// import { useState, useEffect, useRef } from "react"
// import { toast } from "react-toastify"
// import { useNotifications } from "../contexts/notification-context"
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
//   ImagePlus,
//   Images,
//   Trash,
//   ExternalLink,
//   MoreHorizontal,
//   Download,
//   Copy,
//   Edit,
//   ArrowRight,
// } from "lucide-react"
// import { useTalent } from "../contexts/talents-context"
// import { Info } from "lucide-react"

// export default function EditTalentModal({ isOpen, onClose, talentId, onSave }) {
//   useEffect(() => {
//     // Adicionar estilos de scrollbar ao abrir o modal
//     if (isOpen) {
//       const styleElement = document.createElement("style")
//       styleElement.innerHTML = `
//         .edit-talent-modal-container ::-webkit-scrollbar {
//           width: 6px;
//         }
//         .edit-talent-modal-container ::-webkit-scrollbar-track {
//           background: #1f2937;
//           border-radius: 9999px;
//         }
//         .edit-talent-modal-container ::-webkit-scrollbar-thumb {
//           background-color: #ec4899;
//           border-radius: 9999px;
//         }
//         .edit-talent-modal-container ::-webkit-scrollbar-thumb:hover {
//           background-color: #f472b6;
//         }
//       `
//       document.head.appendChild(styleElement)

//       return () => {
//         // Remover estilos ao fechar o modal
//         document.head.removeChild(styleElement)
//       }
//     }
//   }, [isOpen])
//   const { fetchTalentById, updateTalent, addTalentPhotos, fetchTalentPhotos, deleteTalentPhoto } = useTalent()
//   const [talent, setTalent] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState(null)
//   const { notifyTalentUpdated } = useNotifications || {}
//   const modalRef = useRef(null)
//   const [activeSection, setActiveSection] = useState("basic")
//   const [formTouched, setFormTouched] = useState(false)
//   const [imagePreviewHover, setImagePreviewHover] = useState(false)
//   const [showTooltip, setShowTooltip] = useState({})
//   const fileInputRef = useRef(null)
//   const photoInputRef = useRef(null)

//   // Estados para os campos editáveis
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
//     category: "",
//     instagram: "",
//     tipo_talento: "",
//     cover: "",
//   })

//   // Estado para controlar erros de validação
//   const [formErrors, setFormErrors] = useState({})

//   // Estado para controlar campos de array (instrumentos e idiomas)
//   const [newInstrument, setNewInstrument] = useState("")
//   const [newLanguage, setNewLanguage] = useState("")

//   // Estado para gerenciar fotos
//   const [photos, setPhotos] = useState([])
//   const [loadingPhotos, setLoadingPhotos] = useState(false)
//   const [selectedPhotos, setSelectedPhotos] = useState([])
//   const [uploadingPhotos, setUploadingPhotos] = useState(false)
//   const [photoActionMenu, setPhotoActionMenu] = useState(null)

//   // Efeito para fechar o modal ao clicar fora
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         if (formTouched) {
//           // Confirmar antes de fechar se houver alterações
//           if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
//             onClose()
//           }
//         } else {
//           onClose()
//         }
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//       document.body.style.overflow = "hidden"
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//       document.body.style.overflow = "auto"
//     }
//   }, [isOpen, onClose, formTouched])

//   // Efeito para fechar o modal com a tecla ESC
//   useEffect(() => {
//     const handleEscKey = (event) => {
//       if (event.key === "Escape") {
//         if (formTouched) {
//           // Confirmar antes de fechar se houver alterações
//           if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
//             onClose()
//           }
//         } else {
//           onClose()
//         }
//       }
//     }

//     if (isOpen) {
//       window.addEventListener("keydown", handleEscKey)
//     }

//     return () => {
//       window.removeEventListener("keydown", handleEscKey)
//       document.body.style.overflow = "auto"
//     }
//   }, [isOpen, onClose, formTouched])

//   // Buscar dados do talento quando o modal for aberto
//   useEffect(() => {
//     if (isOpen && talentId) {
//       fetchTalentDetails(talentId)
//       fetchTalentPhotosList(talentId)
//       setFormTouched(false)
//     }
//   }, [isOpen, talentId])

//   // Função para buscar os detalhes do talento
//   const fetchTalentDetails = async (id) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const data = await fetchTalentById(id)
//       setTalent(data)

//       // Preencher o formulário com os dados do talento
//       setFormData({
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
//         category: data.category || "",
//         instagram: data.instagram || "",
//         tipo_talento: data.tipo_talento || "",
//         cover: data.cover || "",
//       })
//     } catch (error) {
//       console.error("Erro ao buscar detalhes do talento:", error)
//       setError(error.message)
//       toast.error(`Erro ao carregar detalhes: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Modificar a função fetchTalentPhotosList para processar corretamente o formato da resposta
//   const fetchTalentPhotosList = async (id) => {
//     setLoadingPhotos(true)
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}/photos`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Erro ao buscar fotos do talento: ${response.status}`)
//       }

//       const data = await response.json()
//       // Processar os dados para adicionar uma URL utilizável para cada foto
//       const processedPhotos = data.map((photo) => ({
//         ...photo,
//         url: photo.image_base64 ? `data:image/jpeg;base64,${photo.image_base64}` : null,
//       }))
//       setPhotos(processedPhotos || [])
//     } catch (error) {
//       console.error("Erro ao buscar fotos do talento:", error)
//       toast.error(`Erro ao carregar fotos: ${error.message}`)
//     } finally {
//       setLoadingPhotos(false)
//     }
//   }

//   // Função para formatar data para o formato do input date (YYYY-MM-DD)
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return ""
//     try {
//       const date = new Date(dateString)
//       return date.toISOString().split("T")[0]
//     } catch (error) {
//       return ""
//     }
//   }

//   // Função para lidar com mudanças nos campos do formulário
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }))

//     // Marcar o formulário como alterado
//     setFormTouched(true)

//     // Limpar erro do campo quando o usuário digitar
//     if (formErrors[name]) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: null,
//       }))
//     }

//     // Validação em tempo real para alguns campos
//     if (name === "instagram" && value && !value.startsWith("@")) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: "Instagram deve começar com @",
//       }))
//     }
//   }

//   // Funções para lidar com arrays (instrumentos e idiomas)
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

//   // Validação do formulário
//   const validateForm = () => {
//     const errors = {}

//     if (!formData.name) errors.name = "Nome é obrigatório"
//     if (!formData.category) errors.category = "Categoria é obrigatória"
//     if (!formData.birth_date) errors.birth_date = "Data de nascimento é obrigatória"

//     // Validar formato de Instagram (opcional)
//     if (formData.instagram && !formData.instagram.startsWith("@")) {
//       errors.instagram = "Instagram deve começar com @"
//     }

