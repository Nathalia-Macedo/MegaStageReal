// import { useState, useEffect } from "react"
// import {
//   User,
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   MoreHorizontal,
//   X,
//   Check,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   UserPlus,
//   Mail,
//   Key,
//   UserCircle,
// } from "lucide-react"
// import { useUsers } from "../../contexts/users-context"
// import ConfirmationModal from "../ConfirmationModal"
// export default function UserManagement() {
//   const { users, loading, error, fetchUsers, deleteUser, createUser } = useUsers()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filteredUsers, setFilteredUsers] = useState([])
//   const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [userToDelete, setUserToDelete] = useState(null)
//   const [actionMenuOpen, setActionMenuOpen] = useState({})

//   // Paginação
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(10)
//   const [totalPages, setTotalPages] = useState(1)

//   // Novo usuário
//   const [newUser, setNewUser] = useState({
//     email: "",
//     password: "",
//     first_name: "",
//     last_name: "",
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [formErrors, setFormErrors] = useState({})

//   useEffect(() => {
//     fetchUsers()
//   }, [fetchUsers])

//   useEffect(() => {
//     if (users.length > 0) {
//       const filtered = users.filter(
//         (user) =>
//           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           user.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
//       )
//       setFilteredUsers(filtered)

//       // Recalcular paginação
//       const totalPages = Math.ceil(filtered.length / itemsPerPage)
//       setTotalPages(totalPages || 1)

//       // Resetar para a primeira página quando o filtro mudar
//       if (currentPage > totalPages) {
//         setCurrentPage(1)
//       }
//     }
//   }, [users, searchTerm, itemsPerPage, currentPage])

//   const handleCreateUser = async (e) => {
//     e.preventDefault()

//     // Validação
//     const errors = {}
//     if (!newUser.email) errors.email = "Email é obrigatório"
//     else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = "Email inválido"

//     if (!newUser.password) errors.password = "Senha é obrigatória"
//     else if (newUser.password.length < 6) errors.password = "A senha deve ter pelo menos 6 caracteres"

//     if (!newUser.first_name) errors.first_name = "Nome é obrigatório"
//     if (!newUser.last_name) errors.last_name = "Sobrenome é obrigatório"

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors)
//       return
//     }

//     setIsSubmitting(true)
//     setFormErrors({})

//     try {
//       await createUser(newUser)
//       setIsAddUserModalOpen(false)
//       setNewUser({
//         email: "",
//         password: "",
//         first_name: "",
//         last_name: "",
//       })
//     } catch (error) {
//       // Erro já tratado no contexto
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDeleteUser = (user) => {
//     setUserToDelete(user)
//     setIsDeleteModalOpen(true)
//   }

//   const confirmDeleteUser = async () => {
//     if (!userToDelete) return

//     try {
//       await deleteUser(userToDelete.id)
//       setIsDeleteModalOpen(false)
//       setUserToDelete(null)
//     } catch (error) {
//       // Erro já tratado no contexto
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setNewUser((prev) => ({
//       ...prev,
//       [name]: value,
//     }))

//     // Limpar erro do campo quando o usuário digitar
//     if (formErrors[name]) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: null,
//       }))
//     }
//   }

//   const toggleActionMenu = (id) => {
//     setActionMenuOpen((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }))
//   }

//   const closeAllActionMenus = () => {
//     setActionMenuOpen({})
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return date.toLocaleDateString("pt-BR", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     })
//   }

//   // Paginação
//   const getCurrentPageItems = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage
//     const endIndex = startIndex + itemsPerPage
//     return filteredUsers.slice(startIndex, endIndex)
//   }

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1)
//     }
//   }

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1)
//     }
//   }

//   const goToPage = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber)
//     }
//   }

//   const renderPagination = () => {
//     if (totalPages <= 1) return null

//     const pageNumbers = []
//     const maxPageButtons = window.innerWidth < 640 ? 3 : 5
//     let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
//     const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

//     if (endPage - startPage + 1 < maxPageButtons) {
//       startPage = Math.max(1, endPage - maxPageButtons + 1)
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i)
//     }

