// import { useState, useEffect, useRef } from "react"
// import { useTalent } from "../contexts/talents-context"
// import { toast } from "react-toastify"
// import {
//   X,
//   Info,
//   Calendar,
//   Check,
//   ChevronRight,
//   Camera,
//   Music,
//   Globe,
//   Settings,
//   User,
//   Ruler,
//   Eye,
//   Palette,
//   Instagram,
//   AlertCircle,
//   PlusCircle,
//   Sparkles,
// } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// export default function AddTalentModal({ isOpen, onClose, onSave }) {
//   const { createTalent } = useTalent()
//   const [isVisible, setIsVisible] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [imagePreview, setImagePreview] = useState(null)
//   const fileInputRef = useRef(null)
//   const modalRef = useRef(null)
//   const [activeStep, setActiveStep] = useState(1)
//   const [formProgress, setFormProgress] = useState(0)

//   // Opções fixas para cores de olhos e cabelos
//   const eyeColorOptions = ["Castanhos", "Azuis", "Verdes", "Pretos", "Mel", "Cinza", "Heterocromia"]

//   const hairColorOptions = [
//     "Preto",
//     "Castanho Escuro",
//     "Castanho Claro",
//     "Loiro Escuro",
//     "Loiro Claro",
//     "Ruivo",
//     "Grisalho",
//     "Branco",
//     "Colorido",
//   ]

//   const [formData, setFormData] = useState({
//     name: "",
//     type: "Ator", // Tipo do talento: Ator ou Atriz
//     birth_date: "",
//     height: "",
//     eye_color: "",
//     hair_color: "",
//     instagram: "",
//     can_sing: false,
//     instruments: [],
//     languages: [],
//     ativo: true,
//     destaque: false,
//     disponivel: true,
//     data_disponibilidade: "",
//     cover: null,
//   })

//   const [errors, setErrors] = useState({})
//   const [newInstrument, setNewInstrument] = useState("")
//   const [newLanguage, setNewLanguage] = useState("")
//   const [touched, setTouched] = useState({})

//   // Calcular progresso do formulário
//   useEffect(() => {
//     const requiredFields = ["name", "birth_date", "height", "eye_color", "hair_color"]
//     const filledRequiredFields = requiredFields.filter((field) => formData[field])
//     const progress = Math.round((filledRequiredFields.length / requiredFields.length) * 100)
//     setFormProgress(progress)
//   }, [formData])

//   useEffect(() => {
//     if (isOpen) {
//       setIsVisible(true)
//       document.body.style.overflow = "hidden"
//     } else {
//       setIsVisible(false)
//       setTimeout(() => {
//         document.body.style.overflow = "auto"
//         resetForm()
//       }, 300)
//     }
//   }, [isOpen])

//   // Separar o evento de clique fora do modal do useEffect principal
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose()
//       }
//     }

//     if (isOpen) {
//       // Adicionar um pequeno delay para evitar que o evento seja capturado imediatamente
//       const timer = setTimeout(() => {
//         document.addEventListener("mousedown", handleClickOutside)
//       }, 100)

//       return () => {
//         clearTimeout(timer)
//         document.removeEventListener("mousedown", handleClickOutside)
//       }
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen, onClose])

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       type: "Ator",
//       birth_date: "",
//       height: "",
//       eye_color: "",
//       hair_color: "",
//       instagram: "",
//       can_sing: false,
//       instruments: [],
//       languages: [],
//       ativo: true,
//       destaque: false,
//       disponivel: true,
//       data_disponibilidade: "",
//       cover: null,
//     })
//     setErrors({})
//     setImagePreview(null)
//     setNewInstrument("")
//     setNewLanguage("")
//     setActiveStep(1)
//     setTouched({})
//   }

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target

//     if (type === "checkbox") {
//       setFormData({ ...formData, [name]: checked })
//     } else {
//       setFormData({ ...formData, [name]: value })
//     }

//     // Marcar campo como tocado
//     setTouched({ ...touched, [name]: true })

//     // Limpar erro do campo quando o usuário começa a digitar
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null })
//     }
//   }

//   const handleBlur = (e) => {
//     const { name } = e.target
//     setTouched({ ...touched, [name]: true })
//     validateField(name, formData[name])
//   }

//   const validateField = (name, value) => {
//     let error = null

//     switch (name) {
//       case "name":
//         if (!value.trim()) error = "Nome é obrigatório"
//         break
//       case "birth_date":
//         if (!value) error = "Data de nascimento é obrigatória"
//         break
//       case "height":
//         if (!value) error = "Altura é obrigatória"
//         break
//       case "eye_color":
//         if (!value) error = "Cor dos olhos é obrigatória"
//         break
//       case "hair_color":
//         if (!value) error = "Cor do cabelo é obrigatória"
//         break
//       case "instagram":
//         if (value && !value.startsWith("@")) error = "Instagram deve começar com @"
//         break
//       case "data_disponibilidade":
//         if (!formData.disponivel && !value) error = "Data de disponibilidade é obrigatória quando não está disponível"
//         break
//       default:
//         break
//     }

//     if (error) {
//       setErrors((prev) => ({ ...prev, [name]: error }))
//       return false
//     }

//     setErrors((prev) => ({ ...prev, [name]: null }))
//     return true
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

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       // Verificar tamanho do arquivo (limite de 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setErrors({ ...errors, cover: "A imagem deve ter menos de 5MB" })
//         return
//       }

//       try {
//         // Converter para base64
//         const base64Image = await convertToBase64(file)
//         setFormData({ ...formData, cover: base64Image })
//         setImagePreview(base64Image)

//         // Limpar erro do campo
//         if (errors.cover) {
//           setErrors({ ...errors, cover: null })
//         }

//         // Mostrar toast de sucesso
//         toast.success("Imagem carregada com sucesso!")
//       } catch (error) {
//         console.error("Erro ao converter imagem:", error)
//         setErrors({ ...errors, cover: "Erro ao processar a imagem" })
//         toast.error("Erro ao processar a imagem")
//       }
//     }
//   }

//   const triggerFileInput = () => {
//     fileInputRef.current.click()
//   }

//   const handleDragOver = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   const handleDrop = async (e) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const file = e.dataTransfer.files[0]
//       if (file.type.startsWith("image/")) {
//         // Verificar tamanho do arquivo (limite de 5MB)
//         if (file.size > 5 * 1024 * 1024) {
//           setErrors({ ...errors, cover: "A imagem deve ter menos de 5MB" })
//           toast.error("A imagem deve ter menos de 5MB")
//           return
//         }

//         try {
//           // Converter para base64
//           const base64Image = await convertToBase64(file)
//           setFormData({ ...formData, cover: base64Image })
//           setImagePreview(base64Image)

//           // Limpar erro do campo
//           if (errors.cover) {
//             setErrors({ ...errors, cover: null })
//           }

//           // Mostrar toast de sucesso
//           toast.success("Imagem carregada com sucesso!")
//         } catch (error) {
//           console.error("Erro ao converter imagem:", error)
//           setErrors({ ...errors, cover: "Erro ao processar a imagem" })
//           toast.error("Erro ao processar a imagem")
//         }
//       } else {
//         setErrors({ ...errors, cover: "O arquivo deve ser uma imagem" })
//         toast.error("O arquivo deve ser uma imagem")
//       }
//     }
//   }

