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

      const response = await fetch("https://megastage.onrender.com/api/v1/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

      return {
        id: notification.id,
        message,
        action: notification.action || "geral",
        time: formatTimeAgo(new Date(notification.created_at)),
        timestamp: new Date(notification.created_at),
        read: notification.read === true, // Converter explicitamente para booleano
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

  // Função para marcar todas as notificações como lidas
  const markAllAsRead = () => {
    try {
      // Atualizar o estado local imediatamente para melhor UX
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
      toast.error(`Erro ao marcar notificações: ${error.message}`)
    }
  }

  // Função para marcar uma notificação específica como lida
  const markAsRead = (id) => {
    try {
      // Atualizar o estado local imediatamente para melhor UX
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      )

      setNotifications(updatedNotifications)
      setUnreadCount(updatedNotifications.filter((n) => !n.read).length)

      // Atualizar o cache
      notificationsCache.current.data = updatedNotifications
    } catch (error) {
      // Não exibir toast de erro para não atrapalhar a experiência do usuário
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

    switch (action.toLowerCase()) {
      case "cadastro":
      case "registro":
        return "user"
      case "atualização":
      case "edição":
        return "edit"
      case "destaque":
        return "star"
      default:
        return "bell"
    }
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
        } else {
          
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