//     return (
//       <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
//         <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
//           <select
//             className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-gray-900"
//             value={itemsPerPage}
//             onChange={(e) => setItemsPerPage(Number(e.target.value))}
//           >
//             <option value={5}>5 por página</option>
//             <option value={10}>10 por página</option>
//             <option value={20}>20 por página</option>
//             <option value={50}>50 por página</option>
//           </select>
//           <span className="ml-2 text-xs sm:text-sm text-gray-600">
//             Exibindo {getCurrentPageItems().length} de {filteredUsers.length} usuários
//           </span>
//         </div>

//         <div className="flex items-center space-x-1 w-full sm:w-auto justify-center">
//           <button
//             onClick={goToPreviousPage}
//             disabled={currentPage === 1}
//             className={`p-1.5 rounded-md ${
//               currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
//             }`}
//             aria-label="Página anterior"
//             type="button"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>

//           {pageNumbers.map((number) => (
//             <button
//               key={number}
//               onClick={() => goToPage(number)}
//               className={`px-2 py-1 rounded-md text-sm ${
//                 currentPage === number ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-gray-100"
//               }`}
//               type="button"
//             >
//               {number}
//             </button>
//           ))}

//           <button
//             onClick={goToNextPage}
//             disabled={currentPage === totalPages}
//             className={`p-1.5 rounded-md ${
//               currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
//             }`}
//             aria-label="Próxima página"
//             type="button"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
//         <button
//           onClick={() => setIsAddUserModalOpen(true)}
//           className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
//         >
//           <Plus className="w-5 h-5 mr-2" />
//           Adicionar Usuário
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div className="relative w-full md:w-auto md:min-w-[300px]">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Buscar usuários..."
//               className="pl-10 pr-4 py-2 w-full text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-2 w-full md:w-auto justify-end">
//             <button
//               onClick={() => fetchUsers()}
//               className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
//               ) : (
//                 <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   />
//                 </svg>
//               )}
//               Atualizar
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
//             <p className="flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path
//                   fillRule="evenodd"
//                   d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {error}
//             </p>
//           </div>
//         )}

//         {/* Tabela para desktop */}
//         <div className="hidden md:block overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Usuário
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Email
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Data de Criação
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Ações
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                     <div className="flex justify-center items-center">
//                       <svg className="animate-spin h-5 w-5 mr-3 text-pink-500" viewBox="0 0 24 24">
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Carregando usuários...
//                     </div>
//                   </td>
//                 </tr>
//               ) : getCurrentPageItems().length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                     Nenhum usuário encontrado.
//                   </td>
//                 </tr>
//               ) : (
//                 getCurrentPageItems().map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                           <User className="h-5 w-5 text-gray-500" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.first_name} {user.last_name}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{user.email}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{formatDate(user.created_at)}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex justify-end space-x-2">
//                         <button
//                           onClick={() => {
//                             /* Implementar edição */
//                           }}
//                           className="text-blue-500 hover:text-blue-700"
//                           aria-label="Editar usuário"
//                         >
//                           <Edit className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteUser(user)}
//                           className="text-red-500 hover:text-red-700"
//                           aria-label="Excluir usuário"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Cards para mobile */}
//         <div className="md:hidden">
//           {loading ? (
//             <div className="flex justify-center items-center py-8">
//               <svg className="animate-spin h-8 w-8 mr-3 text-pink-500" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               <span className="text-gray-600">Carregando usuários...</span>
//             </div>
//           ) : getCurrentPageItems().length === 0 ? (
//             <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado.</div>
//           ) : (
//             <div className="space-y-4">
//               {getCurrentPageItems().map((user) => (
//                 <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
//                   <div className="flex items-center justify-between p-4 border-b border-gray-100">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                         <User className="h-5 w-5 text-gray-500" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-900">
//                           {user.first_name} {user.last_name}
//                         </h3>
//                         <p className="text-sm text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                     <div className="relative">
//                       <button
//                         onClick={() => toggleActionMenu(user.id)}
//                         className="p-1.5 rounded-full hover:bg-gray-100"
//                         aria-label="Ações"
//                         type="button"
//                       >
//                         <MoreHorizontal className="h-5 w-5 text-gray-500" />
//                       </button>