//   const addInstrument = () => {
//     if (newInstrument.trim() && !formData.instruments.includes(newInstrument.trim())) {
//       setFormData({
//         ...formData,
//         instruments: [...formData.instruments, newInstrument.trim()],
//       })
//       setNewInstrument("")
//       // Mostrar feedback visual
//       toast.success(`Instrumento "${newInstrument.trim()}" adicionado!`, { autoClose: 1500 })
//     }
//   }

//   const removeInstrument = (index) => {
//     const updatedInstruments = [...formData.instruments]
//     const removed = updatedInstruments[index]
//     updatedInstruments.splice(index, 1)
//     setFormData({ ...formData, instruments: updatedInstruments })
//     // Mostrar feedback visual
//     toast.info(`Instrumento "${removed}" removido`, { autoClose: 1500 })
//   }

//   const addLanguage = () => {
//     if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
//       setFormData({
//         ...formData,
//         languages: [...formData.languages, newLanguage.trim()],
//       })
//       setNewLanguage("")
//       // Mostrar feedback visual
//       toast.success(`Idioma "${newLanguage.trim()}" adicionado!`, { autoClose: 1500 })
//     }
//   }

//   const removeLanguage = (index) => {
//     const updatedLanguages = [...formData.languages]
//     const removed = updatedLanguages[index]
//     updatedLanguages.splice(index, 1)
//     setFormData({ ...formData, languages: updatedLanguages })
//     // Mostrar feedback visual
//     toast.info(`Idioma "${removed}" removido`, { autoClose: 1500 })
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
//     if (!formData.birth_date) newErrors.birth_date = "Data de nascimento é obrigatória"
//     if (!formData.height) newErrors.height = "Altura é obrigatória"
//     if (!formData.eye_color) newErrors.eye_color = "Cor dos olhos é obrigatória"
//     if (!formData.hair_color) newErrors.hair_color = "Cor do cabelo é obrigatória"

//     // Validar formato do Instagram (opcional)
//     if (formData.instagram && !formData.instagram.startsWith("@")) {
//       newErrors.instagram = "Instagram deve começar com @"
//     }

//     // Validar data de disponibilidade se não estiver disponível
//     if (!formData.disponivel && !formData.data_disponibilidade) {
//       newErrors.data_disponibilidade = "Data de disponibilidade é obrigatória quando não está disponível"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       toast.error("Por favor, corrija os erros no formulário", { toastId: "form-validation-error" })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Adicionar categoria fixa como STAGE
//       const talentData = {
//         ...formData,
//         category: "STAGE",
//       }

//       await createTalent(talentData)
//       toast.success("Talento adicionado com sucesso!", { toastId: "add-talent-success" })

//       if (onSave) {
//         onSave(talentData)
//       }

//       onClose()
//     } catch (error) {
//       console.error("Erro ao adicionar talento:", error)
//       toast.error(`Erro ao adicionar talento: ${error.message}`, { toastId: "add-talent-error" })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Impedir a propagação do clique dentro do modal
//   const handleModalClick = (e) => {
//     e.stopPropagation()
//   }

//   // Navegar para o próximo passo
//   const goToNextStep = () => {
//     if (activeStep < 3) {
//       setActiveStep(activeStep + 1)
//     }
//   }

//   // Navegar para o passo anterior
//   const goToPrevStep = () => {
//     if (activeStep > 1) {
//       setActiveStep(activeStep - 1)
//     }
//   }

//   // Ir para um passo específico
//   const goToStep = (step) => {
//     setActiveStep(step)
//   }

//   if (!isOpen) return null

//   // Variantes de animação para o Framer Motion
//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.3 } },
//   }

//   const slideIn = {
//     hidden: { x: 20, opacity: 0 },
//     visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
//   }

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 sm:p-4 overflow-y-auto backdrop-blur-sm"
//           onClick={onClose}
//         >
//           <motion.div
//             ref={modalRef}
//             onClick={handleModalClick}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ type: "spring", damping: 25 }}
//             className={`bg-white rounded-2xl shadow-2xl w-full max-w-5xl transform relative overflow-hidden`}
//             style={{ maxHeight: "95vh" }}
//           >
//             {/* Barra de progresso */}
//             <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
//               <motion.div
//                 className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
//                 initial={{ width: 0 }}
//                 animate={{ width: `${formProgress}%` }}
//                 transition={{ duration: 0.5 }}
//               />
//             </div>

//             {/* Cabeçalho */}
//             <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-white">Adicionar Novo Talento</h2>
//                 <div className="flex items-center mt-1">
//                   <div className="flex space-x-1">
//                     {[1, 2, 3].map((step) => (
//                       <button
//                         key={step}
//                         onClick={() => goToStep(step)}
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                           step === activeStep
//                             ? "w-8 bg-pink-500"
//                             : step < activeStep
//                               ? "w-4 bg-pink-300"
//                               : "w-4 bg-gray-500 bg-opacity-40"
//                         }`}
//                         aria-label={`Ir para o passo ${step}`}
//                       />
//                     ))}
//                   </div>
//                   <span className="text-gray-400 text-xs ml-3">Passo {activeStep} de 3</span>
//                 </div>
//               </div>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   onClose()
//                 }}
//                 className="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition-colors"
//                 aria-label="Fechar"
//                 type="button"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Conteúdo com scroll */}
//             <div className="overflow-y-auto" style={{ maxHeight: "calc(95vh - 80px)" }}>
//               <form onSubmit={handleSubmit}>
//                 {/* Passo 1: Informações Básicas */}
//                 <AnimatePresence mode="wait">
//                   {activeStep === 1 && (
//                     <motion.div
//                       key="step1"
//                       initial="hidden"
//                       animate="visible"
//                       exit="hidden"
//                       variants={fadeIn}
//                       className="p-6"
//                     >
//                       <div className="flex items-center mb-6">
//                         <User className="h-5 w-5 text-pink-500 mr-2" />
//                         <h3 className="text-lg font-semibold text-gray-800">Informações Básicas</h3>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Coluna da esquerda */}
//                         <div>
//                           <div className="mb-6">
//                             <label className="block text-gray-700 font-medium mb-2">Foto do Talento</label>
//                             <div
//                               className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
//                                 errors.cover ? "border-red-300" : "border-gray-300"
//                               } group relative overflow-hidden`}
//                               onClick={triggerFileInput}
//                               onDragOver={handleDragOver}
//                               onDrop={handleDrop}
//                             >
//                               {imagePreview ? (
//                                 <div className="relative">
//                                   <img
//                                     src={imagePreview || "/placeholder.svg"}
//                                     alt="Preview"
//                                     className="mx-auto h-56 w-56 object-cover rounded-lg shadow-md"
//                                   />
//                                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
//                                     <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg">
//                                       <Camera className="h-5 w-5 text-pink-500 inline-block mr-1" />
//                                       <span className="text-gray-800 text-sm font-medium">Alterar imagem</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="py-10 px-4">
//                                   <div className="bg-pink-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//                                     <Camera className="h-10 w-10 text-pink-400" />
//                                   </div>
//                                   <p className="text-gray-700 font-medium mb-2">Arraste e solte uma foto aqui</p>
//                                   <p className="text-gray-500 text-sm mb-4">ou</p>
//                                   <button
//                                     type="button"
//                                     className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-sm"
//                                   >
//                                     Selecionar Imagem
//                                   </button>
//                                   <p className="text-gray-400 text-xs mt-4">
//                                     Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
//                                   </p>
//                                 </div>
//                               )}
//                               <input
//                                 type="file"
//                                 ref={fileInputRef}
//                                 onChange={handleFileChange}
//                                 accept="image/*"
//                                 className="hidden"
//                               />
//                             </div>
//                             {errors.cover && (
//                               <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-red-500 text-xs mt-1 flex items-center"
//                               >
//                                 <AlertCircle className="h-3 w-3 mr-1" />
//                                 {errors.cover}
//                               </motion.p>
//                             )}
//                           </div>
//                         </div>

