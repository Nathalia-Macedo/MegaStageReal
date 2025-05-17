// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useNotifications } from "../contexts/notification-context"
// import {
//   Bell,
//   Star,
//   Search,
//   Filter,
//   ArrowLeft,
//   Calendar,
//   CheckCircle,
//   Clock,
//   Loader2,
//   X,
//   ChevronDown,
//   ChevronUp,
//   RefreshCw,
//   UserPlus,
//   FileEdit,
//   Plus,
//   Edit,
//   Trash,
//   UserMinus,
// } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { format } from "date-fns"
// import { ptBR } from "date-fns/locale"

// // Mapeamento de nomes de ícones para componentes
// const iconMap = {
//   Bell: Bell,
//   Plus: Plus,
//   Edit: Edit,
//   Trash: Trash,
//   UserPlus: UserPlus,
//   UserMinus: UserMinus,
//   Calendar: Calendar,
//   RefreshCw: RefreshCw,
// }

// export default function NotificationsPage({ onGoBack }) {
//   const { notifications, loading, error, fetchNotifications, markAllAsRead, markAsRead, getNotificationIcon } =
//     useNotifications()

//   const [searchTerm, setSearchTerm] = useState("")
//   const [filters, setFilters] = useState({
//     status: "all", // all, read, unread
//     type: "all", // all, user, edit, star, bell
//     date: "all", // all, today, week, month
//   })
//   const [isFiltersOpen, setIsFiltersOpen] = useState(false)
//   const [sortOrder, setSortOrder] = useState("newest") // newest, oldest
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [page, setPage] = useState(1)
//   const [itemsPerPage] = useState(10)

//   const filtersRef = useRef(null)