//                       {actionMenuOpen[user.id] && (
//                         <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//                           <div className="py-1">
//                             <button
//                               onClick={() => {
//                                 /* Implementar edição */
//                                 toggleActionMenu(user.id)
//                               }}
//                               className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                               type="button"
//                             >
//                               <Edit className="h-4 w-4 mr-2 text-blue-500" />
//                               Editar
//                             </button>
//                             <button
//                               onClick={() => {
//                                 handleDeleteUser(user)
//                                 toggleActionMenu(user.id)
//                               }}
//                               className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
//                               type="button"
//                             >
//                               <Trash2 className="h-4 w-4 mr-2" />
//                               Excluir
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="p-4">
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="text-gray-500">Data de criação:</span>
//                       <span className="text-gray-900">{formatDate(user.created_at)}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {renderPagination()}
//       </div>

//       {/* Modal para adicionar usuário */}
//       {isAddUserModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
//             <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900 flex items-center">
//                 <UserPlus className="h-5 w-5 mr-2 text-pink-500" />
//                 Adicionar Novo Usuário
//               </h3>
//               <button
//                 onClick={() => setIsAddUserModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-500"
//                 aria-label="Fechar"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <form onSubmit={handleCreateUser} className="p-6">
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={newUser.email}
//                       onChange={handleInputChange}
//                       className={`pl-10 block w-full rounded-md border ${
//                         formErrors.email ? "border-red-300" : "border-gray-300"
//                       } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 text-gray-900`}
//                       placeholder="usuario@exemplo.com"
//                     />
//                   </div>
//                   {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
//                 </div>

//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                     Senha
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Key className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="password"
//                       id="password"
//                       name="password"
//                       value={newUser.password}
//                       onChange={handleInputChange}
//                       className={`pl-10 block w-full rounded-md border ${
//                         formErrors.password ? "border-red-300" : "border-gray-300"
//                       } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 text-gray-900`}
//                       placeholder="••••••••"
//                     />
//                   </div>
//                   {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
//                       Nome
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <UserCircle className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         type="text"
//                         id="first_name"
//                         name="first_name"
//                         value={newUser.first_name}
//                         onChange={handleInputChange}
//                         className={`pl-10 block w-full rounded-md border ${
//                           formErrors.first_name ? "border-red-300" : "border-gray-300"
//                         } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 text-gray-900`}
//                         placeholder="Nome"
//                       />
//                     </div>
//                     {formErrors.first_name && <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>}
//                   </div>

