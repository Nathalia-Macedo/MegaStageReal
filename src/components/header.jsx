"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notification-context"
import { Bell, User, Edit, Star, MoreVertical, Loader2 } from "lucide-react"

export default function Header({ onNavigate, activeTab = "dashboard" }) {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
      markAllAsRead()
    }
  }

  // Função para renderizar o ícone correto
  const renderNotificationIcon = (action) => {
    const iconType = getNotificationIcon ? getNotificationIcon(action) : "bell"

    let IconComponent = Bell
    let iconColorClass = "text-gray-500"
    let bgColorClass = "bg-gray-100"

    switch (iconType) {
      case "user":
        IconComponent = User
        iconColorClass = "text-blue-500"
        bgColorClass = "bg-blue-100"
        break
      case "edit":
        IconComponent = Edit
        iconColorClass = "text-green-500"
        bgColorClass = "bg-green-100"
        break
      case "star":
        IconComponent = Star
        iconColorClass = "text-yellow-500"
        bgColorClass = "bg-yellow-100"
        break
    }

    return { IconComponent, iconColorClass, bgColorClass }
  }

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
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
          <nav className="hidden md:flex space-x-8">
            {["dashboard", "talentos", "destaques", "configurações"].map((item) => (
              <button
                key={item}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
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
          <div className="hidden md:flex items-center space-x-4">
            {/* Notificações */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
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
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-pink-600 hover:text-pink-800"
                          disabled={loading || notifications.length === 0}
                        >
                          Marcar todas como lidas
                        </button>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {loading ? (
                        <div className="px-4 py-3 text-sm text-gray-500 flex justify-center">
                          <Loader2 className="animate-spin h-5 w-5 mr-3 text-pink-500" />
                          Carregando notificações...
                        </div>
                      ) : error ? (
                        <div className="px-4 py-3 text-sm text-red-500">Erro ao carregar notificações: {error}</div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => {
                          // Determinar o ícone baseado na ação
                          const { IconComponent, iconColorClass, bgColorClass } = renderNotificationIcon(
                            notification.action,
                          )

                          return (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-100 transition-colors duration-200 flex items-start ${
                                !notification.read ? "bg-gray-50" : ""
                              }`}
                            >
                              <div className="mr-3 flex-shrink-0">
                                <div
                                  className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}
                                >
                                  <IconComponent className={`h-5 w-5 ${iconColorClass}`} />
                                </div>
                              </div>
                              <div className="flex-grow">
                                <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
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
                            </div>
                          )
                        })
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">Nenhuma notificação</div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 px-4 py-2">
                      <a href="#" className="text-xs text-pink-600 hover:text-pink-800 font-medium">
                        Ver todas as notificações
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil do usuário */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="flex items-center space-x-3">
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
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {`${user?.name || ""} ${user?.last_name || ""}` || "Admin"}
                    </div>
                    <div className="text-xs text-gray-400">{"Administrador"}</div>
                  </div>
                </div>
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    isProfileOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown de perfil */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Meu Perfil
                    </button>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Configurações
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Ajuda
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-95 overflow-y-auto">
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

          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 mt-16">
            {["dashboard", "talentos", "destaques", "configurações"].map((item) => (
              <button
                key={item}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                  activeTab === item ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => handleTabClick(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
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
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
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
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={handleProfileClick}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Meu Perfil
              </button>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Configurações
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Ajuda
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-gray-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown de notificações para mobile */}
      {isNotificationsOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-50 px-2 pt-2 pb-3 bg-white text-black rounded-md shadow-lg mx-2">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
              <button onClick={handleMarkAllAsRead} className="text-xs text-pink-600 hover:text-pink-800">
                Marcar todas como lidas
              </button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-sm text-gray-500 flex justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-3 text-pink-500" />
                Carregando notificações...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                // Determinar o ícone baseado na ação
                const { IconComponent, iconColorClass, bgColorClass } = renderNotificationIcon(notification.action)

                return (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors duration-200 flex items-start"
                  >
                    <div className="mr-3 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
                        <IconComponent className={`h-5 w-5 ${iconColorClass}`} />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {!notification.read && <div className="w-3 h-3 rounded-full bg-pink-500"></div>}
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        aria-label="Marcar como lida"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">Nenhuma notificação</div>
            )}
          </div>
          <div className="border-t border-gray-200 px-4 py-2">
            <a href="#" className="text-xs text-pink-600 hover:text-pink-800 font-medium">
              Ver todas as notificações
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