//                         {/* Coluna da direita */}
//                         <div>
//                           <div className="mb-5">
//                             <label className="block text-gray-700 font-medium mb-2">
//                               Nome Completo <span className="text-pink-500">*</span>
//                             </label>
//                             <input
//                               type="text"
//                               name="name"
//                               value={formData.name}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
//                                 errors.name && touched.name ? "border-red-300 bg-red-50" : "border-gray-300"
//                               }`}
//                               placeholder="Nome do talento"
//                             />
//                             {errors.name && touched.name && (
//                               <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-red-500 text-xs mt-1 flex items-center"
//                               >
//                                 <AlertCircle className="h-3 w-3 mr-1" />
//                                 {errors.name}
//                               </motion.p>
//                             )}
//                           </div>

//                           <div className="mb-5">
//                             <label className="block text-gray-700 font-medium mb-2">
//                               Tipo do Talento <span className="text-pink-500">*</span>
//                             </label>
//                             <div className="grid grid-cols-2 gap-3">
//                               <label
//                                 className={`
//                                 flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer
//                                 ${
//                                   formData.type === "Ator"
//                                     ? "border-pink-500 bg-pink-50 text-pink-700"
//                                     : "border-gray-200 hover:border-gray-300 text-gray-700"
//                                 }
//                               `}
//                               >
//                                 <input
//                                   type="radio"
//                                   name="type"
//                                   value="Ator"
//                                   checked={formData.type === "Ator"}
//                                   onChange={handleChange}
//                                   className="sr-only"
//                                 />
//                                 <span className="font-medium">Ator</span>
//                               </label>
//                               <label
//                                 className={`
//                                 flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer
//                                 ${
//                                   formData.type === "Atriz"
//                                     ? "border-pink-500 bg-pink-50 text-pink-700"
//                                     : "border-gray-200 hover:border-gray-300 text-gray-700"
//                                 }
//                               `}
//                               >
//                                 <input
//                                   type="radio"
//                                   name="type"
//                                   value="Atriz"
//                                   checked={formData.type === "Atriz"}
//                                   onChange={handleChange}
//                                   className="sr-only"
//                                 />
//                                 <span className="font-medium">Atriz</span>
//                               </label>
//                             </div>
//                           </div>

//                           <div className="mb-5">
//                             <label className="block text-gray-700 font-medium mb-2">
//                               Data de Nascimento <span className="text-pink-500">*</span>
//                             </label>
//                             <div className="relative">
//                               <input
//                                 type="date"
//                                 name="birth_date"
//                                 value={formData.birth_date}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 ${
//                                   errors.birth_date && touched.birth_date
//                                     ? "border-red-300 bg-red-50"
//                                     : "border-gray-300"
//                                 }`}
//                               />
//                               <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
//                             </div>
//                             {errors.birth_date && touched.birth_date && (
//                               <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-red-500 text-xs mt-1 flex items-center"
//                               >
//                                 <AlertCircle className="h-3 w-3 mr-1" />
//                                 {errors.birth_date}
//                               </motion.p>
//                             )}
//                           </div>

//                           <div className="mb-5">
//                             <label className="block text-gray-700 font-medium mb-2">Instagram</label>
//                             <div className="relative">
//                               <input
//                                 type="text"
//                                 name="instagram"
//                                 value={formData.instagram}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
//                                   errors.instagram && touched.instagram ? "border-red-300 bg-red-50" : "border-gray-300"
//                                 }`}
//                                 placeholder="@usuario"
//                               />
//                               <Instagram className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                             </div>
//                             {errors.instagram && touched.instagram ? (
//                               <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-red-500 text-xs mt-1 flex items-center"
//                               >
//                                 <AlertCircle className="h-3 w-3 mr-1" />
//                                 {errors.instagram}
//                               </motion.p>
//                             ) : (
//                               <p className="text-gray-500 text-xs mt-1">Exemplo: @usuario</p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}

//                   {/* Passo 2: Características Físicas */}
//                   {activeStep === 2 && (
//                     <motion.div
//                       key="step2"
//                       initial="hidden"
//                       animate="visible"
//                       exit="hidden"
//                       variants={fadeIn}
//                       className="p-6"
//                     >
//                       <div className="flex items-center mb-6">
//                         <Ruler className="h-5 w-5 text-pink-500 mr-2" />
//                         <h3 className="text-lg font-semibold text-gray-800">Características Físicas</h3>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Coluna da esquerda */}
//                         <div>
//                           <div className="mb-5">
//                             <label className="block text-gray-700 font-medium mb-2">
//                               Altura (cm) <span className="text-pink-500">*</span>
//                             </label>
//                             <div className="relative">
//                               <input
//                                 type="number"
//                                 name="height"
//                                 value={formData.height}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 ${
//                                   errors.height && touched.height ? "border-red-300 bg-red-50" : "border-gray-300"
//                                 }`}
//                                 placeholder="170"
//                                 min="100"
//                                 max="250"
//                               />
//                               <span className="absolute right-3 top-3 text-gray-400">cm</span>
//                             </div>
//                             {errors.height && touched.height && (
//                               <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-red-500 text-xs mt-1 flex items-center"
//                               >
//                                 <AlertCircle className="h-3 w-3 mr-1" />
//                                 {errors.height}
//                               </motion.p>
//                             )}
//                           </div>

//                           <div className="mb-5">
//                             <label className="block text-gray-700 font-medium mb-2">
//                               Cor dos Olhos <span className="text-pink-500">*</span>
//                             </label>
//                             <div className="relative">
//                               <select
//                                 name="eye_color"
//                                 value={formData.eye_color}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 appearance-none ${
//                                   errors.eye_color && touched.eye_color ? "border-red-300 bg-red-50" : "border-gray-300"
//                                 }`}
//                               >
//                                 <option value="" className="text-gray-500">
//                                   Selecione a cor dos olhos
//                                 </option>
//                                 {eyeColorOptions.map((color) => (
//                                   <option key={color} value={color} className="text-gray-700">
//                                     {color}
//                                   </option>
//                                 ))}
//                               </select>
//                               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
//                                 <Eye className="h-5 w-5" />
//                               </div>
//                             </div>
//                             {errors.eye_color && touched.eye_color && (
//                               <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-red-500 text-xs mt-1 flex items-center"
//                               >
//                                 <AlertCircle className="h-3 w-3 mr-1" />
//                                 {errors.eye_color}
//                               </motion.p>
//                             )}
//                           </div>
//                         </div>

