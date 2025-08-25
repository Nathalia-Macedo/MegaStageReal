import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  Settings,
  HelpCircle,
  User,
  Users,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  LogOut,
  Monitor,
  Search,
  GripVertical,
  Play,
  Eye,
  Info,
  Video,
  List,
  X,
  Maximize2,
  Minimize2,
  Save,
  Plus,
  Edit,
} from "lucide-react"
import { toast } from "react-toastify"
import DashboardHelp from "../helpers/DashboardHelper"
import TalentsHelp from "../helpers/TalentsHelp"
import HighlightsHelp from "./HighlightHelp"
import NotificationHelpPage from "./NotificationHelpPage"
import { useTalent } from "../../contexts/talents-context"
import UserManagement from "./UserManagement"

const DraggableVideoItem = ({
  video,
  index,
  onPlay,
  onTitleEdit,
  editingVideoId,
  editingTitle,
  setEditingTitle,
  onTitleSave,
  onTitleCancel,
}) => {
  return (
    <Draggable key={video.id} draggableId={video.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all ${
            snapshot.isDragging ? "opacity-50 shadow-lg" : ""
          }`}
        >
          <div className="flex items-center space-x-4">
            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="text-gray-400 flex-shrink-0" size={20} />
            </div>

            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <button
                  onClick={() => onPlay(video)}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                  title="Assistir vídeo"
                >
                  <Play size={20} />
                </button>
              </div>

              <div className="flex-1">
                {editingVideoId === video.id ? (
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border-2 border-pink-200 shadow-sm">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 placeholder-gray-500 outline-none bg-white"
                      placeholder="Digite o título do vídeo..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          onTitleSave(video.id)
                        } else if (e.key === "Escape") {
                          onTitleCancel()
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => onTitleSave(video.id)}
                      className="px-3 py-2 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors shadow-sm"
                    >
                      ✓ Salvar
                    </button>
                    <button
                      onClick={onTitleCancel}
                      className="px-3 py-2 bg-gray-500 text-white rounded-md text-xs font-medium hover:bg-gray-600 transition-colors shadow-sm"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onTitleEdit(video.id, video.title_video)}
                    className="text-left hover:text-pink-600 transition-colors group"
                    title="Clique para editar o título"
                  >
                    <p className="font-medium text-gray-900 group-hover:underline">
                      {video.title_video || `Vídeo #${video.id}`}
                    </p>
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Clique para editar
                    </span>
                  </button>
                )}
                <p className="text-sm text-gray-500">Posição: {index + 1}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                #{index + 1}
              </span>
              <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">Em Exposição</span>
              <button
                onClick={() => onPlay(video)}
                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                title="Assistir vídeo"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("site")
  const [activeHelpSection, setActiveHelpSection] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [videoOrders, setVideoOrders] = useState([])
  const [talentVideos, setTalentVideos] = useState([])
  const [selectedVideoIds, setSelectedVideoIds] = useState(new Set())
  const [isLoadingSite, setIsLoadingSite] = useState(false)
  const [isLoadingVideos, setIsLoadingVideos] = useState(false)
  const [editingVideoId, setEditingVideoId] = useState(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [pipVideo, setPipVideo] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [aboutText, setAboutText] = useState("") // Estado local para edição
  const videoRef = useRef(null)
  const [isTalentsFetched, setIsTalentsFetched] = useState(false)
  const [isAboutFetched, setIsAboutFetched] = useState(false)
  const prevTalentIdRef = useRef(null) // Para rastrear mudanças no selectedTalent.id

  const {
    talents,
    fetchTalents,
    fetchVideoOrders,
    updateVideoOrder,
    addVideoOrder,
    removeVideoOrder,
    fetchTalentById,
    fetchTalentVideos,
    updateTalentVideo,
    deleteTalentVideo,
    fetchAbout,
    createAbout,
    updateAbout,
    aboutDescription,
    isAboutExisting,
    aboutMessage,
    loading: contextLoading,
    error: contextError,
  } = useTalent()

  // Carregar dados do site e "Quem Somos"
  useEffect(() => {
    if (activeTab === "site" && !isTalentsFetched && !isAboutFetched) {
      setIsLoadingSite(true)
      const fetchSiteData = async () => {
        try {
          await Promise.all([
            fetchTalents().then(() => setIsTalentsFetched(true)),
            fetchAbout().then(() => {
              setAboutText(aboutDescription) // Inicializar estado local com descrição do contexto
              setIsAboutFetched(true)
            }),
          ])
        } catch (err) {
          toast.error("Erro ao carregar dados do site.")
        } finally {
          setIsLoadingSite(false)
        }
      }
      fetchSiteData()
    } else if (activeTab !== "site") {
      setSelectedTalent(null)
      setVideoOrders([])
      setTalentVideos([])
      setSelectedVideoIds(new Set())
    }
  }, [activeTab, isTalentsFetched, isAboutFetched, fetchTalents, fetchAbout, aboutDescription])

  // Carregar vídeos do talento selecionado
  const loadTalentData = useCallback(async (talentId) => {
    if (activeTab !== "site" || !talentId) return
    setIsLoadingVideos(true)
    try {
      const [orders, videos] = await Promise.all([
        fetchVideoOrders(talentId),
        fetchTalentVideos(talentId),
      ])
      setVideoOrders(orders || [])
      setTalentVideos(Array.isArray(videos) ? videos : [])
      setSelectedVideoIds(new Set(orders.map((order) => order.video_id)))
    } catch (error) {
      toast.error("Erro ao carregar vídeos do talento.")
    } finally {
      setIsLoadingVideos(false)
    }
  }, [activeTab, fetchVideoOrders, fetchTalentVideos])

  // Evitar chamadas redundantes ao selecionar talento
  useEffect(() => {
    if (selectedTalent?.id && selectedTalent.id !== prevTalentIdRef.current) {
      prevTalentIdRef.current = selectedTalent.id
      loadTalentData(selectedTalent.id)
    }
  }, [selectedTalent?.id, loadTalentData])

  const handleVideoPlay = (video) => {
    setPipVideo(video)
    setIsExpanded(false)
  }

  const closePipVideo = () => {
    setPipVideo(null)
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleVideoSelection = async (videoId, isSelected) => {
    if (activeTab !== "site") return
    const newSelectedIds = new Set(selectedVideoIds)
    if (isSelected) {
      newSelectedIds.add(videoId)
      try {
        const order = videoOrders.length + 1
        await addVideoOrder(selectedTalent.id, videoId, order)
        await loadTalentData(selectedTalent.id)
        toast.success("Vídeo adicionado à hero section.")
      } catch (error) {
        toast.error("Erro ao adicionar vídeo à hero section.")
        return
      }
    } else {
      newSelectedIds.delete(videoId)
      try {
        await removeVideoOrder(selectedTalent.id, videoId)
        await loadTalentData(selectedTalent.id)
        toast.success("Vídeo removido da hero section.")
      } catch (error) {
        toast.error("Erro ao remover vídeo da hero section.")
        return
      }
    }
    setSelectedVideoIds(newSelectedIds)
  }

  const handleVideoExpositionToggle = async (videoId, currentValue) => {
    if (activeTab !== "site") return
    try {
      const currentVideo = talentVideos.find((v) => v.id === videoId)
      if (!currentVideo) return

      const newExpositionValue = !currentValue
      const videoData = {
        talent_id: selectedTalent.id,
        video_url: currentVideo.video_url,
        public_id: currentVideo.public_id,
        short_url: currentVideo.short_url,
        video_in_exposicao: newExpositionValue,
        title_video: currentVideo.title_video || `Vídeo ${videoId}`,
      }

      await updateTalentVideo(selectedTalent.id, videoId, videoData)

      if (newExpositionValue) {
        const nextOrder = videoOrders.length + 1
        await addVideoOrder(selectedTalent.id, videoId, nextOrder)
      } else {
        await removeVideoOrder(selectedTalent.id, videoId)
      }

      await loadTalentData(selectedTalent.id)
      toast.success("Status de exposição do vídeo atualizado.")
    } catch (error) {
      toast.error("Erro ao atualizar status de exposição do vídeo.")
    }
  }

  const handleTitleEdit = (videoId, currentTitle) => {
    setEditingVideoId(videoId)
    setEditingTitle(currentTitle || `Vídeo ${videoId}`)
  }

  const handleTitleSave = async (videoId) => {
    if (!editingTitle.trim()) {
      toast.error("O título não pode ficar vazio!")
      return
    }

    try {
      const currentVideo = talentVideos.find((v) => v.id === videoId)
      if (!currentVideo) return

      const videoData = {
        talent_id: selectedTalent.id,
        video_url: currentVideo.video_url,
        public_id: currentVideo.public_id,
        short_url: currentVideo.short_url,
        video_in_exposicao: currentVideo.video_in_exposicao,
        title_video: editingTitle.trim(),
      }

      await updateTalentVideo(selectedTalent.id, videoId, videoData)
      await loadTalentData(selectedTalent.id)
      setEditingVideoId(null)
      setEditingTitle("")
      toast.success("Título do vídeo atualizado com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar o título do vídeo. Tente novamente.")
    }
  }

  const handleTitleCancel = () => {
    setEditingVideoId(null)
    setEditingTitle("")
  }

  const handleAboutSave = async () => {
    if (!aboutText.trim()) {
      toast.error("A descrição não pode ficar vazia!")
      return
    }

    try {
      if (isAboutExisting) {
        await updateAbout(aboutText)
        toast.success("Descrição atualizada com sucesso!")
      } else {
        await createAbout(aboutText)
        toast.success("Descrição criada com sucesso!")
      }
      setIsEditingAbout(false)
    } catch (error) {
      if (error.message.includes("400") && error.message.includes("About already exists")) {
        toast.error("Já existe uma descrição. Use o botão de editar para atualizar.")
        await fetchAbout()
      } else {
        toast.error("Erro ao salvar a descrição. Tente novamente.")
      }
    }
  }

  const handleAboutCancel = () => {
    setIsEditingAbout(false)
    setAboutText(aboutDescription) // Resetar para o valor do contexto
  }

  const startAboutEdit = () => {
    setIsEditingAbout(true)
    setAboutText(aboutDescription)
  }

  const onDragEnd = async (result) => {
    if (!result.destination || activeTab !== "site") return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    const newOrder = Array.from(videoOrders)
    const [reorderedItem] = newOrder.splice(sourceIndex, 1)
    newOrder.splice(destinationIndex, 0, reorderedItem)

    // Atualizar estado local otimisticamente
    setVideoOrders(newOrder)

    try {
      // Atualizar a ordem no backend sequencialmente
      for (let i = 0; i < newOrder.length; i++) {
        const videoId = newOrder[i].video_id
        const newPosition = i + 1
        await updateVideoOrder(selectedTalent.id, videoId, newPosition)
      }
      // Recarregar a ordem para garantir sincronia
      const updatedOrders = await fetchVideoOrders(selectedTalent.id)
      setVideoOrders(updatedOrders || [])
      toast.success("Ordem dos vídeos atualizada com sucesso!")
    } catch (error) {
      toast.error("Erro ao reordenar vídeos. As alterações foram revertidas.")
      await loadTalentData(selectedTalent.id) // Reverter para estado do backend
    }
  }

  const filteredTalents = talents.filter((talent) =>
    talent.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: "profile", label: "Perfil", icon: <User size={20} /> },
    { id: "users", label: "Usuários", icon: <Users size={20} /> },
    { id: "site", label: "Site", icon: <Monitor size={20} /> },
    { id: "help", label: "Ajuda", icon: <HelpCircle size={20} /> },
  ]

  const helpSections = [
    { id: "dashboard", label: "Dashboard", description: "Aprenda a usar o dashboard principal" },
    { id: "talents", label: "Talentos", description: "Gerenciamento de talentos" },
    { id: "highlights", label: "Destaques", description: "Como destacar talentos" },
    { id: "users", label: "Usuários", description: "Gerenciamento de usuários" },
    { id: "notifications", label: "Notificações", description: "Sistema de notificações" },
  ]

  const renderHelpContent = () => {
    switch (activeHelpSection) {
      case "dashboard":
        return <DashboardHelp />
      case "talents":
        return <TalentsHelp />
      case "highlights":
        return <HighlightsHelp />
      case "users":
        return <UserManagement />
      case "notifications":
        return <NotificationHelpPage setActiveTab={setActiveTab} />
      default:
        return <DashboardHelp />
    }
  }

  const renderSiteContent = () => (
    <div className="space-y-6">
      {pipVideo && (
        <div
          className={`fixed ${isExpanded ? "inset-0 z-50 bg-black bg-opacity-90" : "bottom-4 right-4 z-50"} transition-all duration-300`}
        >
          <div
            className={`${isExpanded ? "w-full h-full flex items-center justify-center" : "w-80 h-48"} bg-black rounded-lg overflow-hidden shadow-2xl`}
          >
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={pipVideo.video_url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={toggleExpanded}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  title={isExpanded ? "Minimizar" : "Expandir"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={closePipVideo}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  title="Fechar"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {pipVideo.title_video || `Vídeo ${pipVideo.id}`}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações do Site</h2>

        {/* About Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Quem Somos</label>
            {isAboutExisting && (
              <span className="text-xs text-gray-500 italic">Apenas uma descrição pode existir. Use o botão de editar para atualizar.</span>
            )}
          </div>
          {isLoadingSite || contextLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
              <span className="ml-3 text-gray-600">Carregando...</span>
            </div>
          ) : contextError ? (
            <div className="text-gray-600 text-sm">{contextError}</div>
          ) : (
            <>
              {isEditingAbout ? (
                <div className="space-y-4">
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 outline-none resize-y whitespace-pre-wrap"
                    placeholder="Digite a descrição do Quem Somos..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAboutSave}
                      className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoadingSite || contextLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isAboutExisting ? "Atualizar Descrição" : "Criar Descrição"}
                    </button>
                    <button
                      onClick={handleAboutCancel}
                      className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition-colors shadow-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {isAboutExisting && aboutDescription ? (
                    <div className="flex justify-between items-start">
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">{aboutDescription}</p>
                      <button
                        onClick={startAboutEdit}
                        className="ml-4 p-2 text-gray-400 hover:text-pink-600 transition-colors"
                        title="Editar descrição"
                      >
                        <Edit size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600 text-sm">{aboutMessage || "Nenhuma descrição disponível."}</div>
                      <button
                        onClick={startAboutEdit}
                        className="ml-4 p-2 text-gray-400 hover:text-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Adicionar descrição"
                        disabled={isAboutExisting}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Talento</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Digite o nome do talento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 outline-none"
            />
          </div>

          {searchTerm && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredTalents.map((talent) => (
                <button
                  key={talent.id}
                  onClick={() => {
                    setSelectedTalent(talent)
                    setSearchTerm(talent.name)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                >
                  <img
                    src={talent.cover || "/placeholder.svg?height=40&width=40"}
                    alt={talent.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{talent.name}</p>
                    <p className="text-sm text-gray-500">{talent.category}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedTalent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-200 p-6">
                <div className="flex items-center mb-4">
                  <Info className="text-pink-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Informações da Atriz</h3>
                </div>

                <div className="text-center mb-4">
                  <img
                    src={selectedTalent.cover || "/placeholder.svg?height=120&width=120"}
                    alt={selectedTalent.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                  />
                  <h4 className="text-xl font-bold text-gray-900">{selectedTalent.name}</h4>
                  <p className="text-sm text-gray-600">{selectedTalent.category}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium text-gray-900">{selectedTalent.tipo_talento || "Ator"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Altura:</span>
                    <span className="font-medium text-gray-900">{selectedTalent.height || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Olhos:</span>
                    <span className="font-medium text-gray-900">{selectedTalent.eye_color || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cabelo:</span>
                    <span className="font-medium text-gray-900">{selectedTalent.hair_color || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${selectedTalent.ativo ? "text-green-600" : "text-red-600"}`}>
                      {selectedTalent.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponível:</span>
                    <span className={`font-medium ${selectedTalent.disponivel ? "text-green-600" : "text-red-600"}`}>
                      {selectedTalent.disponivel ? "Sim" : "Não"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destaque:</span>
                    <span className={`font-medium ${selectedTalent.destaque ? "text-pink-600" : "text-gray-600"}`}>
                      {selectedTalent.destaque ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-pink-200">
                  <p className="text-xs text-pink-600 font-medium text-center">
                    {videoOrders.length} vídeos na Hero Section
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Video className="text-blue-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Todos os Vídeos</h3>
                  </div>
                  <span className="text-sm text-gray-500">{talentVideos.length} vídeos</span>
                </div>

                {isLoadingVideos ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                    <span className="ml-3 text-gray-600">Carregando vídeos...</span>
                  </div>
                ) : talentVideos.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {talentVideos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => handleVideoPlay(video)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Assistir vídeo"
                            >
                              <Play size={16} />
                            </button>
                          </div>
                          <div className="flex-1">
                            {editingVideoId === video.id ? (
                              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border-2 border-pink-200 shadow-sm">
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 placeholder-gray-500 outline-none bg-white"
                                  placeholder="Digite o título do vídeo..."
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleTitleSave(video.id)
                                    } else if (e.key === "Escape") {
                                      handleTitleCancel()
                                    }
                                  }}
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleTitleSave(video.id)}
                                  className="px-3 py-2 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors shadow-sm"
                                >
                                  ✓ Salvar
                                </button>
                                <button
                                  onClick={handleTitleCancel}
                                  className="px-3 py-2 bg-gray-500 text-white rounded-md text-xs font-medium hover:bg-gray-600 transition-colors shadow-sm"
                                >
                                  ✕ Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleTitleEdit(video.id, video.title_video)}
                                className="text-left hover:text-pink-600 transition-colors group"
                                title="Clique para editar o título"
                              >
                                <p className="font-medium text-gray-900 group-hover:underline">
                                  {video.title_video || `Vídeo ${video.id}`}
                                </p>
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Clique para editar
                                </span>
                              </button>
                            )}
                            <p className="text-sm text-gray-500">ID: {video.id}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(video.video_in_exposicao)}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleVideoExpositionToggle(video.id, video.video_in_exposicao)
                              }}
                              className="w-4 h-4 text-pink-600 bg-white border-2 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer checked:bg-pink-600 checked:border-pink-600"
                            />
                            <span className="text-sm text-gray-600">Colocar em exposição na heroSection</span>
                          </label>

                          <div className="flex space-x-1">
                            {video.video_in_exposicao && (
                              <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                Em Exposição
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Play className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-2">Nenhum vídeo encontrado</p>
                    <p className="text-sm text-gray-500">Este talento ainda não possui vídeos cadastrados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTalent && (
          <div className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <List className="text-purple-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Vídeos em Exposição na Hero Section</h3>
                </div>
                <span className="text-sm text-gray-500">Arraste para reordenar</span>
              </div>

              {isLoadingVideos ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  <span className="ml-3 text-gray-600">Carregando vídeos...</span>
                </div>
              ) : videoOrders.length > 0 ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="videos-list">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {videoOrders.map((order, index) => {
                          const video = talentVideos.find((v) => v.id === order.video_id)
                          if (!video) return null
                          return (
                            <DraggableVideoItem
                              key={video.id}
                              video={video}
                              index={index}
                              onPlay={handleVideoPlay}
                              onTitleEdit={handleTitleEdit}
                              editingVideoId={editingVideoId}
                              editingTitle={editingTitle}
                              setEditingTitle={setEditingTitle}
                              onTitleSave={handleTitleSave}
                              onTitleCancel={handleTitleCancel}
                            />
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <List className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-2">Nenhum vídeo em exposição</p>
                  <p className="text-sm text-gray-500">
                    Marque os vídeos acima para colocá-los em exposição na hero section
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedTalent && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-2">Selecione um talento</p>
            <p className="text-sm text-gray-500">
              Use o campo de busca acima para encontrar e configurar os vídeos de um talento
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "site":
        return isLoadingSite ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-gray-600">Carregando configurações do site...</span>
          </div>
        ) : renderSiteContent()
      case "help":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 px-2">Tópicos de Ajuda</h3>
                <ul className="space-y-1">
                  {helpSections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveHelpSection(section.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
                          activeHelpSection === section.id
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{section.label}</span>
                          <span className="text-xs text-gray-500">{section.description}</span>
                        </div>
                        <ChevronRight
                          size={16}
                          className={activeHelpSection === section.id ? "text-pink-500" : "text-gray-400"}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-3">{renderHelpContent()}</div>
          </div>
        )
      case "profile":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações de Perfil</h2>
            <p className="text-gray-600">Gerencie suas informações de perfil.</p>
          </div>
        )
      case "appearance":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações de Aparência</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Tema</h3>
                <div className="flex space-x-4">
                  <button className="flex flex-col items-center justify-center p-4 bg-white border border-pink-500 rounded-lg hover:border-pink-600 transition-colors">
                    <Sun size={24} className="text-yellow-500 mb-2" />
                    <span className="text-sm font-medium">Claro</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-pink-600 transition-colors">
                    <Moon size={24} className="text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-white">Escuro</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded-lg hover:border-pink-600 transition-colors">
                    <div className="flex mb-2">
                      <Sun size={24} className="text-yellow-500" />
                      <Moon size={24} className="text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">Sistema</span>
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Idioma</h3>
                <div className="flex space-x-4">
                  <button className="flex items-center p-3 bg-white border border-pink-500 rounded-lg text-pink-500">
                    <Globe size={20} className="mr-2" />
                    <span className="text-sm font-medium">Português</span>
                  </button>
                  <button className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-600 transition-colors">
                    <Globe size={20} className="mr-2" />
                    <span className="text-sm font-medium">English</span>
                  </button>
                  <button className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-600 transition-colors">
                    <Globe size={20} className="mr-2" />
                    <span className="text-sm font-medium">Español</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case "users":
        return <UserManagement />
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Configurações de {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">Conteúdo para a aba {activeTab} será exibido aqui.</p>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Settings className="mr-2 text-pink-500" size={28} />
          Configurações
        </h1>
        <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-1">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-pink-600 border-b-2 border-pink-500"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage