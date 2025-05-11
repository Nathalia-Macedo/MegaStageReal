// import { useState, useEffect, useRef } from "react"
// import { useTalent } from "../contexts/talents-context"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   X,
//   Instagram,
//   Star,
//   Edit,
//   Globe,
//   Clock,
//   Check,
//   AlertCircle,
//   Music,
//   Calendar,
//   Ruler,
//   Eye,
//   Palette,
// } from "lucide-react"
// import { toast } from "react-toastify"

// export default function TalentModal({ onClose }) {
//   const { selectedTalent, isModalOpen, closeModal, toggleHighlight } = useTalent()
//   const [isVisible, setIsVisible] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const modalRef = useRef(null)

//   useEffect(() => {
//     if (isModalOpen) {
//       setIsVisible(true)
//       document.body.style.overflow = "hidden"
//     }
//     return () => {
//       document.body.style.overflow = "auto"
//     }
//   }, [isModalOpen])

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         handleClose()
//       }
//     }

//     if (isModalOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isModalOpen])

//   useEffect(() => {
//     const handleEscKey = (event) => {
//       if (event.key === "Escape") {
//         handleClose()
//       }
//     }

//     if (isModalOpen) {
//       window.addEventListener("keydown", handleEscKey)
//     }

//     return () => {
//       window.removeEventListener("keydown", handleEscKey)
//     }
//   }, [isModalOpen])

//   if (!isModalOpen || !selectedTalent) return null

//   const calculateAge = (birthDate) => {
//     if (!birthDate) return "-"
//     const today = new Date()
//     const birth = new Date(birthDate)
//     let age = today.getFullYear() - birth.getFullYear()
//     const monthDiff = today.getMonth() - birth.getMonth()
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//       age--
//     }
//     return age
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "-"
//     try {
//       const date = new Date(dateString)
//       return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
//     } catch (error) {
//       return dateString
//     }
//   }