//   // Fechar filtros quando clicar fora
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (filtersRef.current && !filtersRef.current.contains(event.target)) {
//         setIsFiltersOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   // Função para voltar à página anterior
//   const handleGoBack = () => {
//     if (onGoBack && typeof onGoBack === "function") {
//       onGoBack()
//     }
//   }

//   // Função para atualizar as notificações
//   const handleRefresh = async () => {
//     setIsRefreshing(true)
//     await fetchNotifications(true)
//     setTimeout(() => {
//       setIsRefreshing(false)
//     }, 600) // Pequeno delay para feedback visual
//   }

//   // Função para marcar todas como lidas
//   const handleMarkAllAsRead = () => {
//     markAllAsRead()
//   }

//   // Função para marcar uma notificação como lida
//   const handleMarkAsRead = (id) => {
//     markAsRead(id)
//   }

//   // Substitua a função renderNotificationIcon atual por esta versão corrigida
//   const renderNotificationIcon = (notification) => {
//     // Verificar primeiro pelo conteúdo da mensagem para casos específicos
//     if (
//       (notification.message && notification.message.toLowerCase().includes("integração")) ||
//       (notification.message && notification.message.toLowerCase().includes("integracao"))
//     ) {
//       return (
//         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
//           <RefreshCw className="w-5 h-5 text-blue-500" />
//         </div>
//       )
//     }

//     // Determinar o tipo de ícone com base na ação
//     let IconComponent = Bell
//     let iconColorClass = "text-purple-500"
//     let bgColorClass = "bg-purple-100"

//     // Verificar a ação para determinar o ícone
//     const action = notification.action || "bell"

//     if (action === "user" || action.includes("user_created")) {
//       IconComponent = UserPlus
//       iconColorClass = "text-blue-500"
//       bgColorClass = "bg-blue-100"
//     } else if (action === "edit" || action.includes("user_updated")) {
//       IconComponent = Edit
//       iconColorClass = "text-green-500"
//       bgColorClass = "bg-green-100"
//     } else if (action === "star" || action.includes("highlight")) {
//       IconComponent = Star
//       iconColorClass = "text-yellow-500"
//       bgColorClass = "bg-yellow-100"
//     } else if (action === "calendar" || action.includes("availability")) {
//       IconComponent = Calendar
//       iconColorClass = "text-red-500"
//       bgColorClass = "bg-red-100"
//     } else if (action === "integration" || action.includes("import")) {
//       IconComponent = RefreshCw
//       iconColorClass = "text-blue-500"
//       bgColorClass = "bg-blue-100"
//     }

//     return (
//       <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bgColorClass}`}>
//         <IconComponent className={`w-5 h-5 ${iconColorClass}`} />
//       </div>
//     )
//   }

//   // Função para filtrar notificações
//   const getFilteredNotifications = () => {
//     if (!notifications) return []

//     return notifications
//       .filter((notification) => {
//         // Filtro de busca
//         if (searchTerm && !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
//           return false
//         }

//         // Filtro de status
//         if (filters.status === "read" && !notification.read) return false
//         if (filters.status === "unread" && notification.read) return false

//         // Filtro de tipo
//         if (filters.type !== "all") {
//           const iconType = getNotificationIcon(notification.action)
//           if (filters.type !== iconType) return false
//         }

//         // Filtro de data
//         if (filters.date !== "all") {
//           const now = new Date()
//           const notificationDate = new Date(notification.timestamp)

//           if (filters.date === "today") {
//             return notificationDate.toDateString() === now.toDateString()
//           } else if (filters.date === "week") {
//             const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
//             return notificationDate >= oneWeekAgo
//           } else if (filters.date === "month") {
//             const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
//             return notificationDate >= oneMonthAgo
//           }
//         }

//         return true
//       })
//       .sort((a, b) => {
//         if (sortOrder === "newest") {
//           return new Date(b.timestamp) - new Date(a.timestamp)
//         } else {
//           return new Date(a.timestamp) - new Date(b.timestamp)
//         }
//       })
//   }

//   const filteredNotifications = getFilteredNotifications()

//   // Paginação
//   const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
//   const paginatedNotifications = filteredNotifications.slice((page - 1) * itemsPerPage, page * itemsPerPage)

//   // Função para formatar data completa
//   const formatFullDate = (date) => {
//     return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
//   }

//   // Função para limpar todos os filtros
//   const clearFilters = () => {
//     setSearchTerm("")
//     setFilters({
//       status: "all",
//       type: "all",
//       date: "all",
//     })
//     setSortOrder("newest")
//     setPage(1)
//   }

//   // Verificar se há filtros ativos
//   const hasActiveFilters = () => {
//     return (
//       searchTerm !== "" ||
//       filters.status !== "all" ||
//       filters.type !== "all" ||
//       filters.date !== "all" ||
//       sortOrder !== "newest"
//     )
//   }

//   // Função para obter o título da notificação com base na ação
//   const getNotificationTitle = (action) => {
//     switch (action) {
//       case "user_created":
//         return "Novo talento cadastrado"
//       case "user_updated":
//         return "Perfil atualizado"
//       case "highlight_added":
//         return "Novo destaque"
//       case "availability_changed":
//         return "Disponibilidade alterada"
//       default:
//         return "Notificação"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-black text-white shadow-lg">
//         <div className="container mx-auto px-4 max-w-7xl">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               <button
//                 onClick={handleGoBack}
//                 className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
//                 aria-label="Voltar"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </button>
//               <h1 className="text-xl font-bold">Notificações</h1>
//             </div>

//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={handleRefresh}
//                 className={`p-2 rounded-full hover:bg-gray-800 transition-colors ${isRefreshing ? "animate-spin" : ""}`}
//                 disabled={loading || isRefreshing}
//                 aria-label="Atualizar notificações"
//               >
//                 <RefreshCw className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={handleMarkAllAsRead}
//                 className="hidden sm:flex items-center px-3 py-1.5 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors text-sm"
//                 disabled={loading || filteredNotifications.filter((n) => !n.read).length === 0}
//               >
//                 <CheckCircle className="h-4 w-4 mr-1" />
//                 Marcar todas como lidas
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Conteúdo principal */}
//       <main className="container mx-auto px-4 py-6 max-w-7xl">
//         {/* Barra de pesquisa e filtros */}
//         <div className="mb-6 flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//               placeholder="Buscar notificações..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value)
//                 setPage(1) // Reset para primeira página ao buscar
//               }}
//             />
//             {searchTerm && (
//               <button className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setSearchTerm("")}>
//                 <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//               </button>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <div className="relative" ref={filtersRef}>
//               <button
//                 onClick={() => setIsFiltersOpen(!isFiltersOpen)}
//                 className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 <span>Filtros</span>
//                 {hasActiveFilters() && (
//                   <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full">
//                     {Object.values(filters).filter((f) => f !== "all").length +
//                       (searchTerm ? 1 : 0) +
//                       (sortOrder !== "newest" ? 1 : 0)}
//                   </span>
//                 )}
//               </button>