//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   // Função para salvar as alterações
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       toast.error("Por favor, corrija os erros no formulário", {
//         icon: <AlertCircle className="text-red-500" />,
//       })
//       return
//     }

//     setSaving(true)

//     try {
//       const updatedTalent = await updateTalent(talentId, formData)
//       toast.success("Talento atualizado com sucesso!", {
//         icon: <CheckCircle className="text-green-500" />,
//       })

//       // Notificar atualização para buscar novas notificações
//       if (notifyTalentUpdated) {
//         notifyTalentUpdated(updatedTalent)
//       }

//       // Chamar a função de callback com o talento atualizado
//       if (onSave) {
//         onSave(updatedTalent)
//       }

//       setFormTouched(false)
//       // Fechar o modal
//       onClose()
//     } catch (error) {
//       console.error("Erro ao atualizar talento:", error)
//       toast.error(`Erro ao atualizar talento: ${error.message}`, {
//         icon: <XCircle className="text-red-500" />,
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Função para mostrar tooltip
//   const handleShowTooltip = (id) => {
//     setShowTooltip((prev) => ({ ...prev, [id]: true }))
//   }

//   // Função para esconder tooltip
//   const handleHideTooltip = (id) => {
//     setShowTooltip((prev) => ({ ...prev, [id]: false }))
//   }

//   // Função para converter arquivo para base64
//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.onloadend = () => resolve(reader.result)
//       reader.onerror = (error) => reject(error)
//       reader.readAsDataURL(file)
//     })
//   }

//   // Função para lidar com upload de imagem de capa
//   const handleImageUpload = () => {
//     fileInputRef.current.click()
//   }

//   // Função para processar a imagem de capa selecionada
//   const handleFileChange = async (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       // Verificar tamanho do arquivo (limite de 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("A imagem deve ter menos de 5MB")
//         return
//       }

//       try {
//         // Converter para base64
//         const base64Image = await convertToBase64(file)
//         setFormData((prev) => ({
//           ...prev,
//           cover: base64Image,
//         }))
//         setFormTouched(true)
//         toast.success("Imagem de capa carregada com sucesso!")
//       } catch (error) {
//         console.error("Erro ao processar imagem:", error)
//         toast.error("Erro ao processar a imagem")
//       }
//     }
//   }

//   // Função para abrir seletor de fotos
//   const handleAddPhotos = () => {
//     photoInputRef.current.click()
//   }

//   // Função para processar as fotos selecionadas
//   const handlePhotoSelection = async (e) => {
//     const files = Array.from(e.target.files)
//     if (files.length === 0) return

//     setUploadingPhotos(true)
//     const photosBase64 = []
//     const failedUploads = []

//     try {
//       // Processar cada arquivo
//       for (const file of files) {
//         // Verificar tamanho do arquivo (limite de 5MB)
//         if (file.size > 5 * 1024 * 1024) {
//           failedUploads.push(`${file.name} (excede 5MB)`)
//           continue
//         }

//         try {
//           // Converter para base64
//           const base64Image = await convertToBase64(file)
//           // Remover o prefixo "data:image/jpeg;base64," para obter apenas a string base64
//           const base64String = base64Image.split(",")[1]
//           photosBase64.push(base64String)
//         } catch (error) {
//           failedUploads.push(file.name)
//           console.error(`Erro ao processar ${file.name}:`, error)
//         }
//       }

//       // Se temos fotos para enviar
//       if (photosBase64.length > 0) {
//         // Enviar fotos para a API
//         await addTalentPhotos(talentId, photosBase64)
//         toast.success(`${photosBase64.length} foto(s) adicionada(s) com sucesso!`)

//         // Recarregar a lista de fotos
//         fetchTalentPhotosList(talentId)
//       }

//       // Mostrar erros se houver
//       if (failedUploads.length > 0) {
//         toast.error(`Falha ao processar ${failedUploads.length} imagem(ns)`)
//       }
//     } catch (error) {
//       console.error("Erro ao adicionar fotos:", error)
//       toast.error(`Erro ao adicionar fotos: ${error.message}`)
//     } finally {
//       setUploadingPhotos(false)
//       // Limpar o input de arquivo
//       e.target.value = null
//     }
//   }

//   // Funções para drag and drop de fotos
//   const handlePhotoDragOver = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     // Adicionar classe visual para indicar que o drop é possível
//     document.getElementById("photo-drop-area")?.classList.add("bg-pink-900/30", "border-pink-500/50")
//   }

//   const handlePhotoDragLeave = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     // Remover classe visual quando o arquivo sai da área
//     document.getElementById("photo-drop-area")?.classList.remove("bg-pink-900/30", "border-pink-500/50")
//   }

//   const handlePhotoDrop = async (e) => {
//     e.preventDefault()
//     e.stopPropagation()

//     // Remover classe visual
//     document.getElementById("photo-drop-area")?.classList.remove("bg-pink-900/30", "border-pink-500/50")

//     // Verificar se há arquivos
//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return

//     const files = Array.from(e.dataTransfer.files)

//     // Filtrar apenas arquivos de imagem
//     const imageFiles = files.filter((file) => file.type.startsWith("image/"))

//     if (imageFiles.length === 0) {
//       toast.error("Por favor, arraste apenas arquivos de imagem")
//       return
//     }

//     setUploadingPhotos(true)
//     const photosBase64 = []
//     const failedUploads = []

//     try {
//       // Processar cada arquivo
//       for (const file of imageFiles) {
//         // Verificar tamanho do arquivo (limite de 5MB)
//         if (file.size > 5 * 1024 * 1024) {
//           failedUploads.push(`${file.name} (excede 5MB)`)
//           continue
//         }

//         try {
//           // Converter para base64
//           const base64Image = await convertToBase64(file)
//           // Remover o prefixo "data:image/jpeg;base64," para obter apenas a string base64
//           const base64String = base64Image.split(",")[1]
//           photosBase64.push(base64String)
//         } catch (error) {
//           failedUploads.push(file.name)
//           console.error(`Erro ao processar ${file.name}:`, error)
//         }
//       }

//       // Se temos fotos para enviar
//       if (photosBase64.length > 0) {
//         // Enviar fotos para a API
//         await addTalentPhotos(talentId, photosBase64)
//         toast.success(`${photosBase64.length} foto(s) adicionada(s) com sucesso!`)

//         // Recarregar a lista de fotos
//         fetchTalentPhotosList(talentId)
//       }

//       // Mostrar erros se houver
//       if (failedUploads.length > 0) {
//         toast.error(`Falha ao processar ${failedUploads.length} imagem(ns)`)
//       }
//     } catch (error) {
//       console.error("Erro ao adicionar fotos:", error)
//       toast.error(`Erro ao adicionar fotos: ${error.message}`)
//     } finally {
//       setUploadingPhotos(false)
//     }
//   }

//   // Função para excluir uma foto
//   const handleDeletePhoto = async (photoId) => {
//     if (!window.confirm("Tem certeza que deseja excluir esta foto?")) return

//     try {
//       await deleteTalentPhoto(talentId, photoId)
//       toast.success("Foto excluída com sucesso!")

//       // Atualizar a lista de fotos
//       setPhotos(photos.filter((photo) => photo.id !== photoId))

//       // Fechar o menu de ações
//       setPhotoActionMenu(null)
//     } catch (error) {
//       console.error("Erro ao excluir foto:", error)
//       toast.error(`Erro ao excluir foto: ${error.message}`)
//     }
//   }

//   // Função para copiar URL da foto
//   const handleCopyPhotoUrl = (url) => {
//     navigator.clipboard
//       .writeText(url)
//       .then(() => {
//         toast.success("URL da foto copiada para a área de transferência!")
//         setPhotoActionMenu(null)
//       })
//       .catch((err) => {
//         console.error("Erro ao copiar URL:", err)
//         toast.error("Erro ao copiar URL da foto")
//       })
//   }

//   // Função para abrir foto em nova aba
//   const handleOpenPhotoInNewTab = (url) => {
//     window.open(url, "_blank")
//     setPhotoActionMenu(null)
//   }

//   // Função para baixar foto
//   const handleDownloadPhoto = (url, id) => {
//     const link = document.createElement("a")
//     link.href = url
//     link.download = `talento-foto-${id}.jpg`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     setPhotoActionMenu(null)
//   }

//   // Função para alternar o menu de ações da foto
//   const togglePhotoActionMenu = (photoId) => {
//     setPhotoActionMenu(photoActionMenu === photoId ? null : photoId)
//   }

//   // Se o modal não estiver aberto, não renderizar nada
//   if (!isOpen) return null

//   const renderBasicInfoSection = () => (
//     <div className={`space-y-6 ${activeSection !== "basic" ? "hidden" : ""}`}>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Nome */}
//         <div>
//           <label
//             htmlFor="name"
//             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
//           >
//             Nome <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
//             <div
//               className="relative ml-1.5"
//               onMouseEnter={() => handleShowTooltip("name")}
//               onMouseLeave={() => handleHideTooltip("name")}
//             >
//               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
//               {showTooltip.name && (
//                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                   Nome completo do talento como será exibido no sistema
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
//               className={`pl-10 block w-full rounded-lg border ${
//                 formErrors.name
//                   ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
//                   : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
//               } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
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

//         {/* Categoria */}
//         <div>
//           <label
//             htmlFor="category"
//             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
//           >
//             Categoria <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
//             <div
//               className="relative ml-1.5"
//               onMouseEnter={() => handleShowTooltip("category")}
//               onMouseLeave={() => handleHideTooltip("category")}
//             >
//               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
//               {showTooltip.category && (
//                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                   Categoria principal do talento
//                 </div>
//               )}
//             </div>
//           </label>
//           <div className="relative group">
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleInputChange}
//               className={`block w-full rounded-lg border ${
//                 formErrors.category
//                   ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
//                   : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
//               } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none pr-10 transition-all`}
//             >
//               <option value="">Selecione uma categoria</option>
//               <option value="Ator">Ator</option>
//               <option value="Atriz">Atriz</option>
//               <option value="Modelo">Modelo</option>
//               <option value="Músico">Músico</option>
//               <option value="Dançarino">Dançarino</option>
//             </select>
//             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//               <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//             </div>
//             <AnimatePresence>
//               {formErrors.category && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
//                 >
//                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
//                   {formErrors.category}
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Tipo de Talento */}
//         <div>
//           <label
//             htmlFor="tipo_talento"
//             className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
//           >
//             Tipo de Talento
//             <div
//               className="relative ml-1.5"
//               onMouseEnter={() => handleShowTooltip("tipo_talento")}
//               onMouseLeave={() => handleHideTooltip("tipo_talento")}
//             >
//               <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
//               {showTooltip.tipo_talento && (
//                 <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                   Especificação adicional do tipo de talento
//                 </div>
//               )}
//             </div>
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//               <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//             </div>
//             <input
//               type="text"
//               id="tipo_talento"
//               name="tipo_talento"
//               value={formData.tipo_talento}
//               onChange={handleInputChange}
//               className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
//               placeholder="Tipo de talento"
//             />
//           </div>
//         </div>

