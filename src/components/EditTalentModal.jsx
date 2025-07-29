// // import { useState, useEffect, useRef } from "react"
// // import { toast } from "react-toastify"
// // import { motion, AnimatePresence } from "framer-motion"
// // import {
// //   X,
// //   Calendar,
// //   Ruler,
// //   Eye,
// //   Music,
// //   Globe,
// //   Instagram,
// //   ImageIcon,
// //   User,
// //   AlertCircle,
// //   Plus,
// //   Palette,
// //   Check,
// //   Clock,
// //   ChevronDown,
// //   Camera,
// //   Upload,
// //   CheckCircle,
// //   XCircle,
// //   HelpCircle,
// //   Sparkles,
// //   Languages,
// //   FileText,
// //   Mic,
// //   Briefcase,
// //   Save,
// //   Loader2,
// //   Trash2,
// //   Images,
// //   ExternalLink,
// //   Copy,
// //   Video,
// //   Link,
// // } from "lucide-react"
// // import { useTalent } from "../contexts/talents-context"
// // import ConfirmationModal from "./ConfirmationModal"
// // import PhotoGallery from "./PhotoGalery"
// // import ModalSection from "./ModalSection"
// // import PhotoUploadArea from "./PhotoUploadArea"

// // export default function EditTalentModal({ isOpen, onClose, talentId, onSave }) {
// //   const {
// //     fetchTalentById,
// //     updateTalent,
// //     addTalentPhotos,
// //     fetchTalentPhotos,
// //     deleteTalentPhoto,
// //     addTalentVideos,
// //     fetchTalentVideos,
// //     deleteTalentVideo,
// //   } = useTalent()

// //   const [talent, setTalent] = useState(null)
// //   const [loading, setLoading] = useState(false)
// //   const [saving, setSaving] = useState(false)
// //   const [error, setError] = useState(null)
// //   const { notifyTalentUpdated } = useTalent() || {}
// //   const modalRef = useRef(null)
// //   const [activeSection, setActiveSection] = useState("basic")
// //   const [formTouched, setFormTouched] = useState(false)
// //   const [imagePreviewHover, setImagePreviewHover] = useState(false)
// //   const [showTooltip, setShowTooltip] = useState({})
// //   const fileInputRef = useRef(null)
// //   const photoInputRef = useRef(null)

// //   // SEMPRE inicializar com STAGE
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     birth_date: "",
// //     height: "",
// //     eye_color: "",
// //     hair_color: "",
// //     can_sing: false,
// //     instruments: [],
// //     languages: [],
// //     ativo: true,
// //     disponivel: true,
// //     data_disponibilidade: "",
// //     destaque: false,
// //     category: "STAGE", // SEMPRE STAGE
// //     instagram: "@",
// //     tipo_talento: "", // CORRIGIDO: Deixar vazio inicialmente
// //     cover: "",
// //   })

// //   const [formErrors, setFormErrors] = useState({})
// //   const [newInstrument, setNewInstrument] = useState("")
// //   const [newLanguage, setNewLanguage] = useState("")
// //   const [photos, setPhotos] = useState([])
// //   const [loadingPhotos, setLoadingPhotos] = useState(false)
// //   const [uploadingPhotos, setUploadingPhotos] = useState(false)
// //   const [photoActionMenu, setPhotoActionMenu] = useState(null)
// //   const [videos, setVideos] = useState([])
// //   const [loadingVideos, setLoadingVideos] = useState(false)
// //   const [uploadingVideos, setUploadingVideos] = useState(false)
// //   const [videoActionMenu, setVideoActionMenu] = useState(null)
// //   const [newVideoUrl, setNewVideoUrl] = useState("")
// //   const [videoUrls, setVideoUrls] = useState([""]) // Array de URLs para adicionar múltiplas

// //   const [confirmationModal, setConfirmationModal] = useState({
// //     isOpen: false,
// //     itemId: null,
// //     itemType: null,
// //     title: "",
// //     message: "",
// //   })

// //   const [keyCounter, setKeyCounter] = useState(0)
// //   const [imagePreviewUrls, setImagePreviewUrls] = useState({})

// //   const generateUniqueKey = (prefix, id) => {
// //     const counter = keyCounter
// //     setKeyCounter((prev) => prev + 1)
// //     return `${prefix}-${id || "temp"}-${Date.now()}-${counter}`
// //   }

// //   // Reset completo do estado quando o modal abre/fecha ou muda de talento
// //   useEffect(() => {
// //     if (isOpen && talentId) {
// //       console.log("🔄 Abrindo modal para talento:", talentId)

// //       // Reset completo de todos os estados
// //       setPhotos([])
// //       setImagePreviewUrls({})
// //       setLoadingPhotos(false)
// //       setUploadingPhotos(false)
// //       setPhotoActionMenu(null)
// //       setVideos([])
// //       setLoadingVideos(false)
// //       setUploadingVideos(false)
// //       setVideoActionMenu(null)
// //       setActiveSection("basic")
// //       setVideoUrls([""])
// //       setFormTouched(false)
// //       setFormErrors({}) // Reset dos erros
// //       setError(null) // Reset do erro geral

// //       // Reset do formData para valores padrão - SEMPRE COM STAGE
// //       setFormData({
// //         name: "",
// //         birth_date: "",
// //         height: "",
// //         eye_color: "",
// //         hair_color: "",
// //         can_sing: false,
// //         instruments: [],
// //         languages: [],
// //         ativo: true,
// //         disponivel: true,
// //         data_disponibilidade: "",
// //         destaque: false,
// //         category: "STAGE", // SEMPRE STAGE
// //         instagram: "@",
// //         tipo_talento: "", // CORRIGIDO: Deixar vazio inicialmente
// //         cover: "",
// //       })

// //       // Buscar dados do talento
// //       fetchTalentDetails(talentId)
// //     } else if (!isOpen) {
// //       // Reset quando fecha o modal
// //       setFormTouched(false)
// //       setFormErrors({})
// //       setError(null)
// //     }
// //   }, [isOpen, talentId])

// //   useEffect(() => {
// //     return () => Object.values(imagePreviewUrls).forEach((url) => URL.revokeObjectURL(url))
// //   }, [])

// //   const fetchTalentDetails = async (id) => {
// //     setLoading(true)
// //     setError(null)
// //     try {
// //       if (!id) throw new Error("ID do talento inválido")
// //       const data = await fetchTalentById(id)
// //       if (!data) throw new Error("Nenhum dado retornado para o talento")

// //       console.log("📥 Dados do talento carregados:", data)
// //       console.log("🎭 Tipo de talento da API:", data.tipo_talento)

// //       setTalent(data)

// //       // SEMPRE forçar categoria como STAGE, independente do que vem da API
// //       const newFormData = {
// //         name: data.name || "",
// //         birth_date: data.birth_date ? formatDateForInput(data.birth_date) : "",
// //         height: data.height || "",
// //         eye_color: data.eye_color || "",
// //         hair_color: data.hair_color || "",
// //         can_sing: data.can_sing || false,
// //         instruments: data.instruments || [],
// //         languages: data.languages || [],
// //         ativo: data.ativo !== undefined ? data.ativo : true,
// //         disponivel: data.disponivel !== undefined ? data.disponivel : true,
// //         data_disponibilidade: data.data_disponibilidade ? formatDateForInput(data.data_disponibilidade) : "",
// //         destaque: data.destaque || false,
// //         category: "STAGE", // SEMPRE STAGE, NUNCA usar o que vem da API
// //         instagram: data.instagram ? (data.instagram.startsWith("@") ? data.instagram : "@" + data.instagram) : "@",
// //         tipo_talento: data.tipo_talento || "", // CORRIGIDO: Usar valor da API ou vazio
// //         cover: data.cover || "",
// //       }

// //       console.log("📝 FormData configurado:", {
// //         name: newFormData.name,
// //         category: newFormData.category,
// //         tipo_talento: newFormData.tipo_talento,
// //       })
// //       console.log("🎭 Tipo de talento no formData:", newFormData.tipo_talento)

// //       setFormData(newFormData)
// //     } catch (error) {
// //       console.error("❌ Erro ao carregar talento:", error)
// //       setError(error.message || "Erro ao carregar detalhes do talento")
// //       toast.error(`Erro ao carregar detalhes: ${error.message || "Dados não encontrados"}`)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const fetchTalentPhotosList = async (id) => {
// //     if (activeSection !== "photos") return
// //     setLoadingPhotos(true)
// //     try {
// //       const token = localStorage.getItem("token")
// //       if (!token) throw new Error("Token de autenticação não encontrado")
// //       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}/photos`, {
// //         method: "GET",
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       })
// //       if (!response.ok) throw new Error(`Erro ao buscar fotos do talento: ${response.status}`)
// //       const data = await response.json()
// //       console.log("Dados recebidos da API para fotos:", data)
// //       const processedPhotos = data.map((photo, index) => ({
// //         ...photo,
// //         url: photo.image_url || "/placeholder.svg",
// //         uniqueKey: generateUniqueKey("photo", photo.id),
// //       }))
// //       setPhotos(processedPhotos || [])
// //       console.log("Fotos processadas e atualizadas no estado:", processedPhotos)
// //     } catch (error) {
// //       console.error("Erro ao buscar fotos do talento:", error)
// //       toast.error(`Erro ao carregar fotos: ${error.message}`)
// //     } finally {
// //       setLoadingPhotos(false)
// //     }
// //   }

// //   useEffect(() => {
// //     if (isOpen && talentId && activeSection === "photos") {
// //       fetchTalentPhotosList(talentId)
// //     }
// //   }, [isOpen, talentId, activeSection])

// //   const handlePhotoDrop = async (e) => {
// //     e.preventDefault()
// //     e.stopPropagation()
// //     const dropArea = document.getElementById("photo-drop-area")
// //     if (dropArea) dropArea.classList.remove("bg-pink-900/30", "border-pink-500/50")
// //     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return
// //     const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
// //     if (files.length === 0) {
// //       toast.error("Por favor, arraste apenas arquivos de imagem")
// //       return
// //     }
// //     if (!talentId) {
// //       toast.error("ID do talento não encontrado. Não é possível adicionar fotos.")
// //       return
// //     }
// //     setUploadingPhotos(true)
// //     try {
// //       toast.info(`Enviando ${files.length} imagem(ns)...`, { autoClose: false, toastId: "processing-drop" })
// //       const formData = new FormData()
// //       files.forEach((file) => formData.append("files", file))
// //       formData.append("release", "false")
// //       const token = localStorage.getItem("token")
// //       if (!token) throw new Error("Token de autenticação não encontrado")
// //       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
// //         method: "POST",
// //         headers: { Authorization: `Bearer ${token}` },
// //         body: formData,
// //       })
// //       if (!response.ok) {
// //         const errorData = await response.json()
// //         throw new Error(errorData.detail || `Erro no upload: ${response.status}`)
// //       }
// //       const data = await response.json()
// //       toast.success(`${files.length} foto(s) adicionada(s) com sucesso!`)
// //       await fetchTalentPhotosList(talentId)
// //     } catch (error) {
// //       toast.error(`Erro ao processar imagens: ${error.message || "Erro desconhecido"}`)
// //     } finally {
// //       setUploadingPhotos(false)
// //     }
// //   }

// //   const handlePhotoSelection = async (e) => {
// //     const files = Array.from(e.target.files)
// //     if (files.length === 0) return
// //     if (!talentId) {
// //       toast.error("ID do talento não encontrado. Não é possível adicionar fotos.")
// //       return
// //     }
// //     setUploadingPhotos(true)
// //     try {
// //       toast.info(`Enviando ${files.length} imagem(ns)...`, { autoClose: false, toastId: "processing" })
// //       const formData = new FormData()
// //       files.forEach((file) => formData.append("files", file))
// //       formData.append("release", "false")
// //       const token = localStorage.getItem("token")
// //       if (!token) throw new Error("Token de autenticação não encontrado")
// //       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
// //         method: "POST",
// //         headers: { Authorization: `Bearer ${token}` },
// //         body: formData,
// //       })
// //       if (!response.ok) {
// //         const errorData = await response.json()
// //         throw new Error(errorData.detail || `Erro no upload: ${response.status}`)
// //       }
// //       const data = await response.json()
// //       toast.success(`${files.length} foto(s) adicionada(s) com sucesso!`)
// //       await fetchTalentPhotosList(talentId)
// //     } catch (error) {
// //       toast.error(`Erro ao processar imagens: ${error.message || "Erro desconhecido"}`)
// //     } finally {
// //       setUploadingPhotos(false)
// //       e.target.value = null
// //     }
// //   }

// //   const handleDeletePhoto = (photoId) => {
// //     const photo = photos.find((p) => p.id === photoId)
// //     if (!photo || !photo.id) {
// //       toast.error("Não é possível excluir foto: ID inválido")
// //       return
// //     }
// //     setConfirmationModal({
// //       isOpen: true,
// //       itemId: photo.id,
// //       itemType: "photo",
// //       title: "Excluir foto",
// //       message: "Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.",
// //     })
// //     setPhotoActionMenu(null)
// //   }

// //   const handleDeleteVideo = (videoId) => {
// //     setConfirmationModal({
// //       isOpen: true,
// //       itemId: videoId,
// //       itemType: "video",
// //       title: "Excluir vídeo",
// //       message: "Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.",
// //     })
// //     setVideoActionMenu(null)
// //   }

// //   const confirmDelete = async () => {
// //     const { itemId, itemType } = confirmationModal
// //     if (!itemId) {
// //       toast.error("Erro: ID do item não encontrado")
// //       setConfirmationModal({ isOpen: false, itemId: null, itemType: null, title: "", message: "" })
// //       return
// //     }
// //     try {
// //       if (itemType === "video") {
// //         await deleteTalentVideo(talentId, itemId)
// //         toast.success("Vídeo excluído com sucesso!")
// //         await fetchTalentVideosList(talentId)
// //       } else if (itemType === "photo") {
// //         await deleteTalentPhoto(talentId, itemId)
// //         toast.success("Foto excluída com sucesso!")
// //         await fetchTalentPhotosList(talentId)
// //       }
// //     } catch (error) {
// //       toast.error(`Erro ao excluir ${itemType}: ${error.message}`)
// //     } finally {
// //       setConfirmationModal({ isOpen: false, itemId: null, itemType: null, title: "", message: "" })
// //     }
// //   }

// //   const closeConfirmationModal = () =>
// //     setConfirmationModal({ isOpen: false, itemId: null, itemType: null, title: "", message: "" })

// //   const fetchTalentVideosList = async (id) => {
// //     if (activeSection !== "videos") return
// //     setLoadingVideos(true)
// //     try {
// //       const data = await fetchTalentVideos(id)
// //       const processedVideos = data.map((video, index) => ({
// //         ...video,
// //         url: video.video_url, // Usar video_url da API
// //         uniqueKey: generateUniqueKey("video", video.id),
// //       }))
// //       setVideos(processedVideos || [])
// //     } catch (error) {
// //       toast.error(`Erro ao carregar vídeos: ${error.message}`)
// //     } finally {
// //       setLoadingVideos(false)
// //     }
// //   }

// //   useEffect(() => {
// //     if (isOpen && talentId && activeSection === "videos") {
// //       fetchTalentVideosList(talentId)
// //     }
// //   }, [isOpen, talentId, activeSection])

// //   // Validar URL de vídeo
// //   const isValidVideoUrl = (url) => {
// //     const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
// //     const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/
// //     const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/.+/
// //     return youtubeRegex.test(url) || vimeoRegex.test(url) || instagramRegex.test(url)
// //   }

// //   // Adicionar nova URL de vídeo ao array
// //   const addVideoUrlField = () => {
// //     setVideoUrls([...videoUrls, ""])
// //   }

// //   // Remover URL de vídeo do array
// //   const removeVideoUrlField = (index) => {
// //     const newUrls = videoUrls.filter((_, i) => i !== index)
// //     setVideoUrls(newUrls.length === 0 ? [""] : newUrls)
// //   }

