"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useTalent } from "../contexts/talents-context"
import { motion } from "framer-motion"
import {
  Star,
  Search,
  Filter,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
  Award,
  Calendar,
  Tag,
  LinkIcon,
} from "lucide-react"
import { toast } from "react-toastify"
import TalentModal from "./TalentModal"
import EditTalentModal from "./EditTalentModal"
import ConfirmationModal from "./ConfirmationModal"

const HighlightsPage = () => {
  const {
    talents,
    loading,
    error,
    fetchTalents,
    toggleHighlight,
    deleteTalent,
    fetchTalentById, // Adicionando a função para buscar talento por ID
    openModal, // Adicionando a função para abrir o modal de visualização
    closeModal, // Adicionando a função para fechar o modal
    isModalOpen, // Estado que controla se o modal está aberto
    selectedTalent: contextSelectedTalent, // Talento selecionado do contexto
  } = useTalent()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "all", // all, available, unavailable
    gender: "all", // all, male, female
    ageRange: [0, 100],
  })
  const [sortBy, setSortBy] = useState("name") // name, age, status
  const [sortDirection, setSortDirection] = useState("asc") // asc, desc
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [talentToEdit, setTalentToEdit] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [talentToDelete, setTalentToDelete] = useState(null)
  const [localLoading, setLocalLoading] = useState({})
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Carregar talentos ao montar o componente
  useEffect(() => {
    const loadTalents = async () => {
      try {
        console.log("Carregando talentos destacados...")
        const fetchedTalents = await fetchTalents()
        console.log(`Talentos carregados: ${fetchedTalents?.length || 0}`)
        setIsInitialLoad(false)
      } catch (error) {
        console.error("Erro ao carregar talentos:", error)
        toast.error(`Erro ao carregar talentos: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
        })
        setIsInitialLoad(false)
      }
    }

    loadTalents()
  }, [fetchTalents])

  // Filtrar talentos destacados usando useMemo para melhorar o desempenho
  const highlightedTalents = useMemo(() => {
    console.log(`Filtrando talentos destacados de ${talents?.length || 0} talentos`)
    if (!talents || talents.length === 0) return []
    return talents.filter((talent) => talent.destaque === true)
  }, [talents])

  // Função para calcular a idade com base na data de nascimento
  const calculateAge = useCallback((birthDate) => {
    if (!birthDate) return "N/A"
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }, [])

  // Função para formatar data
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }, [])

  // Função para formatar o link do Instagram
  const formatInstagramLink = useCallback((instagram) => {
    if (!instagram) return null
    // Remove @ se existir
    const username = instagram.startsWith("@") ? instagram.substring(1) : instagram
    return `https://instagram.com/${username}`
  }, [])

  // Função para renderizar o status do talento
  const renderStatus = useCallback((talent) => {
    if (!talent.ativo) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">
          Inativo
        </span>
      )
    } else if (!talent.disponivel) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 whitespace-nowrap">
          Indisponível
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
          Disponível
        </span>
      )
    }
  }, [])

  // Função para lidar com a remoção de destaque
  const handleToggleHighlight = async (id, isHighlighted) => {
    setLocalLoading((prev) => ({ ...prev, [id]: true }))
    try {
      await toggleHighlight(id, isHighlighted)
      toast.success(`Talento ${isHighlighted ? "removido dos" : "adicionado aos"} destaques com sucesso!`, {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      toast.error(`Erro ao alterar destaque: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      setLocalLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Funções para abrir modais
  const handleViewTalent = async (id) => {
    try {
      // Usar a função do contexto para abrir o modal de visualização
      openModal(talents.find((t) => t.id === id))
    } catch (error) {
      console.error("Erro ao abrir modal de visualização:", error)
      toast.error("Erro ao abrir detalhes do talento. Tente novamente.")
    }
  }

  const handleEditTalent = async (id) => {
    try {
      setLocalLoading((prev) => ({ ...prev, [id]: true }))

      // Buscar os detalhes completos do talento usando a função do contexto
      const talentDetails = await fetchTalentById(id)

      // Definir o talento para edição e abrir o modal
      setTalentToEdit(talentDetails)
      setIsEditModalOpen(true)
    } catch (error) {
      console.error("Erro ao buscar detalhes do talento para edição:", error)
      toast.error("Erro ao carregar detalhes do talento. Tente novamente.")
    } finally {
      setLocalLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleDeleteConfirmation = (id) => {
    setTalentToDelete(id)
    setIsDeleteModalOpen(true)
  }

  // Função para excluir talento
  const handleDeleteTalent = async () => {
    if (!talentToDelete) return

    setLocalLoading((prev) => ({ ...prev, [talentToDelete]: true }))
    try {
      await deleteTalent(talentToDelete)
      toast.success("Talento excluído com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      })
      setIsDeleteModalOpen(false)
      setTalentToDelete(null)
    } catch (error) {
      toast.error(`Erro ao excluir talento: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      setLocalLoading((prev) => ({ ...prev, [talentToDelete]: false }))
    }
  }

  // Função para filtrar e ordenar talentos - otimizada com useMemo
  const filteredTalents = useMemo(() => {
    if (!highlightedTalents || highlightedTalents.length === 0) return []

    // Filtrar por termo de busca
    let filtered = highlightedTalents.filter((talent) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        talent.name.toLowerCase().includes(searchLower) ||
        (talent.instagram && talent.instagram.toLowerCase().includes(searchLower)) ||
        (talent.tipo_talento && talent.tipo_talento.toLowerCase().includes(searchLower))
      )
    })

    // Aplicar filtros adicionais
    if (filters.status !== "all") {
      filtered = filtered.filter((talent) => {
        if (filters.status === "available") return talent.disponivel && talent.ativo
        if (filters.status === "unavailable") return !talent.disponivel && talent.ativo
        if (filters.status === "inactive") return !talent.ativo
        return true
      })
    }

    if (filters.gender !== "all") {
      filtered = filtered.filter((talent) => {
        // Assumindo que tipo_talento "Ator" é masculino e "Atriz" é feminino
        if (filters.gender === "male") return talent.tipo_talento === "Ator"
        if (filters.gender === "female") return talent.tipo_talento === "Atriz"
        return true
      })
    }

    // Filtrar por faixa etária
    filtered = filtered.filter((talent) => {
      const age = calculateAge(talent.birth_date)
      return age >= filters.ageRange[0] && age <= filters.ageRange[1]
    })

    // Ordenar talentos
    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "age") {
        const ageA = calculateAge(a.birth_date)
        const ageB = calculateAge(b.birth_date)
        return sortDirection === "asc" ? ageA - ageB : ageB - ageA
      } else if (sortBy === "status") {
        // Ordenar por status: Disponível > Indisponível > Inativo
        const statusOrder = { disponivel: 1, indisponivel: 2, inativo: 3 }
        const statusA = !a.ativo ? "inativo" : a.disponivel ? "disponivel" : "indisponivel"
        const statusB = !b.ativo ? "inativo" : b.disponivel ? "disponivel" : "indisponivel"
        return sortDirection === "asc"
          ? statusOrder[statusA] - statusOrder[statusB]
          : statusOrder[statusB] - statusOrder[statusA]
      }
      return 0
    })
  }, [highlightedTalents, searchTerm, filters, sortBy, sortDirection, calculateAge])

  // Animações para os cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  // Renderizar o conteúdo principal
  const renderContent = () => {
    // Mostrar loading apenas no carregamento inicial
    if (isInitialLoad) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
          <p className="text-gray-500 text-lg">Carregando talentos destacados...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 text-lg font-medium mb-2">Erro ao carregar talentos</p>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => {
              setIsInitialLoad(true)
              fetchTalents().finally(() => setIsInitialLoad(false))
            }}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )
    }

    if (!filteredTalents || filteredTalents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Star className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">Nenhum talento destacado encontrado</p>
          <p className="text-gray-400 max-w-md">
            {searchTerm || filters.status !== "all" || filters.gender !== "all"
              ? "Tente ajustar seus filtros de busca para encontrar talentos."
              : "Destaque talentos na página de talentos para que eles apareçam aqui."}
          </p>
        </div>
      )
    }

    // Visualização em cards (grid)
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredTalents.map((talent) => (
          <motion.div
            key={talent.id}
            variants={cardVariants}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all"
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <div className="h-56 bg-gray-100 overflow-hidden">
                {talent.cover ? (
                  <img
                    src={talent.cover || "/placeholder.svg"}
                    alt={`Foto de ${talent.name}`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
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
                    onClick={() => handleViewTalent(talent.id)}
                    className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                    aria-label="Visualizar talento"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTalent(talent.id)}
                      className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Editar talento"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteConfirmation(talent.id)}
                      className="p-2 bg-white/90 rounded-full text-red-600 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Excluir talento"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggleHighlight(talent.id, talent.destaque)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 hover:bg-gray-50 transition-colors"
                aria-label="Remover dos destaques"
                type="button"
                disabled={localLoading[talent.id]}
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
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                )}
              </button>
              <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-md text-xs font-medium shadow-sm flex items-center">
                <Award className="h-3 w-3 mr-1" />
                Destaque
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 text-lg truncate" title={talent.name}>
                  {talent.name}
                </h3>
                <div>{renderStatus(talent)}</div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span>{calculateAge(talent.birth_date)} anos</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="truncate" title={talent.tipo_talento || "N/A"}>
                    {talent.tipo_talento || "N/A"}
                  </span>
                </div>

                {talent.instagram && (
                  <div className="flex items-center text-sm text-gray-600">
                    <LinkIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <a
                      href={formatInstagramLink(talent.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800 hover:underline truncate"
                      title={talent.instagram}
                    >
                      {talent.instagram}
                    </a>
                  </div>
                )}

                {!talent.disponivel && talent.data_disponibilidade && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span
                      className="truncate"
                      title={`Disponível a partir de: ${formatDate(talent.data_disponibilidade)}`}
                    >
                      Disponível a partir de: {formatDate(talent.data_disponibilidade)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleViewTalent(talent.id)}
                  className="flex items-center justify-center px-4 py-2 bg-pink-50 text-pink-700 rounded-md hover:bg-pink-100 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="Visualizar talento"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Visualizar
                </button>
                <button
                  onClick={() => handleEditTalent(talent.id)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Editar talento"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 mr-2" />
            Talentos Destacados
          </h1>
          <p className="text-gray-500 mt-1">Gerencie os talentos que recebem destaque especial no sistema.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setIsInitialLoad(true)
              fetchTalents().finally(() => setIsInitialLoad(false))
            }}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center"
            disabled={isInitialLoad}
          >
            {isInitialLoad ? (
              <Loader2 className="h-5 w-5 mr-1 animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            Atualizar
          </button>
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Buscar por nome, instagram..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">Filtros</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 ml-2 transition-transform ${
                  filterOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 p-4 border border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="block w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="all">Todos</option>
                    <option value="available">Disponíveis</option>
                    <option value="unavailable">Indisponíveis</option>
                    <option value="inactive">Inativos</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                  <select
                    className="block w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700"
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  >
                    <option value="all">Todos</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faixa etária: {filters.ageRange[0]} - {filters.ageRange[1]} anos
                  </label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.ageRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          ageRange: [Number.parseInt(e.target.value), filters.ageRange[1]],
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.ageRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          ageRange: [filters.ageRange[0], Number.parseInt(e.target.value)],
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                  <div className="flex items-center">
                    <select
                      className="block w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Nome</option>
                      <option value="age">Idade</option>
                      <option value="status">Status</option>
                    </select>
                    <button
                      onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                      className="ml-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      {sortDirection === "asc" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() =>
                      setFilters({
                        status: "all",
                        gender: "all",
                        ageRange: [0, 100],
                      })
                    }
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Limpar filtros
                  </button>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="px-4 py-2 bg-pink-500 text-white text-sm rounded-md hover:bg-pink-600 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-pink-50 px-3 py-1 rounded-full text-pink-700 text-sm flex items-center">
            <Star className="h-4 w-4 mr-1" />
            <span>
              {filteredTalents.length} talento{filteredTalents.length !== 1 && "s"} destacado
              {filteredTalents.length !== 1 && "s"}
            </span>
          </div>

          {searchTerm && (
            <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm flex items-center">
              <Search className="h-4 w-4 mr-1" />
              <span>Busca: "{searchTerm}"</span>
              <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-blue-900">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {filters.status !== "all" && (
            <div className="bg-green-50 px-3 py-1 rounded-full text-green-700 text-sm flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              <span>
                Status:{" "}
                {filters.status === "available"
                  ? "Disponíveis"
                  : filters.status === "unavailable"
                    ? "Indisponíveis"
                    : "Inativos"}
              </span>
              <button onClick={() => setFilters({ ...filters, status: "all" })} className="ml-1 hover:text-green-900">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {filters.gender !== "all" && (
            <div className="bg-purple-50 px-3 py-1 rounded-full text-purple-700 text-sm flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              <span>Gênero: {filters.gender === "male" ? "Masculino" : "Feminino"}</span>
              <button onClick={() => setFilters({ ...filters, gender: "all" })} className="ml-1 hover:text-purple-900">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {(filters.ageRange[0] > 0 || filters.ageRange[1] < 100) && (
            <div className="bg-amber-50 px-3 py-1 rounded-full text-amber-700 text-sm flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              <span>
                Idade: {filters.ageRange[0]} - {filters.ageRange[1]} anos
              </span>
              <button
                onClick={() => setFilters({ ...filters, ageRange: [0, 100] })}
                className="ml-1 hover:text-amber-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      {renderContent()}

      {/* Modal de Visualização - Usando o modal do contexto */}
      {isModalOpen && contextSelectedTalent && (
        <TalentModal isOpen={isModalOpen} onClose={closeModal} talent={contextSelectedTalent} />
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && talentToEdit && (
        <EditTalentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          talentId={talentToEdit.id}
          onSave={() => {
            setIsEditModalOpen(false)
            fetchTalents() // Recarregar talentos após salvar
          }}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteTalent}
          title="Excluir Talento"
          message="Tem certeza que deseja excluir este talento? Esta ação não pode ser desfeita."
          confirmButtonText="Excluir"
          confirmButtonColor="red"
        />
      )}
    </div>
  )
}

export default HighlightsPage