//         {/* Data de Nascimento */}
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
//       </div>

//       {/* Instagram */}
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
//                 Perfil do Instagram (deve começar com @)
//               </div>
//             )}
//           </div>
//         </label>
//         <div className="relative group">
//           <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//             <Instagram className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
//           </div>
//           <input
//             type="text"
//             id="instagram"
//             name="instagram"
//             value={formData.instagram}
//             onChange={handleInputChange}
//             className={`pl-10 block w-full rounded-lg border ${
//               formErrors.instagram
//                 ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
//                 : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
//             } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
//             placeholder="@usuario"
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

//       {/* Imagem de Capa */}
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

//         {/* Prévia da imagem */}
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
//     </div>
//   )

//   const renderCharacteristicsSection = () => (
//     <div className={`space-y-6 ${activeSection !== "characteristics" ? "hidden" : ""}`}>
//       <motion.div
//         className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
//         whileHover={{ y: -2 }}
//       >
//         <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
//           <User className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
//           Características Físicas
//         </h4>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Altura */}
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

//           {/* Cor dos Olhos */}
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

//           {/* Cor do Cabelo */}
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

//       {/* Habilidades Musicais */}
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
//                   key={index}
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

//       {/* Idiomas */}
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
//                 key={index}
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
//     </div>
//   )

//   const renderStatusSection = () => (
//     <div className={`space-y-6 ${activeSection !== "status" ? "hidden" : ""}`}>
//       <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
//         <h4 className="text-base uppercase tracking-wider text-pink-400 font-medium mb-5 pb-2 border-b border-gray-800 flex items-center">
//           <FileText className="h-5 w-5 mr-2 text-pink-400" />
//           Status do Talento
//         </h4>

//         <div className="space-y-4">
//           {/* Ativo no sistema */}
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

//           {/* Disponível para trabalhos */}
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

//           {/* Seção de data de disponibilidade */}
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

//           {/* Destacar talento */}
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
//     </div>
//   )

