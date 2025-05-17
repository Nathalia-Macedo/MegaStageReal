import { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notification-context"
import {
  Bell,
  UserPlus,
  Calendar,
  MoreVertical,
  Loader2,
  RefreshCw,
  Plus,
  Edit,
  Trash,
  UserMinus,
  Star,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mapeamento de nomes de ícones para componentes
const iconMap = {
  Bell: Bell,
  Plus: Plus,
  Edit: Edit,
  Trash: Trash,
  UserPlus: UserPlus,
  UserMinus: UserMinus,
  Calendar: Calendar,
  RefreshCw: RefreshCw,
}

export default function Header({ onNavigate, activeTab = "dashboard" }) {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)

  // Obter o contexto de notificações com verificação de existência
  const notificationsContext = useNotifications()

  // Desestruturar com valores padrão seguros
  const {
    notifications = [],
    loading = false,
    error = null,
    unreadCount = 0,
    markAllAsRead = () => console.warn("markAllAsRead não disponível"),
    markAsRead = () => console.warn("markAsRead não disponível"),
    getNotificationIcon = () => "bell",
  } = notificationsContext || {}

  // Detectar se é mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px é o breakpoint md do Tailwind
    }

    // Verificar inicialmente
    checkIfMobile()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkIfMobile)

    // Limpar listener
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Verificar se o contexto está disponível
  useEffect(() => {
    if (!notificationsContext) {
      console.error(
        "Contexto de notificações não encontrado. Verifique se o NotificationsProvider está envolvendo este componente.",
      )
    } else {
      console.log("Contexto de notificações carregado:", {
        notificationsCount: notifications.length,
        unreadCount,
        loading,
        error,
      })
    }
  }, [notificationsContext])

  // Fechar dropdowns quando clicar fora deles
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Função para lidar com a navegação
  const handleTabClick = (tab) => {
    if (onNavigate) {
      onNavigate(tab)
    }
    setIsMobileMenuOpen(false)
  }

  // Função para lidar com o logout
  const handleLogout = () => {
    logout()
    // O redirecionamento para a tela de login será tratado no App.jsx
  }

  // Função para navegar para o perfil
  const handleProfileClick = () => {
    if (onNavigate) {
      onNavigate("perfil")
    }
    setIsProfileOpen(false)
    setIsMobileMenuOpen(false)
  }

  // Adicione esta função após handleProfileClick
  const handleHelpClick = () => {
    if (onNavigate) {
      // Navega para a tela de configurações com a seção de ajuda e tópico dashboard selecionados
      onNavigate("configurações", { section: "help", topic: "dashboard" })
    }
    setIsProfileOpen(false)
    setIsMobileMenuOpen(false)
  }

  // Função para lidar com a marcação de notificação como lida
  const handleMarkAsRead = (id, e) => {
    e.stopPropagation()
    if (markAsRead && typeof markAsRead === "function") {
      markAsRead(id)
    }
  }

  // Função para lidar com marcar todas como lidas
  const handleMarkAllAsRead = () => {
    if (markAllAsRead && typeof markAllAsRead === "function") {
      // Desabilitar o botão enquanto estiver carregando
      if (loading) return

      markAllAsRead()
    }
  }

  // Função para lidar com o clique no ícone de notificações
  const handleNotificationIconClick = () => {
    if (isMobile) {
      // No mobile, navegar diretamente para a página de notificações
      if (onNavigate) {
        onNavigate("notificações", { returnTo: activeTab })
      }
    } else {
      // No desktop, abrir o dropdown como antes
      setIsNotificationsOpen(!isNotificationsOpen)
    }
  }

  // Substitua a função renderNotificationIcon atual por esta versão corrigida
  const renderNotificationIcon = (notification) => {
    // Verificar primeiro pelo conteúdo da mensagem para casos específicos
    if (
      (notification.message && notification.message.toLowerCase().includes("integração")) ||
      (notification.message && notification.message.toLowerCase().includes("integracao"))
    ) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
          <RefreshCw className="w-4 h-4 text-blue-500" />
        </div>
      )
    }

    // Determinar o tipo de ícone com base na ação
    let IconComponent = Bell
    let iconColorClass = "text-purple-500"
    let bgColorClass = "bg-purple-100"

    // Verificar a ação para determinar o ícone
    const action = notification.action || "bell"

    if (action === "user" || action.includes("user_created")) {
      IconComponent = UserPlus
      iconColorClass = "text-blue-500"
      bgColorClass = "bg-blue-100"
    } else if (action === "edit" || action.includes("user_updated")) {
      IconComponent = Edit
      iconColorClass = "text-green-500"
      bgColorClass = "bg-green-100"
    } else if (action === "star" || action.includes("highlight")) {
      IconComponent = Star
      iconColorClass = "text-yellow-500"
      bgColorClass = "bg-yellow-100"
    } else if (action === "calendar" || action.includes("availability")) {
      IconComponent = Calendar
      iconColorClass = "text-red-500"
      bgColorClass = "bg-red-100"
    } else if (action === "integration" || action.includes("import")) {
      IconComponent = RefreshCw
      iconColorClass = "text-blue-500"
      bgColorClass = "bg-blue-100"
    }

    return (
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColorClass}`}>
        <IconComponent className={`w-4 h-4 ${iconColorClass}`} />
      </div>
    )
  }

  // Função para obter o título da notificação com base na ação
  const getNotificationTitle = (action) => {
    switch (action) {
      case "user":
        return "Novo talento cadastrado"
      case "edit":
        return "Perfil atualizado"
      case "star":
        return "Novo destaque"
      case "calendar":
        return "Disponibilidade alterada"
      case "integration":
        return "Integração de dados"
      default:
        return "Notificação"
    }
  }

  // Variantes de animação para o dropdown de perfil
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -5,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.2, // Reduzido de 0.3 para 0.2
        staggerChildren: 0.03, // Reduzido de 0.05 para 0.03
        delayChildren: 0.02, // Reduzido de 0.05 para 0.02
      },
    },
  }

  // Variantes para os itens do menu
  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.15, // Reduzido de 0.2 para 0.15
      },
    },
  }

  // Variantes para as notificações no mobile
  const mobileNotificationVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2, // Reduzido de 0.3 para 0.2
        staggerChildren: 0.03, // Reduzido de 0.05 para 0.03
        delayChildren: 0.02, // Reduzido de 0.05 para 0.02
      },
    },
  }

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-2 md:px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Botão Hamburguer Mobile */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Logo */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mega%20Stage%20Branco-m7bEuZkcotsi4oqaKuleo1RSShlJTh.png"
              alt="MegaStage"
              className="h-6 sm:h-8"
            />

            {/* Botão Hamburguer - SEMPRE VISÍVEL EM MOBILE */}
            <div className="block md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Abrir menu principal</span>
                {/* Ícone Hamburguer */}
                <svg
                  className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Ícone X */}
                <svg
                  className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu para desktop */}
          <nav className="hidden md:flex space-x-2 lg:space-x-8">
            {["dashboard", "talentos", "destaques", "configurações"].map((item) => (
              <button
                key={item}
                className={`relative px-1 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-colors duration-200 ${
                  activeTab === item ? "text-white" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => handleTabClick(item)}
              >
                {item.toUpperCase()}
                {activeTab === item && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Ícones de ação */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* Notificações */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={handleNotificationIconClick}
                className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Ver notificações</span>
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown de notificações */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 overflow-hidden"
                  >
                    <div className="py-1">
                      <motion.div variants={itemVariants} className="px-4 py-2 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-pink-600 hover:text-pink-800"
                            disabled={loading || notifications.length === 0 || unreadCount === 0}
                          >
                            {loading ? (
                              <span className="flex items-center">
                                <Loader2 className="animate-spin h-3 w-3 mr-1" />
                                Processando...
                              </span>
                            ) : (
                              "Marcar todas como lidas"
                            )}
                          </button>
                        </div>
                      </motion.div>

                      <div className="max-h-60 overflow-y-auto">
                        {loading ? (
                          <motion.div
                            variants={itemVariants}
                            className="px-4 py-3 text-sm text-gray-500 flex justify-center"
                          >
                            <Loader2 className="animate-spin h-5 w-5 mr-3 text-pink-500" />
                            Carregando notificações...
                          </motion.div>
                        ) : error ? (
                          <motion.div variants={itemVariants} className="px-4 py-3 text-sm text-red-500">
                            Erro ao carregar notificações: {error}
                          </motion.div>
                        ) : notifications.length > 0 ? (
                          notifications.map((notification) => {
                            // Determinar o ícone baseado na ação
                            const iconElement = renderNotificationIcon(notification)
                            const title = getNotificationTitle(notification.action)

                            return (
                              <motion.div
                                key={notification.id}
                                variants={itemVariants}
                                className={`px-4 py-3 hover:bg-gray-100 transition-colors duration-200 flex items-start ${
                                  !notification.read ? "bg-gray-50" : ""
                                }`}
                              >
                                <div className="mr-3 flex-shrink-0">{iconElement}</div>
                                <div className="flex-grow">
                                  <p className="text-sm font-medium text-gray-900">{title}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                <div className="ml-2 flex-shrink-0 relative">
                                  {!notification.read && <div className="w-3 h-3 rounded-full bg-pink-500"></div>}
                                  <button
                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    aria-label="Marcar como lida"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </div>
                              </motion.div>
                            )
                          })
                        ) : (
                          <motion.div variants={itemVariants} className="px-4 py-3 text-sm text-gray-500">
                            Nenhuma notificação
                          </motion.div>
                        )}
                      </div>

                      {/* Pré-renderizando o link "Ver todas as notificações" para evitar atraso */}
                      <motion.div
                        variants={itemVariants}
                        initial="visible"
                        animate="visible"
                        className="border-t border-gray-200 px-4 py-2"
                      >
                        <a
                          onClick={() => {
                            setIsNotificationsOpen(false)
                            if (onNavigate) {
                              onNavigate("notificações", { returnTo: activeTab })
                            }
                          }}
                          className="text-xs text-pink-600 hover:text-pink-800 font-medium cursor-pointer"
                        >
                          Ver todas as notificações
                        </a>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Perfil do usuário */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 lg:space-x-3 focus:outline-none"
              >
                <div className="flex items-center space-x-1 lg:space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-pink-500">
                    {user?.photo ? (
                      <img
                        src={user.photo || "/placeholder.svg"}
                        alt={`${user.name || ""} ${user.last_name || ""}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="16" fill="%23a0a0a0" textAnchor="middle" dy=".3em">${(user.name || "U").charAt(0)}</text></svg>`
                        }}
                      />
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-medium">
                      {`${user?.name || ""} ${user?.last_name || ""}` || "Admin"}
                    </div>
                    <div className="text-xs text-gray-400">{"Administrador"}</div>
                  </div>
                  <div className="text-left lg:hidden">
                    <div className="text-xs font-medium">{user?.name || "Admin"}</div>
                    <div className="text-xs text-gray-400">{"Admin"}</div>
                  </div>
                </div>
                <motion.svg
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Dropdown de perfil */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 overflow-hidden"
                  >
                    <div className="py-1">
                      <motion.button
                        variants={itemVariants}
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Meu Perfil
                      </motion.button>
                      <motion.a
                        variants={itemVariants}
                        onClick={handleHelpClick}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Ajuda
                      </motion.a>
                      <motion.button
                        variants={itemVariants}
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sair
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-95 overflow-y-auto"
          >
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-gray-300 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <motion.div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 mt-16"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {["dashboard", "talentos", "destaques", "configurações"].map((item) => (
                <motion.button
                  key={item}
                  variants={itemVariants}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    activeTab === item ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => handleTabClick(item)}
                >
                  {item.toUpperCase()}
                </motion.button>
              ))}
            </motion.div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-pink-500">
                    {user?.photo ? (
                      <img
                        src={user.photo || "/placeholder.svg"}
                        alt={`${user.name || ""} ${user.last_name || ""}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23a0a0a0" textAnchor="middle" dy=".3em">${(user.name || "U").charAt(0)}</text></svg>`
                        }}
                      />
                    ) : (
                      <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {`${user?.name || ""} ${user?.last_name || ""}` || "Admin"}
                  </div>
                  <div className="text-sm font-medium text-gray-400">{"Administrador"}</div>
                </div>
                <button
                  className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none relative"
                  onClick={handleNotificationIconClick}
                >
                  <span className="sr-only">Ver notificações</span>
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              <motion.div
                className="mt-3 px-2 space-y-1"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  variants={itemVariants}
                  onClick={handleProfileClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Meu Perfil
                </motion.button>
                <motion.a
                  variants={itemVariants}
                  onClick={handleHelpClick}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
                >
                  Ajuda
                </motion.a>
                <motion.button
                  variants={itemVariants}
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-gray-700"
                >
                  Sair
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown de notificações para mobile - REMOVIDO, agora navega diretamente para a página */}
    </header>
  )
}