// //   // Atualizar URL específica
// //   const updateVideoUrl = (index, value) => {
// //     const newUrls = [...videoUrls]
// //     newUrls[index] = value
// //     setVideoUrls(newUrls)
// //   }

// //   // Adicionar vídeos usando as URLs
// //   const handleAddVideos = async () => {
// //     const validUrls = videoUrls.filter((url) => url.trim() && isValidVideoUrl(url.trim()))

// //     if (validUrls.length === 0) {
// //       toast.error("Por favor, insira pelo menos uma URL válida de vídeo")
// //       return
// //     }

// //     setUploadingVideos(true)
// //     try {
// //       await addTalentVideos(talentId, validUrls)
// //       toast.success(`${validUrls.length} vídeo(s) adicionado(s) com sucesso!`)
// //       setVideoUrls([""])
// //       await fetchTalentVideosList(talentId)
// //     } catch (error) {
// //       toast.error(`Erro ao adicionar vídeos: ${error.message}`)
// //     } finally {
// //       setUploadingVideos(false)
// //     }
// //   }

// //   const handleInputChange = (e) => {
// //     const { name, value, type, checked } = e.target

// //     let newValue = type === "checkbox" ? checked : value

// //     // GARANTIR que category seja sempre STAGE
// //     if (name === "category") {
// //       newValue = "STAGE"
// //     }

// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: newValue,
// //     }))

// //     setFormTouched(true)

// //     // Limpar erro específico do campo quando ele for alterado
// //     if (formErrors[name]) {
// //       setFormErrors((prev) => ({
// //         ...prev,
// //         [name]: null,
// //       }))
// //     }
// //   }

// //   const addInstrument = () => {
// //     if (newInstrument.trim()) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         instruments: [...prev.instruments, newInstrument.trim()],
// //       }))
// //       setNewInstrument("")
// //       setFormTouched(true)
// //     }
// //   }

// //   const removeInstrument = (index) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       instruments: prev.instruments.filter((_, i) => i !== index),
// //     }))
// //     setFormTouched(true)
// //   }

// //   const addLanguage = () => {
// //     if (newLanguage.trim()) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         languages: [...prev.languages, newLanguage.trim()],
// //       }))
// //       setNewLanguage("")
// //       setFormTouched(true)
// //     }
// //   }

// //   const removeLanguage = (index) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       languages: prev.languages.filter((_, i) => i !== index),
// //     }))
// //     setFormTouched(true)
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()

// //     console.log("🚀 Iniciando processo de salvamento...")
// //     console.log("📋 Dados do formulário antes da validação:", formData)

// //     if (!validateForm()) {
// //       console.log("❌ Validação falhou:", formErrors)
// //       toast.error("Por favor, corrija os erros no formulário", {
// //         icon: <AlertCircle className="text-red-500" />,
// //       })
// //       return
// //     }

// //     console.log("✅ Validação passou, iniciando salvamento...")
// //     setSaving(true)

// //     try {
// //       // GARANTIR que category seja sempre STAGE no envio
// //       const dataToSave = {
// //         ...formData,
// //         category: "STAGE", // FORÇAR STAGE
// //       }

// //       console.log("📤 Dados sendo enviados para a API:", dataToSave)
// //       console.log("🎯 Categoria confirmada como:", dataToSave.category)

// //       const updatedTalent = await updateTalent(talentId, dataToSave)

// //       console.log("✅ Talento atualizado com sucesso:", updatedTalent)

// //       toast.success("Talento atualizado com sucesso!", {
// //         icon: <CheckCircle className="text-green-500" />,
// //       })

// //       if (notifyTalentUpdated) notifyTalentUpdated(updatedTalent)
// //       if (onSave) onSave(updatedTalent)

// //       setFormTouched(false)
// //       onClose()
// //     } catch (error) {
// //       console.error("❌ Erro ao salvar:", error)
// //       toast.error(`Erro ao atualizar talento: ${error.message}`, {
// //         icon: <XCircle className="text-red-500" />,
// //       })
// //     } finally {
// //       setSaving(false)
// //     }
// //   }

// //   const handleShowTooltip = (id) => setShowTooltip((prev) => ({ ...prev, [id]: true }))
// //   const handleHideTooltip = (id) => setShowTooltip((prev) => ({ ...prev, [id]: false }))

// //   const convertToBase64 = (file) => {
// //     return new Promise((resolve, reject) => {
// //       const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
// //       if (!validTypes.includes(file.type)) {
// //         reject(new Error(`Tipo de arquivo não suportado: ${file.type}. Use JPEG, PNG, GIF ou WebP.`))
// //         return
// //       }
// //       const reader = new FileReader()
// //       reader.onloadend = () => resolve(reader.result)
// //       reader.onerror = () => reject(new Error("Erro ao ler o arquivo. Tente novamente."))
// //       reader.readAsDataURL(file)
// //     })
// //   }

// //   const handleImageUpload = () => fileInputRef.current.click()

// //   const handleFileChange = async (e) => {
// //     const file = e.target.files[0]
// //     if (file) {
// //       try {
// //         const base64Image = await convertToBase64(file)
// //         setFormData((prev) => ({
// //           ...prev,
// //           cover: base64Image,
// //         }))
// //         setFormTouched(true)
// //         toast.success("Imagem de capa carregada com sucesso!")
// //       } catch (error) {
// //         toast.error(`Erro ao processar a imagem: ${error.message}`)
// //       }
// //     }
// //   }

// //   const validateForm = () => {
// //     const errors = {}

// //     if (!formData.tipo_talento || !formData.tipo_talento.trim()) {
// //       errors.tipo_talento = "Tipo de talento é obrigatório"
// //     }

// //     if (!formData.birth_date) {
// //       errors.birth_date = "Data de nascimento é obrigatória"
// //     }

// //     // NÃO validar categoria - ela é sempre STAGE
// //     console.log("🔍 Validação - categoria atual:", formData.category)
// //     console.log("🔍 Erros encontrados:", errors)

// //     setFormErrors(errors)
// //     return Object.keys(errors).length === 0
// //   }

// //   const formatDateForInput = (dateString) => (dateString ? new Date(dateString).toISOString().split("T")[0] : "")

// //   if (!isOpen) return null

// //   const renderBasicInfoSection = () => (
// //     <ModalSection activeSection={activeSection} sectionKey="basic">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div>
// //           <label
// //             htmlFor="name"
// //             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
// //           >
// //             Nome (Somente Leitura)
// //             <div
// //               className="relative ml-1.5"
// //               onMouseEnter={() => handleShowTooltip("name")}
// //               onMouseLeave={() => handleHideTooltip("name")}
// //             >
// //               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
// //               {showTooltip.name && (
// //                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
// //                   Nome do talento (não pode ser editado)
// //                 </div>
// //               )}
// //             </div>
// //           </label>
// //           <div className="relative group">
// //             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
// //               <User className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
// //             </div>
// //             <input
// //               type="text"
// //               id="name"
// //               name="name"
// //               value={formData.name}
// //               onChange={handleInputChange}
// //               readOnly
// //               className={`pl-10 block w-full rounded-lg border ${
// //                 formErrors.name
// //                   ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
// //                   : "border-gray-200 dark:border-gray-700 focus:ring-gray-400 focus:border-gray-400"
// //               } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed transition-all`}
// //               placeholder="Nome completo"
// //             />
// //             <AnimatePresence>
// //               {formErrors.name && (
// //                 <motion.p
// //                   initial={{ opacity: 0, y: -10 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -10 }}
// //                   className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
// //                 >
// //                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
// //                   {formErrors.name}
// //                 </motion.p>
// //               )}
// //             </AnimatePresence>
// //           </div>
// //         </div>

// //         <div>
// //           <label
// //             htmlFor="tipo_talento"
// //             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
// //           >
// //             Tipo de Talento <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
// //             <div
// //               className="relative ml-1.5"
// //               onMouseEnter={() => handleShowTooltip("tipo_talento")}
// //               onMouseLeave={() => handleHideTooltip("tipo_talento")}
// //             >
// //               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
// //               {showTooltip.tipo_talento && (
// //                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
// //                   Selecione se é Ator ou Atriz
// //                 </div>
// //               )}
// //             </div>
// //           </label>
// //           <div className="relative group">
// //             <select
// //               id="tipo_talento"
// //               name="tipo_talento"
// //               value={formData.tipo_talento}
// //               onChange={handleInputChange}
// //               className={`block w-full rounded-lg border ${
// //                 formErrors.tipo_talento
// //                   ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
// //                   : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
// //               } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none pr-10 transition-all`}
// //             >
// //               <option value="">Selecione o tipo</option>
// //               <option value="Ator">Ator</option>
// //               <option value="Atriz">Atriz</option>
// //             </select>
// //             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
// //               <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
// //             </div>
// //             <AnimatePresence>
// //               {formErrors.tipo_talento && (
// //                 <motion.p
// //                   initial={{ opacity: 0, y: -10 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -10 }}
// //                   className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
// //                 >
// //                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
// //                   {formErrors.tipo_talento}
// //                 </motion.p>
// //               )}
// //             </AnimatePresence>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div>
// //           <label
// //             htmlFor="birth_date"
// //             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
// //           >
// //             Data de Nascimento <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
// //             <div
// //               className="relative ml-1.5"
// //               onMouseEnter={() => handleShowTooltip("birth_date")}
// //               onMouseLeave={() => handleHideTooltip("birth_date")}
// //             >
// //               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
// //               {showTooltip.birth_date && (
// //                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
// //                   Data de nascimento para cálculo de idade
// //                 </div>
// //               )}
// //             </div>
// //           </label>
// //           <div className="relative group">
// //             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
// //               <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
// //             </div>
// //             <input
// //               type="date"
// //               id="birth_date"
// //               name="birth_date"
// //               value={formData.birth_date}
// //               onChange={handleInputChange}
// //               className={`pl-10 block w-full rounded-lg border ${
// //                 formErrors.birth_date
// //                   ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
// //                   : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
// //               } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
// //             />
// //             <AnimatePresence>
// //               {formErrors.birth_date && (
// //                 <motion.p
// //                   initial={{ opacity: 0, y: -10 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -10 }}
// //                   className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
// //                 >
// //                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
// //                   {formErrors.birth_date}
// //                 </motion.p>
// //               )}
// //             </AnimatePresence>
// //           </div>
// //         </div>

// //         {/* Campo de Categoria - Apenas informativo */}
// //         <div>
// //           <label
// //             htmlFor="category"
// //             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
// //           >
// //             Categoria
// //             <div
// //               className="relative ml-1.5"
// //               onMouseEnter={() => handleShowTooltip("category")}
// //               onMouseLeave={() => handleHideTooltip("category")}
// //             >
// //               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
// //               {showTooltip.category && (
// //                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
// //                   Categoria fixa para todos os talentos: STAGE
// //                 </div>
// //               )}
// //             </div>
// //           </label>
// //           <div className="relative group">
// //             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
// //               <Briefcase className="h-4 w-4 text-green-500" />
// //             </div>
// //             <div className="pl-10 block w-full rounded-lg border border-green-200 dark:border-green-700 shadow-sm sm:text-sm p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 font-medium">
// //               STAGE
// //             </div>
// //             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
// //               <Check className="h-4 w-4 text-green-500" />
// //             </div>
// //           </div>
// //           <p className="mt-1 text-xs text-green-600 dark:text-green-400">
// //             ✅ Categoria definida automaticamente como STAGE
// //           </p>
// //         </div>
// //       </div>

// //       <div>
// //         <label
// //           htmlFor="instagram"
// //           className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
// //         >
// //           Instagram
// //           <div
// //             className="relative ml-1.5"
// //             onMouseEnter={() => handleShowTooltip("instagram")}
// //             onMouseLeave={() => handleHideTooltip("instagram")}
// //           >
// //             <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
// //             {showTooltip.instagram && (
// //               <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
// //                 Perfil do Instagram (@ será adicionado automaticamente)
// //               </div>
// //             )}
// //           </div>
// //         </label>
// //         <div className="relative group">
// //           <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
// //             <Instagram className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
// //           </div>
// //           <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
// //             <span className="text-gray-500 dark:text-gray-400 font-medium">@</span>
// //           </div>
// //           <input
// //             type="text"
// //             id="instagram"
// //             name="instagram"
// //             value={formData.instagram.startsWith("@") ? formData.instagram.slice(1) : formData.instagram}
// //             onChange={(e) => {
// //               const value = e.target.value
// //               const cleanValue = value.replace(/^@+/, "")
// //               const finalValue = "@" + cleanValue
// //               setFormData((prev) => ({
// //                 ...prev,
// //                 instagram: finalValue,
// //               }))
// //               setFormTouched(true)
// //               if (formErrors.instagram) {
// //                 setFormErrors((prev) => ({
// //                   ...prev,
// //                   instagram: null,
// //                 }))
// //               }
// //             }}
// //             className={`pl-14 block w-full rounded-lg border ${
// //               formErrors.instagram
// //                 ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
// //                 : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
// //             } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
// //             placeholder="usuario"
// //           />
// //           <AnimatePresence>
// //             {formErrors.instagram && (
// //               <motion.p
// //                 initial={{ opacity: 0, y: -10 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -10 }}
// //                 className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
// //               >
// //                 <AlertCircle className="h-3.5 w-3.5 mr-1" />
// //                 {formErrors.instagram}
// //               </motion.p>
// //             )}
// //           </AnimatePresence>
// //         </div>
// //       </div>

// //       <motion.div
// //         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30"
// //         whileHover={{ y: -2 }}
// //       >
// //         <div className="flex items-center justify-between mb-3">
// //           <label
// //             htmlFor="cover"
// //             className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center"
// //           >
// //             <Camera className="h-4 w-4 mr-1.5 text-pink-500 dark:text-pink-400" />
// //             Imagem de Perfil
// //           </label>
// //           <motion.button
// //             type="button"
// //             onClick={handleImageUpload}
// //             className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-800/40 transition-colors"
// //             whileHover={{ scale: 1.05 }}
// //             whileTap={{ scale: 0.95 }}
// //           >
// //             <Upload className="h-3.5 w-3.5 mr-1" />
// //             Upload
// //           </motion.button>
// //           <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
// //         </div>
// //         <div className="relative group">
// //           <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
// //             <ImageIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
// //           </div>
// //           <input
// //             type="text"
// //             id="cover"
// //             name="cover"
// //             value={formData.cover || ""}
// //             onChange={handleInputChange}
// //             className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
// //             placeholder="https://exemplo.com/imagem.jpg"
// //           />
// //         </div>
// //         {formData.cover && (
// //           <div className="mt-4">
// //             <motion.div
// //               className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group cursor-pointer shadow-md"
// //               onMouseEnter={() => setImagePreviewHover(true)}
// //               onMouseLeave={() => setImagePreviewHover(false)}
// //               whileHover={{ scale: 1.02 }}
// //             >
// //               <img
// //                 src={formData.cover || "/placeholder.svg"}
// //                 alt="Prévia"
// //                 className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
// //                 onError={(e) => {
// //                   e.target.onerror = null
// //                   e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23a0a0a0" textAnchor="middle" dy=".3em">Imagem não disponível</text></svg>`
// //                 }}
// //               />
// //               <AnimatePresence>
// //                 {imagePreviewHover && (
// //                   <motion.div
// //                     initial={{ opacity: 0 }}
// //                     animate={{ opacity: 1 }}
// //                     exit={{ opacity: 0 }}
// //                     className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center"
// //                   >
// //                     <div className="text-white text-sm font-medium px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg">
// //                       <Camera className="h-4 w-4 inline-block mr-2" />
// //                       Visualizar imagem
// //                     </div>
// //                   </motion.div>
// //                 )}
// //               </AnimatePresence>
// //             </motion.div>
// //             <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
// //               Esta imagem será exibida no perfil do talento e nas listagens
// //             </p>
// //           </div>
// //         )}
// //       </motion.div>

// //       {/* Campo oculto para garantir que category seja sempre STAGE */}
// //       <input type="hidden" name="category" value="STAGE" />
// //     </ModalSection>
// //   )