//                         {/* Coluna da direita */}
//                         <div>
//                           <div className="mb-5">
//                             <label className="block text-gray-700 font-medium mb-2">
//                               Cor do Cabelo <span className="text-pink-500">*</span>
//                             </label>
//                             <div className="relative">
//                               <select
//                                 name="hair_color"
//                                 value={formData.hair_color}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 appearance-none ${
//                                   errors.hair_color && touched.hair_color
//                                     ? "border-red-300 bg-red-50"
//                                     : "border-gray-300"
//                                 }`}
//                               >
//                                 <option value="" className="text-gray-500">
//                                   Selecione a cor do cabelo
//                                 </option>
//                                 {hairColorOptions.map((color) => (
//                                   <option key={color} value={color} className="text-gray-700">
//                                     {color}
//                                   </option>
//                                 ))}
//                               </select>
//                               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
//                                 <Palette className="h-5 w-5" />
//                               </div>
//                             </div>
//                             {errors.hair_color && touched.hair_color && (
//                               <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="text-red-500 text-xs mt-1 flex items-center"
//                               >
//                                 <AlertCircle className="h-3 w-3 mr-1" />
//                                 {errors.hair_color}
//                               </motion.p>
//                             )}
//                           </div>

//                           <div className="mb-5">
//                             <label className="block text-gray-700 font-medium mb-2">Habilidades Musicais</label>
//                             <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                               <label className="flex items-center text-gray-700 mb-4">
//                                 <input
//                                   type="checkbox"
//                                   name="can_sing"
//                                   checked={formData.can_sing}
//                                   onChange={handleChange}
//                                   className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-500 rounded"
//                                 />
//                                 <span className="font-medium">Canta</span>
//                               </label>

//                               <div className="mb-3">
//                                 <label className="block text-gray-700 font-medium mb-2">Instrumentos</label>
//                                 <div className="flex">
//                                   <input
//                                     type="text"
//                                     value={newInstrument}
//                                     onChange={(e) => setNewInstrument(e.target.value)}
//                                     className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
//                                     placeholder="Adicionar instrumento"
//                                     onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInstrument())}
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={addInstrument}
//                                     className="px-4 py-2 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition-colors flex items-center"
//                                   >
//                                     <PlusCircle className="h-4 w-4" />
//                                   </button>
//                                 </div>
//                               </div>

//                               <div className="flex flex-wrap gap-2 mt-2">
//                                 {formData.instruments.length > 0 ? (
//                                   formData.instruments.map((instrument, index) => (
//                                     <motion.div
//                                       key={index}
//                                       initial={{ opacity: 0, scale: 0.8 }}
//                                       animate={{ opacity: 1, scale: 1 }}
//                                       className="bg-white px-3 py-1 rounded-full flex items-center border border-gray-200 shadow-sm"
//                                     >
//                                       <Music className="h-3 w-3 text-pink-500 mr-1" />
//                                       <span className="text-sm text-gray-700">{instrument}</span>
//                                       <button
//                                         type="button"
//                                         onClick={() => removeInstrument(index)}
//                                         className="ml-1 text-gray-400 hover:text-gray-600 p-1"
//                                       >
//                                         <X className="h-3 w-3" />
//                                       </button>
//                                     </motion.div>
//                                   ))
//                                 ) : (
//                                   <p className="text-gray-400 text-sm italic">Nenhum instrumento adicionado</p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}

//                   {/* Passo 3: Idiomas e Status */}
//                   {activeStep === 3 && (
//                     <motion.div
//                       key="step3"
//                       initial="hidden"
//                       animate="visible"
//                       exit="hidden"
//                       variants={fadeIn}
//                       className="p-6"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Coluna da esquerda */}
//                         <div>
//                           <div className="flex items-center mb-6">
//                             <Globe className="h-5 w-5 text-pink-500 mr-2" />
//                             <h3 className="text-lg font-semibold text-gray-800">Idiomas</h3>
//                           </div>

//                           <div className="mb-5">
//                             <div className="flex">
//                               <input
//                                 type="text"
//                                 value={newLanguage}
//                                 onChange={(e) => setNewLanguage(e.target.value)}
//                                 className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
//                                 placeholder="Adicionar idioma"
//                                 onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={addLanguage}
//                                 className="px-4 py-3 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition-colors flex items-center"
//                               >
//                                 <PlusCircle className="h-4 w-4" />
//                               </button>
//                             </div>

//                             <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mt-4 min-h-[150px]">
//                               <div className="flex flex-wrap gap-2">
//                                 {formData.languages.length > 0 ? (
//                                   formData.languages.map((language, index) => (
//                                     <motion.div
//                                       key={index}
//                                       initial={{ opacity: 0, scale: 0.8 }}
//                                       animate={{ opacity: 1, scale: 1 }}
//                                       className="bg-white px-3 py-1 rounded-full flex items-center border border-gray-200 shadow-sm"
//                                     >
//                                       <Globe className="h-3 w-3 text-pink-500 mr-1" />
//                                       <span className="text-sm text-gray-700">{language}</span>
//                                       <button
//                                         type="button"
//                                         onClick={() => removeLanguage(index)}
//                                         className="ml-1 text-gray-400 hover:text-gray-600 p-1"
//                                       >
//                                         <X className="h-3 w-3" />
//                                       </button>
//                                     </motion.div>
//                                   ))
//                                 ) : (
//                                   <div className="flex flex-col items-center justify-center w-full h-full py-6">
//                                     <Globe className="h-8 w-8 text-gray-300 mb-2" />
//                                     <p className="text-gray-400 text-sm">Nenhum idioma adicionado</p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Coluna da direita */}
//                         <div>
//                           <div className="flex items-center mb-6">
//                             <Settings className="h-5 w-5 text-pink-500 mr-2" />
//                             <h3 className="text-lg font-semibold text-gray-800">Status</h3>
//                           </div>

//                           <div className="space-y-4">
//                             <motion.div
//                               className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                               whileHover={{ y: -2 }}
//                             >
//                               <div className="flex items-center mb-2">
//                                 <input
//                                   type="checkbox"
//                                   name="ativo"
//                                   checked={formData.ativo}
//                                   onChange={handleChange}
//                                   className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-500 rounded"
//                                   id="ativo-checkbox"
//                                 />
//                                 <label htmlFor="ativo-checkbox" className="font-medium text-gray-700 flex items-center">
//                                   Ativo
//                                   <button
//                                     type="button"
//                                     className="ml-2 text-gray-400 hover:text-gray-600"
//                                     aria-label="Informações sobre status ativo"
//                                   >
//                                     <Info className="h-4 w-4" />
//                                   </button>
//                                 </label>
//                               </div>
//                               <p className="text-sm text-gray-600 ml-8">
//                                 Quando ativo, o talento aparecerá no site para visualização pública.
//                               </p>
//                             </motion.div>