//               <AnimatePresence>
//                 {isFiltersOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-gray-200"
//                   >
//                     <div className="p-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-sm font-medium text-gray-900">Filtros</h3>
//                         <button
//                           onClick={clearFilters}
//                           className="text-xs text-pink-600 hover:text-pink-800"
//                           disabled={!hasActiveFilters()}
//                         >
//                           Limpar filtros
//                         </button>
//                       </div>

//                       {/* Filtro de status */}
//                       <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                         <div className="flex space-x-2">
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium ${
//                               filters.status === "all"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, status: "all" })}
//                           >
//                             Todas
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium ${
//                               filters.status === "read"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, status: "read" })}
//                           >
//                             Lidas
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium ${
//                               filters.status === "unread"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, status: "unread" })}
//                           >
//                             Não lidas
//                           </button>
//                         </div>
//                       </div>

//                       {/* Filtro de tipo */}
//                       <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
//                         <div className="grid grid-cols-2 gap-2">
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium ${
//                               filters.type === "all"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, type: "all" })}
//                           >
//                             Todos
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium flex items-center justify-center ${
//                               filters.type === "user"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, type: "user" })}
//                           >
//                             <UserPlus className="h-3 w-3 mr-1" /> Cadastros
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium flex items-center justify-center ${
//                               filters.type === "edit"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, type: "edit" })}
//                           >
//                             <FileEdit className="h-3 w-3 mr-1" /> Edições
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium flex items-center justify-center ${
//                               filters.type === "star"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, type: "star" })}
//                           >
//                             <Star className="h-3 w-3 mr-1" /> Destaques
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium flex items-center justify-center ${
//                               filters.type === "calendar"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, type: "calendar" })}
//                           >
//                             <Calendar className="h-3 w-3 mr-1" /> Disponibilidade
//                           </button>
//                         </div>
//                       </div>

//                       {/* Filtro de data */}
//                       <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
//                         <div className="flex flex-wrap gap-2">
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium ${
//                               filters.date === "all"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, date: "all" })}
//                           >
//                             Todos
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium ${
//                               filters.date === "today"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, date: "today" })}
//                           >
//                             Hoje
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium ${
//                               filters.date === "week"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, date: "week" })}
//                           >
//                             Última semana
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium ${
//                               filters.date === "month"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setFilters({ ...filters, date: "month" })}
//                           >
//                             Último mês
//                           </button>
//                         </div>
//                       </div>

//                       {/* Ordenação */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
//                         <div className="flex space-x-2">
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium flex items-center ${
//                               sortOrder === "newest"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setSortOrder("newest")}
//                           >
//                             <ChevronDown className="h-3 w-3 mr-1" /> Mais recentes
//                           </button>
//                           <button
//                             className={`px-3 py-1 rounded-md text-xs font-medium flex items-center ${
//                               sortOrder === "oldest"
//                                 ? "bg-pink-100 text-pink-800"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                             }`}
//                             onClick={() => setSortOrder("oldest")}
//                           >
//                             <ChevronUp className="h-3 w-3 mr-1" /> Mais antigas
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Botão de marcar todas como lidas para mobile */}
//             <button
//               onClick={handleMarkAllAsRead}
//               className="sm:hidden flex items-center justify-center p-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
//               disabled={loading || filteredNotifications.filter((n) => !n.read).length === 0}
//               aria-label="Marcar todas como lidas"
//             >
//               <CheckCircle className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         {/* Resumo dos filtros ativos */}
//         {hasActiveFilters() && (
//           <div className="mb-4 flex flex-wrap gap-2 items-center">
//             <span className="text-sm text-gray-500">Filtros ativos:</span>

//             {searchTerm && (
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                 Busca: {searchTerm}
//                 <button onClick={() => setSearchTerm("")} className="ml-1 text-gray-500 hover:text-gray-700">
//                   <X className="h-3 w-3" />
//                 </button>
//               </span>
//             )}

//             {filters.status !== "all" && (
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                 Status: {filters.status === "read" ? "Lidas" : "Não lidas"}
//                 <button
//                   onClick={() => setFilters({ ...filters, status: "all" })}
//                   className="ml-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </span>
//             )}

//             {filters.type !== "all" && (
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                 Tipo:{" "}
//                 {filters.type === "user"
//                   ? "Cadastros"
//                   : filters.type === "edit"
//                     ? "Edições"
//                     : filters.type === "star"
//                       ? "Destaques"
//                       : filters.type === "calendar"
//                         ? "Disponibilidade"
//                         : "Geral"}
//                 <button
//                   onClick={() => setFilters({ ...filters, type: "all" })}
//                   className="ml-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </span>
//             )}

//             {filters.date !== "all" && (
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                 Período: {filters.date === "today" ? "Hoje" : filters.date === "week" ? "Última semana" : "Último mês"}
//                 <button
//                   onClick={() => setFilters({ ...filters, date: "all" })}
//                   className="ml-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </span>
//             )}

//             {sortOrder !== "newest" && (
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                 Ordenação: Mais antigas primeiro
//                 <button onClick={() => setSortOrder("newest")} className="ml-1 text-gray-500 hover:text-gray-700">
//                   <X className="h-3 w-3" />
//                 </button>
//               </span>
//             )}

//             <button onClick={clearFilters} className="text-xs text-pink-600 hover:text-pink-800 ml-auto">
//               Limpar todos
//             </button>
//           </div>
//         )}

//         {/* Lista de notificações */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {loading ? (
//             <div className="flex justify-center items-center p-12">
//               <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
//               <span className="ml-3 text-gray-600">Carregando notificações...</span>
//             </div>
//           ) : error ? (
//             <div className="p-6 text-center">
//               <p className="text-red-500 mb-4">{error}</p>
//               <button
//                 onClick={handleRefresh}
//                 className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
//               >
//                 Tentar novamente
//               </button>
//             </div>
//           ) : filteredNotifications.length === 0 ? (
//             <div className="p-12 text-center">
//               <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma notificação encontrada</h3>
//               <p className="text-gray-500 mb-4">
//                 {hasActiveFilters()
//                   ? "Tente ajustar os filtros para ver mais resultados."
//                   : "Você não tem notificações no momento."}
//               </p>
//               {hasActiveFilters() && (
//                 <button
//                   onClick={clearFilters}
//                   className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
//                 >
//                   Limpar filtros
//                 </button>
//               )}
//             </div>
//           ) : (
//             <>
//               <ul className="divide-y divide-gray-200">
//                 {paginatedNotifications.map((notification) => {
//                   const notificationIcon = renderNotificationIcon(notification)
//                   const title = getNotificationTitle(notification.action)

//                   return (
//                     <motion.li
//                       key={notification.id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-gray-50" : ""}`}
//                     >
//                       <div className="flex items-start">
//                         <div className="mr-4 flex-shrink-0">{notificationIcon}</div>
//                         <div className="flex-grow">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <h3
//                                 className={`text-base font-medium ${
//                                   !notification.read ? "text-gray-900" : "text-gray-700"
//                                 }`}
//                               >
//                                 {title}
//                               </h3>
//                               <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
//                             </div>
//                             {!notification.read && (
//                               <span className="ml-2 flex-shrink-0 inline-block h-2 w-2 rounded-full bg-pink-500"></span>
//                             )}
//                           </div>
//                           <div className="mt-2 flex items-center text-xs text-gray-500">
//                             <Clock className="h-3 w-3 mr-1" />
//                             <span>{notification.time}</span>
//                             <span className="mx-2">•</span>
//                             <Calendar className="h-3 w-3 mr-1" />
//                             <span>{formatFullDate(notification.timestamp)}</span>
//                           </div>
//                           <div className="mt-2 flex justify-between items-center">
//                             <div className="text-xs text-gray-500">ID: {notification.id}</div>
//                             {!notification.read && (
//                               <button
//                                 onClick={() => handleMarkAsRead(notification.id)}
//                                 className="text-xs text-pink-600 hover:text-pink-800 flex items-center"
//                               >
//                                 <CheckCircle className="h-3 w-3 mr-1" />
//                                 Marcar como lida
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </motion.li>
//                   )
//                 })}
//               </ul>

//               {/* Paginação */}
//               {totalPages > 1 && (
//                 <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//                   <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                     <div>
//                       <p className="text-sm text-gray-700">
//                         Mostrando <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> a{" "}
//                         <span className="font-medium">
//                           {Math.min(page * itemsPerPage, filteredNotifications.length)}
//                         </span>{" "}
//                         de <span className="font-medium">{filteredNotifications.length}</span> resultados
//                       </p>
//                     </div>
//                     <div>
//                       <nav
//                         className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                         aria-label="Pagination"
//                       >
//                         <button
//                           onClick={() => setPage(Math.max(1, page - 1))}
//                           disabled={page === 1}
//                           className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
//                             page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
//                           }`}
//                         >
//                           <span className="sr-only">Anterior</span>
//                           <ChevronUp className="h-5 w-5 rotate-90" />
//                         </button>

//                         {/* Números de página */}
//                         {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
//                           let pageNumber

//                           // Lógica para mostrar páginas ao redor da página atual
//                           if (totalPages <= 5) {
//                             pageNumber = i + 1
//                           } else if (page <= 3) {
//                             pageNumber = i + 1
//                           } else if (page >= totalPages - 2) {
//                             pageNumber = totalPages - 4 + i
//                           } else {
//                             pageNumber = page - 2 + i
//                           }

//                           return (
//                             <button
//                               key={pageNumber}
//                               onClick={() => setPage(pageNumber)}
//                               className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                                 page === pageNumber
//                                   ? "z-10 bg-pink-50 border-pink-500 text-pink-600"
//                                   : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                               }`}
//                             >
//                               {pageNumber}
//                             </button>
//                           )
//                         })}

//                         <button
//                           onClick={() => setPage(Math.min(totalPages, page + 1))}
//                           disabled={page === totalPages}
//                           className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
//                             page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
//                           }`}
//                         >
//                           <span className="sr-only">Próxima</span>
//                           <ChevronDown className="h-5 w-5 rotate-90" />
//                         </button>
//                       </nav>
//                     </div>
//                   </div>

//                   {/* Paginação mobile */}
//                   <div className="flex items-center justify-between w-full sm:hidden">
//                     <button
//                       onClick={() => setPage(Math.max(1, page - 1))}
//                       disabled={page === 1}
//                       className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
//                         page === 1
//                           ? "text-gray-300 bg-gray-100 cursor-not-allowed"
//                           : "text-gray-700 bg-white hover:bg-gray-50"
//                       }`}
//                     >
//                       Anterior
//                     </button>
//                     <span className="text-sm text-gray-700">
//                       Página {page} de {totalPages}
//                     </span>
//                     <button
//                       onClick={() => setPage(Math.min(totalPages, page + 1))}
//                       disabled={page === totalPages}
//                       className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
//                         page === totalPages
//                           ? "text-gray-300 bg-gray-100 cursor-not-allowed"
//                           : "text-gray-700 bg-white hover:bg-gray-50"
//                       }`}
//                     >
//                       Próxima
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }


"use client"

import { useState, useEffect, useRef } from "react"
import { useNotifications } from "../contexts/notification-context"
import {
  Bell,
  Star,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  UserPlus,
  FileEdit,
  Plus,
  Edit,
  Trash,
  UserMinus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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

export default function NotificationsPage({ onGoBack }) {
  const { notifications, loading, error, fetchNotifications, markAllAsRead, markAsRead, getNotificationIcon } =
    useNotifications()

  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "all", // all, read, unread
    type: "all", // all, user, edit, star, bell
    date: "all", // all, today, week, month
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState("newest") // newest, oldest
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const filtersRef = useRef(null)

  // Adicione este useEffect logo após a declaração dos estados, antes do useEffect existente para o filtersRef
  useEffect(() => {
    // Quando o componente é montado, rola a página para o topo
    window.scrollTo(0, 0)
  }, [])

  // Fechar filtros quando clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setIsFiltersOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Função para voltar à página anterior
  const handleGoBack = () => {
    if (onGoBack && typeof onGoBack === "function") {
      onGoBack()
    }
  }

  // Função para atualizar as notificações
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchNotifications(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600) // Pequeno delay para feedback visual
  }

  // Função para marcar todas como lidas
  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  // Função para marcar uma notificação como lida
  const handleMarkAsRead = (id) => {
    markAsRead(id)
  }

  // Substitua a função renderNotificationIcon atual por esta versão corrigida
  const renderNotificationIcon = (notification) => {
    // Verificar primeiro pelo conteúdo da mensagem para casos específicos
    if (
      (notification.message && notification.message.toLowerCase().includes("integração")) ||
      (notification.message && notification.message.toLowerCase().includes("integracao"))
    ) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
          <RefreshCw className="w-5 h-5 text-blue-500" />
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
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bgColorClass}`}>
        <IconComponent className={`w-5 h-5 ${iconColorClass}`} />
      </div>
    )
  }

  // Função para filtrar notificações
  const getFilteredNotifications = () => {
    if (!notifications) return []

    return notifications
      .filter((notification) => {
        // Filtro de busca
        if (searchTerm && !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false
        }

        // Filtro de status
        if (filters.status === "read" && !notification.read) return false
        if (filters.status === "unread" && notification.read) return false

        // Filtro de tipo
        if (filters.type !== "all") {
          const iconType = getNotificationIcon(notification.action)
          if (filters.type !== iconType) return false
        }

        // Filtro de data
        if (filters.date !== "all") {
          const now = new Date()
          const notificationDate = new Date(notification.timestamp)

          if (filters.date === "today") {
            return notificationDate.toDateString() === now.toDateString()
          } else if (filters.date === "week") {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return notificationDate >= oneWeekAgo
          } else if (filters.date === "month") {
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            return notificationDate >= oneMonthAgo
          }
        }

        return true
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.timestamp) - new Date(a.timestamp)
        } else {
          return new Date(a.timestamp) - new Date(b.timestamp)
        }
      })
  }

  const filteredNotifications = getFilteredNotifications()

  // Paginação
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const paginatedNotifications = filteredNotifications.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Função para formatar data completa
  const formatFullDate = (date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
  }

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      status: "all",
      type: "all",
      date: "all",
    })
    setSortOrder("newest")
    setPage(1)
  }

  // Verificar se há filtros ativos
  const hasActiveFilters = () => {
    return (
      searchTerm !== "" ||
      filters.status !== "all" ||
      filters.type !== "all" ||
      filters.date !== "all" ||
      sortOrder !== "newest"
    )
  }

  // Função para obter o título da notificação com base na ação
  const getNotificationTitle = (action) => {
    switch (action) {
      case "user_created":
        return "Novo talento cadastrado"
      case "user_updated":
        return "Perfil atualizado"
      case "highlight_added":
        return "Novo destaque"
      case "availability_changed":
        return "Disponibilidade alterada"
      default:
        return "Notificação"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleGoBack}
                className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold">Notificações</h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-full hover:bg-gray-800 transition-colors ${isRefreshing ? "animate-spin" : ""}`}
                disabled={loading || isRefreshing}
                aria-label="Atualizar notificações"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={handleMarkAllAsRead}
                className="hidden sm:flex items-center px-3 py-1.5 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors text-sm"
                disabled={loading || filteredNotifications.filter((n) => !n.read).length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Barra de pesquisa e filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Buscar notificações..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1) // Reset para primeira página ao buscar
              }}
            />
            {searchTerm && (
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative" ref={filtersRef}>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>Filtros</span>
                {hasActiveFilters() && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full">
                    {Object.values(filters).filter((f) => f !== "all").length +
                      (searchTerm ? 1 : 0) +
                      (sortOrder !== "newest" ? 1 : 0)}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isFiltersOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-900">Filtros</h3>
                        <button
                          onClick={clearFilters}
                          className="text-xs text-pink-600 hover:text-pink-800"
                          disabled={!hasActiveFilters()}
                        >
                          Limpar filtros
                        </button>
                      </div>

                      {/* Filtro de status */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex space-x-2">
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              filters.status === "all"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, status: "all" })}
                          >
                            Todas
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              filters.status === "read"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, status: "read" })}
                          >
                            Lidas
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              filters.status === "unread"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, status: "unread" })}
                          >
                            Não lidas
                          </button>
                        </div>
                      </div>

                      {/* Filtro de tipo */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              filters.type === "all"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, type: "all" })}
                          >
                            Todos
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center justify-center ${
                              filters.type === "user"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, type: "user" })}
                          >
                            <UserPlus className="h-3 w-3 mr-1" /> Cadastros
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center justify-center ${
                              filters.type === "edit"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, type: "edit" })}
                          >
                            <FileEdit className="h-3 w-3 mr-1" /> Edições
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center justify-center ${
                              filters.type === "star"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, type: "star" })}
                          >
                            <Star className="h-3 w-3 mr-1" /> Destaques
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center justify-center ${
                              filters.type === "calendar"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, type: "calendar" })}
                          >
                            <Calendar className="h-3 w-3 mr-1" /> Disponibilidade
                          </button>
                        </div>
                      </div>

                      {/* Filtro de data */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              filters.date === "all"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, date: "all" })}
                          >
                            Todos
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              filters.date === "today"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, date: "today" })}
                          >
                            Hoje
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              filters.date === "week"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, date: "week" })}
                          >
                            Última semana
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              filters.date === "month"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setFilters({ ...filters, date: "month" })}
                          >
                            Último mês
                          </button>
                        </div>
                      </div>

                      {/* Ordenação */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                        <div className="flex space-x-2">
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center ${
                              sortOrder === "newest"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setSortOrder("newest")}
                          >
                            <ChevronDown className="h-3 w-3 mr-1" /> Mais recentes
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center ${
                              sortOrder === "oldest"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setSortOrder("oldest")}
                          >
                            <ChevronUp className="h-3 w-3 mr-1" /> Mais antigas
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botão de marcar todas como lidas para mobile */}
            <button
              onClick={handleMarkAllAsRead}
              className="sm:hidden flex items-center justify-center p-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              disabled={loading || filteredNotifications.filter((n) => !n.read).length === 0}
              aria-label="Marcar todas como lidas"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Resumo dos filtros ativos */}
        {hasActiveFilters() && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Filtros ativos:</span>

            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Busca: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 text-gray-500 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.status !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Status: {filters.status === "read" ? "Lidas" : "Não lidas"}
                <button
                  onClick={() => setFilters({ ...filters, status: "all" })}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.type !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Tipo:{" "}
                {filters.type === "user"
                  ? "Cadastros"
                  : filters.type === "edit"
                    ? "Edições"
                    : filters.type === "star"
                      ? "Destaques"
                      : filters.type === "calendar"
                        ? "Disponibilidade"
                        : "Geral"}
                <button
                  onClick={() => setFilters({ ...filters, type: "all" })}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.date !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Período: {filters.date === "today" ? "Hoje" : filters.date === "week" ? "Última semana" : "Último mês"}
                <button
                  onClick={() => setFilters({ ...filters, date: "all" })}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {sortOrder !== "newest" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Ordenação: Mais antigas primeiro
                <button onClick={() => setSortOrder("newest")} className="ml-1 text-gray-500 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button onClick={clearFilters} className="text-xs text-pink-600 hover:text-pink-800 ml-auto">
              Limpar todos
            </button>
          </div>
        )}

        {/* Lista de notificações */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
              <span className="ml-3 text-gray-600">Carregando notificações...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma notificação encontrada</h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters()
                  ? "Tente ajustar os filtros para ver mais resultados."
                  : "Você não tem notificações no momento."}
              </p>
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {paginatedNotifications.map((notification) => {
                  const notificationIcon = renderNotificationIcon(notification)
                  const title = getNotificationTitle(notification.action)

                  return (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-gray-50" : ""}`}
                    >
                      <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">{notificationIcon}</div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3
                                className={`text-base font-medium ${
                                  !notification.read ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                            </div>
                            {!notification.read && (
                              <span className="ml-2 flex-shrink-0 inline-block h-2 w-2 rounded-full bg-pink-500"></span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{notification.time}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatFullDate(notification.timestamp)}</span>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="text-xs text-gray-500">ID: {notification.id}</div>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-pink-600 hover:text-pink-800 flex items-center"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Marcar como lida
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> a{" "}
                        <span className="font-medium">
                          {Math.min(page * itemsPerPage, filteredNotifications.length)}
                        </span>{" "}
                        de <span className="font-medium">{filteredNotifications.length}</span> resultados
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Anterior</span>
                          <ChevronUp className="h-5 w-5 rotate-90" />
                        </button>

                        {/* Números de página */}
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                          let pageNumber

                          // Lógica para mostrar páginas ao redor da página atual
                          if (totalPages <= 5) {
                            pageNumber = i + 1
                          } else if (page <= 3) {
                            pageNumber = i + 1
                          } else if (page >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i
                          } else {
                            pageNumber = page - 2 + i
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === pageNumber
                                  ? "z-10 bg-pink-50 border-pink-500 text-pink-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          )
                        })}

                        <button
                          onClick={() => setPage(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Próxima</span>
                          <ChevronDown className="h-5 w-5 rotate-90" />
                        </button>
                      </nav>
                    </div>
                  </div>

                  {/* Paginação mobile */}
                  <div className="flex items-center justify-between w-full sm:hidden">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        page === 1
                          ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-700">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        page === totalPages
                          ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
