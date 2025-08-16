import { createContext, useContext, useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"

const NotificationsContext = createContext()

export const useNotifications = () => useContext(NotificationsContext)

// Eventos personalizados para notificações
const NOTIFICATION_EVENTS = {
  TALENT_UPDATED: "talent_updated",
  TALENT_CREATED: "talent_created",
  TALENT_DELETED: "talent_deleted",
  TALENT_HIGHLIGHTED: "talent_highlighted",
  TALENT_IMPORTED: "talent_imported",
  MANUAL_REFRESH: "manual_refresh",
}

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Referências para controle de cache e tempo
  const notificationsCache = useRef({ data: [], timestamp: 0, ttl: 5 * 60 * 1000 }) // 5 minutos de TTL
  const lastFetchTime = useRef(0)
  const minFetchInterval = useRef(10 * 1000) // 10 segundos mínimo entre chamadas
  const eventListeners = useRef({})
  const isMounted = useRef(true)

  // Função para buscar notificações da API
  const fetchNotifications = async (force = false) => {
    // Evitar chamadas muito frequentes à API
    const now = Date.now()
    const timeSinceLastFetch = now - lastFetchTime.current
    if (!force && timeSinceLastFetch < minFetchInterval.current) {
      return notifications
    }

    // Verificar se o cache é válido
    const cacheAge = now - notificationsCache.current.timestamp
    if (!force && cacheAge < notificationsCache.current.ttl && notificationsCache.current.data.length > 0) {
      return notificationsCache.current.data
    }

    // Se já estiver carregando, não iniciar outra chamada
    if (loading) {
      return notifications
    }

    if (!isMounted.current) {
      return notifications
    }

    setLoading(true)
    setError(null)
    lastFetchTime.current = now

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar notificações: ${response.status}`)
      }

      const data = await response.json()

      // Verificar se data é um array
      if (!Array.isArray(data)) {
        // Se data não for um array, mas tiver uma propriedade que contém as notificações
        const notificationsArray = data.notifications || data.data || []
        if (Array.isArray(notificationsArray)) {
          processNotifications(notificationsArray)
          // Atualizar o cache
          notificationsCache.current = {
            data: notificationsArray,
            timestamp: now,
            ttl: 5 * 60 * 1000, // 5 minutos
          }
          return notificationsArray
        }

        if (isMounted.current) {
          setNotifications([])
          setUnreadCount(0)
        }
        return []
      }

      // Processar as notificações se data for um array
      processNotifications(data)

      // Atualizar o cache
      notificationsCache.current = {
        data,
        timestamp: now,
        ttl: 5 * 60 * 1000, // 5 minutos
      }

      return data
    } catch (error) {
      if (isMounted.current) {
        setError(error.message)
        // Evitar mostrar o mesmo erro repetidamente
        if (!error.message.includes("já exibido")) {
          error.message += " (já exibido)"
        }
      }
      return []
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  // Função auxiliar para processar as notificações
  const processNotifications = (notificationsArray) => {
    if (!isMounted.current) return

    if (notificationsArray.length === 0) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    // Transformar os dados da API para o formato que precisamos
    const formattedNotifications = notificationsArray.map((notification) => {
      // Formatar a mensagem para capitalizar nomes
      let message = notification.description || notification.message || "Nova notificação"

      // Capitalizar nomes em mensagens como "nath Atualizou os dados do talento: Adriana pires."
      message = capitalizeName(message)

      // Determinar o tipo de ação com base no conteúdo da mensagem
      let actionType = notification.action || "geral"

      // Analisar o conteúdo da mensagem para determinar o tipo de ação
      if (message.toLowerCase().includes("integração") || message.toLowerCase().includes("integra")) {
        actionType = "integration"
      } else if (message.toLowerCase().includes("atualiz")) {
        actionType = "edit"
      } else if (message.toLowerCase().includes("cadastr") || message.toLowerCase().includes("novo")) {
        actionType = "user"
      } else if (message.toLowerCase().includes("destaque")) {
        actionType = "star"
      } else if (message.toLowerCase().includes("disponib")) {
        actionType = "calendar"
      }

      return {
        id: notification.id,
        message,
        action: actionType,
        time: formatTimeAgo(new Date(notification.created_at)),
        timestamp: new Date(notification.created_at),
        read: notification.status !== "unread", // Agora verificamos se o status NÃO é "unread"
        userId: notification.user_id,
      }
    })

    // Ordenar por data, mais recentes primeiro
    formattedNotifications.sort((a, b) => b.timestamp - a.timestamp)

    // Verificar se há novas notificações
    const currentIds = new Set(notifications.map((n) => n.id))
    const newNotifications = formattedNotifications.filter((n) => !currentIds.has(n.id))

    if (newNotifications.length > 0 && notifications.length > 0) {
      // Mostrar toast apenas se não for a primeira carga
      toast.info(`${newNotifications.length} nova(s) notificação(ões) recebida(s)`)
    }

    setNotifications(formattedNotifications)
    const unreadNotifications = formattedNotifications.filter((n) => !n.read)
    setUnreadCount(unreadNotifications.length)
  }

  // Função para capitalizar nomes em mensagens
  const capitalizeName = (message) => {
    // Padrões comuns em mensagens de notificação
    const patterns = [
      // "nath Atualizou os dados do talento: Adriana pires."
      {
        regex: /^(\w+)\s+(.*?)\s+do\s+talento:\s+([a-zA-Z]+)\s+([a-zA-Z]+)/i,
        replace: (match, name1, action, name2, name3) =>
          `${capitalizeFirstLetter(name1)} ${action} do talento: ${capitalizeFirstLetter(name2)} ${capitalizeFirstLetter(name3)}`,
      },
      // Outros padrões podem ser adicionados aqui
    ]

    let result = message
    for (const pattern of patterns) {
      if (pattern.regex.test(message)) {
        result = message.replace(pattern.regex, pattern.replace)
        break
      }
    }

    return result
  }

  // Função auxiliar para capitalizar a primeira letra
  const capitalizeFirstLetter = (string) => {
    if (!string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Substituir a função markAllAsRead atual pela nova implementação que usa a rota centralizada
  const markAllAsRead = async () => {
    try {
      setLoading(true)

      // Obter o token de autenticação
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      // Filtrar apenas notificações não lidas
      const unreadNotifications = notifications.filter((notification) => !notification.read)

      if (unreadNotifications.length === 0) {
        toast.info("Não há notificações não lidas")
        return
      }

      // Usar a nova rota centralizada para marcar todas como lidas
      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/notifications/mark-all-read", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao marcar notificações como lidas: ${response.status}`)
      }

      // Atualizar o estado local após sucesso na API
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }))

      setNotifications(updatedNotifications)
      setUnreadCount(0)

      // Atualizar o cache
      notificationsCache.current.data = updatedNotifications

      toast.success("Todas as notificações foram marcadas como lidas")
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error)
      toast.error(`Erro ao marcar notificações: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Função para marcar uma notificação específica como lida
  const markAsRead = async (id) => {
    try {
      // Obter o token de autenticação
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      // Verificar se a notificação já está marcada como lida
      const notification = notifications.find((n) => n.id === id)
      if (!notification || notification.read) {
        return // Já está lida, não precisa fazer nada
      }

      // Atualizar o estado local imediatamente para melhor UX
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      )

      setNotifications(updatedNotifications)
      setUnreadCount(updatedNotifications.filter((n) => !n.read).length)

      // Atualizar o cache
      notificationsCache.current.data = updatedNotifications

      // Fazer a chamada à API
      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/notifications/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ status: "read" }), // Mantemos isso como está, pois já está correto
      })

      if (!response.ok) {
        throw new Error(`Erro ao marcar notificação como lida: ${response.status}`)
      }

      // Não precisamos fazer nada com a resposta, já atualizamos o estado local
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error)
      // Não exibir toast de erro para não atrapalhar a experiência do usuário
    }
  }

  // Função para adicionar uma notificação local
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(), // ID temporário
      message: notification.message || "Nova notificação",
      action: notification.action || "geral",
      time: "Agora mesmo",
      timestamp: new Date(),
      read: false,
      userId: notification.userId || null,
    }

    setNotifications((prev) => [newNotification, ...prev])
    setUnreadCount((prev) => prev + 1)

    // Mostrar toast
    toast.info(newNotification.message)
  }

  // Função para remover uma notificação específica
  const removeNotification = async (id) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      // Remover do estado local imediatamente
      const updatedNotifications = notifications.filter((n) => n.id !== id)
      setNotifications(updatedNotifications)
      setUnreadCount(updatedNotifications.filter((n) => !n.read).length)

      // Atualizar o cache
      notificationsCache.current.data = updatedNotifications

      // Fazer a chamada à API para remover
      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao remover notificação: ${response.status}`)
      }

      toast.success("Notificação removida com sucesso")
    } catch (error) {
      console.error("Erro ao remover notificação:", error)
      toast.error(`Erro ao remover notificação: ${error.message}`)
      // Recarregar notificações em caso de erro
      fetchNotifications(true)
    }
  }

  // Função para limpar todas as notificações
  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      if (notifications.length === 0) {
        toast.info("Não há notificações para limpar")
        return
      }

      // Limpar estado local imediatamente
      setNotifications([])
      setUnreadCount(0)

      // Limpar cache
      notificationsCache.current.data = []

      // Fazer a chamada à API para limpar todas
      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/notifications/clear-all", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao limpar notificações: ${response.status}`)
      }

      toast.success("Todas as notificações foram removidas")
    } catch (error) {
      console.error("Erro ao limpar notificações:", error)
      toast.error(`Erro ao limpar notificações: ${error.message}`)
      // Recarregar notificações em caso de erro
      fetchNotifications(true)
    }
  }

  // Função para forçar atualização das notificações
  const refreshNotifications = async () => {
    try {
      setLoading(true)
      await fetchNotifications(true)
      toast.success("Notificações atualizadas")
    } catch (error) {
      toast.error("Erro ao atualizar notificações")
    } finally {
      setLoading(false)
    }
  }

  // Função auxiliar para formatar o tempo relativo
  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return "Agora mesmo"
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `Há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `Há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `Há ${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"}`
    }

    const diffInYears = Math.floor(diffInMonths / 12)
    return `Há ${diffInYears} ${diffInYears === 1 ? "ano" : "anos"}`
  }

  // Função para obter o ícone com base na ação da notificação
  const getNotificationIcon = (action) => {
    if (!action) return "bell"

    // Converter para minúsculas e remover espaços extras para comparação mais robusta
    const actionLower = typeof action === "string" ? action.toLowerCase().trim() : ""

    // Mapear os valores reais da API para os tipos de ícones
    if (
      actionLower.includes("cadastro") ||
      actionLower.includes("registro") ||
      actionLower.includes("criado") ||
      actionLower.includes("novo") ||
      actionLower.includes("talent_created") ||
      actionLower === "user_created" ||
      actionLower === "user"
    ) {
      return "user"
    }

    if (
      actionLower.includes("atualiza") ||
      actionLower.includes("edição") ||
      actionLower.includes("modificado") ||
      actionLower.includes("talent_updated") ||
      actionLower === "user_updated" ||
      actionLower === "edit"
    ) {
      return "edit"
    }

    if (
      actionLower.includes("destaque") ||
      actionLower.includes("highlight") ||
      actionLower === "highlight_added" ||
      actionLower.includes("talent_highlighted") ||
      actionLower === "star"
    ) {
      return "star"
    }

    if (
      actionLower.includes("disponib") ||
      actionLower.includes("calendar") ||
      actionLower === "availability_changed" ||
      actionLower === "calendar"
    ) {
      return "calendar"
    }

    // Verificar se é uma integração
    if (
      actionLower.includes("integra") ||
      actionLower.includes("import") ||
      actionLower.includes("talent_imported") ||
      actionLower === "integration"
    ) {
      return "integration"
    }

    // Valor padrão
    return "bell"
  }

  // Funções para disparar eventos de notificação
  const notifyTalentUpdated = (talent) => {
    fetchNotifications(true) // Forçar atualização
  }

  const notifyTalentCreated = (talent) => {
    fetchNotifications(true) // Forçar atualização
  }

  const notifyTalentDeleted = (talentId) => {
    fetchNotifications(true) // Forçar atualização
  }

  const notifyTalentHighlighted = (talent) => {
    fetchNotifications(true) // Forçar atualização
  }

  const notifyTalentImported = (count) => {
    fetchNotifications(true) // Forçar atualização
  }

  // Atualizar os tempos relativos periodicamente
  useEffect(() => {
    const updateRelativeTimes = () => {
      if (notifications.length === 0 || !isMounted.current) return

      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        time: formatTimeAgo(notification.timestamp),
      }))

      setNotifications(updatedNotifications)
    }

    // Atualizar a cada minuto
    const timeUpdateInterval = setInterval(updateRelativeTimes, 60 * 1000)

    return () => {
      clearInterval(timeUpdateInterval)
    }
  }, [notifications])

  // Buscar notificações ao montar o componente
  useEffect(() => {
    isMounted.current = true
    fetchNotifications()

    // Configurar um intervalo para buscar notificações periodicamente (a cada 5 minutos como fallback)
    const intervalId = setInterval(
      () => {
        // Verificar se o cache expirou antes de fazer a chamada
        const now = Date.now()
        const cacheAge = now - notificationsCache.current.timestamp
        if (cacheAge > notificationsCache.current.ttl) {
          fetchNotifications()
        }
      },
      5 * 60 * 1000,
    ) // 5 minutos

    return () => {
      isMounted.current = false
      clearInterval(intervalId)
    }
  }, [])

  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    addNotification,
    removeNotification,
    clearAllNotifications,
    refreshNotifications,
    getNotificationIcon,
    // Funções para disparar eventos de notificação
    notifyTalentUpdated,
    notifyTalentCreated,
    notifyTalentDeleted,
    notifyTalentHighlighted,
    notifyTalentImported,
  }

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}