//   // Corrigir a renderização da seção de fotos (estava faltando)
//   const renderPhotosSection = () => (
//     <div className={`space-y-6 ${activeSection !== "photos" ? "hidden" : ""}`}>
//       <div
//         id="photo-drop-area"
//         className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md transition-colors duration-200"
//         onDragOver={handlePhotoDragOver}
//         onDragLeave={handlePhotoDragLeave}
//         onDrop={handlePhotoDrop}
//       >
//         <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-800">
//           <h4 className="text-base uppercase tracking-wider text-pink-400 font-medium flex items-center">
//             <Images className="h-5 w-5 mr-2 text-pink-400" />
//             Fotos do Talento
//           </h4>
//           <motion.button
//             type="button"
//             onClick={handleAddPhotos}
//             disabled={uploadingPhotos}
//             className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-pink-300 bg-pink-900/30 hover:bg-pink-800/40 transition-colors ${
//               uploadingPhotos ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//             whileHover={!uploadingPhotos ? { scale: 1.05 } : {}}
//             whileTap={!uploadingPhotos ? { scale: 0.95 } : {}}
//           >
//             {uploadingPhotos ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
//                 Enviando...
//               </>
//             ) : (
//               <>
//                 <ImagePlus className="h-4 w-4 mr-1.5" />
//                 Adicionar Fotos
//               </>
//             )}
//           </motion.button>
//           <input
//             type="file"
//             ref={photoInputRef}
//             onChange={handlePhotoSelection}
//             accept="image/*"
//             multiple
//             className="hidden"
//           />
//         </div>

//         {loadingPhotos ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//             >
//               <Loader2 className="h-10 w-10 text-pink-500" />
//             </motion.div>
//             <p className="mt-4 text-gray-400 font-medium">Carregando fotos...</p>
//           </div>
//         ) : photos.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
//             <ImageIcon className="h-16 w-16 text-gray-600 mb-4" />
//             <p className="text-gray-400 font-medium mb-2">Nenhuma foto adicionada</p>
//             <p className="text-gray-500 text-sm max-w-md text-center mb-6">
//               Adicione fotos para exibir no perfil público do talento. As fotos serão exibidas em um carrossel no site.
//             </p>
//             <div className="flex flex-col items-center">
//               <motion.button
//                 type="button"
//                 onClick={handleAddPhotos}
//                 className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors shadow-sm mb-3"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ImagePlus className="h-4 w-4 mr-2" />
//                 Adicionar Fotos
//               </motion.button>
//               <p className="text-gray-500 text-sm">ou arraste e solte imagens aqui</p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div
//               className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2"
//               style={{
//                 scrollbarWidth: "thin",
//                 scrollbarColor: "#ec4899 #1f2937",
//               }}
//             >
//               {photos.map((photo) => (
//                 <motion.div
//                   key={photo.id}
//                   className="relative group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-md"
//                   whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
//                 >
//                   <div className="aspect-w-3 aspect-h-4 bg-gray-900">
//                     <img
//                       src={photo.url || "/placeholder.svg"}
//                       alt={`Foto ${photo.id}`}
//                       className="object-cover w-full h-full"
//                       onError={(e) => {
//                         e.target.onerror = null
//                         e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23333"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23999" textAnchor="middle" dy=".3em">Imagem não disponível</text></svg>`
//                       }}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
//                       <div className="flex justify-between items-center">
//                         <div className="flex space-x-1">
//                           <motion.button
//                             type="button"
//                             onClick={() => handleOpenPhotoInNewTab(photo.url)}
//                             className="p-1.5 bg-gray-800/80 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/80 backdrop-blur-sm"
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                           >
//                             <ExternalLink className="h-4 w-4" />
//                           </motion.button>
//                           <motion.button
//                             type="button"
//                             onClick={() => handleDownloadPhoto(photo.url, photo.id)}
//                             className="p-1.5 bg-gray-800/80 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/80 backdrop-blur-sm"
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                           >
//                             <Download className="h-4 w-4" />
//                           </motion.button>
//                         </div>
//                         <div className="relative">
//                           <motion.button
//                             type="button"
//                             onClick={() => togglePhotoActionMenu(photo.id)}
//                             className="p-1.5 bg-gray-800/80 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/80 backdrop-blur-sm"
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                           >
//                             <MoreHorizontal className="h-4 w-4" />
//                           </motion.button>

//                           {photoActionMenu === photo.id && (
//                             <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-10">
//                               <div className="py-1">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleCopyPhotoUrl(photo.url)}
//                                   className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
//                                 >
//                                   <Copy className="h-4 w-4 mr-2" />
//                                   Copiar URL
//                                 </button>
//                                 <button
//                                   type="button"
//                                   onClick={() => handleOpenPhotoInNewTab(photo.url)}
//                                   className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
//                                 >
//                                   <ExternalLink className="h-4 w-4 mr-2" />
//                                   Abrir em nova aba
//                                 </button>
//                                 <button
//                                   type="button"
//                                   onClick={() => handleDownloadPhoto(photo.url, photo.id)}
//                                   className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
//                                 >
//                                   <Download className="h-4 w-4 mr-2" />
//                                   Baixar imagem
//                                 </button>
//                                 <div className="border-t border-gray-700 my-1"></div>
//                                 <button
//                                   type="button"
//                                   onClick={() => handleDeletePhoto(photo.id)}
//                                   className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300"
//                                 >
//                                   <Trash className="h-4 w-4 mr-2" />
//                                   Excluir foto
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed text-center">
//               <p className="text-gray-400 text-sm mb-2">Arraste e solte imagens aqui para adicionar mais fotos</p>
//               <div className="flex justify-center">
//                 <motion.button
//                   type="button"
//                   onClick={handleAddPhotos}
//                   className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-pink-300 bg-pink-900/30 hover:bg-pink-800/40 transition-colors"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <ImagePlus className="h-4 w-4 mr-1.5" />
//                   Selecionar arquivos
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   // Adicionar o return do componente que estava faltando
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm edit-talent-modal-container"
//         >
//           <motion.div
//             ref={modalRef}
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             transition={{ type: "spring", damping: 30, stiffness: 400 }}
//             className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] max-h-[90vh]"
//           >
//             {/* Cabeçalho com gradiente */}
//             <div className="bg-gray-900 bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-6 py-5 flex justify-between items-center sticky top-0 z-10 relative border-b border-gray-800">
//               {/* Elementos de design no background */}
//               <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
//               <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl"></div>

//               <h2 className="text-xl font-bold text-white flex items-center relative z-10">
//                 <Edit className="h-5 w-5 mr-2 text-pink-400" />
//                 Editar Talento
//               </h2>
//               <motion.button
//                 onClick={() => {
//                   if (formTouched) {
//                     if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
//                       onClose()
//                     }
//                   } else {
//                     onClose()
//                   }
//                 }}
//                 className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 relative z-10"
//                 aria-label="Fechar"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <X className="h-5 w-5" />
//               </motion.button>
//             </div>

