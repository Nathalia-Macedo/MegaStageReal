import { useState, useEffect, useRef } from "react"
import { useTalent } from "../contexts/talents-context"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  Edit,
  Trash2,
  Star,
  Search,
  Plus,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Info,
  User,
  Calendar,
  Sliders,
  List,
  Grid,
  ArrowUp,
  ArrowDown,
  Instagram,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import TalentModal from "./TalentModal"
import EditTalentModal from "./EditTalentModal"
import AddTalentModal from "./AddTalentModal"
import ConfirmationModal from "./ConfirmationModal"

export default function TalentsManager() {
  const {
    talents,
    loading: contextLoading,
    fetchTalents,
    fetchTalentById,
    deleteTalent,
    toggleHighlight,
    openModal,
  } = useTalent()
  const [loading, setLoading] = useState(contextLoading)
  const isInitialMount = useRef(true)
  const [localLoading, setLocalLoading] = useState({})
  const [actionMenuOpen, setActionMenuOpen] = useState({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [filteredTalents, setFilteredTalents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortOrder, setSortOrder] = useState("name_asc")
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState(() => {
    // Recuperar preferência do usuário do localStorage
    const savedViewMode = localStorage.getItem("talentsViewMode")
    return savedViewMode || (window.innerWidth < 768 ? "cards" : "table")
  })
  const [advancedFilters, setAdvancedFilters] = useState(false)
  const [ageRange, setAgeRange] = useState([0, 100])
  const [categoryFilter, setCategoryFilter] = useState("")
  const [highlightedFilter, setHighlightedFilter] = useState("")

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const savedItemsPerPage = localStorage.getItem("talentsItemsPerPage")
    return savedItemsPerPage ? Number.parseInt(savedItemsPerPage) : 10
  })
  const [paginatedTalents, setPaginatedTalents] = useState([])
  const [totalPages, setTotalPages] = useState(1)

  // Estado para o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTalentId, setEditingTalentId] = useState(null)

  // Estado para o modal de confirmação de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingTalentId, setDeletingTalentId] = useState(null)
  const [deletingTalentName, setDeletingTalentName] = useState("")

  // Referência para fechar menus de ação quando clicar fora
  const menuRef = useRef(null)
  const filterRef = useRef(null)

  // Estado para controlar o carregamento durante a busca
  const [searchLoading, setSearchLoading] = useState(false)

  // Estado para animações
  const [isAnimating, setIsAnimating] = useState(false)

  // Salvar preferências do usuário
  useEffect(() => {
    localStorage.setItem("talentsViewMode", viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem("talentsItemsPerPage", itemsPerPage.toString())
  }, [itemsPerPage])

  useEffect(() => {
    // Função para fechar menus quando clicar fora
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenuOpen({})
      }

      if (filterRef.current && !filterRef.current.contains(event.target) && showFilters) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showFilters])

  const calculateAge = (birthDate) => {
    if (!birthDate) return "-"
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
    } catch (error) {
      return dateString
    }
  }

  // Função applyFilters otimizada com useMemo
  const applyFilters = () => {
    // Evitar processamento desnecessário se não houver talentos
    if (talents.length === 0) {
      setFilteredTalents([])
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)

    // Usar requestAnimationFrame para sincronizar com o ciclo de renderização do navegador
    requestAnimationFrame(() => {
      let filtered = [...talents]

      // Filtro de busca por nome
      if (searchTerm) {
        filtered = filtered.filter((talent) => talent.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }

      // Filtro de status
      if (statusFilter) {
        if (statusFilter === "disponivel") {
          filtered = filtered.filter((talent) => talent.disponivel === true && talent.ativo === true)
        } else if (statusFilter === "indisponivel") {
          filtered = filtered.filter((talent) => talent.disponivel === false && talent.ativo === true)
        } else if (statusFilter === "inativo") {
          filtered = filtered.filter((talent) => talent.ativo === false)
        }
      }

      // Filtros avançados
      if (advancedFilters) {
        // Filtro de categoria
        if (categoryFilter) {
          filtered = filtered.filter((talent) => talent.category === categoryFilter)
        }

        // Filtro de destaque
        if (highlightedFilter) {
          if (highlightedFilter === "destacado") {
            filtered = filtered.filter((talent) => talent.destaque === true)
          } else if (highlightedFilter === "nao_destacado") {
            filtered = filtered.filter((talent) => talent.destaque === false)
          }
        }

        // Filtro de idade
        filtered = filtered.filter((talent) => {
          const age = calculateAge(talent.birth_date)
          return age >= ageRange[0] && age <= ageRange[1]
        })
      }

      // Ordenação
      if (sortOrder === "name_asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortOrder === "name_desc") {
        filtered.sort((a, b) => b.name.localeCompare(a.name))
      } else if (sortOrder === "age_asc") {
        filtered.sort((a, b) => calculateAge(a.birth_date) - calculateAge(b.birth_date))
      } else if (sortOrder === "age_desc") {
        filtered.sort((a, b) => calculateAge(b.birth_date) - calculateAge(a.birth_date))
      } else if (sortOrder === "recent") {
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      }

      // Atualizar o estado em uma única operação
      setFilteredTalents(filtered)
      setCurrentPage(1)
      setSearchLoading(false)
    })
  }

  // Memoizar a paginação para melhorar a performance
  useEffect(() => {
    // Evitar processamento se não houver dados
    if (filteredTalents.length === 0) {
      setPaginatedTalents([])
      setTotalPages(1)
      return
    }

    const totalItems = filteredTalents.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    setTotalPages(totalPages || 1)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Aplicar paginação diretamente sem animação intermediária
    setPaginatedTalents(filteredTalents.slice(startIndex, endIndex))

    // Só animar quando não estiver no carregamento inicial
    if (!loading && !isInitialMount.current) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [filteredTalents, currentPage, itemsPerPage, loading])

  useEffect(() => {
    const loadInitialData = async () => {
      setError(null)
      try {
        // Definir um estado de carregamento inicial para evitar flashes
        setLoading(true)
        const loadedTalents = await fetchTalents()

        // Definir os dados filtrados e paginados em uma única operação
        setFilteredTalents(loadedTalents || [])

        // Não mostrar toast se for o carregamento inicial
        if (!isInitialMount.current) {
          toast.success("Talentos carregados com sucesso!", {
            toastId: "fetch-talents-success",
            icon: <CheckCircle className="text-green-500" size={18} />,
          })
        }
      } catch (error) {
        console.error("Erro ao carregar talentos iniciais:", error)
        setError(error.message || "Erro ao carregar talentos")
        toast.error(`Erro ao carregar talentos: ${error.message}`, {
          toastId: "fetch-talents-error",
          icon: <AlertCircle className="text-red-500" size={18} />,
        })
      } finally {
        // Marcar que não é mais o carregamento inicial
        isInitialMount.current = false
        setLoading(false)
      }
    }

    loadInitialData()
  }, []) // Carrega apenas uma vez

  useEffect(() => {
    // Não aplicar filtros durante o carregamento inicial ou quando não há talentos
    if (loading || talents.length === 0) return

    // Aplicar filtros com debounce para evitar múltiplas renderizações
    const timer = setTimeout(() => {
      applyFilters()
    }, 100)

    return () => clearTimeout(timer)
  }, [talents, searchTerm, statusFilter, sortOrder, advancedFilters, categoryFilter, highlightedFilter, ageRange])

  const handleViewTalent = async (id, e) => {
    if (e) e.preventDefault()

    try {
      // Verificar se já estamos carregando este talento para evitar requisições duplicadas
      if (localLoading[id]) return

      // Primeiro verifica se o talento já está no estado local
      const existingTalent = talents.find((t) => t.id === id)

      // Usamos um estado de loading local para este talento específico
      setLocalLoading((prev) => ({ ...prev, [id]: true }))

      if (existingTalent) {
        // Se já temos o talento básico, abrimos o modal com ele primeiro
        // Usar setTimeout para evitar renderização imediata que pode causar flicker
        setTimeout(() => {
          openModal(existingTalent)
        }, 0)
      }

      // Buscamos os detalhes completos em segundo plano
      try {
        const detailedTalent = await fetchTalentById(id)

        // Atualizamos o modal com os detalhes completos quando disponíveis
        // Usar setTimeout para evitar renderização imediata que pode causar flicker
        setTimeout(() => {
          openModal(detailedTalent)
        }, 0)
      } catch (error) {
        console.error("Erro ao buscar detalhes do talento:", error)
        toast.error(`Erro ao carregar detalhes: ${error.message}`, {
          toastId: `fetch-talent-${id}-error`,
          icon: <AlertCircle className="text-red-500" size={18} />,
        })
      } finally {
        setLocalLoading((prev) => ({ ...prev, [id]: false }))
      }
    } catch (error) {
      console.error("Erro ao buscar talento:", error)
      toast.error(`Erro ao carregar talento: ${error.message}`, {
        toastId: `fetch-talent-${id}-error`,
        icon: <AlertCircle className="text-red-500" size={18} />,
      })
      setLocalLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleCloseModal = () => {
    // Apenas fecha o modal, sem atualizar a tabela
  }

  const handleEditTalent = (id) => {
    setEditingTalentId(id)
    setIsEditModalOpen(true)
  }

  const handleSaveEditedTalent = (updatedTalent) => {
    // Atualizar a lista de talentos após a edição
    fetchTalents()
  }

  // Função para abrir o modal de confirmação de exclusão
  const openDeleteConfirmation = (id) => {
    const talent = talents.find((t) => t.id === id)
    if (talent) {
      setDeletingTalentId(id)
      setDeletingTalentName(talent.name)
      setIsDeleteModalOpen(true)
    }
  }

  // Função para executar a exclusão após confirmação
  const confirmDelete = async () => {
    if (!deletingTalentId) return

    try {
      setLocalLoading((prev) => ({ ...prev, [deletingTalentId]: true }))
      await deleteTalent(deletingTalentId)
      toast.success("Talento excluído com sucesso!", {
        toastId: `delete-talent-${deletingTalentId}-success`,
        icon: <CheckCircle className="text-green-500" size={18} />,
      })
    } catch (error) {
      console.error("Erro ao excluir talento:", error)
      toast.error(`Erro ao excluir talento: ${error.message}`, {
        toastId: `delete-talent-${deletingTalentId}-error`,
        icon: <AlertCircle className="text-red-500" size={18} />,
      })
    } finally {
      setLocalLoading((prev) => ({ ...prev, [deletingTalentId]: false }))
      setIsDeleteModalOpen(false)
      setDeletingTalentId(null)
      setDeletingTalentName("")
    }
  }

  const handleToggleHighlight = async (id, isHighlighted) => {
    try {
      await toggleHighlight(id, isHighlighted)
      toast.success("Destaque alterado com sucesso!", {
        toastId: `toggle-highlight-${id}-success`,
        icon: <CheckCircle className="text-green-500" size={18} />,
      })
    } catch (error) {
      console.error("Erro ao alternar destaque:", error)
      toast.error(`Erro ao alternar destaque: ${error.message}`, {
        toastId: `toggle-highlight-${id}-error`,
        icon: <AlertCircle className="text-red-500" size={18} />,
      })
    }
  }

  const handleAddTalent = () => {
    setIsAddModalOpen(true)
  }

  const handleImportFromManager = () => {
    toast.info("Funcionalidade de importação em desenvolvimento", {
      icon: <Info className="text-blue-500" size={18} />,
    })
  }

  const handleRefresh = async () => {
    try {
      await fetchTalents()
      toast.success("Talentos atualizados com sucesso!", {
        toastId: "refresh-talents-success",
        icon: <CheckCircle className="text-green-500" size={18} />,
      })
    } catch (error) {
      console.error("Erro ao atualizar talentos:", error)
      toast.error(`Erro ao atualizar talentos: ${error.message}`, {
        toastId: "refresh-talents-error",
        icon: <AlertCircle className="text-red-500" size={18} />,
      })
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      // Scroll para o topo da lista
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      // Scroll para o topo da lista
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      // Scroll para o topo da lista
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const toggleActionMenu = (id) => {
    setActionMenuOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleAdvancedFilters = () => {
    setAdvancedFilters(!advancedFilters)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setSortOrder("name_asc")
    setCategoryFilter("")
    setHighlightedFilter("")
    setAgeRange([0, 100])
    setAdvancedFilters(false)
  }

  const renderStatus = (talent) => {
    if (!talent.ativo) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm bg-red-100 text-red-800 whitespace-nowrap">
          <XCircle className="w-3 h-3 mr-1 flex-shrink-0" />
          <span>Inativo</span>
        </span>
      )
    } else if (talent.disponivel) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-800 whitespace-nowrap">
          <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
          <span>Disponível</span>
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm bg-yellow-100 text-yellow-800 whitespace-nowrap">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          <span>Indisponível</span>
        </span>
      )
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

      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-col sm:flex-row items-center justify-between mt-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
          <select
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-gray-900"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            aria-label="Itens por página"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
          <span className="ml-2 text-xs sm:text-sm text-gray-600">
            Exibindo {paginatedTalents.length} de {filteredTalents.length} talentos
          </span>
        </div>

        <div className="flex items-center space-x-1 w-full sm:w-auto justify-center">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-pink-500 focus:outline-none"
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
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                currentPage === number
                  ? "bg-pink-500 text-white"
                  : "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-pink-500 focus:outline-none"
              }`}
              type="button"
              aria-label={`Página ${number}`}
              aria-current={currentPage === number ? "page" : undefined}
            >
              {number}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-md ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-pink-500 focus:outline-none"
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

  const renderMobileTableView = () => (
    <div className="md:hidden">
      {loading || searchLoading ? (
        <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 mb-4 text-pink-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-gray-600 font-medium">
              {loading ? "Carregando talentos..." : "Buscando talentos..."}
            </span>
          </div>
        </div>
      ) : paginatedTalents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum talento encontrado</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Não encontramos talentos com os critérios de busca atuais. Tente ajustar os filtros ou adicionar um novo
              talento.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              type="button"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {paginatedTalents.map((talent) => (
              <motion.div
                key={talent.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden mr-3 border border-gray-200">
                      {talent.cover ? (
                        <img
                          src={talent.cover || "/placeholder.svg"}
                          alt={`Foto de ${talent.name}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23a0a0a0" textAnchor="middle" dy=".3em">${talent.name.charAt(0)}</text></svg>`
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">
                          {talent.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{talent.name}</h3>
                      <p className="text-xs text-gray-500">{talent.category}</p>
                    </div>
                  </div>
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => toggleActionMenu(talent.id)}
                      className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      aria-label="Ações"
                      type="button"
                    >
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </button>

                    <AnimatePresence>
                      {actionMenuOpen[talent.id] && (
                        <motion.div
                          className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-hidden"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                handleViewTalent(talent.id, e)
                                toggleActionMenu(talent.id)
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              type="button"
                            >
                              <Eye className="h-4 w-4 mr-2 text-gray-500" />
                              Visualizar
                            </button>
                            <button
                              onClick={() => {
                                handleEditTalent(talent.id)
                                toggleActionMenu(talent.id)
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              type="button"
                            >
                              <Edit className="h-4 w-4 mr-2 text-blue-500" />
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                handleToggleHighlight(talent.id, talent.destaque)
                                toggleActionMenu(talent.id)
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              type="button"
                            >
                              <Star
                                className={`h-4 w-4 mr-2 ${talent.destaque ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                              />
                              {talent.destaque ? "Remover destaque" : "Destacar"}
                            </button>
                            <button
                              onClick={() => {
                                openDeleteConfirmation(talent.id)
                                toggleActionMenu(talent.id)
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span className="text-sm text-gray-600">{calculateAge(talent.birth_date)} anos</span>
                    </div>
                    <div>{renderStatus(talent)}</div>
                  </div>

                  {talent.destaque && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1.5" />
                      <span className="text-sm text-gray-600">Talento em destaque</span>
                    </div>
                  )}

                  {!talent.disponivel && talent.data_disponibilidade && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span className="text-sm text-gray-600">
                        Disponível a partir de: {formatDate(talent.data_disponibilidade)}
                      </span>
                    </div>
                  )}

                  {talent.instagram && (
                    <div className="flex items-center">
                      <Instagram className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span className="text-sm text-gray-600">{talent.instagram}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 p-4 flex justify-between">
                  <button
                    onClick={(e) => handleViewTalent(talent.id, e)}
                    className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    aria-label="Visualizar talento"
                    type="button"
                  >
                    {localLoading[talent.id] ? (
                      <svg className="animate-spin h-4 w-4 mr-1.5 text-gray-500" viewBox="0 0 24 24">
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
                    ) : (
                      <Eye className="h-4 w-4 mr-1.5" />
                    )}
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleEditTalent(talent.id)}
                    className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Editar talento"
                    type="button"
                  >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Editar
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )

  const renderDesktopTableView = () => (
    <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  Nome
                  <button
                    onClick={() => setSortOrder(sortOrder === "name_asc" ? "name_desc" : "name_asc")}
                    className="ml-1 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    aria-label="Ordenar por nome"
                    type="button"
                  >
                    {sortOrder === "name_asc" ? (
                      <ArrowUp className="h-3 w-3 text-gray-400" />
                    ) : sortOrder === "name_desc" ? (
                      <ArrowDown className="h-3 w-3 text-gray-400" />
                    ) : (
                      <ArrowUp className="h-3 w-3 text-gray-300" />
                    )}
                  </button>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Categoria
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  Idade
                  <button
                    onClick={() => setSortOrder(sortOrder === "age_asc" ? "age_desc" : "age_asc")}
                    className="ml-1 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    aria-label="Ordenar por idade"
                    type="button"
                  >
                    {sortOrder === "age_asc" ? (
                      <ArrowUp className="h-3 w-3 text-gray-400" />
                    ) : sortOrder === "age_desc" ? (
                      <ArrowDown className="h-3 w-3 text-gray-400" />
                    ) : (
                      <ArrowUp className="h-3 w-3 text-gray-300" />
                    )}
                  </button>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Destaque
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading || searchLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="animate-spin h-8 w-8 mb-4 text-pink-500" viewBox="0 0 24 24">
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
                    <span className="font-medium">{loading ? "Carregando talentos..." : "Buscando talentos..."}</span>
                  </div>
                </td>
              </tr>
            ) : paginatedTalents.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum talento encontrado</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Não encontramos talentos com os critérios de busca atuais. Tente ajustar os filtros ou adicionar
                      um novo talento.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      type="button"
                    >
                      Limpar filtros
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {paginatedTalents.map((talent, index) => (
                  <motion.tr
                    key={talent.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                          {talent.cover ? (
                            <img
                              src={talent.cover || "/placeholder.svg"}
                              alt={`Foto de ${talent.name}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23a0a0a0" textAnchor="middle" dy=".3em">${talent.name.charAt(0)}</text></svg>`
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">
                              {talent.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{talent.name}</div>
                          {talent.instagram && (
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Instagram className="h-3 w-3 mr-1" />
                              {talent.instagram}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {talent.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calculateAge(talent.birth_date)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{renderStatus(talent)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleToggleHighlight(talent.id, talent.destaque)}
                        className="focus:outline-none focus:ring-2 focus:ring-pink-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={talent.destaque ? "Remover dos destaques" : "Adicionar aos destaques"}
                        type="button"
                      >
                        <Star
                          className={`h-5 w-5 ${talent.destaque ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center space-x-2 sm:space-x-3">
                        <button
                          onClick={(e) => handleViewTalent(talent.id, e)}
                          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                          aria-label="Visualizar talento"
                          type="button"
                        >
                          {localLoading[talent.id] ? (
                            <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
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
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditTalent(talent.id)}
                          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Editar talento"
                          type="button"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmation(talent.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Excluir talento"
                          type="button"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading || searchLoading ? (
        <div className="col-span-full flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 mb-4 text-pink-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-gray-600 font-medium">
              {loading ? "Carregando talentos..." : "Buscando talentos..."}
            </span>
          </div>
        </div>
      ) : paginatedTalents.length === 0 ? (
        <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum talento encontrado</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Não encontramos talentos com os critérios de busca atuais. Tente ajustar os filtros ou adicionar um novo
              talento.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              type="button"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          {paginatedTalents.map((talent, index) => (
            <motion.div
              key={talent.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                <div className="h-56 bg-gray-100 overflow-hidden">
                  {talent.cover ? (
                    <img
                      src={talent.cover || "/placeholder.svg"}
                      alt={`Foto de ${talent.name}`}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="32" fill="%23a0a0a0" textAnchor="middle" dy=".3em">${talent.name.charAt(0)}</text></svg>`
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-5xl text-gray-400">{talent.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <button
                      onClick={(e) => handleViewTalent(talent.id, e)}
                      className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                      aria-label="Visualizar talento"
                      type="button"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTalent(talent.id)}
                        className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Editar talento"
                        type="button"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirmation(talent.id)}
                        className="p-2 bg-white/90 rounded-full text-red-600 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Excluir talento"
                        type="button"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleHighlight(talent.id, talent.destaque)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 hover:bg-gray-50 transition-colors"
                  aria-label={talent.destaque ? "Remover dos destaques" : "Adicionar aos destaques"}
                  type="button"
                >
                  <Star
                    className={`h-5 w-5 ${talent.destaque ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                </button>
                {talent.destaque && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-md text-xs font-medium shadow-sm flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Destaque
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-lg">{talent.name}</h3>
                  <div>{renderStatus(talent)}</div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{calculateAge(talent.birth_date)} anos</span>
                  </div>

                  {talent.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{talent.category}</span>
                    </div>
                  )}

                  {talent.instagram && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Instagram className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{talent.instagram}</span>
                    </div>
                  )}

                  {!talent.disponivel && talent.data_disponibilidade && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Disponível a partir de: {formatDate(talent.data_disponibilidade)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => handleViewTalent(talent.id, e)}
                    className="flex items-center justify-center px-4 py-2 bg-pink-50 text-pink-700 rounded-md hover:bg-pink-100 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                    aria-label="Visualizar talento"
                    type="button"
                  >
                    {localLoading[talent.id] ? (
                      <svg className="animate-spin h-4 w-4 mr-2 text-pink-500" viewBox="0 0 24 24">
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
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleEditTalent(talent.id)}
                    className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Editar talento"
                    type="button"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header com animação */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Gerenciar Talentos</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Gerencie, edite e organize todos os talentos da plataforma
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={handleAddTalent}
              className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm sm:text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Adicionar Talento
            </motion.button>
            <motion.button
              onClick={handleImportFromManager}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Importar do Manager
            </motion.button>
          </div>
        </div>

        {/* Barra de ferramentas e filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome..."
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                className="px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-gray-700 min-w-[140px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filtrar por status"
              >
                <option value="">Todos os status</option>
                <option value="disponivel">Disponível</option>
                <option value="indisponivel">Indisponível</option>
                <option value="inativo">Inativo</option>
              </select>

              <div className="flex items-center">
                <button
                  onClick={toggleAdvancedFilters}
                  className={`flex items-center px-3 py-2.5 rounded-md border transition-colors ${
                    advancedFilters
                      ? "bg-pink-50 text-pink-700 border-pink-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  type="button"
                  aria-expanded={advancedFilters}
                  aria-controls="advanced-filters"
                >
                  <Sliders className="h-5 w-5 mr-2" />
                  Filtros avançados
                </button>

                <div className="flex items-center ml-3">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-l-md border border-r-0 transition-colors ${
                      viewMode === "table"
                        ? "bg-gray-100 text-gray-800 border-gray-300"
                        : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    }`}
                    aria-label="Visualizar em tabela"
                    aria-pressed={viewMode === "table"}
                    type="button"
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-2 rounded-r-md border transition-colors ${
                      viewMode === "cards"
                        ? "bg-gray-100 text-gray-800 border-gray-300"
                        : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    }`}
                    aria-label="Visualizar em cards"
                    aria-pressed={viewMode === "cards"}
                    type="button"
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                </div>

                <button
                  onClick={handleRefresh}
                  className="ml-3 flex items-center px-3 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300"
                  disabled={loading}
                  type="button"
                  aria-label="Atualizar lista de talentos"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* Filtros avançados */}
          <AnimatePresence>
            {advancedFilters && (
              <motion.div
                id="advanced-filters"
                className="mt-4 pt-4 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      id="category-filter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-gray-700"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      <option value="STAGE">Stage</option>
                      <option value="ACTOR">Ator/Atriz</option>
                      <option value="MODEL">Modelo</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="highlight-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Destaque
                    </label>
                    <select
                      id="highlight-filter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-gray-700"
                      value={highlightedFilter}
                      onChange={(e) => setHighlightedFilter(e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="destacado">Em destaque</option>
                      <option value="nao_destacado">Sem destaque</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                      Ordenação
                    </label>
                    <select
                      id="sort-order"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-gray-700"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="name_asc">Nome (A-Z)</option>
                      <option value="name_desc">Nome (Z-A)</option>
                      <option value="age_asc">Idade (crescente)</option>
                      <option value="age_desc">Idade (decrescente)</option>
                      <option value="recent">Mais recentes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Faixa etária: {ageRange[0]} - {ageRange[1]} anos
                    </label>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={ageRange[0]}
                        onChange={(e) => setAgeRange([Number.parseInt(e.target.value), ageRange[1]])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={ageRange[1]}
                        onChange={(e) => setAgeRange([ageRange[0], Number.parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    type="button"
                  >
                    Limpar filtros
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mensagem de erro */}
      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </p>
        </motion.div>
      )}

      {/* Visualização de talentos (tabela ou cards) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {viewMode === "table" ? (
          <>
            {renderMobileTableView()}
            {renderDesktopTableView()}
          </>
        ) : (
          renderCardView()
        )}
      </motion.div>

      {/* Paginação */}
      {renderPagination()}

      {/* Modais */}
      <TalentModal onClose={handleCloseModal} />

      <EditTalentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        talentId={editingTalentId}
        onSave={handleSaveEditedTalent}
      />

      <AddTalentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Talento"
        message={`Tem certeza que deseja excluir o talento "${deletingTalentName}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