// //   const renderCharacteristicsSection = () => (
// //     <ModalSection activeSection={activeSection} sectionKey="characteristics">
// //       <motion.div
// //         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
// //         whileHover={{ y: -2 }}
// //       >
// //         <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
// //           <User className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
// //           Características Físicas
// //         </h4>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //           <div>
// //             <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
// //               Altura
// //             </label>
// //             <div className="relative group">
// //               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
// //                 <Ruler className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
// //               </div>
// //               <input
// //                 type="text"
// //                 id="height"
// //                 name="height"
// //                 value={formData.height}
// //                 onChange={handleInputChange}
// //                 className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
// //                 placeholder="170 cm"
// //               />
// //             </div>
// //           </div>
// //           <div>
// //             <label htmlFor="eye_color" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
// //               Cor dos Olhos
// //             </label>
// //             <div className="relative group">
// //               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
// //                 <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
// //               </div>
// //               <input
// //                 type="text"
// //                 id="eye_color"
// //                 name="eye_color"
// //                 value={formData.eye_color}
// //                 onChange={handleInputChange}
// //                 className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
// //                 placeholder="Castanhos"
// //               />
// //             </div>
// //           </div>
// //           <div>
// //             <label htmlFor="hair_color" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
// //               Cor do Cabelo
// //             </label>
// //             <div className="relative group">
// //               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
// //                 <Palette className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
// //               </div>
// //               <input
// //                 type="text"
// //                 id="hair_color"
// //                 name="hair_color"
// //                 value={formData.hair_color}
// //                 onChange={handleInputChange}
// //                 className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
// //                 placeholder="Castanho"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </motion.div>
// //       <motion.div
// //         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
// //         whileHover={{ y: -2 }}
// //       >
// //         <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
// //           <Music className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
// //           Habilidades Musicais
// //         </h4>
// //         <div className="flex items-center mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-700 transition-colors">
// //           <input
// //             type="checkbox"
// //             id="can_sing"
// //             name="can_sing"
// //             checked={formData.can_sing}
// //             onChange={handleInputChange}
// //             className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
// //           />
// //           <label htmlFor="can_sing" className="ml-2 block text-sm text-gray-700 dark:text-gray-200 flex items-center">
// //             <Mic className="h-4 w-4 mr-1.5 text-pink-500 dark:text-pink-400" />
// //             Canta
// //           </label>
// //         </div>
// //         <div>
// //           <label htmlFor="new-instrument" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
// //             Instrumentos
// //           </label>
// //           <div className="flex">
// //             <input
// //               type="text"
// //               id="new-instrument"
// //               value={newInstrument}
// //               onChange={(e) => setNewInstrument(e.target.value)}
// //               className="block w-full rounded-l-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
// //               placeholder="Adicionar instrumento"
// //               onKeyPress={(e) => {
// //                 if (e.key === "Enter") {
// //                   e.preventDefault()
// //                   addInstrument()
// //                 }
// //               }}
// //             />
// //             <motion.button
// //               type="button"
// //               onClick={addInstrument}
// //               className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-r-lg hover:from-pink-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2"
// //               whileHover={{ scale: 1.05 }}
// //               whileTap={{ scale: 0.95 }}
// //             >
// //               <Plus className="h-5 w-5" />
// //             </motion.button>
// //           </div>
// //           <div className="mt-3 flex flex-wrap gap-2">
// //             {formData.instruments.length === 0 ? (
// //               <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum instrumento adicionado</p>
// //             ) : (
// //               formData.instruments.map((instrument, index) => (
// //                 <motion.div
// //                   key={`instrument-${index}-${instrument}`}
// //                   initial={{ opacity: 0, scale: 0.8 }}
// //                   animate={{ opacity: 1, scale: 1 }}
// //                   exit={{ opacity: 0, scale: 0.8 }}
// //                   className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all"
// //                 >
// //                   <Music className="h-3.5 w-3.5 mr-1.5 text-pink-500 dark:text-pink-400" />
// //                   {instrument}
// //                   <button
// //                     type="button"
// //                     onClick={() => removeInstrument(index)}
// //                     className="ml-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
// //                   >
// //                     <X className="h-3.5 w-3.5" />
// //                   </button>
// //                 </motion.div>
// //               ))
// //             )}
// //           </div>
// //         </div>
// //       </motion.div>
// //       <motion.div
// //         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
// //         whileHover={{ y: -2 }}
// //       >
// //         <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
// //           <Languages className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
// //           Idiomas
// //         </h4>
// //         <div className="flex">
// //           <input
// //             type="text"
// //             id="new-language"
// //             value={newLanguage}
// //             onChange={(e) => setNewLanguage(e.target.value)}
// //             className="block w-full rounded-l-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
// //             placeholder="Adicionar idioma"
// //             onKeyPress={(e) => {
// //               if (e.key === "Enter") {
// //                 e.preventDefault()
// //                 addLanguage()
// //               }
// //             }}
// //           />
// //           <motion.button
// //             type="button"
// //             onClick={addLanguage}
// //             className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-r-lg hover:from-pink-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2"
// //             whileHover={{ scale: 1.05 }}
// //             whileTap={{ scale: 0.95 }}
// //           >
// //             <Plus className="h-5 w-5" />
// //           </motion.button>
// //         </div>
// //         <div className="mt-3 flex flex-wrap gap-2">
// //           {formData.languages.length === 0 ? (
// //             <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum idioma adicionado</p>
// //           ) : (
// //             formData.languages.map((language, index) => (
// //               <motion.div
// //                 key={`language-${index}-${language}`}
// //                 initial={{ opacity: 0, scale: 0.8 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 exit={{ opacity: 0, scale: 0.8 }}
// //                 className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all"
// //               >
// //                 <Globe className="h-3.5 w-3.5 mr-1.5 text-pink-500 dark:text-pink-400" />
// //                 {language}
// //                 <button
// //                   type="button"
// //                   onClick={() => removeLanguage(index)}
// //                   className="ml-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
// //                 >
// //                   <X className="h-3.5 w-3.5" />
// //                 </button>
// //               </motion.div>
// //             ))
// //           )}
// //         </div>
// //       </motion.div>
// //     </ModalSection>
// //   )

// //   const renderStatusSection = () => (
// //     <ModalSection activeSection={activeSection} sectionKey="status">
// //       <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
// //         <h4 className="text-base uppercase tracking-wider text-pink-400 font-medium mb-5 pb-2 border-b border-gray-800 flex items-center">
// //           <FileText className="h-5 w-5 mr-2 text-pink-400" />
// //           Status do Talento
// //         </h4>
// //         <div className="space-y-4">
// //           <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
// //             <div className="flex items-center">
// //               <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
// //                 <input
// //                   type="checkbox"
// //                   id="ativo"
// //                   name="ativo"
// //                   checked={formData.ativo}
// //                   onChange={handleInputChange}
// //                   className="sr-only peer"
// //                 />
// //                 <Check className={`h-4 w-4 text-green-400 ${!formData.ativo && "opacity-0"}`} />
// //               </div>
// //               <label htmlFor="ativo" className="flex items-center cursor-pointer">
// //                 <span className="text-white font-medium">Ativo no sistema</span>
// //                 <span className="ml-2 text-sm text-gray-400">
// //                   (Talentos inativos não aparecem nas listagens públicas)
// //                 </span>
// //               </label>
// //             </div>
// //           </div>
// //           <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
// //             <div className="flex items-center">
// //               <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
// //                 <input
// //                   type="checkbox"
// //                   id="disponivel"
// //                   name="disponivel"
// //                   checked={formData.disponivel}
// //                   onChange={handleInputChange}
// //                   className="sr-only peer"
// //                 />
// //                 <Clock className={`h-4 w-4 text-amber-400 ${!formData.disponivel && "opacity-0"}`} />
// //               </div>
// //               <label htmlFor="disponivel" className="flex items-center cursor-pointer">
// //                 <span className="text-white font-medium">Disponível para trabalhos</span>
// //                 <span className="ml-2 text-sm text-gray-400">
// //                   (Indica se o talento está disponível para contratação)
// //                 </span>
// //               </label>
// //             </div>
// //           </div>
// //           <AnimatePresence>
// //             {!formData.disponivel && (
// //               <motion.div
// //                 initial={{ opacity: 0, height: 0 }}
// //                 animate={{ opacity: 1, height: "auto" }}
// //                 exit={{ opacity: 0, height: 0 }}
// //                 transition={{ duration: 0.3 }}
// //                 className="ml-9 mt-1"
// //               >
// //                 <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
// //                   <label htmlFor="data_disponibilidade" className="block text-amber-300 font-medium mb-2">
// //                     Disponível a partir de:
// //                   </label>
// //                   <div className="relative">
// //                     <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
// //                       <div className="flex items-center justify-center pl-4 pr-2">
// //                         <Calendar className="h-5 w-5 text-amber-400 flex-shrink-0" />
// //                       </div>
// //                       <input
// //                         type="date"
// //                         id="data_disponibilidade"
// //                         name="data_disponibilidade"
// //                         value={formData.data_disponibilidade}
// //                         onChange={handleInputChange}
// //                         className="block w-full py-3 px-2 bg-gray-800 text-white border-0 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 focus:outline-none"
// //                       />
// //                     </div>
// //                     <p className="mt-2 text-xs text-amber-300/80">
// //                       Esta data será exibida para indicar quando o talento estará disponível novamente.
// //                     </p>
// //                   </div>
// //                 </div>
// //               </motion.div>
// //             )}
// //           </AnimatePresence>
// //           <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
// //             <div className="flex items-center">
// //               <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
// //                 <input
// //                   type="checkbox"
// //                   id="destaque"
// //                   name="destaque"
// //                   checked={formData.destaque}
// //                   onChange={handleInputChange}
// //                   className="sr-only peer"
// //                 />
// //                 <Sparkles className={`h-4 w-4 text-yellow-400 ${!formData.destaque && "opacity-0"}`} />
// //               </div>
// //               <label htmlFor="destaque" className="flex items-center cursor-pointer">
// //                 <span className="text-white font-medium">Destacar talento</span>
// //                 <span className="ml-2 text-sm text-gray-400">(Talentos destacados aparecem em seções especiais)</span>
// //               </label>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </ModalSection>
// //   )

// //   const renderPhotosSection = () => (
// //     <ModalSection activeSection={activeSection} sectionKey="photos">
// //       <PhotoUploadArea
// //         talentId={talentId}
// //         uploadingPhotos={uploadingPhotos}
// //         onPhotoSelection={handlePhotoSelection}
// //         onPhotoDrop={handlePhotoDrop}
// //       />
// //       <PhotoGallery
// //         photos={photos}
// //         loadingPhotos={loadingPhotos}
// //         onDeletePhoto={handleDeletePhoto}
// //         onToggleActionMenu={setPhotoActionMenu}
// //         photoActionMenu={photoActionMenu}
// //       />
// //     </ModalSection>
// //   )

// //   const renderVideosSection = () => (
// //     <ModalSection activeSection={activeSection} sectionKey="videos">
// //       {/* Área única para adicionar vídeos por URL */}
// //       <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
// //         <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-700">
// //           <h4 className="text-lg font-medium text-purple-400 flex items-center">
// //             <Video className="h-5 w-5 mr-2" />
// //             Adicionar Vídeos
// //           </h4>
// //           <span className="text-sm text-gray-400">
// //             {videos.length} vídeo{videos.length !== 1 ? "s" : ""} adicionado{videos.length !== 1 ? "s" : ""}
// //           </span>
// //         </div>

// //         {/* Campos de URL */}
// //         <div className="space-y-4 mb-6">
// //           <p className="text-gray-300 text-sm mb-4">Adicione URLs de vídeos do YouTube, Vimeo ou Instagram:</p>

// //           {videoUrls.map((url, index) => (
// //             <motion.div
// //               key={index}
// //               initial={{ opacity: 0, y: 10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="flex gap-2"
// //             >
// //               <div className="flex-1 relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <Link className="h-4 w-4 text-gray-400" />
// //                 </div>
// //                 <input
// //                   type="url"
// //                   value={url}
// //                   onChange={(e) => updateVideoUrl(index, e.target.value)}
// //                   placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
// //                   className={`pl-10 block w-full rounded-lg border ${
// //                     url && !isValidVideoUrl(url)
// //                       ? "border-red-500 focus:ring-red-500 focus:border-red-500"
// //                       : "border-gray-600 focus:ring-purple-500 focus:border-purple-500"
// //                   } bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 transition-all`}
// //                 />
// //                 {url && !isValidVideoUrl(url) && (
// //                   <p className="mt-1 text-xs text-red-400">URL inválida. Use YouTube, Vimeo ou Instagram.</p>
// //                 )}
// //               </div>

// //               {videoUrls.length > 1 && (
// //                 <motion.button
// //                   type="button"
// //                   onClick={() => removeVideoUrlField(index)}
// //                   className="px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
// //                   whileHover={{ scale: 1.05 }}
// //                   whileTap={{ scale: 0.95 }}
// //                 >
// //                   <X className="h-4 w-4" />
// //                 </motion.button>
// //               )}
// //             </motion.div>
// //           ))}
// //         </div>

// //         {/* Botões de ação */}
// //         <div className="flex gap-3">
// //           <motion.button
// //             type="button"
// //             onClick={addVideoUrlField}
// //             className="px-4 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded-lg transition-colors flex items-center gap-2"
// //             whileHover={{ scale: 1.02 }}
// //             whileTap={{ scale: 0.98 }}
// //           >
// //             <Plus className="h-4 w-4" />
// //             Adicionar mais URL
// //           </motion.button>

// //           <motion.button
// //             type="button"
// //             onClick={handleAddVideos}
// //             disabled={uploadingVideos || videoUrls.every((url) => !url.trim())}
// //             className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center gap-2 ${
// //               uploadingVideos || videoUrls.every((url) => !url.trim()) ? "opacity-50 cursor-not-allowed" : ""
// //             }`}
// //             whileHover={!uploadingVideos ? { scale: 1.02 } : {}}
// //             whileTap={!uploadingVideos ? { scale: 0.98 } : {}}
// //           >
// //             {uploadingVideos ? (
// //               <>
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //                 Adicionando...
// //               </>
// //             ) : (
// //               <>
// //                 <Upload className="h-4 w-4" />
// //                 Adicionar Vídeos
// //               </>
// //             )}
// //           </motion.button>
// //         </div>
// //       </div>

// //       {/* Lista de vídeos existentes */}
// //       <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
// //         <h4 className="text-lg font-medium text-purple-400 mb-4 flex items-center">
// //           <Images className="h-5 w-5 mr-2" />
// //           Vídeos do Talento
// //         </h4>

// //         {loadingVideos ? (
// //           <div className="flex justify-center py-8">
// //             <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
// //           </div>
// //         ) : videos.length === 0 ? (
// //           <div className="text-center py-8">
// //             <Video className="h-12 w-12 text-gray-600 mx-auto mb-3" />
// //             <p className="text-gray-400">Nenhum vídeo adicionado ainda</p>
// //             <p className="text-gray-500 text-sm">Use o formulário acima para adicionar vídeos</p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {videos.map((video) => (
// //               <motion.div
// //                 key={video.uniqueKey}
// //                 initial={{ opacity: 0, scale: 0.9 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 exit={{ opacity: 0, scale: 0.9 }}
// //                 className="relative group bg-gray-800 rounded-lg overflow-hidden"
// //               >
// //                 <div className="aspect-video bg-gray-700">
// //                   <iframe
// //                     src={
// //                       video.url?.includes("youtube") || video.url?.includes("youtu.be")
// //                         ? video.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
// //                         : video.url?.includes("vimeo")
// //                           ? video.url.replace("vimeo.com/", "player.vimeo.com/video/")
// //                           : video.url?.includes("instagram")
// //                             ? video.url + "/embed"
// //                             : ""
// //                     }
// //                     title={`Vídeo ${video.id}`}
// //                     frameBorder="0"
// //                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// //                     allowFullScreen
// //                     className="w-full h-full"
// //                   />
// //                 </div>