//                             <motion.div
//                               className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                               whileHover={{ y: -2 }}
//                             >
//                               <div className="flex items-center mb-2">
//                                 <input
//                                   type="checkbox"
//                                   name="destaque"
//                                   checked={formData.destaque}
//                                   onChange={handleChange}
//                                   className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-500 rounded"
//                                   id="destaque-checkbox"
//                                 />
//                                 <label
//                                   htmlFor="destaque-checkbox"
//                                   className="font-medium text-gray-700 flex items-center"
//                                 >
//                                   Destaque
//                                   <Sparkles className="h-4 w-4 text-yellow-400 ml-2" />
//                                 </label>
//                               </div>
//                               <p className="text-sm text-gray-600 ml-8">
//                                 Talentos em destaque aparecem em posições privilegiadas no site.
//                               </p>
//                             </motion.div>

//                             <motion.div
//                               className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                               whileHover={{ y: -2 }}
//                             >
//                               <div className="flex items-center mb-2">
//                                 <input
//                                   type="checkbox"
//                                   name="disponivel"
//                                   checked={formData.disponivel}
//                                   onChange={handleChange}
//                                   className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-500 rounded"
//                                   id="disponivel-checkbox"
//                                 />
//                                 <label
//                                   htmlFor="disponivel-checkbox"
//                                   className="font-medium text-gray-700 flex items-center"
//                                 >
//                                   Disponível
//                                   <button
//                                     type="button"
//                                     className="ml-2 text-gray-400 hover:text-gray-600"
//                                     aria-label="Informações sobre disponibilidade"
//                                   >
//                                     <Info className="h-4 w-4" />
//                                   </button>
//                                 </label>
//                               </div>
//                               <p className="text-sm text-gray-600 ml-8">
//                                 Indica se o talento está disponível para novos trabalhos.
//                               </p>

//                               {!formData.disponivel && (
//                                 <motion.div
//                                   initial={{ opacity: 0, height: 0 }}
//                                   animate={{ opacity: 1, height: "auto" }}
//                                   className="mt-3 ml-8"
//                                 >
//                                   <label className="block text-gray-700 text-sm font-medium mb-1">
//                                     <Calendar className="h-4 w-4 inline-block mr-1" />
//                                     Data de disponibilidade
//                                   </label>
//                                   <div className="relative">
//                                     <input
//                                       type="date"
//                                       name="data_disponibilidade"
//                                       value={formData.data_disponibilidade}
//                                       onChange={handleChange}
//                                       onBlur={handleBlur}
//                                       className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
//                                         errors.data_disponibilidade && touched.data_disponibilidade
//                                           ? "border-red-300 bg-red-50"
//                                           : "border-gray-300"
//                                       }`}
//                                     />
//                                     <Calendar className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
//                                   </div>
//                                   {errors.data_disponibilidade && touched.data_disponibilidade && (
//                                     <motion.p
//                                       initial={{ opacity: 0, y: -10 }}
//                                       animate={{ opacity: 1, y: 0 }}
//                                       className="text-red-500 text-xs mt-1 flex items-center"
//                                     >
//                                       <AlertCircle className="h-3 w-3 mr-1" />
//                                       {errors.data_disponibilidade}
//                                     </motion.p>
//                                   )}
//                                 </motion.div>
//                               )}
//                             </motion.div>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Botões de navegação e ação */}
//                 <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
//                   <div>
//                     {activeStep > 1 && (
//                       <button
//                         type="button"
//                         onClick={goToPrevStep}
//                         className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
//                       >
//                         <ChevronRight className="h-4 w-4 mr-1 transform rotate-180" />
//                         Voltar
//                       </button>
//                     )}
//                   </div>

//                   <div className="flex space-x-3">
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         onClose()
//                       }}
//                       className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
//                       disabled={isSubmitting}
//                     >
//                       Cancelar
//                     </button>

//                     {activeStep < 3 ? (
//                       <button
//                         type="button"
//                         onClick={goToNextStep}
//                         className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center shadow-sm"
//                       >
//                         Próximo
//                         <ChevronRight className="h-4 w-4 ml-1" />
//                       </button>
//                     ) : (
//                       <button
//                         type="submit"
//                         className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors flex items-center shadow-sm"
//                         disabled={isSubmitting}
//                       >
//                         {isSubmitting ? (
//                           <>
//                             <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Salvando...
//                           </>
//                         ) : (
//                           <>
//                             <Check className="h-4 w-4 mr-2" />
//                             Salvar Talento
//                           </>
//                         )}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }


"use client"