//                   <div>
//                     <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
//                       Sobrenome
//                     </label>
//                     <input
//                       type="text"
//                       id="last_name"
//                       name="last_name"
//                       value={newUser.last_name}
//                       onChange={handleInputChange}
//                       className={`block w-full rounded-md border ${
//                         formErrors.last_name ? "border-red-300" : "border-gray-300"
//                       } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 text-gray-900`}
//                       placeholder="Sobrenome"
//                     />
//                     {formErrors.last_name && <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>}
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsAddUserModalOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
//                 >
//                   Cancelar
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-4 py-2 bg-pink-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex items-center"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="animate-spin h-4 w-4 mr-2" />
//                       Criando...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="h-4 w-4 mr-2" />
//                       Criar Usuário
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal de confirmação de exclusão */}
//       <ConfirmationModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={confirmDeleteUser}
//         title="Confirmar Exclusão"
//         message={
//           userToDelete
//             ? `Tem certeza que deseja excluir o usuário ${userToDelete.first_name} ${userToDelete.last_name}? Esta ação não pode ser desfeita.`
//             : "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
//         }
//         confirmText="Excluir"
//         cancelText="Cancelar"
//         type="danger"
//       />
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import {
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  X,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Mail,
  Key,
  UserCircle,
} from "lucide-react"
import { useUsers } from "../../contexts/users-context"
import ConfirmationModal from "../ConfirmationModal"
export default function UserManagement() {
  const { users, loading, error, fetchUsers, deleteUser, createUser } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState({})

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Novo usuário
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)

      // Recalcular paginação
      const totalPages = Math.ceil(filtered.length / itemsPerPage)
      setTotalPages(totalPages || 1)

      // Resetar para a primeira página quando o filtro mudar
      if (currentPage > totalPages) {
        setCurrentPage(1)
      }
    }
  }, [users, searchTerm, itemsPerPage, currentPage])

  const handleCreateUser = async (e) => {
    e.preventDefault()

    // Validação
    const errors = {}
    if (!newUser.email) errors.email = "Email é obrigatório"
    else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = "Email inválido"

    if (!newUser.password) errors.password = "Senha é obrigatória"
    else if (newUser.password.length < 6) errors.password = "A senha deve ter pelo menos 6 caracteres"

    if (!newUser.first_name) errors.first_name = "Nome é obrigatório"
    if (!newUser.last_name) errors.last_name = "Sobrenome é obrigatório"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    setFormErrors({})

    try {
      await createUser(newUser)
      setIsAddUserModalOpen(false)
      setNewUser({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
      })
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete.id)
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    } catch (error) {
      // Erro já tratado no contexto
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpar erro do campo quando o usuário digitar
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const toggleActionMenu = (id) => {
    setActionMenuOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const closeAllActionMenus = () => {
    setActionMenuOpen({})
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Paginação
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const maxPageButtons = window.innerWidth < 640 ? 3 : 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
          <select
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-gray-900"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
          <span className="ml-2 text-xs sm:text-sm text-gray-600">
            Exibindo {getCurrentPageItems().length} de {filteredUsers.length} usuários
          </span>
        </div>

        <div className="flex items-center space-x-1 w-full sm:w-auto justify-center">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-md ${
              currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Página anterior"
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-2 py-1 rounded-md text-sm ${
                currentPage === number ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              type="button"
            >
              {number}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-md ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Próxima página"
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Usuário
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar usuários..."
              className="pl-10 pr-4 py-2 w-full text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => fetchUsers()}
              className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              Atualizar
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Tabela para desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Usuário
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data de Criação
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-pink-500" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Carregando usuários...
                    </div>
                  </td>
                </tr>
              ) : getCurrentPageItems().length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                getCurrentPageItems().map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(user.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            /* Implementar edição */
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          aria-label="Editar usuário"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Excluir usuário"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards para mobile */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 mr-3 text-pink-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-600">Carregando usuários...</span>
            </div>
          ) : getCurrentPageItems().length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado.</div>
          ) : (
            <div className="space-y-4">
              {getCurrentPageItems().map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => toggleActionMenu(user.id)}
                        className="p-1.5 rounded-full hover:bg-gray-100"
                        aria-label="Ações"
                        type="button"
                      >
                        <MoreHorizontal className="h-5 w-5 text-gray-500" />
                      </button>

                      {actionMenuOpen[user.id] && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                /* Implementar edição */
                                toggleActionMenu(user.id)
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              type="button"
                            >
                              <Edit className="h-4 w-4 mr-2 text-blue-500" />
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteUser(user)
                                toggleActionMenu(user.id)
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Data de criação:</span>
                      <span className="text-gray-900">{formatDate(user.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {renderPagination()}
      </div>

      {/* Modal para adicionar usuário */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-pink-500" />
                Adicionar Novo Usuário
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      className={`pl-10 block w-full rounded-md border ${
                        formErrors.email ? "border-red-300" : "border-gray-300"
                      } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 text-gray-900`}
                      placeholder="usuario@exemplo.com"
                    />
                  </div>
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className={`pl-10 block w-full rounded-md border ${
                        formErrors.password ? "border-red-300" : "border-gray-300"
                      } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 text-gray-900`}
                      placeholder="••••••••"
                    />
                  </div>
                  {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={newUser.first_name}
                        onChange={handleInputChange}
                        className={`pl-10 block w-full rounded-md border ${
                          formErrors.first_name ? "border-red-300" : "border-gray-300"
                        } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 text-gray-900`}
                        placeholder="Nome"
                      />
                    </div>
                    {formErrors.first_name && <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>}
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={newUser.last_name}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border ${
                        formErrors.last_name ? "border-red-300" : "border-gray-300"
                      } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 text-gray-900`}
                      placeholder="Sobrenome"
                    />
                    {formErrors.last_name && <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-pink-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Criar Usuário
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Confirmar Exclusão"
        message={
          userToDelete
            ? `Tem certeza que deseja excluir o usuário ${userToDelete.first_name} ${userToDelete.last_name}? Esta ação não pode ser desfeita.`
            : "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