// //                 {/* Overlay com ações */}
// //                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
// //                   <div className="opacity-0 group-hover:opacity-100 flex gap-2">
// //                     <motion.button
// //                       onClick={() => window.open(video.url, "_blank")}
// //                       className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-800 transition-colors"
// //                       whileHover={{ scale: 1.1 }}
// //                       whileTap={{ scale: 0.9 }}
// //                       title="Abrir em nova aba"
// //                     >
// //                       <ExternalLink className="h-4 w-4" />
// //                     </motion.button>

// //                     <motion.button
// //                       onClick={() =>
// //                         navigator.clipboard
// //                           .writeText(video.url)
// //                           .then(() => toast.success("URL copiada!"))
// //                           .catch(() => toast.error("Erro ao copiar URL"))
// //                       }
// //                       className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-800 transition-colors"
// //                       whileHover={{ scale: 1.1 }}
// //                       whileTap={{ scale: 0.9 }}
// //                       title="Copiar URL"
// //                     >
// //                       <Copy className="h-4 w-4" />
// //                     </motion.button>

// //                     <motion.button
// //                       onClick={() => handleDeleteVideo(video.id)}
// //                       className="p-2 bg-red-500/90 rounded-full hover:bg-red-500 text-white transition-colors"
// //                       whileHover={{ scale: 1.1 }}
// //                       whileTap={{ scale: 0.9 }}
// //                       title="Excluir vídeo"
// //                     >
// //                       <Trash2 className="h-4 w-4" />
// //                     </motion.button>
// //                   </div>
// //                 </div>
// //               </motion.div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </ModalSection>
// //   )

// //   return (
// //     <AnimatePresence>
// //       {isOpen && (
// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           exit={{ opacity: 0 }}
// //           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
// //           onClick={onClose}
// //         >
// //           <motion.div
// //             initial={{ y: 50, opacity: 0 }}
// //             animate={{ y: 0, opacity: 1 }}
// //             exit={{ y: 50, opacity: 0 }}
// //             className="edit-talent-modal-container bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <div className="flex justify-between items-center mb-6">
// //               <h2 className="text-2xl font-bold text-white">Editar Talento</h2>
// //               <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
// //                 <X className="h-6 w-6" />
// //               </button>
// //             </div>
// //             {error && (
// //               <div className="mb-4 p-3 bg-red-900/30 rounded-lg border border-red-500 text-red-200 text-sm">
// //                 {error}
// //               </div>
// //             )}
// //             {loading ? (
// //               <div className="flex justify-center">
// //                 <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
// //               </div>
// //             ) : (
// //               <>
// //                 <div className="space-y-6">
// //                   <div className="flex space-x-4">
// //                     {["basic", "characteristics", "status", "photos", "videos"].map((section) => (
// //                       <button
// //                         key={section}
// //                         onClick={() => setActiveSection(section)}
// //                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
// //                           activeSection === section
// //                             ? "bg-pink-500 text-white"
// //                             : "bg-gray-800 text-gray-300 hover:bg-gray-700"
// //                         }`}
// //                       >
// //                         {section.charAt(0).toUpperCase() + section.slice(1)}
// //                       </button>
// //                     ))}
// //                   </div>
// //                   {activeSection === "basic" && renderBasicInfoSection()}
// //                   {activeSection === "characteristics" && renderCharacteristicsSection()}
// //                   {activeSection === "status" && renderStatusSection()}
// //                   {activeSection === "photos" && renderPhotosSection()}
// //                   {activeSection === "videos" && renderVideosSection()}
// //                 </div>
// //                 <div className="mt-6 flex justify-end space-x-4">
// //                   <motion.button
// //                     onClick={onClose}
// //                     className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                   >
// //                     Cancelar
// //                   </motion.button>
// //                   <motion.button
// //                     onClick={handleSubmit}
// //                     disabled={!formTouched || saving}
// //                     className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors ${
// //                       !formTouched || saving ? "opacity-70 cursor-not-allowed" : ""
// //                     }`}
// //                     whileHover={!formTouched || saving ? {} : { scale: 1.05 }}
// //                     whileTap={!formTouched || saving ? {} : { scale: 0.95 }}
// //                   >
// //                     {saving ? (
// //                       <>
// //                         <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
// //                         Salvando...
// //                       </>
// //                     ) : (
// //                       <>
// //                         <Save className="h-4 w-4 mr-2 inline" />
// //                         Salvar Alterações
// //                       </>
// //                     )}
// //                   </motion.button>
// //                 </div>
// //               </>
// //             )}
// //           </motion.div>
// //         </motion.div>
// //       )}
// //       {confirmationModal.isOpen && (
// //         <ConfirmationModal
// //           isOpen={confirmationModal.isOpen}
// //           onClose={closeConfirmationModal}
// //           onConfirm={confirmDelete}
// //           title={confirmationModal.title}
// //           message={confirmationModal.message}
// //         />
// //       )}
// //     </AnimatePresence>
// //   )
// // }









































// "use client"

// import { useState, useEffect, useRef } from "react"
// import { toast } from "react-toastify"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   X,
//   Calendar,
//   Ruler,
//   Eye,
//   Music,
//   Globe,
//   Instagram,
//   ImageIcon,
//   User,
//   AlertCircle,
//   Plus,
//   Palette,
//   Check,
//   Clock,
//   ChevronDown,
//   Camera,
//   Upload,
//   CheckCircle,
//   XCircle,
//   HelpCircle,
//   Sparkles,
//   Languages,
//   FileText,
//   Mic,
//   Briefcase,
//   Save,
//   Loader2,
//   Trash2,
//   Images,
//   ExternalLink,
//   Copy,
//   Video,
//   Link,
// } from "lucide-react"
// import { useTalent } from "../contexts/talents-context"
// import ConfirmationModal from "./ConfirmationModal"
// import PhotoGallery from "./PhotoGalery"
// import ModalSection from "./ModalSection"
// import PhotoUploadArea from "./PhotoUploadArea"

// export default function EditTalentModal({ isOpen, onClose, talentId, onSave }) {
//   const {
//     fetchTalentById,
//     updateTalent,
//     addTalentPhotos,
//     fetchTalentPhotos,
//     deleteTalentPhoto,
//     addTalentVideos,
//     fetchTalentVideos,
//     deleteTalentVideo,
//   } = useTalent()

//   const [talent, setTalent] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState(null)
//   const { notifyTalentUpdated } = useTalent() || {}
//   const modalRef = useRef(null)
//   const [activeSection, setActiveSection] = useState("basic")
//   const [formTouched, setFormTouched] = useState(false)
//   const [imagePreviewHover, setImagePreviewHover] = useState(false)
//   const [showTooltip, setShowTooltip] = useState({})
//   const fileInputRef = useRef(null)
//   const photoInputRef = useRef(null)

//   // SEMPRE inicializar com STAGE
//   const [formData, setFormData] = useState({
//     name: "",
//     birth_date: "",
//     height: "",
//     eye_color: "",
//     hair_color: "",
//     can_sing: false,
//     instruments: [],
//     languages: [],
//     ativo: true,
//     disponivel: true,
//     data_disponibilidade: "",
//     destaque: false,
//     category: "STAGE", // SEMPRE STAGE
//     instagram: "@",
//     tipo_talento: "", // CORRIGIDO: Deixar vazio inicialmente
//     cover: "",
//   })

//   const [formErrors, setFormErrors] = useState({})
//   const [newInstrument, setNewInstrument] = useState("")
//   const [newLanguage, setNewLanguage] = useState("")
//   const [photos, setPhotos] = useState([])
//   const [loadingPhotos, setLoadingPhotos] = useState(false)
//   const [uploadingPhotos, setUploadingPhotos] = useState(false)
//   const [photoActionMenu, setPhotoActionMenu] = useState(null)
//   const [videos, setVideos] = useState([])
//   const [loadingVideos, setLoadingVideos] = useState(false)
//   const [uploadingVideos, setUploadingVideos] = useState(false)
//   const [videoActionMenu, setVideoActionMenu] = useState(null)
//   const [newVideoUrl, setNewVideoUrl] = useState("")
//   const [videoUrls, setVideoUrls] = useState([""]) // Array de URLs para adicionar múltiplas

//   const [confirmationModal, setConfirmationModal] = useState({
//     isOpen: false,
//     itemId: null,
//     itemType: null,
//     title: "",
//     message: "",
//     loading: false, // NOVO: estado de loading
//   })

//   const [keyCounter, setKeyCounter] = useState(0)
//   const [imagePreviewUrls, setImagePreviewUrls] = useState({})

//   const generateUniqueKey = (prefix, id) => {
//     const counter = keyCounter
//     setKeyCounter((prev) => prev + 1)
//     return `${prefix}-${id || "temp"}-${Date.now()}-${counter}`
//   }

//   // Reset completo do estado quando o modal abre/fecha ou muda de talento
//   useEffect(() => {
//     if (isOpen && talentId) {
//       console.log("🔄 Abrindo modal para talento:", talentId)

//       // Reset completo de todos os estados
//       setPhotos([])
//       setImagePreviewUrls({})
//       setLoadingPhotos(false)
//       setUploadingPhotos(false)
//       setPhotoActionMenu(null)
//       setVideos([])
//       setLoadingVideos(false)
//       setUploadingVideos(false)
//       setVideoActionMenu(null)
//       setActiveSection("basic")
//       setVideoUrls([""])
//       setFormTouched(false)
//       setFormErrors({}) // Reset dos erros
//       setError(null) // Reset do erro geral

//       // Reset do formData para valores padrão - SEMPRE COM STAGE
//       setFormData({
//         name: "",
//         birth_date: "",
//         height: "",
//         eye_color: "",
//         hair_color: "",
//         can_sing: false,
//         instruments: [],
//         languages: [],
//         ativo: true,
//         disponivel: true,
//         data_disponibilidade: "",
//         destaque: false,
//         category: "STAGE", // SEMPRE STAGE
//         instagram: "@",
//         tipo_talento: "", // CORRIGIDO: Deixar vazio inicialmente
//         cover: "",
//       })

//       // Buscar dados do talento
//       fetchTalentDetails(talentId)
//     } else if (!isOpen) {
//       // Reset quando fecha o modal
//       setFormTouched(false)
//       setFormErrors({})
//       setError(null)
//     }
//   }, [isOpen, talentId])

//   useEffect(() => {
//     return () => Object.values(imagePreviewUrls).forEach((url) => URL.revokeObjectURL(url))
//   }, [])

//   const fetchTalentDetails = async (id) => {
//     setLoading(true)
//     setError(null)
//     try {
//       if (!id) throw new Error("ID do talento inválido")
//       const data = await fetchTalentById(id)
//       if (!data) throw new Error("Nenhum dado retornado para o talento")

//       console.log("📥 Dados do talento carregados:", data)
//       console.log("🎭 Tipo de talento da API:", data.tipo_talento)

//       setTalent(data)

//       // SEMPRE forçar categoria como STAGE, independente do que vem da API
//       const newFormData = {
//         name: data.name || "",
//         birth_date: data.birth_date ? formatDateForInput(data.birth_date) : "",
//         height: data.height || "",
//         eye_color: data.eye_color || "",
//         hair_color: data.hair_color || "",
//         can_sing: data.can_sing || false,
//         instruments: data.instruments || [],
//         languages: data.languages || [],
//         ativo: data.ativo !== undefined ? data.ativo : true,
//         disponivel: data.disponivel !== undefined ? data.disponivel : true,
//         data_disponibilidade: data.data_disponibilidade ? formatDateForInput(data.data_disponibilidade) : "",
//         destaque: data.destaque || false,
//         category: "STAGE", // SEMPRE STAGE, NUNCA usar o que vem da API
//         instagram: data.instagram ? (data.instagram.startsWith("@") ? data.instagram : "@" + data.instagram) : "@",
//         tipo_talento: data.tipo_talento || "", // CORRIGIDO: Usar valor da API ou vazio
//         cover: data.cover || "",
//       }

//       console.log("📝 FormData configurado:", {
//         name: newFormData.name,
//         category: newFormData.category,
//         tipo_talento: newFormData.tipo_talento,
//       })
//       console.log("🎭 Tipo de talento no formData:", newFormData.tipo_talento)

//       setFormData(newFormData)
//     } catch (error) {
//       console.error("❌ Erro ao carregar talento:", error)
//       setError(error.message || "Erro ao carregar detalhes do talento")
//       toast.error(`Erro ao carregar detalhes: ${error.message || "Dados não encontrados"}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTalentPhotosList = async (id) => {
//     if (activeSection !== "photos") return
//     setLoadingPhotos(true)
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) throw new Error("Token de autenticação não encontrado")
//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}/photos`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })
//       if (!response.ok) throw new Error(`Erro ao buscar fotos do talento: ${response.status}`)
//       const data = await response.json()
//       console.log("Dados recebidos da API para fotos:", data)
//       const processedPhotos = data.map((photo, index) => ({
//         ...photo,
//         url: photo.image_url || "/placeholder.svg",
//         uniqueKey: generateUniqueKey("photo", photo.id),
//       }))
//       setPhotos(processedPhotos || [])
//       console.log("Fotos processadas e atualizadas no estado:", processedPhotos)
//     } catch (error) {
//       console.error("Erro ao buscar fotos do talento:", error)
//       toast.error(`Erro ao carregar fotos: ${error.message}`)
//     } finally {
//       setLoadingPhotos(false)
//     }
//   }

//   useEffect(() => {
//     if (isOpen && talentId && activeSection === "photos") {
//       fetchTalentPhotosList(talentId)
//     }
//   }, [isOpen, talentId, activeSection])

//   const handlePhotoDrop = async (e) => {
//     e.preventDefault()
//     e.stopPropagation()

//     const dropArea = document.getElementById("photo-drop-area")
//     if (dropArea) dropArea.classList.remove("bg-pink-900/30", "border-pink-500/50")

//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return

//     const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

//     if (files.length === 0) {
//       toast.error("Por favor, arraste apenas arquivos de imagem")
//       return
//     }

//     if (!talentId) {
//       toast.error("ID do talento não encontrado. Não é possível adicionar fotos.")
//       return
//     }

//     setUploadingPhotos(true)

//     try {
//       toast.info(`Enviando ${files.length} imagem(ns)...`, { autoClose: false, toastId: "processing-drop" })

//       const formData = new FormData()
//       files.forEach((file) => formData.append("files", file))
//       formData.append("release", "false")

//       const token = localStorage.getItem("token")
//       if (!token) throw new Error("Token de autenticação não encontrado")

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.detail || `Erro no upload: ${response.status}`)
//       }

//       const data = await response.json()
//       toast.success(`${files.length} foto(s) adicionada(s) com sucesso!`)
//       await fetchTalentPhotosList(talentId)

//       // NÃO resetar formTouched aqui - manter o estado para permitir salvar
//     } catch (error) {
//       toast.error(`Erro ao processar imagens: ${error.message || "Erro desconhecido"}`)
//     } finally {
//       setUploadingPhotos(false)
//     }
//   }

//   const handlePhotoSelection = async (e) => {
//     const files = Array.from(e.target.files)
//     if (files.length === 0) return

//     if (!talentId) {
//       toast.error("ID do talento não encontrado. Não é possível adicionar fotos.")
//       return
//     }

//     setUploadingPhotos(true)

//     try {
//       toast.info(`Enviando ${files.length} imagem(ns)...`, { autoClose: false, toastId: "processing" })

//       const formData = new FormData()
//       files.forEach((file) => formData.append("files", file))
//       formData.append("release", "false")

//       const token = localStorage.getItem("token")
//       if (!token) throw new Error("Token de autenticação não encontrado")

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.detail || `Erro no upload: ${response.status}`)
//       }

//       const data = await response.json()
//       toast.success(`${files.length} foto(s) adicionada(s) com sucesso!`)
//       await fetchTalentPhotosList(talentId)

//       // NÃO resetar formTouched aqui - manter o estado para permitir salvar
//     } catch (error) {
//       toast.error(`Erro ao processar imagens: ${error.message || "Erro desconhecido"}`)
//     } finally {
//       setUploadingPhotos(false)
//       e.target.value = null
//     }
//   }