import { useState, useEffect, useRef } from "react"
import { useTalent } from "../contexts/talents-context"
import { toast } from "react-toastify"
import {
  X,
  Info,
  Calendar,
  Check,
  ChevronRight,
  Camera,
  Music,
  Globe,
  Settings,
  User,
  Ruler,
  Eye,
  Palette,
  Instagram,
  AlertCircle,
  PlusCircle,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AddTalentModal({ isOpen, onClose, onSave }) {
  const { createTalent } = useTalent()
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const modalRef = useRef(null)
  const [activeStep, setActiveStep] = useState(1)
  const [formProgress, setFormProgress] = useState(0)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  // Opções fixas para cores de olhos e cabelos
  const eyeColorOptions = ["Castanhos", "Azuis", "Verdes", "Pretos", "Mel", "Cinza", "Heterocromia"]

  const hairColorOptions = [
    "Preto",
    "Castanho Escuro",
    "Castanho Claro",
    "Loiro Escuro",
    "Loiro Claro",
    "Ruivo",
    "Grisalho",
    "Branco",
    "Colorido",
  ]

  const [formData, setFormData] = useState({
    name: "",
    type: "Ator", // Tipo do talento: Ator ou Atriz
    birth_date: "",
    height: "",
    eye_color: "",
    hair_color: "",
    instagram: "",
    can_sing: false,
    instruments: [],
    languages: [],
    ativo: true,
    destaque: false,
    disponivel: true,
    data_disponibilidade: "",
    cover: null,
  })

  const [errors, setErrors] = useState({})
  const [newInstrument, setNewInstrument] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [touched, setTouched] = useState({})

  // Calcular progresso do formulário
  useEffect(() => {
    const requiredFields = ["name", "birth_date", "height", "eye_color", "hair_color"]
    const filledRequiredFields = requiredFields.filter((field) => formData[field])
    const progress = Math.round((filledRequiredFields.length / requiredFields.length) * 100)
    setFormProgress(progress)
  }, [formData])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = "hidden"
    } else {
      setIsVisible(false)
      setTimeout(() => {
        document.body.style.overflow = "auto"
        resetForm()
      }, 300)
    }
  }, [isOpen])

  // Separar o evento de clique fora do modal do useEffect principal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      // Adicionar um pequeno delay para evitar que o evento seja capturado imediatamente
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timer)
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Ator",
      birth_date: "",
      height: "",
      eye_color: "",
      hair_color: "",
      instagram: "",
      can_sing: false,
      instruments: [],
      languages: [],
      ativo: true,
      destaque: false,
      disponivel: true,
      data_disponibilidade: "",
      cover: null,
    })
    setErrors({})
    setImagePreview(null)
    setNewInstrument("")
    setNewLanguage("")
    setActiveStep(1)
    setTouched({})
    setAttemptedSubmit(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Marcar campo como tocado
    setTouched({ ...touched, [name]: true })

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })
    validateField(name, formData[name])
  }

  const validateField = (name, value) => {
    let error = null

    switch (name) {
      case "name":
        if (!value.trim()) error = "Nome é obrigatório"
        break
      case "birth_date":
        if (!value) error = "Data de nascimento é obrigatória"
        break
      case "height":
        if (!value) error = "Altura é obrigatória"
        break
      case "eye_color":
        if (!value) error = "Cor dos olhos é obrigatória"
        break
      case "hair_color":
        if (!value) error = "Cor do cabelo é obrigatória"
        break
      case "instagram":
        if (value && !value.startsWith("@")) error = "Instagram deve começar com @"
        break
      case "data_disponibilidade":
        if (!formData.disponivel && !value) error = "Data de disponibilidade é obrigatória quando não está disponível"
        break
      default:
        break
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
      return false
    }

    setErrors((prev) => ({ ...prev, [name]: null }))
    return true
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Verificar tamanho do arquivo (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, cover: "A imagem deve ter menos de 5MB" })
        return
      }

      try {
        // Converter para base64
        const base64Image = await convertToBase64(file)
        setFormData({ ...formData, cover: base64Image })
        setImagePreview(base64Image)

        // Limpar erro do campo
        if (errors.cover) {
          setErrors({ ...errors, cover: null })
        }

        // Mostrar toast de sucesso
        toast.success("Imagem carregada com sucesso!")
      } catch (error) {
        console.error("Erro ao converter imagem:", error)
        setErrors({ ...errors, cover: "Erro ao processar a imagem" })
        toast.error("Erro ao processar a imagem")
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        // Verificar tamanho do arquivo (limite de 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors({ ...errors, cover: "A imagem deve ter menos de 5MB" })
          toast.error("A imagem deve ter menos de 5MB")
          return
        }

        try {
          // Converter para base64
          const base64Image = await convertToBase64(file)
          setFormData({ ...formData, cover: base64Image })
          setImagePreview(base64Image)

          // Limpar erro do campo
          if (errors.cover) {
            setErrors({ ...errors, cover: null })
          }

          // Mostrar toast de sucesso
          toast.success("Imagem carregada com sucesso!")
        } catch (error) {
          console.error("Erro ao converter imagem:", error)
          setErrors({ ...errors, cover: "Erro ao processar a imagem" })
          toast.error("Erro ao processar a imagem")
        }
      } else {
        setErrors({ ...errors, cover: "O arquivo deve ser uma imagem" })
        toast.error("O arquivo deve ser uma imagem")
      }
    }
  }

  const addInstrument = () => {
    if (newInstrument.trim() && !formData.instruments.includes(newInstrument.trim())) {
      setFormData({
        ...formData,
        instruments: [...formData.instruments, newInstrument.trim()],
      })
      setNewInstrument("")
      // Mostrar feedback visual
      toast.success(`Instrumento "${newInstrument.trim()}" adicionado!`, { autoClose: 1500 })
    }
  }

  const removeInstrument = (index) => {
    const updatedInstruments = [...formData.instruments]
    const removed = updatedInstruments[index]
    updatedInstruments.splice(index, 1)
    setFormData({ ...formData, instruments: updatedInstruments })
    // Mostrar feedback visual
    toast.info(`Instrumento "${removed}" removido`, { autoClose: 1500 })
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()],
      })
      setNewLanguage("")
      // Mostrar feedback visual
      toast.success(`Idioma "${newLanguage.trim()}" adicionado!`, { autoClose: 1500 })
    }
  }

  const removeLanguage = (index) => {
    const updatedLanguages = [...formData.languages]
    const removed = updatedLanguages[index]
    updatedLanguages.splice(index, 1)
    setFormData({ ...formData, languages: updatedLanguages })
    // Mostrar feedback visual
    toast.info(`Idioma "${removed}" removido`, { autoClose: 1500 })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!formData.birth_date) newErrors.birth_date = "Data de nascimento é obrigatória"
    if (!formData.height) newErrors.height = "Altura é obrigatória"
    if (!formData.eye_color) newErrors.eye_color = "Cor dos olhos é obrigatória"
    if (!formData.hair_color) newErrors.hair_color = "Cor do cabelo é obrigatória"

    // Validar formato do Instagram (opcional)
    if (formData.instagram && !formData.instagram.startsWith("@")) {
      newErrors.instagram = "Instagram deve começar com @"
    }

    // Validar data de disponibilidade se não estiver disponível
    if (!formData.disponivel && !formData.data_disponibilidade) {
      newErrors.data_disponibilidade = "Data de disponibilidade é obrigatória quando não está disponível"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Marcar que houve uma tentativa de envio
    setAttemptedSubmit(true)

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário", { toastId: "form-validation-error" })
      return
    }

    setIsSubmitting(true)

    try {
      // Adicionar categoria fixa como STAGE
      const talentData = {
        ...formData,
        category: "STAGE",
      }

      await createTalent(talentData)
      toast.success("Talento adicionado com sucesso!", { toastId: "add-talent-success" })

      if (onSave) {
        onSave(talentData)
      }

      onClose()
    } catch (error) {
      console.error("Erro ao adicionar talento:", error)
      toast.error(`Erro ao adicionar talento: ${error.message}`, { toastId: "add-talent-error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Impedir a propagação do clique dentro do modal
  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  // Navegar para o próximo passo
  const goToNextStep = () => {
    // Validar apenas os campos do passo atual antes de avançar
    let isValid = true

    if (activeStep === 1) {
      // Validar campos do passo 1
      if (!formData.name.trim()) {
        setErrors((prev) => ({ ...prev, name: "Nome é obrigatório" }))
        setTouched((prev) => ({ ...prev, name: true }))
        isValid = false
      }
      if (!formData.birth_date) {
        setErrors((prev) => ({ ...prev, birth_date: "Data de nascimento é obrigatória" }))
        setTouched((prev) => ({ ...prev, birth_date: true }))
        isValid = false
      }
    } else if (activeStep === 2) {
      // Validar campos do passo 2
      if (!formData.height) {
        setErrors((prev) => ({ ...prev, height: "Altura é obrigatória" }))
        setTouched((prev) => ({ ...prev, height: true }))
        isValid = false
      }
      if (!formData.eye_color) {
        setErrors((prev) => ({ ...prev, eye_color: "Cor dos olhos é obrigatória" }))
        setTouched((prev) => ({ ...prev, eye_color: true }))
        isValid = false
      }
      if (!formData.hair_color) {
        setErrors((prev) => ({ ...prev, hair_color: "Cor do cabelo é obrigatória" }))
        setTouched((prev) => ({ ...prev, hair_color: true }))
        isValid = false
      }
    }
    // Não validamos o passo 3 aqui, pois isso só deve acontecer no submit

    if (!isValid) {
      toast.error("Por favor, preencha os campos obrigatórios", { toastId: "validation-error" })
      return
    }

    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
      // Resetar a posição do scroll para o topo
      const contentElement = document.querySelector(".overflow-y-auto")
      if (contentElement) {
        contentElement.scrollTop = 0
      }
    }
  }

  // Navegar para o passo anterior
  const goToPrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
      // Resetar a posição do scroll para o topo
      const contentElement = document.querySelector(".overflow-y-auto")
      if (contentElement) {
        contentElement.scrollTop = 0
      }
    }
  }

  // Ir para um passo específico
  const goToStep = (step) => {
    setActiveStep(step)
    // Resetar a posição do scroll para o topo
    const contentElement = document.querySelector(".overflow-y-auto")
    if (contentElement) {
      contentElement.scrollTop = 0
    }
  }

  if (!isOpen) return null

  // Variantes de animação para o Framer Motion
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  }

  const slideIn = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 sm:p-4 overflow-y-auto backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            onClick={handleModalClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl transform relative overflow-hidden"
            style={{ maxHeight: "95vh" }}
          >
            {/* Barra de progresso - Agora dentro do header para evitar a faixa branca */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 relative">
              {/* Barra de progresso no topo do header */}
              <div className="absolute top-0 left-0 right-0 h-1">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${formProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Adicionar Novo Talento</h2>
                  <div className="flex items-center mt-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((step) => (
                        <button
                          key={step}
                          onClick={() => goToStep(step)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            step === activeStep
                              ? "w-8 bg-pink-500"
                              : step < activeStep
                                ? "w-4 bg-pink-300"
                                : "w-4 bg-gray-500 bg-opacity-40"
                          }`}
                          aria-label={`Ir para o passo ${step}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs ml-3">Passo {activeStep} de 3</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition-colors"
                  aria-label="Fechar"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo com scroll */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(95vh - 80px)" }}>
              {/* Importante: Usar onSubmit apenas no botão de submit, não no form */}
              <form>
                {/* Passo 1: Informações Básicas */}
                <AnimatePresence mode="wait">
                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={fadeIn}
                      className="p-6"
                    >
                      <div className="flex items-center mb-6">
                        <User className="h-5 w-5 text-pink-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Informações Básicas</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Coluna da esquerda */}
                        <div>
                          <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">Foto do Talento</label>
                            <div
                              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                                errors.cover ? "border-red-300" : "border-gray-300"
                              } group relative overflow-hidden`}
                              onClick={triggerFileInput}
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                            >
                              {imagePreview ? (
                                <div className="relative">
                                  <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="mx-auto h-56 w-56 object-cover rounded-lg shadow-md"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg">
                                      <Camera className="h-5 w-5 text-pink-500 inline-block mr-1" />
                                      <span className="text-gray-800 text-sm font-medium">Alterar imagem</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-10 px-4">
                                  <div className="bg-pink-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                    <Camera className="h-10 w-10 text-pink-400" />
                                  </div>
                                  <p className="text-gray-700 font-medium mb-2">Arraste e solte uma foto aqui</p>
                                  <p className="text-gray-500 text-sm mb-4">ou</p>
                                  <button
                                    type="button"
                                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-sm"
                                  >
                                    Selecionar Imagem
                                  </button>
                                  <p className="text-gray-400 text-xs mt-4">
                                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                                  </p>
                                </div>
                              )}
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                              />
                            </div>
                            {errors.cover && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1 flex items-center"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.cover}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Coluna da direita */}
                        <div>
                          <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">
                              Nome Completo <span className="text-pink-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                                errors.name && touched.name ? "border-red-300 bg-red-50" : "border-gray-300"
                              }`}
                              placeholder="Nome do talento"
                            />
                            {errors.name && touched.name && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1 flex items-center"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.name}
                              </motion.p>
                            )}
                          </div>

                          <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">
                              Tipo do Talento <span className="text-pink-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <label
                                className={`
                                flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer h-12
                                ${
                                  formData.type === "Ator"
                                    ? "border-pink-500 bg-pink-50 text-pink-700"
                                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                                }
                              `}
                              >
                                <input
                                  type="radio"
                                  name="type"
                                  value="Ator"
                                  checked={formData.type === "Ator"}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <span className="font-medium">Ator</span>
                              </label>
                              <label
                                className={`
                                flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer h-12
                                ${
                                  formData.type === "Atriz"
                                    ? "border-pink-500 bg-pink-50 text-pink-700"
                                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                                }
                              `}
                              >
                                <input
                                  type="radio"
                                  name="type"
                                  value="Atriz"
                                  checked={formData.type === "Atriz"}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <span className="font-medium">Atriz</span>
                              </label>
                            </div>
                          </div>

                          <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">
                              Data de Nascimento <span className="text-pink-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 ${
                                  errors.birth_date && touched.birth_date
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300"
                                }`}
                              />
                              <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.birth_date && touched.birth_date && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1 flex items-center"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.birth_date}
                              </motion.p>
                            )}
                          </div>

                          <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">Instagram</label>
                            <div className="relative">
                              <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                  errors.instagram && touched.instagram ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                                placeholder="@usuario"
                              />
                              <Instagram className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            </div>
                            {errors.instagram && touched.instagram ? (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1 flex items-center"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.instagram}
                              </motion.p>
                            ) : (
                              <p className="text-gray-500 text-xs mt-1">Exemplo: @usuario</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Passo 2: Características Físicas */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={fadeIn}
                      className="p-6"
                    >
                      <div className="flex items-center mb-6">
                        <Ruler className="h-5 w-5 text-pink-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Características Físicas</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Coluna da esquerda */}
                        <div>
                          <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">
                              Altura (cm) <span className="text-pink-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 ${
                                  errors.height && touched.height ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                                placeholder="170"
                                min="100"
                                max="250"
                              />
                              <span className="absolute right-3 top-3 text-gray-400">cm</span>
                            </div>
                            {errors.height && touched.height && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1 flex items-center"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.height}
                              </motion.p>
                            )}
                          </div>

                          <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">
                              Cor dos Olhos <span className="text-pink-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                name="eye_color"
                                value={formData.eye_color}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 appearance-none ${
                                  errors.eye_color && touched.eye_color ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                              >
                                <option value="" className="text-gray-500">
                                  Selecione a cor dos olhos
                                </option>
                                {eyeColorOptions.map((color) => (
                                  <option key={color} value={color} className="text-gray-700">
                                    {color}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <Eye className="h-5 w-5" />
                              </div>
                            </div>
                            {errors.eye_color && touched.eye_color && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1 flex items-center"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.eye_color}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Coluna da direita */}
                        <div>
                          <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">
                              Cor do Cabelo <span className="text-pink-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                name="hair_color"
                                value={formData.hair_color}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 appearance-none ${
                                  errors.hair_color && touched.hair_color
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300"
                                }`}
                              >
                                <option value="" className="text-gray-500">
                                  Selecione a cor do cabelo
                                </option>
                                {hairColorOptions.map((color) => (
                                  <option key={color} value={color} className="text-gray-700">
                                    {color}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <Palette className="h-5 w-5" />
                              </div>
                            </div>
                            {errors.hair_color && touched.hair_color && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1 flex items-center"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.hair_color}
                              </motion.p>
                            )}
                          </div>

                          <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">Habilidades Musicais</label>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <label className="flex items-center text-gray-700 mb-4">
                                <input
                                  type="checkbox"
                                  name="can_sing"
                                  checked={formData.can_sing}
                                  onChange={handleChange}
                                  className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-500 rounded"
                                />
                                <span className="font-medium">Canta</span>
                              </label>

                              <div className="mb-3">
                                <label className="block text-gray-700 font-medium mb-2">Instrumentos</label>
                                <div className="flex">
                                  <input
                                    type="text"
                                    value={newInstrument}
                                    onChange={(e) => setNewInstrument(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
                                    placeholder="Adicionar instrumento"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInstrument())}
                                  />
                                  <button
                                    type="button"
                                    onClick={addInstrument}
                                    className="px-4 py-2 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition-colors flex items-center"
                                  >
                                    <PlusCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mt-2">
                                {formData.instruments.length > 0 ? (
                                  formData.instruments.map((instrument, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="bg-white px-3 py-1 rounded-full flex items-center border border-gray-200 shadow-sm"
                                    >
                                      <Music className="h-3 w-3 text-pink-500 mr-1" />
                                      <span className="text-sm text-gray-700">{instrument}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeInstrument(index)}
                                        className="ml-1 text-gray-400 hover:text-gray-600 p-1"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </motion.div>
                                  ))
                                ) : (
                                  <p className="text-gray-400 text-sm italic">Nenhum instrumento adicionado</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Passo 3: Idiomas e Status */}
                  {activeStep === 3 && (
                    <motion.div
                      key="step3"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={fadeIn}
                      className="p-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Coluna da esquerda - Idiomas */}
                        <div>
                          <div className="flex items-center mb-6">
                            <Globe className="h-5 w-5 text-pink-500 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">Idiomas</h3>
                          </div>

                          <div className="mb-5">
                            <div className="flex">
                              <input
                                type="text"
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
                                placeholder="Adicionar idioma"
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                              />
                              <button
                                type="button"
                                onClick={addLanguage}
                                className="px-4 py-3 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition-colors flex items-center"
                              >
                                <PlusCircle className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mt-4 min-h-[150px]">
                              <div className="flex flex-wrap gap-2">
                                {formData.languages.length > 0 ? (
                                  formData.languages.map((language, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="bg-white px-3 py-1 rounded-full flex items-center border border-gray-200 shadow-sm"
                                    >
                                      <Globe className="h-3 w-3 text-pink-500 mr-1" />
                                      <span className="text-sm text-gray-700">{language}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeLanguage(index)}
                                        className="ml-1 text-gray-400 hover:text-gray-600 p-1"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </motion.div>
                                  ))
                                ) : (
                                  <div className="flex flex-col items-center justify-center w-full h-full py-6">
                                    <Globe className="h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-gray-400 text-sm">Nenhum idioma adicionado</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Coluna da direita - Status */}
                        <div>
                          <div className="flex items-center mb-6">
                            <Settings className="h-5 w-5 text-pink-500 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                          </div>

                          <div className="space-y-4">
                            <motion.div
                              className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                              whileHover={{ y: -2 }}
                            >
                              <div className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  name="ativo"
                                  checked={formData.ativo}
                                  onChange={handleChange}
                                  className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-500 rounded"
                                  id="ativo-checkbox"
                                />
                                <label htmlFor="ativo-checkbox" className="font-medium text-gray-700 flex items-center">
                                  Ativo
                                  <button
                                    type="button"
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    aria-label="Informações sobre status ativo"
                                  >
                                    <Info className="h-4 w-4" />
                                  </button>
                                </label>
                              </div>
                              <p className="text-sm text-gray-600 ml-8">
                                Quando ativo, o talento aparecerá no site para visualização pública.
                              </p>
                            </motion.div>

                            <motion.div
                              className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                              whileHover={{ y: -2 }}
                            >
                              <div className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  name="destaque"
                                  checked={formData.destaque}
                                  onChange={handleChange}
                                  className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-500 rounded"
                                  id="destaque-checkbox"
                                />
                                <label
                                  htmlFor="destaque-checkbox"
                                  className="font-medium text-gray-700 flex items-center"
                                >
                                  Destaque
                                  <Sparkles className="h-4 w-4 text-yellow-400 ml-2" />
                                </label>
                              </div>
                              <p className="text-sm text-gray-600 ml-8">
                                Talentos em destaque aparecem em posições privilegiadas no site.
                              </p>
                            </motion.div>

                            <motion.div
                              className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                              whileHover={{ y: -2 }}
                            >
                              <div className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  name="disponivel"
                                  checked={formData.disponivel}
                                  onChange={handleChange}
                                  className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-500 rounded"
                                  id="disponivel-checkbox"
                                />
                                <label
                                  htmlFor="disponivel-checkbox"
                                  className="font-medium text-gray-700 flex items-center"
                                >
                                  Disponível
                                  <button
                                    type="button"
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    aria-label="Informações sobre disponibilidade"
                                  >
                                    <Info className="h-4 w-4" />
                                  </button>
                                </label>
                              </div>
                              <p className="text-sm text-gray-600 ml-8">
                                Indica se o talento está disponível para novos trabalhos.
                              </p>

                              {!formData.disponivel && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-3 ml-8"
                                >
                                  <label className="block text-gray-700 text-sm font-medium mb-1">
                                    <Calendar className="h-4 w-4 inline-block mr-1" />
                                    Data de disponibilidade
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="date"
                                      name="data_disponibilidade"
                                      value={formData.data_disponibilidade}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                        errors.data_disponibilidade && touched.data_disponibilidade
                                          ? "border-red-300 bg-red-50"
                                          : "border-gray-300"
                                      }`}
                                    />
                                    <Calendar className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                                  </div>
                                  {errors.data_disponibilidade && touched.data_disponibilidade && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="text-red-500 text-xs mt-1 flex items-center"
                                    >
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      {errors.data_disponibilidade}
                                    </motion.p>
                                  )}
                                </motion.div>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botões de navegação e ação */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div>
                      {activeStep > 1 && (
                        <button
                          type="button"
                          onClick={goToPrevStep}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
                        >
                          <ChevronRight className="h-4 w-4 mr-1 transform rotate-180" />
                          Voltar
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onClose()
                        }}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </button>

                      {activeStep < 3 ? (
                        <button
                          type="button"
                          onClick={goToNextStep}
                          className="w-full sm:w-auto px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center shadow-sm"
                        >
                          Próximo
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      ) : (
                        <button
                          type="button" // Importante: usar type="button" aqui
                          onClick={handleSubmit} // Chamar handleSubmit diretamente
                          className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors flex items-center justify-center shadow-sm"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
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
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Salvar Talento
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