//   const handleToggleHighlight = async () => {
//     try {
//       setIsLoading(true)
//       await toggleHighlight(selectedTalent.id, selectedTalent.destaque)
//       toast.success(selectedTalent.destaque ? "Destaque removido com sucesso!" : "Destaque adicionado com sucesso!", {
//         toastId: `toggle-highlight-${selectedTalent.id}-success`,
//       })
//     } catch (error) {
//       console.error("Erro ao alternar destaque:", error)
//       toast.error(`Erro ao alternar destaque: ${error.message}`, {
//         toastId: `toggle-highlight-${selectedTalent.id}-error`,
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleClose = () => {
//     setIsVisible(false)
//     setTimeout(() => {
//       closeModal()
//       onClose()
//     }, 300)
//   }

//   const handleEdit = () => {
//     console.log(`Editando talento ${selectedTalent.id}`)
//     handleClose()
//   }

//   const formatHeight = (height) => {
//     if (!height) return "-"
//     if (height.includes("cm")) return height
//     return `${height} cm`
//   }

//   const formatInstagram = (instagram) => {
//     if (!instagram) return null
//     return instagram.startsWith("@") ? instagram : `@${instagram}`
//   }

//   const getStatusColor = () => {
//     if (!selectedTalent.ativo) return "bg-red-500"
//     return selectedTalent.disponivel ? "bg-emerald-500" : "bg-amber-500"
//   }

//   const getStatusText = () => {
//     if (!selectedTalent.ativo) return "Inativo"
//     return selectedTalent.disponivel ? "Disponível" : "Indisponível"
//   }

//   const getStatusIcon = () => {
//     if (!selectedTalent.ativo) return <AlertCircle className="h-3.5 w-3.5" />
//     return selectedTalent.disponivel ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />
//   }

//   return (
//     <AnimatePresence>
//       {isModalOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//         >
//           <motion.div
//             ref={modalRef}
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             transition={{ type: "spring", damping: 30, stiffness: 400 }}
//             className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
//           >
//             <button
//               onClick={handleClose}
//               className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-gray-600 hover:text-gray-900 hover:bg-white transition-all shadow-sm focus:outline-none"
//               aria-label="Fechar"
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <div className="flex flex-col md:flex-row">
//               {/* Coluna da foto */}
//               <div className="w-full md:w-2/5 relative">
//                 <div className="relative aspect-[3/4] bg-gray-100">
//                   <img
//                     src={selectedTalent.cover || "/placeholder.svg"}
//                     alt={selectedTalent.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.onerror = null
//                       e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="64" fill="%23d0d0d0" textAnchor="middle" dy=".3em">${selectedTalent.name?.charAt(0) || "T"}</text></svg>`
//                     }}
//                   />

//                   {/* Status indicator */}
//                   <div className="absolute top-4 left-4 flex items-center space-x-1.5">
//                     <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`}></div>
//                     <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
//                       {getStatusText()}
//                     </span>
//                   </div>

//                   {/* Destaque badge */}
//                   {selectedTalent.destaque && (
//                     <div className="absolute top-4 right-4 bg-amber-400 p-1.5 rounded-full shadow-lg">
//                       <Star className="h-4 w-4 text-white fill-white" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Coluna de informações */}
//               <div className="w-full md:w-3/5 p-8 overflow-y-auto" style={{ maxHeight: "85vh" }}>
//                 <div className="space-y-6">
//                   {/* Cabeçalho */}
//                   <div className="space-y-1">
//                     <div className="flex items-center">
//                       <h2 className="text-2xl font-bold text-gray-900">{selectedTalent.name}</h2>
//                       <div
//                         className={`ml-3 px-2.5 py-1 text-xs font-medium rounded-full ${
//                           selectedTalent.category === "Ator" || selectedTalent.category === "Atriz"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-purple-100 text-purple-800"
//                         }`}
//                       >
//                         {selectedTalent.category || selectedTalent.tipo_talento}
//                       </div>
//                     </div>

//                     <div className="flex items-center text-gray-500 text-sm">
//                       <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
//                       <span>{calculateAge(selectedTalent.birth_date)} anos</span>

//                       {selectedTalent.instagram && (
//                         <>
//                           <span className="mx-2">•</span>
//                           <a
//                             href={`https://instagram.com/${formatInstagram(selectedTalent.instagram).replace("@", "")}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center text-pink-500 hover:text-pink-600 transition-colors"
//                           >
//                             <Instagram className="h-4 w-4 mr-1" />
//                             {formatInstagram(selectedTalent.instagram)}
//                           </a>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* Disponibilidade */}
//                   {!selectedTalent.disponivel && selectedTalent.data_disponibilidade && (
//                     <div className="flex items-center p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
//                       <Clock className="h-4 w-4 mr-2 text-amber-500" />
//                       <span>
//                         Disponível a partir de: <strong>{formatDate(selectedTalent.data_disponibilidade)}</strong>
//                       </span>
//                     </div>
//                   )}

//                   {/* Características */}
//                   <div>
//                     <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Características</h3>
//                     <div className="grid grid-cols-3 gap-3">
//                       <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
//                         <Ruler className="h-5 w-5 text-gray-400 mb-1" />
//                         <span className="text-sm text-gray-500">Altura</span>
//                         <span className="font-medium text-gray-900">{formatHeight(selectedTalent.height)}</span>
//                       </div>

//                       <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
//                         <Palette className="h-5 w-5 text-gray-400 mb-1" />
//                         <span className="text-sm text-gray-500">Cabelos</span>
//                         <span className="font-medium text-gray-900">{selectedTalent.hair_color || "-"}</span>
//                       </div>

//                       <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
//                         <Eye className="h-5 w-5 text-gray-400 mb-1" />
//                         <span className="text-sm text-gray-500">Olhos</span>
//                         <span className="font-medium text-gray-900">{selectedTalent.eye_color || "-"}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Habilidades e Idiomas */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Habilidades */}
//                     <div>
//                       <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Habilidades</h3>
//                       <div className="space-y-2">
//                         <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
//                           <div className="mr-3 p-1.5 bg-pink-100 rounded-full">
//                             <Music className="h-4 w-4 text-pink-500" />
//                           </div>
//                           <div>
//                             <span className="text-sm text-gray-900 font-medium">Canta</span>
//                             <span className="ml-2 text-sm text-gray-500">
//                               {selectedTalent.can_sing ? "Sim" : "Não"}
//                             </span>
//                           </div>
//                         </div>

//                         {selectedTalent.instruments && selectedTalent.instruments.length > 0 && (
//                           <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
//                             <div className="mr-3 p-1.5 bg-pink-100 rounded-full">
//                               <Music className="h-4 w-4 text-pink-500" />
//                             </div>
//                             <div>
//                               <span className="text-sm text-gray-900 font-medium">Instrumentos</span>
//                               <span className="ml-2 text-sm text-gray-500">
//                                 {selectedTalent.instruments.join(", ")}
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Idiomas */}
//                     <div>
//                       <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Idiomas</h3>
//                       {selectedTalent.languages && selectedTalent.languages.length > 0 ? (
//                         <div className="flex flex-wrap gap-2">
//                           {selectedTalent.languages.map((language, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100"
//                             >
//                               <Globe className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
//                               <span className="text-sm text-gray-700">{language}</span>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500">
//                           Nenhum idioma cadastrado
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Ações */}
//                   <div className="pt-4 flex space-x-3">
//                     <button
//                       onClick={handleEdit}
//                       className="flex-1 flex items-center justify-center h-11 bg-gray-900 hover:bg-black text-white rounded-lg transition-colors shadow-sm"
//                       type="button"
//                     >
//                       <Edit className="h-4 w-4 mr-2" />
//                       Editar Perfil
//                     </button>