//   const handleDeletePhoto = (photoId) => {
//     const photo = photos.find((p) => p.id === photoId)
//     if (!photo || !photo.id) {
//       toast.error("Não é possível excluir foto: ID inválido")
//       return
//     }
//     setConfirmationModal({
//       isOpen: true,
//       itemId: photo.id,
//       itemType: "photo",
//       title: "Excluir foto",
//       message: "Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.",
//       loading: false,
//     })
//     setPhotoActionMenu(null)
//   }

//   const handleDeleteVideo = (videoId) => {
//     setConfirmationModal({
//       isOpen: true,
//       itemId: videoId,
//       itemType: "video",
//       title: "Excluir vídeo",
//       message: "Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.",
//       loading: false,
//     })
//     setVideoActionMenu(null)
//   }

//   const confirmDelete = async () => {
//     const { itemId, itemType } = confirmationModal

//     if (!itemId) {
//       toast.error("Erro: ID do item não encontrado")
//       setConfirmationModal({
//         isOpen: false,
//         itemId: null,
//         itemType: null,
//         title: "",
//         message: "",
//         loading: false,
//       })
//       return
//     }

//     // Ativar loading
//     setConfirmationModal((prev) => ({ ...prev, loading: true }))

//     try {
//       if (itemType === "video") {
//         await deleteTalentVideo(talentId, itemId)
//         toast.success("Vídeo excluído com sucesso!")
//         await fetchTalentVideosList(talentId)
//       } else if (itemType === "photo") {
//         await deleteTalentPhoto(talentId, itemId)
//         toast.success("Foto excluída com sucesso!")
//         await fetchTalentPhotosList(talentId)
//       }
//     } catch (error) {
//       toast.error(`Erro ao excluir ${itemType}: ${error.message}`)
//     } finally {
//       // Fechar modal e desativar loading
//       setConfirmationModal({
//         isOpen: false,
//         itemId: null,
//         itemType: null,
//         title: "",
//         message: "",
//         loading: false,
//       })
//     }
//   }

//   const closeConfirmationModal = () =>
//     setConfirmationModal({
//       isOpen: false,
//       itemId: null,
//       itemType: null,
//       title: "",
//       message: "",
//       loading: false,
//     })

//   const fetchTalentVideosList = async (id) => {
//     if (activeSection !== "videos") return
//     setLoadingVideos(true)
//     try {
//       const data = await fetchTalentVideos(id)
//       const processedVideos = data.map((video, index) => ({
//         ...video,
//         url: video.video_url, // Usar video_url da API
//         uniqueKey: generateUniqueKey("video", video.id),
//       }))
//       setVideos(processedVideos || [])
//     } catch (error) {
//       toast.error(`Erro ao carregar vídeos: ${error.message}`)
//     } finally {
//       setLoadingVideos(false)
//     }
//   }

//   useEffect(() => {
//     if (isOpen && talentId && activeSection === "videos") {
//       fetchTalentVideosList(talentId)
//     }
//   }, [isOpen, talentId, activeSection])

//   // Validar URL de vídeo
//   const isValidVideoUrl = (url) => {
//     const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
//     const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/
//     const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/.+/
//     return youtubeRegex.test(url) || vimeoRegex.test(url) || instagramRegex.test(url)
//   }

//   // Adicionar nova URL de vídeo ao array
//   const addVideoUrlField = () => {
//     setVideoUrls([...videoUrls, ""])
//   }

//   // Remover URL de vídeo do array
//   const removeVideoUrlField = (index) => {
//     const newUrls = videoUrls.filter((_, i) => i !== index)
//     setVideoUrls(newUrls.length === 0 ? [""] : newUrls)
//   }

//   // Atualizar URL específica
//   const updateVideoUrl = (index, value) => {
//     const newUrls = [...videoUrls]
//     newUrls[index] = value
//     setVideoUrls(newUrls)
//   }

//   // Adicionar vídeos usando as URLs
//   const handleAddVideos = async () => {
//     const validUrls = videoUrls.filter((url) => url.trim() && isValidVideoUrl(url.trim()))

//     if (validUrls.length === 0) {
//       toast.error("Por favor, insira pelo menos uma URL válida de vídeo")
//       return
//     }

//     setUploadingVideos(true)
//     try {
//       await addTalentVideos(talentId, validUrls)
//       toast.success(`${validUrls.length} vídeo(s) adicionado(s) com sucesso!`)
//       setVideoUrls([""])
//       await fetchTalentVideosList(talentId)
//     } catch (error) {
//       toast.error(`Erro ao adicionar vídeos: ${error.message}`)
//     } finally {
//       setUploadingVideos(false)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target

//     let newValue = type === "checkbox" ? checked : value

//     // GARANTIR que category seja sempre STAGE
//     if (name === "category") {
//       newValue = "STAGE"
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }))

//     setFormTouched(true)

//     // Limpar erro específico do campo quando ele for alterado
//     if (formErrors[name]) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: null,
//       }))
//     }
//   }

//   const addInstrument = () => {
//     if (newInstrument.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         instruments: [...prev.instruments, newInstrument.trim()],
//       }))
//       setNewInstrument("")
//       setFormTouched(true)
//     }
//   }

//   const removeInstrument = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       instruments: prev.instruments.filter((_, i) => i !== index),
//     }))
//     setFormTouched(true)
//   }

//   const addLanguage = () => {
//     if (newLanguage.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         languages: [...prev.languages, newLanguage.trim()],
//       }))
//       setNewLanguage("")
//       setFormTouched(true)
//     }
//   }

//   const removeLanguage = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       languages: prev.languages.filter((_, i) => i !== index),
//     }))
//     setFormTouched(true)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     console.log("🚀 Iniciando processo de salvamento...")
//     console.log("📋 Dados do formulário antes da validação:", formData)

//     if (!validateForm()) {
//       console.log("❌ Validação falhou:", formErrors)
//       toast.error("Por favor, corrija os erros no formulário", {
//         icon: <AlertCircle className="text-red-500" />,
//       })
//       return
//     }

//     console.log("✅ Validação passou, iniciando salvamento...")
//     setSaving(true)

//     try {
//       // GARANTIR que category seja sempre STAGE no envio
//       const dataToSave = {
//         ...formData,
//         category: "STAGE", // FORÇAR STAGE
//       }

//       console.log("📤 Dados sendo enviados para a API:", dataToSave)
//       console.log("🎯 Categoria confirmada como:", dataToSave.category)

//       const updatedTalent = await updateTalent(talentId, dataToSave)

//       console.log("✅ Talento atualizado com sucesso:", updatedTalent)

//       toast.success("Talento atualizado com sucesso!", {
//         icon: <CheckCircle className="text-green-500" />,
//       })

//       if (notifyTalentUpdated) notifyTalentUpdated(updatedTalent)
//       if (onSave) onSave(updatedTalent)

//       setFormTouched(false)
//       onClose()
//     } catch (error) {
//       console.error("❌ Erro ao salvar:", error)
//       toast.error(`Erro ao atualizar talento: ${error.message}`, {
//         icon: <XCircle className="text-red-500" />,
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleShowTooltip = (id) => setShowTooltip((prev) => ({ ...prev, [id]: true }))
//   const handleHideTooltip = (id) => setShowTooltip((prev) => ({ ...prev, [id]: false }))

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
//       if (!validTypes.includes(file.type)) {
//         reject(new Error(`Tipo de arquivo não suportado: ${file.type}. Use JPEG, PNG, GIF ou WebP.`))
//         return
//       }
//       const reader = new FileReader()
//       reader.onloadend = () => resolve(reader.result)
//       reader.onerror = () => reject(new Error("Erro ao ler o arquivo. Tente novamente."))
//       reader.readAsDataURL(file)
//     })
//   }

//   const handleImageUpload = () => fileInputRef.current.click()

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       try {
//         const base64Image = await convertToBase64(file)
//         setFormData((prev) => ({
//           ...prev,
//           cover: base64Image,
//         }))
//         setFormTouched(true)
//         toast.success("Imagem de capa carregada com sucesso!")
//       } catch (error) {
//         toast.error(`Erro ao processar a imagem: ${error.message}`)
//       }
//     }
//   }

//   const validateForm = () => {
//     const errors = {}

//     if (!formData.tipo_talento || !formData.tipo_talento.trim()) {
//       errors.tipo_talento = "Tipo de talento é obrigatório"
//     }

//     if (!formData.birth_date) {
//       errors.birth_date = "Data de nascimento é obrigatória"
//     }

//     // NÃO validar categoria - ela é sempre STAGE
//     console.log("🔍 Validação - categoria atual:", formData.category)
//     console.log("🔍 Erros encontrados:", errors)

//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const formatDateForInput = (dateString) => (dateString ? new Date(dateString).toISOString().split("T")[0] : "")

//   if (!isOpen) return null

//   const renderBasicInfoSection = () => (
//     <ModalSection activeSection={activeSection} sectionKey="basic">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label
//             htmlFor="name"
//             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
//           >
//             Nome (Somente Leitura)
//             <div
//               className="relative ml-1.5"
//               onMouseEnter={() => handleShowTooltip("name")}
//               onMouseLeave={() => handleHideTooltip("name")}
//             >
//               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
//               {showTooltip.name && (
//                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                   Nome do talento (não pode ser editado)
//                 </div>
//               )}
//             </div>
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//               <User className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//             </div>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               readOnly
//               className={`pl-10 block w-full rounded-lg border ${
//                 formErrors.name
//                   ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
//                   : "border-gray-200 dark:border-gray-700 focus:ring-gray-400 focus:border-gray-400"
//               } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed transition-all`}
//               placeholder="Nome completo"
//             />
//             <AnimatePresence>
//               {formErrors.name && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
//                 >
//                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
//                   {formErrors.name}
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor="tipo_talento"
//             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
//           >
//             Tipo de Talento <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
//             <div
//               className="relative ml-1.5"
//               onMouseEnter={() => handleShowTooltip("tipo_talento")}
//               onMouseLeave={() => handleHideTooltip("tipo_talento")}
//             >
//               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
//               {showTooltip.tipo_talento && (
//                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                   Selecione se é Ator ou Atriz
//                 </div>
//               )}
//             </div>
//           </label>
//           <div className="relative group">
//             <select
//               id="tipo_talento"
//               name="tipo_talento"
//               value={formData.tipo_talento}
//               onChange={handleInputChange}
//               className={`block w-full rounded-lg border ${
//                 formErrors.tipo_talento
//                   ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
//                   : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
//               } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none pr-10 transition-all`}
//             >
//               <option value="">Selecione o tipo</option>
//               <option value="Ator">Ator</option>
//               <option value="Atriz">Atriz</option>
//             </select>
//             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//               <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//             </div>
//             <AnimatePresence>
//               {formErrors.tipo_talento && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
//                 >
//                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
//                   {formErrors.tipo_talento}
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label
//             htmlFor="birth_date"
//             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
//           >
//             Data de Nascimento <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
//             <div
//               className="relative ml-1.5"
//               onMouseEnter={() => handleShowTooltip("birth_date")}
//               onMouseLeave={() => handleHideTooltip("birth_date")}
//             >
//               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
//               {showTooltip.birth_date && (
//                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                   Data de nascimento para cálculo de idade
//                 </div>
//               )}
//             </div>
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//               <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//             </div>
//             <input
//               type="date"
//               id="birth_date"
//               name="birth_date"
//               value={formData.birth_date}
//               onChange={handleInputChange}
//               className={`pl-10 block w-full rounded-lg border ${
//                 formErrors.birth_date
//                   ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
//                   : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
//               } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
//             />
//             <AnimatePresence>
//               {formErrors.birth_date && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
//                 >
//                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
//                   {formErrors.birth_date}
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Campo de Categoria - Apenas informativo */}
//         <div>
//           <label
//             htmlFor="category"
//             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
//           >
//             Categoria
//             <div
//               className="relative ml-1.5"
//               onMouseEnter={() => handleShowTooltip("category")}
//               onMouseLeave={() => handleHideTooltip("category")}
//             >
//               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
//               {showTooltip.category && (
//                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                   Categoria fixa para todos os talentos: STAGE
//                 </div>
//               )}
//             </div>
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//               <Briefcase className="h-4 w-4 text-green-500" />
//             </div>
//             <div className="pl-10 block w-full rounded-lg border border-green-200 dark:border-green-700 shadow-sm sm:text-sm p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 font-medium">
//               STAGE
//             </div>
//             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//               <Check className="h-4 w-4 text-green-500" />
//             </div>
//           </div>
//           <p className="mt-1 text-xs text-green-600 dark:text-green-400">
//             ✅ Categoria definida automaticamente como STAGE
//           </p>
//         </div>
//       </div>

//       <div>
//         <label
//           htmlFor="instagram"
//           className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
//         >
//           Instagram
//           <div
//             className="relative ml-1.5"
//             onMouseEnter={() => handleShowTooltip("instagram")}
//             onMouseLeave={() => handleHideTooltip("instagram")}
//           >
//             <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
//             {showTooltip.instagram && (
//               <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                 Perfil do Instagram (@ será adicionado automaticamente)
//               </div>
//             )}
//           </div>
//         </label>
//         <div className="relative group">
//           <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//             <Instagram className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//           </div>
//           <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
//             <span className="text-gray-500 dark:text-gray-400 font-medium">@</span>
//           </div>
//           <input
//             type="text"
//             id="instagram"
//             name="instagram"
//             value={formData.instagram.startsWith("@") ? formData.instagram.slice(1) : formData.instagram}
//             onChange={(e) => {
//               const value = e.target.value
//               const cleanValue = value.replace(/^@+/, "")
//               const finalValue = "@" + cleanValue
//               setFormData((prev) => ({
//                 ...prev,
//                 instagram: finalValue,
//               }))
//               setFormTouched(true)
//               if (formErrors.instagram) {
//                 setFormErrors((prev) => ({
//                   ...prev,
//                   instagram: null,
//                 }))
//               }
//             }}
//             className={`pl-14 block w-full rounded-lg border ${
//               formErrors.instagram
//                 ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
//                 : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
//             } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
//             placeholder="usuario"
//           />
//           <AnimatePresence>
//             {formErrors.instagram && (
//               <motion.p
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
//               >
//                 <AlertCircle className="h-3.5 w-3.5 mr-1" />
//                 {formErrors.instagram}
//               </motion.p>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       <motion.div
//         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30"
//         whileHover={{ y: -2 }}
//       >
//         <div className="flex items-center justify-between mb-3">
//           <label
//             htmlFor="cover"
//             className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center"
//           >
//             <Camera className="h-4 w-4 mr-1.5 text-pink-500 dark:text-pink-400" />
//             Imagem de Perfil
//           </label>
//           <motion.button
//             type="button"
//             onClick={handleImageUpload}
//             className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-800/40 transition-colors"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Upload className="h-3.5 w-3.5 mr-1" />
//             Upload
//           </motion.button>
//           <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
//         </div>
//         <div className="relative group">
//           <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//             <ImageIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//           </div>
//           <input
//             type="text"
//             id="cover"
//             name="cover"
//             value={formData.cover || ""}
//             onChange={handleInputChange}
//             className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
//             placeholder="https://exemplo.com/imagem.jpg"
//           />
//         </div>
//         {formData.cover && (
//           <div className="mt-4">
//             <motion.div
//               className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group cursor-pointer shadow-md"
//               onMouseEnter={() => setImagePreviewHover(true)}
//               onMouseLeave={() => setImagePreviewHover(false)}
//               whileHover={{ scale: 1.02 }}
//             >
//               <img
//                 src={formData.cover || "/placeholder.svg"}
//                 alt="Prévia"
//                 className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
//                 onError={(e) => {
//                   e.target.onerror = null
//                   e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23a0a0a0" textAnchor="middle" dy=".3em">Imagem não disponível</text></svg>`
//                 }}
//               />
//               <AnimatePresence>
//                 {imagePreviewHover && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center"
//                   >
//                     <div className="text-white text-sm font-medium px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg">
//                       <Camera className="h-4 w-4 inline-block mr-2" />
//                       Visualizar imagem
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//             <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
//               Esta imagem será exibida no perfil do talento e nas listagens
//             </p>
//           </div>
//         )}
//       </motion.div>