//             {/* Conteúdo com scroll */}
//             <div
//               className="overflow-y-auto"
//               style={{
//                 maxHeight: "calc(90vh - 64px)",
//                 scrollbarWidth: "thin",
//                 scrollbarColor: "#ec4899 #1f2937",
//               }}
//             >
//               {loading ? (
//                 <div className="flex flex-col items-center justify-center py-16">
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//                   >
//                     <Loader2 className="h-12 w-12 text-pink-500 dark:text-pink-400" />
//                   </motion.div>
//                   <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
//                     Carregando informações do talento...
//                   </p>
//                 </div>
//               ) : error ? (
//                 <div className="p-6">
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4"
//                   >
//                     <p className="flex items-center">
//                       <AlertCircle className="h-5 w-5 mr-2" />
//                       {error}
//                     </p>
//                     <div className="mt-4 flex justify-center">
//                       <motion.button
//                         onClick={onClose}
//                         className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         Fechar
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit}>
//                   <div className="flex border-b border-gray-800 overflow-x-auto scrollbar-hide bg-gray-900">
//                     <motion.button
//                       type="button"
//                       onClick={() => setActiveSection("basic")}
//                       className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
//                         activeSection === "basic"
//                           ? "text-pink-400 border-b-2 border-pink-500"
//                           : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
//                       }`}
//                       whileHover={{ y: -1 }}
//                       whileTap={{ y: 0 }}
//                     >
//                       <User className={`h-4 w-4 mr-2 ${activeSection === "basic" ? "text-pink-400" : ""}`} />
//                       Informações Básicas
//                     </motion.button>
//                     <motion.button
//                       type="button"
//                       onClick={() => setActiveSection("characteristics")}
//                       className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
//                         activeSection === "characteristics"
//                           ? "text-pink-400 border-b-2 border-pink-500"
//                           : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
//                       }`}
//                       whileHover={{ y: -1 }}
//                       whileTap={{ y: 0 }}
//                     >
//                       <Palette
//                         className={`h-4 w-4 mr-2 ${activeSection === "characteristics" ? "text-pink-400" : ""}`}
//                       />
//                       Características
//                     </motion.button>
//                     <motion.button
//                       type="button"
//                       onClick={() => setActiveSection("status")}
//                       className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
//                         activeSection === "status"
//                           ? "text-pink-400 border-b-2 border-pink-500"
//                           : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
//                       }`}
//                       whileHover={{ y: -1 }}
//                       whileTap={{ y: 0 }}
//                     >
//                       <Info className={`h-4 w-4 mr-2 ${activeSection === "status" ? "text-pink-400" : ""}`} />
//                       Status
//                     </motion.button>
//                     <motion.button
//                       type="button"
//                       onClick={() => setActiveSection("photos")}
//                       className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
//                         activeSection === "photos"
//                           ? "text-pink-400 border-b-2 border-pink-500"
//                           : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
//                       }`}
//                       whileHover={{ y: -1 }}
//                       whileTap={{ y: 0 }}
//                     >
//                       <Images className={`h-4 w-4 mr-2 ${activeSection === "photos" ? "text-pink-400" : ""}`} />
//                       Fotos
//                       {photos.length > 0 && (
//                         <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-pink-900/50 text-pink-300">
//                           {photos.length}
//                         </span>
//                       )}
//                     </motion.button>
//                   </div>

//                   <div className="p-6">
//                     {renderBasicInfoSection()}
//                     {renderCharacteristicsSection()}
//                     {renderStatusSection()}
//                     {renderPhotosSection()}

//                     {/* Botões de ação */}
//                     <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-800">
//                       <motion.button
//                         type="button"
//                         className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
//                         onClick={onClose}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         <Trash2 className="h-4 w-4 mr-1.5" />
//                         Cancelar edição
//                       </motion.button>

//                       <div className="flex space-x-3">
//                         <motion.button
//                           type="button"
//                           onClick={onClose}
//                           className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900"
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                         >
//                           Descartar alterações
//                         </motion.button>
//                         <motion.button
//                           type="submit"
//                           disabled={saving}
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           className={`px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-pink-600 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900 flex items-center ${
//                             saving ? "opacity-80 cursor-not-allowed" : ""
//                           }`}
//                         >
//                           {saving ? (
//                             <>
//                               <Loader2 className="animate-spin h-4 w-4 mr-2" />
//                               Salvando...
//                             </>
//                           ) : (
//                             <>
//                               <Save className="h-4 w-4 mr-2" />
//                               Salvar Alterações
//                               <ArrowRight className="h-4 w-4 ml-2" />
//                             </>
//                           )}
//                         </motion.button>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }



"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { useNotifications } from "../contexts/notification-context"
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
  ImagePlus,
  Images,
  Trash,
  ExternalLink,
  MoreHorizontal,
  Download,
  Copy,
  Edit,
  ArrowRight,
} from "lucide-react"
import { useTalent } from "../contexts/talents-context"
import { Info } from "lucide-react"
// Adicionar importação do ConfirmationModal no topo do arquivo
import ConfirmationModal from "./ConfirmationModal"
export default function EditTalentModal({ isOpen, onClose, talentId, onSave }) {
  useEffect(() => {
    // Adicionar estilos de scrollbar ao abrir o modal
    if (isOpen) {
      const styleElement = document.createElement("style")
      styleElement.innerHTML = `
        .edit-talent-modal-container ::-webkit-scrollbar {
          width: 6px;
        }
        .edit-talent-modal-container ::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 9999px;
        }
        .edit-talent-modal-container ::-webkit-scrollbar-thumb {
          background-color: #ec4899;
          border-radius: 9999px;
        }
        .edit-talent-modal-container ::-webkit-scrollbar-thumb:hover {
          background-color: #f472b6;
        }
      `
      document.head.appendChild(styleElement)

      return () => {
        // Remover estilos ao fechar o modal
        document.head.removeChild(styleElement)
      }
    }
  }, [isOpen])
  const { fetchTalentById, updateTalent, addTalentPhotos, fetchTalentPhotos, deleteTalentPhoto } = useTalent()
  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const { notifyTalentUpdated } = useNotifications || {}
  const modalRef = useRef(null)
  const [activeSection, setActiveSection] = useState("basic")
  const [formTouched, setFormTouched] = useState(false)
  const [imagePreviewHover, setImagePreviewHover] = useState(false)
  const [showTooltip, setShowTooltip] = useState({})
  const fileInputRef = useRef(null)
  const photoInputRef = useRef(null)

  // Estados para os campos editáveis
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
    category: "",
    instagram: "",
    tipo_talento: "",
    cover: "",
  })

  // Estado para controlar erros de validação
  const [formErrors, setFormErrors] = useState({})

  // Estado para controlar campos de array (instrumentos e idiomas)
  const [newInstrument, setNewInstrument] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  // Estado para gerenciar fotos
  const [photos, setPhotos] = useState([])
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [photoActionMenu, setPhotoActionMenu] = useState(null)

  // Adicionar estado para o modal de confirmação
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    photoId: null,
    title: "",
    message: "",
  })

  // Efeito para fechar o modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (formTouched) {
          // Confirmar antes de fechar se houver alterações
          if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
            onClose()
          }
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose, formTouched])

  // Efeito para fechar o modal com a tecla ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (formTouched) {
          // Confirmar antes de fechar se houver alterações
          if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
            onClose()
          }
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscKey)
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose, formTouched])

  // Buscar dados do talento quando o modal for aberto
  useEffect(() => {
    if (isOpen && talentId) {
      fetchTalentDetails(talentId)
      fetchTalentPhotosList(talentId)
      setFormTouched(false)
    }
  }, [isOpen, talentId])

  // Função para buscar os detalhes do talento
  const fetchTalentDetails = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchTalentById(id)
      setTalent(data)

      // Preencher o formulário com os dados do talento
      setFormData({
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
        category: data.category || "",
        instagram: data.instagram || "",
        tipo_talento: data.tipo_talento || "",
        cover: data.cover || "",
      })
    } catch (error) {
      console.error("Erro ao buscar detalhes do talento:", error)
      setError(error.message)
      toast.error(`Erro ao carregar detalhes: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Modificar a função fetchTalentPhotosList para processar corretamente o formato da resposta
  const fetchTalentPhotosList = async (id) => {
    setLoadingPhotos(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}/photos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar fotos do talento: ${response.status}`)
      }

      const data = await response.json()
      // Processar os dados para adicionar uma URL utilizável para cada foto
      const processedPhotos = data.map((photo) => ({
        ...photo,
        url: photo.image_base64 ? `data:image/jpeg;base64,${photo.image_base64}` : null,
      }))
      setPhotos(processedPhotos || [])
    } catch (error) {
      console.error("Erro ao buscar fotos do talento:", error)
      toast.error(`Erro ao carregar fotos: ${error.message}`)
    } finally {
      setLoadingPhotos(false)
    }
  }

  // Função para formatar data para o formato do input date (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    } catch (error) {
      return ""
    }
  }

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Marcar o formulário como alterado
    setFormTouched(true)

    // Limpar erro do campo quando o usuário digitar
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }

    // Validação em tempo real para alguns campos
    if (name === "instagram" && value && !value.startsWith("@")) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "Instagram deve começar com @",
      }))
    }
  }

  // Funções para lidar com arrays (instrumentos e idiomas)
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

  // Validação do formulário
  const validateForm = () => {
    const errors = {}

    if (!formData.name) errors.name = "Nome é obrigatório"
    if (!formData.category) errors.category = "Categoria é obrigatória"
    if (!formData.birth_date) errors.birth_date = "Data de nascimento é obrigatória"

    // Validar formato de Instagram (opcional)
    if (formData.instagram && !formData.instagram.startsWith("@")) {
      errors.instagram = "Instagram deve começar com @"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Função para salvar as alterações
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário", {
        icon: <AlertCircle className="text-red-500" />,
      })
      return
    }

    setSaving(true)

    try {
      const updatedTalent = await updateTalent(talentId, formData)
      toast.success("Talento atualizado com sucesso!", {
        icon: <CheckCircle className="text-green-500" />,
      })

      // Notificar atualização para buscar novas notificações
      if (notifyTalentUpdated) {
        notifyTalentUpdated(updatedTalent)
      }

      // Chamar a função de callback com o talento atualizado
      if (onSave) {
        onSave(updatedTalent)
      }

      setFormTouched(false)
      // Fechar o modal
      onClose()
    } catch (error) {
      console.error("Erro ao atualizar talento:", error)
      toast.error(`Erro ao atualizar talento: ${error.message}`, {
        icon: <XCircle className="text-red-500" />,
      })
    } finally {
      setSaving(false)
    }
  }

  // Função para mostrar tooltip
  const handleShowTooltip = (id) => {
    setShowTooltip((prev) => ({ ...prev, [id]: true }))
  }

  // Função para esconder tooltip
  const handleHideTooltip = (id) => {
    setShowTooltip((prev) => ({ ...prev, [id]: false }))
  }

  // Função para converter arquivo para base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }

  // Função para lidar com upload de imagem de capa
  const handleImageUpload = () => {
    fileInputRef.current.click()
  }

  // Função para processar a imagem de capa selecionada
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Verificar tamanho do arquivo (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter menos de 5MB")
        return
      }

      try {
        // Converter para base64
        const base64Image = await convertToBase64(file)
        setFormData((prev) => ({
          ...prev,
          cover: base64Image,
        }))
        setFormTouched(true)
        toast.success("Imagem de capa carregada com sucesso!")
      } catch (error) {
        console.error("Erro ao processar imagem:", error)
        toast.error("Erro ao processar a imagem")
      }
    }
  }

  // Função para abrir seletor de fotos
  const handleAddPhotos = () => {
    photoInputRef.current.click()
  }

  // Função para processar as fotos selecionadas
  const handlePhotoSelection = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploadingPhotos(true)
    const photosBase64 = []
    const failedUploads = []

    try {
      // Processar cada arquivo
      for (const file of files) {
        // Verificar tamanho do arquivo (limite de 5MB)
        if (file.size > 5 * 1024 * 1024) {
          failedUploads.push(`${file.name} (excede 5MB)`)
          continue
        }

        try {
          // Converter para base64
          const base64Image = await convertToBase64(file)
          // Remover o prefixo "data:image/jpeg;base64," para obter apenas a string base64
          const base64String = base64Image.split(",")[1]
          photosBase64.push(base64String)
        } catch (error) {
          failedUploads.push(file.name)
          console.error(`Erro ao processar ${file.name}:`, error)
        }
      }

      // Se temos fotos para enviar
      if (photosBase64.length > 0) {
        // Enviar fotos para a API
        await addTalentPhotos(talentId, photosBase64)
        toast.success(`${photosBase64.length} foto(s) adicionada(s) com sucesso!`)

        // Recarregar a lista de fotos
        fetchTalentPhotosList(talentId)
      }

      // Mostrar erros se houver
      if (failedUploads.length > 0) {
        toast.error(`Falha ao processar ${failedUploads.length} imagem(ns)`)
      }
    } catch (error) {
      console.error("Erro ao adicionar fotos:", error)
      toast.error(`Erro ao adicionar fotos: ${error.message}`)
    } finally {
      setUploadingPhotos(false)
      // Limpar o input de arquivo
      e.target.value = null
    }
  }

  // Funções para drag and drop de fotos
  const handlePhotoDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Adicionar classe visual para indicar que o drop é possível
    document.getElementById("photo-drop-area")?.classList.add("bg-pink-900/30", "border-pink-500/50")
  }

  const handlePhotoDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Remover classe visual quando o arquivo sai da área
    document.getElementById("photo-drop-area")?.classList.remove("bg-pink-900/30", "border-pink-500/50")
  }

  const handlePhotoDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Remover classe visual
    document.getElementById("photo-drop-area")?.classList.remove("bg-pink-900/30", "border-pink-500/50")

    // Verificar se há arquivos
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return

    const files = Array.from(e.dataTransfer.files)

    // Filtrar apenas arquivos de imagem
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      toast.error("Por favor, arraste apenas arquivos de imagem")
      return
    }

    setUploadingPhotos(true)
    const photosBase64 = []
    const failedUploads = []

    try {
      // Processar cada arquivo
      for (const file of imageFiles) {
        // Verificar tamanho do arquivo (limite de 5MB)
        if (file.size > 5 * 1024 * 1024) {
          failedUploads.push(`${file.name} (excede 5MB)`)
          continue
        }

        try {
          // Converter para base64
          const base64Image = await convertToBase64(file)
          // Remover o prefixo "data:image/jpeg;base64," para obter apenas a string base64
          const base64String = base64Image.split(",")[1]
          photosBase64.push(base64String)
        } catch (error) {
          failedUploads.push(file.name)
          console.error(`Erro ao processar ${file.name}:`, error)
        }
      }

      // Se temos fotos para enviar
      if (photosBase64.length > 0) {
        // Enviar fotos para a API
        await addTalentPhotos(talentId, photosBase64)
        toast.success(`${photosBase64.length} foto(s) adicionada(s) com sucesso!`)

        // Recarregar a lista de fotos
        fetchTalentPhotosList(talentId)
      }

      // Mostrar erros se houver
      if (failedUploads.length > 0) {
        toast.error(`Falha ao processar ${failedUploads.length} imagem(ns)`)
      }
    } catch (error) {
      console.error("Erro ao adicionar fotos:", error)
      toast.error(`Erro ao adicionar fotos: ${error.message}`)
    } finally {
      setUploadingPhotos(false)
    }
  }

  // Substituir a função handleDeletePhoto para usar o modal de confirmação
  const handleDeletePhoto = async (photoId) => {
    setConfirmationModal({
      isOpen: true,
      photoId,
      title: "Excluir foto",
      message: "Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.",
    })

    // Fechar o menu de ações
    setPhotoActionMenu(null)
  }

  // Adicionar função para confirmar a exclusão da foto
  const confirmDeletePhoto = async () => {
    const photoId = confirmationModal.photoId

    try {
      await deleteTalentPhoto(talentId, photoId)
      toast.success("Foto excluída com sucesso!")

      // Atualizar a lista de fotos
      setPhotos(photos.filter((photo) => photo.id !== photoId))
    } catch (error) {
      console.error("Erro ao excluir foto:", error)
      toast.error(`Erro ao excluir foto: ${error.message}`)
    } finally {
      // Fechar o modal de confirmação
      setConfirmationModal({ isOpen: false, photoId: null, title: "", message: "" })
    }
  }

  // Adicionar função para fechar o modal de confirmação
  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, photoId: null, title: "", message: "" })
  }

  // Função para copiar URL da foto
  const handleCopyPhotoUrl = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL da foto copiada para a área de transferência!")
        setPhotoActionMenu(null)
      })
      .catch((err) => {
        console.error("Erro ao copiar URL:", err)
        toast.error("Erro ao copiar URL da foto")
      })
  }

  // Função para abrir foto em nova aba
  const handleOpenPhotoInNewTab = (url) => {
    window.open(url, "_blank")
    setPhotoActionMenu(null)
  }

  // Função para baixar foto
  const handleDownloadPhoto = (url, id) => {
    const link = document.createElement("a")
    link.href = url
    link.download = `talento-foto-${id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setPhotoActionMenu(null)
  }

  // Função para alternar o menu de ações da foto
  const togglePhotoActionMenu = (photoId) => {
    setPhotoActionMenu(photoActionMenu === photoId ? null : photoId)
  }

  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) return null

  const renderBasicInfoSection = () => (
    <div className={`space-y-6 ${activeSection !== "basic" ? "hidden" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
          >
            Nome <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("name")}
              onMouseLeave={() => handleHideTooltip("name")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              {showTooltip.name && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Nome completo do talento como será exibido no sistema
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
              className={`pl-10 block w-full rounded-lg border ${
                formErrors.name
                  ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
              } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
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

        {/* Categoria */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
          >
            Categoria <span className="text-pink-500 dark:text-pink-400 ml-1">*</span>
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("category")}
              onMouseLeave={() => handleHideTooltip("category")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              {showTooltip.category && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Categoria principal do talento
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`block w-full rounded-lg border ${
                formErrors.category
                  ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
              } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none pr-10 transition-all`}
            >
              <option value="">Selecione uma categoria</option>
              <option value="Ator">Ator</option>
              <option value="Atriz">Atriz</option>
              <option value="Modelo">Modelo</option>
              <option value="Músico">Músico</option>
              <option value="Dançarino">Dançarino</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
            </div>
            <AnimatePresence>
              {formErrors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.category}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Talento */}
        <div>
          <label
            htmlFor="tipo_talento"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 flex items-center"
          >
            Tipo de Talento
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("tipo_talento")}
              onMouseLeave={() => handleHideTooltip("tipo_talento")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              {showTooltip.tipo_talento && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Especificação adicional do tipo de talento
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
            </div>
            <input
              type="text"
              id="tipo_talento"
              name="tipo_talento"
              value={formData.tipo_talento}
              onChange={handleInputChange}
              className="pl-10 block w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-opacity-50 focus:border-pink-500 dark:focus:border-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
              placeholder="Tipo de talento"
            />
          </div>
        </div>

        {/* Data de Nascimento */}
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
      </div>

      {/* Instagram */}
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
                Perfil do Instagram (deve começar com @)
              </div>
            )}
          </div>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Instagram className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors" />
          </div>
          <input
            type="text"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            className={`pl-10 block w-full rounded-lg border ${
              formErrors.instagram
                ? "border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/10"
                : "border-gray-200 dark:border-gray-700 focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400"
            } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
            placeholder="@usuario"
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

      {/* Imagem de Capa */}
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

        {/* Prévia da imagem */}
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
    </div>
  )

  const renderCharacteristicsSection = () => (
    <div className={`space-y-6 ${activeSection !== "characteristics" ? "hidden" : ""}`}>
      <motion.div
        className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm"
        whileHover={{ y: -2 }}
      >
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
          <User className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
          Características Físicas
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Altura */}
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

          {/* Cor dos Olhos */}
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

          {/* Cor do Cabelo */}
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

      {/* Habilidades Musicais */}
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
                  key={index}
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

      {/* Idiomas */}
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
                key={index}
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
    </div>
  )

  const renderStatusSection = () => (
    <div className={`space-y-6 ${activeSection !== "status" ? "hidden" : ""}`}>
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
        <h4 className="text-base uppercase tracking-wider text-pink-400 font-medium mb-5 pb-2 border-b border-gray-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-pink-400" />
          Status do Talento
        </h4>

        <div className="space-y-4">
          {/* Ativo no sistema */}
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

          {/* Disponível para trabalhos */}
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

          {/* Seção de data de disponibilidade */}
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

          {/* Destacar talento */}
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
    </div>
  )

  // Corrigir a renderização da seção de fotos (estava faltando)
  const renderPhotosSection = () => (
    <div className={`space-y-6 ${activeSection !== "photos" ? "hidden" : ""}`}>
      <div
        id="photo-drop-area"
        className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md transition-colors duration-200"
        onDragOver={handlePhotoDragOver}
        onDragLeave={handlePhotoDragLeave}
        onDrop={handlePhotoDrop}
      >
        <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-800">
          <h4 className="text-base uppercase tracking-wider text-pink-400 font-medium flex items-center">
            <Images className="h-5 w-5 mr-2 text-pink-400" />
            Fotos do Talento
          </h4>
          <motion.button
            type="button"
            onClick={handleAddPhotos}
            disabled={uploadingPhotos}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-pink-300 bg-pink-900/30 hover:bg-pink-800/40 transition-colors ${
              uploadingPhotos ? "opacity-70 cursor-not-allowed" : ""
            }`}
            whileHover={!uploadingPhotos ? { scale: 1.05 } : {}}
            whileTap={!uploadingPhotos ? { scale: 0.95 } : {}}
          >
            {uploadingPhotos ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4 mr-1.5" />
                Adicionar Fotos
              </>
            )}
          </motion.button>
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoSelection}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        {loadingPhotos ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="h-10 w-10 text-pink-500" />
            </motion.div>
            <p className="mt-4 text-gray-400 font-medium">Carregando fotos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
            <ImageIcon className="h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-400 font-medium mb-2">Nenhuma foto adicionada</p>
            <p className="text-gray-500 text-sm max-w-md text-center mb-6">
              Adicione fotos para exibir no perfil público do talento. As fotos serão exibidas em um carrossel no site.
            </p>
            <div className="flex flex-col items-center">
              <motion.button
                type="button"
                onClick={handleAddPhotos}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors shadow-sm mb-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Adicionar Fotos
              </motion.button>
              <p className="text-gray-500 text-sm">ou arraste e solte imagens aqui</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#ec4899 #1f2937",
              }}
            >
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  className="relative group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-md"
                  whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                >
                  <div className="aspect-w-3 aspect-h-4 bg-gray-900">
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={`Foto ${photo.id}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23333"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23999" textAnchor="middle" dy=".3em">Imagem não disponível</text></svg>`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-1">
                          <motion.button
                            type="button"
                            onClick={() => handleOpenPhotoInNewTab(photo.url)}
                            className="p-1.5 bg-gray-800/80 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/80 backdrop-blur-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => handleDownloadPhoto(photo.url, photo.id)}
                            className="p-1.5 bg-gray-800/80 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/80 backdrop-blur-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Download className="h-4 w-4" />
                          </motion.button>
                        </div>
                        <div className="relative">
                          <motion.button
                            type="button"
                            onClick={() => togglePhotoActionMenu(photo.id)}
                            className="p-1.5 bg-gray-800/80 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/80 backdrop-blur-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </motion.button>

                          {photoActionMenu === photo.id && (
                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-10">
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => handleCopyPhotoUrl(photo.url)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar URL
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenPhotoInNewTab(photo.url)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Abrir em nova aba
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadPhoto(photo.url, photo.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Baixar imagem
                                </button>
                                <div className="border-t border-gray-700 my-1"></div>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Excluir foto
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed text-center">
              <p className="text-gray-400 text-sm mb-2">Arraste e solte imagens aqui para adicionar mais fotos</p>
              <div className="flex justify-center">
                <motion.button
                  type="button"
                  onClick={handleAddPhotos}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-pink-300 bg-pink-900/30 hover:bg-pink-800/40 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ImagePlus className="h-4 w-4 mr-1.5" />
                  Selecionar arquivos
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Adicionar o return do componente que estava faltando
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm edit-talent-modal-container"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] max-h-[90vh]"
          >
            {/* Cabeçalho com gradiente */}
            <div className="bg-gray-900 bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-6 py-5 flex justify-between items-center sticky top-0 z-10 relative border-b border-gray-800">
              {/* Elementos de design no background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl"></div>

              <h2 className="text-xl font-bold text-white flex items-center relative z-10">
                <Edit className="h-5 w-5 mr-2 text-pink-400" />
                Editar Talento
              </h2>
              <motion.button
                onClick={() => {
                  if (formTouched) {
                    if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
                      onClose()
                    }
                  } else {
                    onClose()
                  }
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 relative z-10"
                aria-label="Fechar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Conteúdo com scroll */}
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: "calc(90vh - 64px)",
                scrollbarWidth: "thin",
                scrollbarColor: "#ec4899 #1f2937",
              }}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Loader2 className="h-12 w-12 text-pink-500 dark:text-pink-400" />
                  </motion.div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
                    Carregando informações do talento...
                  </p>
                </div>
              ) : error ? (
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4"
                  >
                    <p className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {error}
                    </p>
                    <div className="mt-4 flex justify-center">
                      <motion.button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Fechar
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex border-b border-gray-800 overflow-x-auto scrollbar-hide bg-gray-900">
                    <motion.button
                      type="button"
                      onClick={() => setActiveSection("basic")}
                      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeSection === "basic"
                          ? "text-pink-400 border-b-2 border-pink-500"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <User className={`h-4 w-4 mr-2 ${activeSection === "basic" ? "text-pink-400" : ""}`} />
                      Informações Básicas
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setActiveSection("characteristics")}
                      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeSection === "characteristics"
                          ? "text-pink-400 border-b-2 border-pink-500"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <Palette
                        className={`h-4 w-4 mr-2 ${activeSection === "characteristics" ? "text-pink-400" : ""}`}
                      />
                      Características
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setActiveSection("status")}
                      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeSection === "status"
                          ? "text-pink-400 border-b-2 border-pink-500"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <Info className={`h-4 w-4 mr-2 ${activeSection === "status" ? "text-pink-400" : ""}`} />
                      Status
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setActiveSection("photos")}
                      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeSection === "photos"
                          ? "text-pink-400 border-b-2 border-pink-500"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <Images className={`h-4 w-4 mr-2 ${activeSection === "photos" ? "text-pink-400" : ""}`} />
                      Fotos
                      {photos.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-pink-900/50 text-pink-300">
                          {photos.length}
                        </span>
                      )}
                    </motion.button>
                  </div>

                  <div className="p-6">
                    {renderBasicInfoSection()}
                    {renderCharacteristicsSection()}
                    {renderStatusSection()}
                    {renderPhotosSection()}

                    {/* Botões de ação */}
                    <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-800">
                      <motion.button
                        type="button"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                        onClick={onClose}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Cancelar edição
                      </motion.button>

                      <div className="flex space-x-3">
                        <motion.button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Descartar alterações
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={saving}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-pink-600 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900 flex items-center ${
                            saving ? "opacity-80 cursor-not-allowed" : ""
                          }`}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Salvar Alterações
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de confirmação para exclusão de fotos */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmDeletePhoto}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </AnimatePresence>
  )
}