//                     <button
//                       onClick={handleToggleHighlight}
//                       disabled={isLoading}
//                       className={`flex-1 flex items-center justify-center h-11 rounded-lg transition-colors shadow-sm ${
//                         selectedTalent.destaque
//                           ? "bg-amber-500 hover:bg-amber-600 text-white"
//                           : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
//                       }`}
//                       type="button"
//                     >
//                       {isLoading ? (
//                         <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></div>
//                       ) : (
//                         <>
//                           <Star className={`h-4 w-4 mr-2 ${selectedTalent.destaque ? "fill-white" : ""}`} />
//                           {selectedTalent.destaque ? "Remover Destaque" : "Destacar Talento"}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
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
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Instagram,
  Star,
  Edit,
  Globe,
  Clock,
  Check,
  AlertCircle,
  Music,
  Calendar,
  Ruler,
  Eye,
  Palette,
} from "lucide-react"
import { toast } from "react-toastify"

export default function TalentModal({ onClose }) {
  const { selectedTalent, isModalOpen, closeModal, toggleHighlight, openEditModal } = useTalent()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isModalOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose()
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isModalOpen])

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (isModalOpen) {
      window.addEventListener("keydown", handleEscKey)
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [isModalOpen])

  if (!isModalOpen || !selectedTalent) return null

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
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
    } catch (error) {
      return dateString
    }
  }

  const handleToggleHighlight = async () => {
    try {
      setIsLoading(true)
      await toggleHighlight(selectedTalent.id, selectedTalent.destaque)

      // Atualizar o estado local do talento para refletir a mudança imediatamente
      selectedTalent.destaque = !selectedTalent.destaque

      toast.success(selectedTalent.destaque ? "Destaque adicionado com sucesso!" : "Destaque removido com sucesso!", {
        toastId: `toggle-highlight-${selectedTalent.id}-success`,
      })
    } catch (error) {
      console.error("Erro ao alternar destaque:", error)
      toast.error(`Erro ao alternar destaque: ${error.message}`, {
        toastId: `toggle-highlight-${selectedTalent.id}-error`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      closeModal()
      if (onClose) onClose()
    }, 300)
  }

  const handleEdit = () => {
    console.log(`Editando talento ${selectedTalent.id}`)
    // Fechar o modal atual
    handleClose()

    // Abrir o modal de edição com o ID do talento selecionado
    if (typeof openEditModal === "function") {
      openEditModal(selectedTalent.id)
    } else {
      // Fallback se a função não estiver disponível no contexto
      toast.error("Função de edição não disponível")
    }
  }

  const formatHeight = (height) => {
    if (!height) return "-"
    if (height.includes("cm")) return height
    return `${height} cm`
  }

  const formatInstagram = (instagram) => {
    if (!instagram) return null
    return instagram.startsWith("@") ? instagram : `@${instagram}`
  }

  const getStatusColor = () => {
    if (!selectedTalent.ativo) return "bg-red-500"
    return selectedTalent.disponivel ? "bg-emerald-500" : "bg-amber-500"
  }

  const getStatusText = () => {
    if (!selectedTalent.ativo) return "Inativo"
    return selectedTalent.disponivel ? "Disponível" : "Indisponível"
  }

  const getStatusIcon = () => {
    if (!selectedTalent.ativo) return <AlertCircle className="h-3.5 w-3.5" />
    return selectedTalent.disponivel ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-gray-600 hover:text-gray-900 hover:bg-white transition-all shadow-sm focus:outline-none"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Coluna da foto */}
              <div className="w-full md:w-2/5 relative">
                <div className="relative aspect-[3/4] bg-gray-100">
                  <img
                    src={selectedTalent.cover || "/placeholder.svg"}
                    alt={selectedTalent.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="64" fill="%23d0d0d0" textAnchor="middle" dy=".3em">${selectedTalent.name?.charAt(0) || "T"}</text></svg>`
                    }}
                  />

                  {/* Status indicator */}
                  <div className="absolute top-4 left-4 flex items-center space-x-1.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`}></div>
                    <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {getStatusText()}
                    </span>
                  </div>

                  {/* Destaque badge */}
                  {selectedTalent.destaque && (
                    <div className="absolute top-4 right-4 bg-amber-400 p-1.5 rounded-full shadow-lg">
                      <Star className="h-4 w-4 text-white fill-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna de informações */}
              <div className="w-full md:w-3/5 p-8 overflow-y-auto" style={{ maxHeight: "85vh" }}>
                <div className="space-y-6">
                  {/* Cabeçalho */}
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTalent.name}</h2>
                      <div
                        className={`ml-3 px-2.5 py-1 text-xs font-medium rounded-full ${
                          selectedTalent.category === "Ator" || selectedTalent.category === "Atriz"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {selectedTalent.category || selectedTalent.tipo_talento}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span>{calculateAge(selectedTalent.birth_date)} anos</span>

                      {selectedTalent.instagram && (
                        <>
                          <span className="mx-2">•</span>
                          <a
                            href={`https://instagram.com/${formatInstagram(selectedTalent.instagram).replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-pink-500 hover:text-pink-600 transition-colors"
                          >
                            <Instagram className="h-4 w-4 mr-1" />
                            {formatInstagram(selectedTalent.instagram)}
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Disponibilidade */}
                  {!selectedTalent.disponivel && selectedTalent.data_disponibilidade && (
                    <div className="flex items-center p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                      <span>
                        Disponível a partir de: <strong>{formatDate(selectedTalent.data_disponibilidade)}</strong>
                      </span>
                    </div>
                  )}

                  {/* Características */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Características</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <Ruler className="h-5 w-5 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">Altura</span>
                        <span className="font-medium text-gray-900">{formatHeight(selectedTalent.height)}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <Palette className="h-5 w-5 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">Cabelos</span>
                        <span className="font-medium text-gray-900">{selectedTalent.hair_color || "-"}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <Eye className="h-5 w-5 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">Olhos</span>
                        <span className="font-medium text-gray-900">{selectedTalent.eye_color || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Habilidades e Idiomas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Habilidades */}
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Habilidades</h3>
                      <div className="space-y-2">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="mr-3 p-1.5 bg-pink-100 rounded-full">
                            <Music className="h-4 w-4 text-pink-500" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-900 font-medium">Canta</span>
                            <span className="ml-2 text-sm text-gray-500">
                              {selectedTalent.can_sing ? "Sim" : "Não"}
                            </span>
                          </div>
                        </div>

                        {selectedTalent.instruments && selectedTalent.instruments.length > 0 && (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="mr-3 p-1.5 bg-pink-100 rounded-full">
                              <Music className="h-4 w-4 text-pink-500" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-900 font-medium">Instrumentos</span>
                              <span className="ml-2 text-sm text-gray-500">
                                {selectedTalent.instruments.join(", ")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Idiomas */}
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">Idiomas</h3>
                      {selectedTalent.languages && selectedTalent.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedTalent.languages.map((language, index) => (
                            <div
                              key={index}
                              className="flex items-center px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100"
                            >
                              <Globe className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-700">{language}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500">
                          Nenhum idioma cadastrado
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="pt-4 flex space-x-3">
                    <button
                      onClick={handleEdit}
                      className="flex-1 flex items-center justify-center h-11 bg-gray-900 hover:bg-black text-white rounded-lg transition-colors shadow-sm"
                      type="button"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </button>

                    <button
                      onClick={handleToggleHighlight}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center h-11 rounded-lg transition-colors shadow-sm ${
                        selectedTalent.destaque
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                      }`}
                      type="button"
                    >
                      {isLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          <Star className={`h-4 w-4 mr-2 ${selectedTalent.destaque ? "fill-white" : ""}`} />
                          {selectedTalent.destaque ? "Remover Destaque" : "Destacar Talento"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