//       {/* Campo oculto para garantir que category seja sempre STAGE */}
//       <input type="hidden" name="category" value="STAGE" />
//     </ModalSection>
//   )

//   const renderCharacteristicsSection = () => (
//     <ModalSection activeSection={activeSection} sectionKey="characteristics">
//       <motion.div
//         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
//         whileHover={{ y: -2 }}
//       >
//         <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
//           <User className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
//           Características Físicas
//         </h4>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
//               Altura
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                 <Ruler className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 id="height"
//                 name="height"
//                 value={formData.height}
//                 onChange={handleInputChange}
//                 className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
//                 placeholder="170 cm"
//               />
//             </div>
//           </div>
//           <div>
//             <label htmlFor="eye_color" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
//               Cor dos Olhos
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                 <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 id="eye_color"
//                 name="eye_color"
//                 value={formData.eye_color}
//                 onChange={handleInputChange}
//                 className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
//                 placeholder="Castanhos"
//               />
//             </div>
//           </div>
//           <div>
//             <label htmlFor="hair_color" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
//               Cor do Cabelo
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                 <Palette className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 id="hair_color"
//                 name="hair_color"
//                 value={formData.hair_color}
//                 onChange={handleInputChange}
//                 className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
//                 placeholder="Castanho"
//               />
//             </div>
//           </div>
//         </div>
//       </motion.div>
//       <motion.div
//         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
//         whileHover={{ y: -2 }}
//       >
//         <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
//           <Music className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
//           Habilidades Musicais
//         </h4>
//         <div className="flex items-center mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-700 transition-colors">
//           <input
//             type="checkbox"
//             id="can_sing"
//             name="can_sing"
//             checked={formData.can_sing}
//             onChange={handleInputChange}
//             className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
//           />
//           <label htmlFor="can_sing" className="ml-2 block text-sm text-gray-700 dark:text-gray-200 flex items-center">
//             <Mic className="h-4 w-4 mr-1.5 text-pink-500 dark:text-pink-400" />
//             Canta
//           </label>
//         </div>
//         <div>
//           <label htmlFor="new-instrument" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//             Instrumentos
//           </label>
//           <div className="flex">
//             <input
//               type="text"
//               id="new-instrument"
//               value={newInstrument}
//               onChange={(e) => setNewInstrument(e.target.value)}
//               className="block w-full rounded-l-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
//               placeholder="Adicionar instrumento"
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault()
//                   addInstrument()
//                 }
//               }}
//             />
//             <motion.button
//               type="button"
//               onClick={addInstrument}
//               className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-r-lg hover:from-pink-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Plus className="h-5 w-5" />
//             </motion.button>
//           </div>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {formData.instruments.length === 0 ? (
//               <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum instrumento adicionado</p>
//             ) : (
//               formData.instruments.map((instrument, index) => (
//                 <motion.div
//                   key={`instrument-${index}-${instrument}`}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all"
//                 >
//                   <Music className="h-3.5 w-3.5 mr-1.5 text-pink-500 dark:text-pink-400" />
//                   {instrument}
//                   <button
//                     type="button"
//                     onClick={() => removeInstrument(index)}
//                     className="ml-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
//                   >
//                     <X className="h-3.5 w-3.5" />
//                   </button>
//                 </motion.div>
//               ))
//             )}
//           </div>
//         </div>
//       </motion.div>
//       <motion.div
//         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
//         whileHover={{ y: -2 }}
//       >
//         <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
//           <Languages className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
//           Idiomas
//         </h4>
//         <div className="flex">
//           <input
//             type="text"
//             id="new-language"
//             value={newLanguage}
//             onChange={(e) => setNewLanguage(e.target.value)}
//             className="block w-full rounded-l-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
//             placeholder="Adicionar idioma"
//             onKeyPress={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault()
//                 addLanguage()
//               }
//             }}
//           />
//           <motion.button
//             type="button"
//             onClick={addLanguage}
//             className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-r-lg hover:from-pink-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Plus className="h-5 w-5" />
//           </motion.button>
//         </div>
//         <div className="mt-3 flex flex-wrap gap-2">
//           {formData.languages.length === 0 ? (
//             <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum idioma adicionado</p>
//           ) : (
//             formData.languages.map((language, index) => (
//               <motion.div
//                 key={`language-${index}-${language}`}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all"
//               >
//                 <Globe className="h-3.5 w-3.5 mr-1.5 text-pink-500 dark:text-pink-400" />
//                 {language}
//                 <button
//                   type="button"
//                   onClick={() => removeLanguage(index)}
//                   className="ml-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
//                 >
//                   <X className="h-3.5 w-3.5" />
//                 </button>
//               </motion.div>
//             ))
//           )}
//         </div>
//       </motion.div>
//     </ModalSection>
//   )

//   const renderStatusSection = () => (
//     <ModalSection activeSection={activeSection} sectionKey="status">
//       <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
//         <h4 className="text-base uppercase tracking-wider text-pink-400 font-medium mb-5 pb-2 border-b border-gray-800 flex items-center">
//           <FileText className="h-5 w-5 mr-2 text-pink-400" />
//           Status do Talento
//         </h4>
//         <div className="space-y-4">
//           <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
//             <div className="flex items-center">
//               <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
//                 <input
//                   type="checkbox"
//                   id="ativo"
//                   name="ativo"
//                   checked={formData.ativo}
//                   onChange={handleInputChange}
//                   className="sr-only peer"
//                 />
//                 <Check className={`h-4 w-4 text-green-400 ${!formData.ativo && "opacity-0"}`} />
//               </div>
//               <label htmlFor="ativo" className="flex items-center cursor-pointer">
//                 <span className="text-white font-medium">Ativo no sistema</span>
//                 <span className="ml-2 text-sm text-gray-400">
//                   (Talentos inativos não aparecem nas listagens públicas)
//                 </span>
//               </label>
//             </div>
//           </div>
//           <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
//             <div className="flex items-center">
//               <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
//                 <input
//                   type="checkbox"
//                   id="disponivel"
//                   name="disponivel"
//                   checked={formData.disponivel}
//                   onChange={handleInputChange}
//                   className="sr-only peer"
//                 />
//                 <Clock className={`h-4 w-4 text-amber-400 ${!formData.disponivel && "opacity-0"}`} />
//               </div>
//               <label htmlFor="disponivel" className="flex items-center cursor-pointer">
//                 <span className="text-white font-medium">Disponível para trabalhos</span>
//                 <span className="ml-2 text-sm text-gray-400">
//                   (Indica se o talento está disponível para contratação)
//                 </span>
//               </label>
//             </div>
//           </div>
//           <AnimatePresence>
//             {!formData.disponivel && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="ml-9 mt-1"
//               >
//                 <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
//                   <label htmlFor="data_disponibilidade" className="block text-amber-300 font-medium mb-2">
//                     Disponível a partir de:
//                   </label>
//                   <div className="relative">
//                     <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
//                       <div className="flex items-center justify-center pl-4 pr-2">
//                         <Calendar className="h-5 w-5 text-amber-400 flex-shrink-0" />
//                       </div>
//                       <input
//                         type="date"
//                         id="data_disponibilidade"
//                         name="data_disponibilidade"
//                         value={formData.data_disponibilidade}
//                         onChange={handleInputChange}
//                         className="block w-full py-3 px-2 bg-gray-800 text-white border-0 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 focus:outline-none"
//                       />
//                     </div>
//                     <p className="mt-2 text-xs text-amber-300/80">
//                       Esta data será exibida para indicar quando o talento estará disponível novamente.
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
//             <div className="flex items-center">
//               <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
//                 <input
//                   type="checkbox"
//                   id="destaque"
//                   name="destaque"
//                   checked={formData.destaque}
//                   onChange={handleInputChange}
//                   className="sr-only peer"
//                 />
//                 <Sparkles className={`h-4 w-4 text-yellow-400 ${!formData.destaque && "opacity-0"}`} />
//               </div>
//               <label htmlFor="destaque" className="flex items-center cursor-pointer">
//                 <span className="text-white font-medium">Destacar talento</span>
//                 <span className="ml-2 text-sm text-gray-400">(Talentos destacados aparecem em seções especiais)</span>
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ModalSection>
//   )

//   const renderPhotosSection = () => (
//     <ModalSection activeSection={activeSection} sectionKey="photos">
//       <PhotoUploadArea
//         talentId={talentId}
//         uploadingPhotos={uploadingPhotos}
//         onPhotoSelection={handlePhotoSelection}
//         onPhotoDrop={handlePhotoDrop}
//       />
//       <PhotoGallery
//         photos={photos}
//         loadingPhotos={loadingPhotos}
//         onDeletePhoto={handleDeletePhoto}
//         onToggleActionMenu={setPhotoActionMenu}
//         photoActionMenu={photoActionMenu}
//       />
//     </ModalSection>
//   )

//   const renderVideosSection = () => (
//     <ModalSection activeSection={activeSection} sectionKey="videos">
//       {/* Área única para adicionar vídeos por URL */}
//       <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
//         <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-700">
//           <h4 className="text-lg font-medium text-purple-400 flex items-center">
//             <Video className="h-5 w-5 mr-2" />
//             Adicionar Vídeos
//           </h4>
//           <span className="text-sm text-gray-400">
//             {videos.length} vídeo{videos.length !== 1 ? "s" : ""} adicionado{videos.length !== 1 ? "s" : ""}
//           </span>
//         </div>

//         {/* Campos de URL */}
//         <div className="space-y-4 mb-6">
//           <p className="text-gray-300 text-sm mb-4">Adicione URLs de vídeos do YouTube, Vimeo ou Instagram:</p>

//           {videoUrls.map((url, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex gap-2"
//             >
//               <div className="flex-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Link className="h-4 w-4 text-gray-400" />
//                 </div>
//                 <input
//                   type="url"
//                   value={url}
//                   onChange={(e) => updateVideoUrl(index, e.target.value)}
//                   placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
//                   className={`pl-10 block w-full rounded-lg border ${
//                     url && !isValidVideoUrl(url)
//                       ? "border-red-500 focus:ring-red-500 focus:border-red-500"
//                       : "border-gray-600 focus:ring-purple-500 focus:border-purple-500"
//                   } bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 transition-all`}
//                 />
//                 {url && !isValidVideoUrl(url) && (
//                   <p className="mt-1 text-xs text-red-400">URL inválida. Use YouTube, Vimeo ou Instagram.</p>
//                 )}
//               </div>

//               {videoUrls.length > 1 && (
//                 <motion.button
//                   type="button"
//                   onClick={() => removeVideoUrlField(index)}
//                   className="px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <X className="h-4 w-4" />
//                 </motion.button>
//               )}
//             </motion.div>
//           ))}
//         </div>

//         {/* Botões de ação */}
//         <div className="flex gap-3">
//           <motion.button
//             type="button"
//             onClick={addVideoUrlField}
//             className="px-4 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded-lg transition-colors flex items-center gap-2"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <Plus className="h-4 w-4" />
//             Adicionar mais URL
//           </motion.button>

//           <motion.button
//             type="button"
//             onClick={handleAddVideos}
//             disabled={uploadingVideos || videoUrls.every((url) => !url.trim())}
//             className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center gap-2 ${
//               uploadingVideos || videoUrls.every((url) => !url.trim()) ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             whileHover={!uploadingVideos ? { scale: 1.02 } : {}}
//             whileTap={!uploadingVideos ? { scale: 0.98 } : {}}
//           >
//             {uploadingVideos ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Adicionando...
//               </>
//             ) : (
//               <>
//                 <Upload className="h-4 w-4" />
//                 Adicionar Vídeos
//               </>
//             )}
//           </motion.button>
//         </div>
//       </div>

//       {/* Lista de vídeos existentes */}
//       <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
//         <h4 className="text-lg font-medium text-purple-400 mb-4 flex items-center">
//           <Images className="h-5 w-5 mr-2" />
//           Vídeos do Talento
//         </h4>

//         {loadingVideos ? (
//           <div className="flex justify-center py-8">
//             <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
//           </div>
//         ) : videos.length === 0 ? (
//           <div className="text-center py-8">
//             <Video className="h-12 w-12 text-gray-600 mx-auto mb-3" />
//             <p className="text-gray-400">Nenhum vídeo adicionado ainda</p>
//             <p className="text-gray-500 text-sm">Use o formulário acima para adicionar vídeos</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {videos.map((video) => (
//               <motion.div
//                 key={video.uniqueKey}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="relative group bg-gray-800 rounded-lg overflow-hidden"
//               >
//                 <div className="aspect-video bg-gray-700">
//                   <iframe
//                     src={
//                       video.url?.includes("youtube") || video.url?.includes("youtu.be")
//                         ? video.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
//                         : video.url?.includes("vimeo")
//                           ? video.url.replace("vimeo.com/", "player.vimeo.com/video/")
//                           : video.url?.includes("instagram")
//                             ? video.url + "/embed"
//                             : ""
//                     }
//                     title={`Vídeo ${video.id}`}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     className="w-full h-full"
//                   />
//                 </div>

//                 {/* Overlay com ações */}
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
//                   <div className="opacity-0 group-hover:opacity-100 flex gap-2">
//                     <motion.button
//                       onClick={() => window.open(video.url, "_blank")}
//                       className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-800 transition-colors"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       title="Abrir em nova aba"
//                     >
//                       <ExternalLink className="h-4 w-4" />
//                     </motion.button>

//                     <motion.button
//                       onClick={() =>
//                         navigator.clipboard
//                           .writeText(video.url)
//                           .then(() => toast.success("URL copiada!"))
//                           .catch(() => toast.error("Erro ao copiar URL"))
//                       }
//                       className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-800 transition-colors"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       title="Copiar URL"
//                     >
//                       <Copy className="h-4 w-4" />
//                     </motion.button>

//                     <motion.button
//                       onClick={() => handleDeleteVideo(video.id)}
//                       className="p-2 bg-red-500/90 rounded-full hover:bg-red-500 text-white transition-colors"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       title="Excluir vídeo"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </ModalSection>
//   )

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ y: 50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: 50, opacity: 0 }}
//             className="edit-talent-modal-container bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-white">Editar Talento</h2>
//               <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             {error && (
//               <div className="mb-4 p-3 bg-red-900/30 rounded-lg border border-red-500 text-red-200 text-sm">
//                 {error}
//               </div>
//             )}
//             {loading ? (
//               <div className="flex justify-center">
//                 <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
//               </div>
//             ) : (
//               <>
//                 <div className="space-y-6">
//                   <div className="flex space-x-4">
//                     {["basic", "characteristics", "status", "photos", "videos"].map((section) => (
//                       <button
//                         key={section}
//                         onClick={() => setActiveSection(section)}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                           activeSection === section
//                             ? "bg-pink-500 text-white"
//                             : "bg-gray-800 text-gray-300 hover:bg-gray-700"
//                         }`}
//                       >
//                         {section.charAt(0).toUpperCase() + section.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                   {activeSection === "basic" && renderBasicInfoSection()}
//                   {activeSection === "characteristics" && renderCharacteristicsSection()}
//                   {activeSection === "status" && renderStatusSection()}
//                   {activeSection === "photos" && renderPhotosSection()}
//                   {activeSection === "videos" && renderVideosSection()}
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-4">
//                   <motion.button
//                     onClick={onClose}
//                     className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Cancelar
//                   </motion.button>
//                   <motion.button
//                     onClick={handleSubmit}
//                     disabled={!formTouched || saving}
//                     className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors ${
//                       !formTouched || saving ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                     whileHover={!formTouched || saving ? {} : { scale: 1.05 }}
//                     whileTap={!formTouched || saving ? {} : { scale: 0.95 }}
//                   >
//                     {saving ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
//                         Salvando...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="h-4 w-4 mr-2 inline" />
//                         Salvar Alterações
//                       </>
//                     )}
//                   </motion.button>
//                 </div>
//               </>
//             )}
//           </motion.div>
//         </motion.div>
//       )}
//       {confirmationModal.isOpen && (
//         <ConfirmationModal
//           isOpen={confirmationModal.isOpen}
//           onClose={closeConfirmationModal}
//           onConfirm={confirmDelete}
//           title={confirmationModal.title}
//           message={confirmationModal.message}
//           loading={confirmationModal.loading} // NOVO: passar o estado de loading
//         />
//       )}
//     </AnimatePresence>
//   )
// }










