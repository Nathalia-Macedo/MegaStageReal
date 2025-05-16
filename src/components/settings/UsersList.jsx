"use client"

import { useState, useEffect } from "react"
import { User, Search, Edit, Trash2, MoreHorizontal, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useUsers } from "../../contexts/users-context"
import ConfirmationModal from "../ConfirmationModal"

export default function UsersList() {
  const { users, loading, error, fetchUsers, deleteUser } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState({})

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)

      // Recalcular paginação
      const totalPages = Math.ceil(filtered.length / itemsPerPage)
      setTotalPages(totalPages || 1)

      // Resetar para a primeira página quando o filtro mudar
      if (currentPage > totalPages) {
        setCurrentPage(1)
      }
    } else {
      setFilteredUsers([])
    }
  }, [users, searchTerm, itemsPerPage, currentPage])

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
                        {user.photo ? (
                          <img
                            src={user.photo || "/placeholder.svg"}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
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
                      {user.photo ? (
                        <img
                          src={user.photo || "/placeholder.svg"}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
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