"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Calendar,
  Ruler,
  Eye,
  Music,
  Globe,
  Instagram,
  ImageIcon,
  User,
  AlertCircle,
  Plus,
  Palette,
  Check,
  Clock,
  ChevronDown,
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  Languages,
  FileText,
  Mic,
  Briefcase,
  Save,
  Loader2,
  Trash2,
  Images,
  ExternalLink,
  Video,
  Film,
} from "lucide-react"
import { useTalent } from "../contexts/talents-context"
import ConfirmationModal from "./ConfirmationModal"
import PhotoGallery from "./PhotoGalery"
import ModalSection from "./ModalSection"
import PhotoUploadArea from "./PhotoUploadArea"

export default function EditTalentModal({ isOpen, onClose, talentId, onSave }) {
  const {
    fetchTalentById,
    updateTalent,
    addTalentPhotos,
    fetchTalentPhotos,
    deleteTalentPhoto,
    addTalentVideos,
    fetchTalentVideos,
    deleteTalentVideo,
  } = useTalent()

  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const { notifyTalentUpdated } = useTalent() || {}
  const modalRef = useRef(null)
  const [activeSection, setActiveSection] = useState("basic")
  const [formTouched, setFormTouched] = useState(false)
  const [imagePreviewHover, setImagePreviewHover] = useState(false)
  const [showTooltip, setShowTooltip] = useState({})
  const fileInputRef = useRef(null)
  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null) // Novo ref para input de vídeos

  // SEMPRE inicializar com STAGE
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    height: "",
    eye_color: "",
    hair_color: "",
    can_sing: false,
    instruments: [],
    languages: [],
    ativo: true,
    disponivel: true,
    data_disponibilidade: "",
    destaque: false,
    category: "STAGE", // SEMPRE STAGE
    instagram: "@",
    tipo_talento: "", // CORRIGIDO: Deixar vazio inicialmente
    cover: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [newInstrument, setNewInstrument] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [photos, setPhotos] = useState([])
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [photoActionMenu, setPhotoActionMenu] = useState(null)
  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [uploadingVideos, setUploadingVideos] = useState(false)
  const [videoActionMenu, setVideoActionMenu] = useState(null)

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: null,
    title: "",
    message: "",
    loading: false,
  })
  const [keyCounter, setKeyCounter] = useState(0)
  const [imagePreviewUrls, setImagePreviewUrls] = useState({})

  const generateUniqueKey = (prefix, id) => {
    const counter = keyCounter
    setKeyCounter((prev) => prev + 1)
    return `${prefix}-${id || "temp"}-${Date.now()}-${counter}`
  }

  // Reset completo do estado quando o modal abre/fecha ou muda de talento
  useEffect(() => {
    if (isOpen && talentId) {
      console.log("🔄 Abrindo modal para talento:", talentId)
      // Reset completo de todos os estados
      setPhotos([])
      setImagePreviewUrls({})
      setLoadingPhotos(false)
      setUploadingPhotos(false)
      setPhotoActionMenu(null)
      setVideos([])
      setLoadingVideos(false)
      setUploadingVideos(false)
      setVideoActionMenu(null)
      setActiveSection("basic")
      setFormTouched(false)
      setFormErrors({}) // Reset dos erros
      setError(null) // Reset do erro geral
      // Reset do formData para valores padrão - SEMPRE COM STAGE
      setFormData({
        name: "",
        birth_date: "",
        height: "",
        eye_color: "",
        hair_color: "",
        can_sing: false,
        instruments: [],
        languages: [],
        ativo: true,
        disponivel: true,
        data_disponibilidade: "",
        destaque: false,
        category: "STAGE", // SEMPRE STAGE
        instagram: "@",
        tipo_talento: "", // CORRIGIDO: Deixar vazio inicialmente
        cover: "",
      })
      // Buscar dados do talento
      fetchTalentDetails(talentId)
    } else if (!isOpen) {
      // Reset quando fecha o modal
      setFormTouched(false)
      setFormErrors({})
      setError(null)
    }
  }, [isOpen, talentId])

  useEffect(() => {
    return () => Object.values(imagePreviewUrls).forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const fetchTalentDetails = async (id) => {
    setLoading(true)
    setError(null)
    try {
      if (!id) throw new Error("ID do talento inválido")
      const data = await fetchTalentById(id)
      if (!data) throw new Error("Nenhum dado retornado para o talento")
      console.log("📥 Dados do talento carregados:", data)
      console.log("🎭 Tipo de talento da API:", data.tipo_talento)
      setTalent(data)
      // SEMPRE forçar categoria como STAGE, independente do que vem da API
      const newFormData = {
        name: data.name || "",
        birth_date: data.birth_date ? formatDateForInput(data.birth_date) : "",
        height: data.height || "",
        eye_color: data.eye_color || "",
        hair_color: data.hair_color || "",
        can_sing: data.can_sing || false,
        instruments: data.instruments || [],
        languages: data.languages || [],
        ativo: data.ativo !== undefined ? data.ativo : true,
        disponivel: data.disponivel !== undefined ? data.disponivel : true,
        data_disponibilidade: data.data_disponibilidade ? formatDateForInput(data.data_disponibilidade) : "",
        destaque: data.destaque || false,
        category: "STAGE", // SEMPRE STAGE, NUNCA usar o que vem da API
        instagram: data.instagram ? (data.instagram.startsWith("@") ? data.instagram : "@" + data.instagram) : "@",
        tipo_talento: data.tipo_talento || "", // CORRIGIDO: Usar valor da API ou vazio
        cover: data.cover || "",
      }
      console.log("📝 FormData configurado:", {
        name: newFormData.name,
        category: newFormData.category,
        tipo_talento: newFormData.tipo_talento,
      })
      console.log("🎭 Tipo de talento no formData:", newFormData.tipo_talento)
      setFormData(newFormData)
    } catch (error) {
      console.error("❌ Erro ao carregar talento:", error)
      setError(error.message || "Erro ao carregar detalhes do talento")
      toast.error(`Erro ao carregar detalhes: ${error.message || "Dados não encontrados"}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchTalentPhotosList = async (id) => {
    if (activeSection !== "photos") return
    setLoadingPhotos(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}/photos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error(`Erro ao buscar fotos do talento: ${response.status}`)
      const data = await response.json()
      console.log("Dados recebidos da API para fotos:", data)
      const processedPhotos = data.map((photo, index) => ({
        ...photo,
        url: photo.image_url || "/placeholder.svg",
        uniqueKey: generateUniqueKey("photo", photo.id),
      }))
      setPhotos(processedPhotos || [])
      console.log("Fotos processadas e atualizadas no estado:", processedPhotos)
    } catch (error) {
      console.error("Erro ao buscar fotos do talento:", error)
      toast.error(`Erro ao carregar fotos: ${error.message}`)
    } finally {
      setLoadingPhotos(false)
    }
  }

  useEffect(() => {
    if (isOpen && talentId && activeSection === "photos") {
      fetchTalentPhotosList(talentId)
    }
  }, [isOpen, talentId, activeSection])

  const handlePhotoDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const dropArea = document.getElementById("photo-drop-area")
    if (dropArea) dropArea.classList.remove("bg-pink-900/30", "border-pink-500/50")
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    if (files.length === 0) {
      toast.error("Por favor, arraste apenas arquivos de imagem")
      return
    }
    if (!talentId) {
      toast.error("ID do talento não encontrado. Não é possível adicionar fotos.")
      return
    }
    setUploadingPhotos(true)
    try {
      toast.info(`Enviando ${files.length} imagem(ns)...`, { autoClose: false, toastId: "processing-drop" })
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))
      formData.append("release", "false")
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Erro no upload: ${response.status}`)
      }
      const data = await response.json()
      toast.success(`${files.length} foto(s) adicionada(s) com sucesso!`)
      await fetchTalentPhotosList(talentId)
    } catch (error) {
      toast.error(`Erro ao processar imagens: ${error.message || "Erro desconhecido"}`)
    } finally {
      setUploadingPhotos(false)
    }
  }

  const handlePhotoSelection = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    if (!talentId) {
      toast.error("ID do talento não encontrado. Não é possível adicionar fotos.")
      return
    }
    setUploadingPhotos(true)
    try {
      toast.info(`Enviando ${files.length} imagem(ns)...`, { autoClose: false, toastId: "processing" })
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))
      formData.append("release", "false")
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")
      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Erro no upload: ${response.status}`)
      }
      const data = await response.json()
      toast.success(`${files.length} foto(s) adicionada(s) com sucesso!`)
      await fetchTalentPhotosList(talentId)
    } catch (error) {
      toast.error(`Erro ao processar imagens: ${error.message || "Erro desconhecido"}`)
    } finally {
      setUploadingPhotos(false)
      e.target.value = null
    }
  }

  const handleDeletePhoto = (photoId) => {
    const photo = photos.find((p) => p.id === photoId)
    if (!photo || !photo.id) {
      toast.error("Não é possível excluir foto: ID inválido")
      return
    }
    setConfirmationModal({
      isOpen: true,
      itemId: photo.id,
      itemType: "photo",
      title: "Excluir foto",
      message: "Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.",
      loading: false,
    })
    setPhotoActionMenu(null)
  }

  const handleDeleteVideo = (videoId) => {
    setConfirmationModal({
      isOpen: true,
      itemId: videoId,
      itemType: "video",
      title: "Excluir vídeo",
      message: "Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.",
      loading: false,
    })
    setVideoActionMenu(null)
  }

  const confirmDelete = async () => {
    const { itemId, itemType } = confirmationModal
    if (!itemId) {
      toast.error("Erro: ID do item não encontrado")
      setConfirmationModal({
        isOpen: false,
        itemId: null,
        itemType: null,
        title: "",
        message: "",
        loading: false,
      })
      return
    }
    // Ativar loading
    setConfirmationModal((prev) => ({ ...prev, loading: true }))
    try {
      if (itemType === "video") {
        await deleteTalentVideo(talentId, itemId)
        toast.success("Vídeo excluído com sucesso!")
        await fetchTalentVideosList(talentId)
      } else if (itemType === "photo") {
        await deleteTalentPhoto(talentId, itemId)
        toast.success("Foto excluída com sucesso!")
        await fetchTalentPhotosList(talentId)
      }
    } catch (error) {
      toast.error(`Erro ao excluir ${itemType}: ${error.message}`)
    } finally {
      // Fechar modal e desativar loading
      setConfirmationModal({
        isOpen: false,
        itemId: null,
        itemType: null,
        title: "",
        message: "",
        loading: false,
      })
    }
  }

  const closeConfirmationModal = () =>
    setConfirmationModal({
      isOpen: false,
      itemId: null,
      itemType: null,
      title: "",
      message: "",
      loading: false,
    })

  const fetchTalentVideosList = async (id) => {
    if (activeSection !== "videos") return
    setLoadingVideos(true)
    try {
      const data = await fetchTalentVideos(id)
      const processedVideos = data.map((video, index) => ({
        ...video,
        url: video.video_url, // Usar video_url da API
        uniqueKey: generateUniqueKey("video", video.id),
      }))
      setVideos(processedVideos || [])
    } catch (error) {
      toast.error(`Erro ao carregar vídeos: ${error.message}`)
    } finally {
      setLoadingVideos(false)
    }
  }

  useEffect(() => {
    if (isOpen && talentId && activeSection === "videos") {
      fetchTalentVideosList(talentId)
    }
  }, [isOpen, talentId, activeSection])

  // Função para validar arquivos de vídeo
  const isValidVideoFile = (file) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/avi"]
    return validTypes.includes(file.type)
  }

  // Função para lidar com drag and drop de vídeos
  const handleVideoDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const dropArea = document.getElementById("video-drop-area")
    if (dropArea) dropArea.classList.remove("bg-purple-900/30", "border-purple-500/50")

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return

    const files = Array.from(e.dataTransfer.files).filter((file) => isValidVideoFile(file))

    if (files.length === 0) {
      toast.error("Por favor, arraste apenas arquivos de vídeo válidos (MP4, MOV, AVI)")
      return
    }

    if (!talentId) {
      toast.error("ID do talento não encontrado. Não é possível adicionar vídeos.")
      return
    }

    await handleVideoUpload(files)
  }

  // Função para lidar com seleção de vídeos
  const handleVideoSelection = async (e) => {
    const files = Array.from(e.target.files).filter((file) => isValidVideoFile(file))

    if (files.length === 0) {
      toast.error("Por favor, selecione apenas arquivos de vídeo válidos (MP4, MOV, AVI)")
      return
    }

    if (!talentId) {
      toast.error("ID do talento não encontrado. Não é possível adicionar vídeos.")
      return
    }

    await handleVideoUpload(files)
    e.target.value = null
  }

  // Função para fazer upload dos vídeos
  const handleVideoUpload = async (files) => {
    setUploadingVideos(true)
    try {
      toast.info(`Enviando ${files.length} vídeo(s)...`, { autoClose: false, toastId: "processing-videos" })

      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))

      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Erro no upload: ${response.status}`)
      }

      const data = await response.json()
      toast.success(`${files.length} vídeo(s) adicionado(s) com sucesso!`)
      await fetchTalentVideosList(talentId)
    } catch (error) {
      toast.error(`Erro ao processar vídeos: ${error.message || "Erro desconhecido"}`)
    } finally {
      setUploadingVideos(false)
      toast.dismiss("processing-videos")
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = type === "checkbox" ? checked : value
    // GARANTIR que category seja sempre STAGE
    if (name === "category") {
      newValue = "STAGE"
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))
    setFormTouched(true)
    // Limpar erro específico do campo quando ele for alterado
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const addInstrument = () => {
    if (newInstrument.trim()) {
      setFormData((prev) => ({
        ...prev,
        instruments: [...prev.instruments, newInstrument.trim()],
      }))
      setNewInstrument("")
      setFormTouched(true)
    }
  }

  const removeInstrument = (index) => {
    setFormData((prev) => ({
      ...prev,
      instruments: prev.instruments.filter((_, i) => i !== index),
    }))
    setFormTouched(true)
  }

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }))
      setNewLanguage("")
      setFormTouched(true)
    }
  }

  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }))
    setFormTouched(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("🚀 Iniciando processo de salvamento...")
    console.log("📋 Dados do formulário antes da validação:", formData)
    if (!validateForm()) {
      console.log("❌ Validação falhou:", formErrors)
      toast.error("Por favor, corrija os erros no formulário", {
        icon: <AlertCircle className="text-red-500" />,
      })
      return
    }
    console.log("✅ Validação passou, iniciando salvamento...")
    setSaving(true)
    try {
      // GARANTIR que category seja sempre STAGE no envio
      const dataToSave = {
        ...formData,
        category: "STAGE", // FORÇAR STAGE
      }
      console.log("📤 Dados sendo enviados para a API:", dataToSave)
      console.log("🎯 Categoria confirmada como:", dataToSave.category)
      const updatedTalent = await updateTalent(talentId, dataToSave)
      console.log("✅ Talento atualizado com sucesso:", updatedTalent)
      toast.success("Talento atualizado com sucesso!", {
        icon: <CheckCircle className="text-green-500" />,
      })
      if (notifyTalentUpdated) notifyTalentUpdated(updatedTalent)
      if (onSave) onSave(updatedTalent)
      setFormTouched(false)
      onClose()
    } catch (error) {
      console.error("❌ Erro ao salvar:", error)
      toast.error(`Erro ao atualizar talento: ${error.message}`, {
        icon: <XCircle className="text-red-500" />,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleShowTooltip = (id) => setShowTooltip((prev) => ({ ...prev, [id]: true }))
  const handleHideTooltip = (id) => setShowTooltip((prev) => ({ ...prev, [id]: false }))

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        reject(new Error(`Tipo de arquivo não suportado: ${file.type}. Use JPEG, PNG, GIF ou WebP.`))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => reject(new Error("Erro ao ler o arquivo. Tente novamente."))
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = () => fileInputRef.current.click()

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const base64Image = await convertToBase64(file)
        setFormData((prev) => ({
          ...prev,
          cover: base64Image,
        }))
        setFormTouched(true)
        toast.success("Imagem de capa carregada com sucesso!")
      } catch (error) {
        toast.error(`Erro ao processar a imagem: ${error.message}`)
      }
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.tipo_talento || !formData.tipo_talento.trim()) {
      errors.tipo_talento = "Tipo de talento é obrigatório"
    }
    if (!formData.birth_date) {
      errors.birth_date = "Data de nascimento é obrigatória"
    }
    // NÃO validar categoria - ela é sempre STAGE
    console.log("🔍 Validação - categoria atual:", formData.category)
    console.log("🔍 Erros encontrados:", errors)
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const formatDateForInput = (dateString) => (dateString ? new Date(dateString).toISOString().split("T")[0] : "")

  if (!isOpen) return null

  const renderBasicInfoSection = () => (
    <ModalSection activeSection={activeSection} sectionKey="basic">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
          >
            Nome (Somente Leitura)
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("name")}
              onMouseLeave={() => handleHideTooltip("name")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              {showTooltip.name && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Nome do talento (não pode ser editado)
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              readOnly
              className={`pl-10 block w-full rounded-lg border ${
                formErrors.name
                  ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 focus:ring-gray-400 focus:border-gray-400"
              } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed transition-all`}
              placeholder="Nome completo"
            />
            <AnimatePresence>
              {formErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <label
            htmlFor="tipo_talento"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
          >
            Tipo de Talento <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("tipo_talento")}
              onMouseLeave={() => handleHideTooltip("tipo_talento")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              {showTooltip.tipo_talento && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Selecione se é Ator ou Atriz
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <select
              id="tipo_talento"
              name="tipo_talento"
              value={formData.tipo_talento}
              onChange={handleInputChange}
              className={`block w-full rounded-lg border ${
                formErrors.tipo_talento
                  ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
              } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none pr-10 transition-all`}
            >
              <option value="">Selecione o tipo</option>
              <option value="Ator">Ator</option>
              <option value="Atriz">Atriz</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
            </div>
            <AnimatePresence>
              {formErrors.tipo_talento && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.tipo_talento}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="birth_date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
          >
            Data de Nascimento <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("birth_date")}
              onMouseLeave={() => handleHideTooltip("birth_date")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              {showTooltip.birth_date && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Data de nascimento para cálculo de idade
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
            </div>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
              className={`pl-10 block w-full rounded-lg border ${
                formErrors.birth_date
                  ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
              } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
            />
            <AnimatePresence>
              {formErrors.birth_date && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.birth_date}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Campo de Categoria - Apenas informativo */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
          >
            Categoria
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("category")}
              onMouseLeave={() => handleHideTooltip("category")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              {showTooltip.category && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Categoria fixa para todos os talentos: STAGE
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Briefcase className="h-4 w-4 text-green-500" />
            </div>
            <div className="pl-10 block w-full rounded-lg border border-green-200 dark:border-green-700 shadow-sm sm:text-sm p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 font-medium">
              STAGE
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Check className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
            ✅ Categoria definida automaticamente como STAGE
          </p>
        </div>
      </div>
      <div>
        <label
          htmlFor="instagram"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
        >
          Instagram
          <div
            className="relative ml-1.5"
            onMouseEnter={() => handleShowTooltip("instagram")}
            onMouseLeave={() => handleHideTooltip("instagram")}
          >
            <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            {showTooltip.instagram && (
              <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Perfil do Instagram (@ será adicionado automaticamente)
              </div>
            )}
          </div>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Instagram className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
          </div>
          <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 font-medium">@</span>
          </div>
          <input
            type="text"
            id="instagram"
            name="instagram"
            value={formData.instagram.startsWith("@") ? formData.instagram.slice(1) : formData.instagram}
            onChange={(e) => {
              const value = e.target.value
              const cleanValue = value.replace(/^@+/, "")
              const finalValue = "@" + cleanValue
              setFormData((prev) => ({
                ...prev,
                instagram: finalValue,
              }))
              setFormTouched(true)
              if (formErrors.instagram) {
                setFormErrors((prev) => ({
                  ...prev,
                  instagram: null,
                }))
              }
            }}
            className={`pl-14 block w-full rounded-lg border ${
              formErrors.instagram
                ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
                : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
            } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
            placeholder="usuario"
          />
          <AnimatePresence>
            {formErrors.instagram && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
              >
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                {formErrors.instagram}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.div
        className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor="cover"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center"
          >
            <Camera className="h-4 w-4 mr-1.5 text-pink-500 dark:text-pink-400" />
            Imagem de Perfil
          </label>
          <motion.button
            type="button"
            onClick={handleImageUpload}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-800/40 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Upload
          </motion.button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <ImageIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
          </div>
          <input
            type="text"
            id="cover"
            name="cover"
            value={formData.cover || ""}
            onChange={handleInputChange}
            className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
        {formData.cover && (
          <div className="mt-4">
            <motion.div
              className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group cursor-pointer shadow-md"
              onMouseEnter={() => setImagePreviewHover(true)}
              onMouseLeave={() => setImagePreviewHover(false)}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={formData.cover || "/placeholder.svg"}
                alt="Prévia"
                className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23a0a0a0" textAnchor="middle" dy=".3em">Imagem não disponível</text></svg>`
                }}
              />
              <AnimatePresence>
                {imagePreviewHover && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center"
                  >
                    <div className="text-white text-sm font-medium px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg">
                      <Camera className="h-4 w-4 inline-block mr-2" />
                      Visualizar imagem
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
              Esta imagem será exibida no perfil do talento e nas listagens
            </p>
          </div>
        )}
      </motion.div>
      {/* Campo oculto para garantir que category seja sempre STAGE */}
      <input type="hidden" name="category" value="STAGE" />
    </ModalSection>
  )

  const renderCharacteristicsSection = () => (
    <ModalSection activeSection={activeSection} sectionKey="characteristics">
      <motion.div
        className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
        whileHover={{ y: -2 }}
      >
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
          <User className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
          Características Físicas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Altura
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Ruler className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
              </div>
              <input
                type="text"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                placeholder="170 cm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="eye_color" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Cor dos Olhos
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
              </div>
              <input
                type="text"
                id="eye_color"
                name="eye_color"
                value={formData.eye_color}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                placeholder="Castanhos"
              />
            </div>
          </div>
          <div>
            <label htmlFor="hair_color" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Cor do Cabelo
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Palette className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
              </div>
              <input
                type="text"
                id="hair_color"
                name="hair_color"
                value={formData.hair_color}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                placeholder="Castanho"
              />
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
        whileHover={{ y: -2 }}
      >
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
          <Music className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
          Habilidades Musicais
        </h4>
        <div className="flex items-center mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-700 transition-colors">
          <input
            type="checkbox"
            id="can_sing"
            name="can_sing"
            checked={formData.can_sing}
            onChange={handleInputChange}
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label htmlFor="can_sing" className="ml-2 block text-sm text-gray-700 dark:text-gray-200 flex items-center">
            <Mic className="h-4 w-4 mr-1.5 text-pink-500 dark:text-pink-400" />
            Canta
          </label>
        </div>
        <div>
          <label htmlFor="new-instrument" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Instrumentos
          </label>
          <div className="flex">
            <input
              type="text"
              id="new-instrument"
              value={newInstrument}
              onChange={(e) => setNewInstrument(e.target.value)}
              className="block w-full rounded-l-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
              placeholder="Adicionar instrumento"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addInstrument()
                }
              }}
            />
            <motion.button
              type="button"
              onClick={addInstrument}
              className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-r-lg hover:from-pink-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.instruments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum instrumento adicionado</p>
            ) : (
              formData.instruments.map((instrument, index) => (
                <motion.div
                  key={`instrument-${index}-${instrument}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all"
                >
                  <Music className="h-3.5 w-3.5 mr-1.5 text-pink-500 dark:text-pink-400" />
                  {instrument}
                  <button
                    type="button"
                    onClick={() => removeInstrument(index)}
                    className="ml-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
      <motion.div
        className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
        whileHover={{ y: -2 }}
      >
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
          <Languages className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
          Idiomas
        </h4>
        <div className="flex">
          <input
            type="text"
            id="new-language"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            className="block w-full rounded-l-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
            placeholder="Adicionar idioma"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addLanguage()
              }
            }}
          />
          <motion.button
            type="button"
            onClick={addLanguage}
            className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-r-lg hover:from-pink-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {formData.languages.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum idioma adicionado</p>
          ) : (
            formData.languages.map((language, index) => (
              <motion.div
                key={`language-${index}-${language}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all"
              >
                <Globe className="h-3.5 w-3.5 mr-1.5 text-pink-500 dark:text-pink-400" />
                {language}
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="ml-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </ModalSection>
  )

  const renderStatusSection = () => (
    <ModalSection activeSection={activeSection} sectionKey="status">
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
        <h4 className="text-base uppercase tracking-wider text-pink-400 font-medium mb-5 pb-2 border-b border-gray-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-pink-400" />
          Status do Talento
        </h4>
        <div className="space-y-4">
          <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <Check className={`h-4 w-4 text-green-400 ${!formData.ativo && "opacity-0"}`} />
              </div>
              <label htmlFor="ativo" className="flex items-center cursor-pointer">
                <span className="text-white font-medium">Ativo no sistema</span>
                <span className="ml-2 text-sm text-gray-400">
                  (Talentos inativos não aparecem nas listagens públicas)
                </span>
              </label>
            </div>
          </div>
          <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
                <input
                  type="checkbox"
                  id="disponivel"
                  name="disponivel"
                  checked={formData.disponivel}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <Clock className={`h-4 w-4 text-amber-400 ${!formData.disponivel && "opacity-0"}`} />
              </div>
              <label htmlFor="disponivel" className="flex items-center cursor-pointer">
                <span className="text-white font-medium">Disponível para trabalhos</span>
                <span className="ml-2 text-sm text-gray-400">
                  (Indica se o talento está disponível para contratação)
                </span>
              </label>
            </div>
          </div>
          <AnimatePresence>
            {!formData.disponivel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-9 mt-1"
              >
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <label htmlFor="data_disponibilidade" className="block text-amber-300 font-medium mb-2">
                    Disponível a partir de:
                  </label>
                  <div className="relative">
                    <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-center pl-4 pr-2">
                        <Calendar className="h-5 w-5 text-amber-400 flex-shrink-0" />
                      </div>
                      <input
                        type="date"
                        id="data_disponibilidade"
                        name="data_disponibilidade"
                        value={formData.data_disponibilidade}
                        onChange={handleInputChange}
                        className="block w-full py-3 px-2 bg-gray-800 text-white border-0 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 focus:outline-none"
                      />
                    </div>
                    <p className="mt-2 text-xs text-amber-300/80">
                      Esta data será exibida para indicar quando o talento estará disponível novamente.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-6 w-6 rounded bg-gray-700 mr-3">
                <input
                  type="checkbox"
                  id="destaque"
                  name="destaque"
                  checked={formData.destaque}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <Sparkles className={`h-4 w-4 text-yellow-400 ${!formData.destaque && "opacity-0"}`} />
              </div>
              <label htmlFor="destaque" className="flex items-center cursor-pointer">
                <span className="text-white font-medium">Destacar talento</span>
                <span className="ml-2 text-sm text-gray-400">(Talentos destacados aparecem em seções especiais)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </ModalSection>
  )

  const renderPhotosSection = () => (
    <ModalSection activeSection={activeSection} sectionKey="photos">
      <PhotoUploadArea
        talentId={talentId}
        uploadingPhotos={uploadingPhotos}
        onPhotoSelection={handlePhotoSelection}
        onPhotoDrop={handlePhotoDrop}
      />
      <PhotoGallery
        photos={photos}
        loadingPhotos={loadingPhotos}
        onDeletePhoto={handleDeletePhoto}
        onToggleActionMenu={setPhotoActionMenu}
        photoActionMenu={photoActionMenu}
      />
    </ModalSection>
  )

  const renderVideosSection = () => (
    <ModalSection activeSection={activeSection} sectionKey="videos">
      {/* Área para adicionar vídeos por upload */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-700">
          <h4 className="text-lg font-medium text-purple-400 flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Adicionar Vídeos
          </h4>
          <span className="text-sm text-gray-400">
            {videos.length} vídeo{videos.length !== 1 ? "s" : ""} adicionado{videos.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Área de drag and drop para vídeos */}
        <div
          id="video-drop-area"
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors duration-300 mb-6"
          onDrop={handleVideoDrop}
          onDragOver={(e) => {
            e.preventDefault()
            e.currentTarget.classList.add("bg-purple-900/30", "border-purple-500/50")
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.currentTarget.classList.remove("bg-purple-900/30", "border-purple-500/50")
          }}
        >
          <div className="flex flex-col items-center">
            <Film className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-300 text-lg font-medium mb-2">Arraste e solte seus vídeos aqui</p>
            <p className="text-gray-400 text-sm mb-4">Formatos aceitos: MP4, MOV, AVI</p>
            <motion.button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={uploadingVideos}
            >
              {uploadingVideos ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Selecionar Vídeos
                </>
              )}
            </motion.button>
            <input
              ref={videoInputRef}
              type="file"
              multiple
              accept="video/mp4,video/quicktime,video/avi"
              onChange={handleVideoSelection}
              className="hidden"
            />
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          <strong>Formatos aceitos:</strong> MP4, MOV (QuickTime), AVI
        </p>
      </div>

      {/* Lista de vídeos existentes */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
        <h4 className="text-lg font-medium text-purple-400 mb-4 flex items-center">
          <Images className="h-5 w-5 mr-2" />
          Vídeos do Talento
        </h4>
        {loadingVideos ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum vídeo adicionado ainda</p>
            <p className="text-gray-500 text-sm">Use a área acima para adicionar vídeos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <motion.div
                key={video.uniqueKey}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  {video.url ? (
                    <video src={video.url} className="w-full h-full object-cover" controls preload="metadata" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Video className="h-8 w-8 mb-2" />
                      <span className="text-sm">Vídeo</span>
                    </div>
                  )}
                </div>
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    {video.url && (
                      <motion.button
                        onClick={() => window.open(video.url, "_blank")}
                        className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-800 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Abrir em nova aba"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 bg-red-500/90 rounded-full hover:bg-red-500 text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Excluir vídeo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ModalSection>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="edit-talent-modal-container bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Editar Talento</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 rounded-lg border border-red-500 text-red-200 text-sm">
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex justify-center">
                <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  <div className="flex space-x-4">
                    {["basic", "characteristics", "status", "photos", "videos"].map((section) => (
                      <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeSection === section
                            ? "bg-pink-500 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </button>
                    ))}
                  </div>
                  {activeSection === "basic" && renderBasicInfoSection()}
                  {activeSection === "characteristics" && renderCharacteristicsSection()}
                  {activeSection === "status" && renderStatusSection()}
                  {activeSection === "photos" && renderPhotosSection()}
                  {activeSection === "videos" && renderVideosSection()}
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <motion.button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!formTouched || saving}
                    className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors ${
                      !formTouched || saving ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    whileHover={!formTouched || saving ? {} : { scale: 1.05 }}
                    whileTap={!formTouched || saving ? {} : { scale: 0.95 }}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2 inline" />
                        Salvar Alterações
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
      {confirmationModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={closeConfirmationModal}
          onConfirm={confirmDelete}
          title={confirmationModal.title}
          message={confirmationModal.message}
          loading={confirmationModal.loading}
        />
      )}
    </AnimatePresence>
  )
}
