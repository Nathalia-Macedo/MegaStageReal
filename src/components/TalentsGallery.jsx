// import { useState, useEffect, useRef } from "react"
// import { useTalent } from "../contexts/talents-context"
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
// import {
//   ChevronLeft,
//   ChevronRight,
//   Instagram,
//   Loader2,
//   Heart,
//   Eye,
//   Music,
//   Languages,
//   ArrowRight,
//   Crown,
// } from "lucide-react"

// export default function TalentsGallery() {
//   const { talents, loading, fetchTalentById, fetchTalentPhotos, fetchTalents, error } = useTalent()

//   // State management
//   const [selectedTalent, setSelectedTalent] = useState(null)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [talentPhotos, setTalentPhotos] = useState({})
//   const [loadingPhotos, setLoadingPhotos] = useState({})
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(12)
//   const [viewMode, setViewMode] = useState("grid")
//   const [filterType, setFilterType] = useState("all")
//   const [genderFilter, setGenderFilter] = useState("all") // 'all', 'male', 'female'
//   const [searchTerm, setSearchTerm] = useState("")
//   const [favorites, setFavorites] = useState(new Set())
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false)
//   const [heroPhotoIndex, setHeroPhotoIndex] = useState(0)

//   // Refs
//   const heroRef = useRef(null)
//   const containerRef = useRef(null)
//   const { scrollYProgress } = useScroll({ target: containerRef })
//   const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
//   const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

//   // Auto-advance hero photos
//   useEffect(() => {
//     if (!selectedTalent || !talentPhotos[selectedTalent.id]?.length) return

//     const interval = setInterval(() => {
//       setHeroPhotoIndex((prev) => {
//         const maxIndex = talentPhotos[selectedTalent.id].length - 1
//         return prev >= maxIndex ? 0 : prev + 1
//       })
//     }, 4000)

//     return () => clearInterval(interval)
//   }, [selectedTalent, talentPhotos])

//   // Determine gender based on name patterns (basic implementation)
//   const determineGender = (name) => {
//     const femaleEndings = ["a", "ana", "ina", "ela", "lia", "ria", "ica", "isa"]
//     const maleEndings = ["o", "os", "an", "on", "el", "ar", "er", "ir"]

//     const lowerName = name.toLowerCase()

//     // Check female endings
//     if (femaleEndings.some((ending) => lowerName.endsWith(ending))) {
//       return "female"
//     }

//     // Check male endings
//     if (maleEndings.some((ending) => lowerName.endsWith(ending))) {
//       return "male"
//     }

//     // Default fallback
//     return "unknown"
//   }

//   // Load talent photos
//   const loadTalentPhotos = async (talentId) => {
//     if (talentPhotos[talentId] || loadingPhotos[talentId]) return

//     setLoadingPhotos((prev) => ({ ...prev, [talentId]: true }))

//     try {
//       const photos = await fetchTalentPhotos(talentId)

//       if (Array.isArray(photos) && photos.length > 0) {
//         const processedPhotos = photos
//           .filter((photo) => photo.release)
//           .map((photo) => ({
//             ...photo,
//             url: photo.image_url || "/placeholder.svg?height=800&width=600",
//           }))

//         setTalentPhotos((prev) => ({
//           ...prev,
//           [talentId]: processedPhotos,
//         }))
//       } else {
//         setTalentPhotos((prev) => ({
//           ...prev,
//           [talentId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error("Erro ao carregar fotos:", error)
//       setTalentPhotos((prev) => ({
//         ...prev,
//         [talentId]: [],
//       }))
//     } finally {
//       setLoadingPhotos((prev) => ({ ...prev, [talentId]: false }))
//     }
//   }

//   // Load talent data
//   const loadTalentData = async (talentId) => {
//     try {
//       const talent = await fetchTalentById(talentId)
//       if (talent) {
//         setSelectedTalent(talent)
//         setHeroPhotoIndex(0)
//         loadTalentPhotos(talentId)
//       }
//     } catch (error) {
//       console.error("Erro ao carregar dados do talento:", error)
//     }
//   }

//   // Initialize data
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         if (talents.length > 0) {
//           // Prioritize featured talents
//           const featuredTalents = talents.filter((t) => t.destaque)
//           const firstTalent = featuredTalents.length > 0 ? featuredTalents[0] : talents[0]

//           setSelectedTalent(firstTalent)
//           setCurrentIndex(talents.findIndex((t) => t.id === firstTalent.id))

//           loadTalentPhotos(firstTalent.id)

//           // Preload photos for featured talents first, then others
//           const priorityTalents = [...featuredTalents, ...talents.filter((t) => !t.destaque)].slice(0, 8)
//           priorityTalents.forEach((talent, index) => {
//             setTimeout(() => loadTalentPhotos(talent.id), index * 150)
//           })

//           setInitialLoadComplete(true)
//           return
//         }

//         const data = await fetchTalents()
//         if (data && data.length > 0) {
//           const featuredTalents = data.filter((t) => t.destaque)
//           const firstTalent = featuredTalents.length > 0 ? featuredTalents[0] : data[0]

//           setSelectedTalent(firstTalent)
//           setCurrentIndex(data.findIndex((t) => t.id === firstTalent.id))
//           loadTalentPhotos(firstTalent.id)

//           const priorityTalents = [...featuredTalents, ...data.filter((t) => !t.destaque)].slice(0, 8)
//           priorityTalents.forEach((talent, index) => {
//             setTimeout(() => loadTalentPhotos(talent.id), index * 150)
//           })
//         }

//         setInitialLoadComplete(true)
//       } catch (err) {
//         console.error("Erro ao inicializar dados:", err)
//         setInitialLoadComplete(true)
//       }
//     }

//     initializeData()
//   }, [talents, fetchTalents])

//   // Filter talents by gender and other criteria
//   const filteredTalents = talents.filter((talent) => {
//     const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesFilter =
//       filterType === "all" ||
//       (filterType === "destacados" && talent.destaque) ||
//       (filterType === "disponivel" && talent.disponivel) ||
//       (filterType === "ativo" && talent.ativo)

//     const gender = determineGender(talent.name)
//     const matchesGender =
//       genderFilter === "all" ||
//       (genderFilter === "male" && gender === "male") ||
//       (genderFilter === "female" && gender === "female")

//     return matchesSearch && matchesFilter && matchesGender
//   })

//   // Separate by gender for display
//   const maleTalents = filteredTalents.filter((talent) => determineGender(talent.name) === "male")
//   const femaleTalents = filteredTalents.filter((talent) => determineGender(talent.name) === "female")
//   const featuredTalents = filteredTalents.filter((talent) => talent.destaque)

//   // Navigation handlers
//   const handlePrevious = () => {
//     if (talents.length === 0) return
//     const newIndex = currentIndex > 0 ? currentIndex - 1 : talents.length - 1
//     setCurrentIndex(newIndex)
//     const talent = talents[newIndex]
//     setSelectedTalent(talent)
//     loadTalentPhotos(talent.id)
//   }

//   const handleNext = () => {
//     if (talents.length === 0) return
//     const newIndex = currentIndex < talents.length - 1 ? currentIndex + 1 : 0
//     setCurrentIndex(newIndex)
//     const talent = talents[newIndex]
//     setSelectedTalent(talent)
//     loadTalentPhotos(talent.id)
//   }

//   const handleTalentClick = (talent) => {
//     const talentIndex = talents.findIndex((t) => t.id === talent.id)
//     setCurrentIndex(talentIndex)
//     setSelectedTalent(talent)
//     loadTalentPhotos(talent.id)
//     heroRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   const toggleFavorite = (talentId) => {
//     setFavorites((prev) => {
//       const newFavorites = new Set(prev)
//       if (newFavorites.has(talentId)) {
//         newFavorites.delete(talentId)
//       } else {
//         newFavorites.add(talentId)
//       }
//       return newFavorites
//     })
//   }

//   // Loading state
//   if (loading && !initialLoadComplete && talents.length === 0) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
//           <div className="relative mb-8">
//             <div className="w-20 h-20 border-2 border-amber-400 rounded-full animate-spin border-t-transparent mx-auto"></div>
//             <Crown className="w-8 h-8 text-amber-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//           </div>
//           <p className="text-white font-light tracking-wider">CARREGANDO TALENTOS EXCLUSIVOS</p>
//         </motion.div>
//       </div>
//     )
//   }

//   if (initialLoadComplete && talents.length === 0) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center max-w-md mx-auto p-8"
//         >
//           <Crown className="w-16 h-16 text-amber-400 mx-auto mb-6" />
//           <h2 className="text-2xl font-light text-white mb-2 tracking-wider">NENHUM TALENTO ENCONTRADO</h2>
//           <p className="text-gray-400">{error ? `Erro: ${error}` : "Não há talentos disponíveis no momento."}</p>
//         </motion.div>
//       </div>
//     )
//   }

//   const currentTalent = selectedTalent || (talents.length > 0 ? talents[0] : null)

//   if (!currentTalent) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-amber-400 mx-auto mb-4" />
//           <p className="text-white font-light tracking-wider">PREPARANDO GALERIA</p>
//         </motion.div>
//       </div>
//     )
//   }

//   const currentTalentPhotos = talentPhotos[currentTalent.id] || []
//   const currentHeroPhoto = currentTalentPhotos[heroPhotoIndex] || {}

//   return (
//     <div ref={containerRef} className="min-h-screen bg-black text-white">
//       {/* Hero Section - Fashion Magazine Style */}
//       <motion.div
//         ref={heroRef}
//         style={{ y: heroY, opacity: heroOpacity }}
//         className="relative h-screen overflow-hidden"
//       >
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={`${currentTalent.id}-${heroPhotoIndex}`}
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
//             className="absolute inset-0"
//           >
//             {/* Background Image */}
//             <div className="absolute inset-0">
//               <img
//                 src={
//                   currentHeroPhoto.url ||
//                   currentTalent.cover ||
//                   "/placeholder.svg?height=1080&width=1920&query=high+fashion+portrait+studio+lighting" ||
//                   "/placeholder.svg"
//                 }
//                 alt={currentTalent.name}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.src = "/placeholder.svg?height=1080&width=1920"
//                 }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
//             </div>

//             {/* Content Overlay */}
//             <div className="relative z-10 h-full flex items-center">
//               <div className="max-w-7xl mx-auto px-8 w-full">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                   {/* Left Content */}
//                   <motion.div
//                     initial={{ opacity: 0, x: -50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.3, duration: 0.8 }}
//                     className="space-y-8"
//                   >
//                     {/* Featured Badge */}
//                     {currentTalent.destaque && (
//                       <motion.div
//                         initial={{ scale: 0, rotate: -10 }}
//                         animate={{ scale: 1, rotate: 0 }}
//                         transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
//                         className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-3 rounded-none font-bold text-sm tracking-wider"
//                       >
//                         <Crown className="w-5 h-5" />
//                         TALENTO EXCLUSIVO
//                       </motion.div>
//                     )}

//                     {/* Name */}
//                     <div>
//                       <motion.h1
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.4, duration: 0.8 }}
//                         className="text-6xl md:text-8xl font-thin tracking-tight leading-none mb-4"
//                       >
//                         {currentTalent.name.split(" ")[0]}
//                       </motion.h1>
//                       {currentTalent.name.split(" ").length > 1 && (
//                         <motion.h2
//                           initial={{ opacity: 0, y: 30 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.6, duration: 0.8 }}
//                           className="text-4xl md:text-6xl font-light tracking-wider text-gray-300"
//                         >
//                           {currentTalent.name.split(" ").slice(1).join(" ")}
//                         </motion.h2>
//                       )}
//                     </div>

//                     {/* Details */}
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.8, duration: 0.6 }}
//                       className="flex flex-wrap gap-6 text-sm tracking-wider"
//                     >
//                       {currentTalent.birth_date && (
//                         <div className="flex items-center gap-2 text-gray-300">
//                           <div className="w-px h-4 bg-amber-400"></div>
//                           <span>
//                             {new Date().getFullYear() - new Date(currentTalent.birth_date).getFullYear()} ANOS
//                           </span>
//                         </div>
//                       )}
//                       {currentTalent.height && (
//                         <div className="flex items-center gap-2 text-gray-300">
//                           <div className="w-px h-4 bg-amber-400"></div>
//                           <span>{currentTalent.height}</span>
//                         </div>
//                       )}
//                       {currentTalent.tipo_talento && (
//                         <div className="flex items-center gap-2 text-gray-300">
//                           <div className="w-px h-4 bg-amber-400"></div>
//                           <span>{currentTalent.tipo_talento.toUpperCase()}</span>
//                         </div>
//                       )}
//                     </motion.div>

//                     {/* Instagram */}
//                     {currentTalent.instagram && (
//                       <motion.a
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: 1, duration: 0.6 }}
//                         href={`https://instagram.com/${currentTalent.instagram.replace(/^@/, "")}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-3 border border-white/30 hover:border-amber-400 px-6 py-3 transition-all duration-300 group"
//                       >
//                         <Instagram className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
//                         <span className="tracking-wider">@{currentTalent.instagram}</span>
//                         <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                       </motion.a>
//                     )}
//                   </motion.div>

//                   {/* Right Content - Stats */}
//                   <motion.div
//                     initial={{ opacity: 0, x: 50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.5, duration: 0.8 }}
//                     className="space-y-8 lg:text-right"
//                   >
//                     {/* Photo Counter */}
//                     {currentTalentPhotos.length > 0 && (
//                       <div className="text-right">
//                         <div className="text-4xl font-thin text-amber-400 mb-2">
//                           {String(heroPhotoIndex + 1).padStart(2, "0")}
//                         </div>
//                         <div className="text-sm tracking-wider text-gray-400">
//                           DE {String(currentTalentPhotos.length).padStart(2, "0")} FOTOS
//                         </div>
//                       </div>
//                     )}

//                     {/* Skills */}
//                     <div className="space-y-4">
//                       {currentTalent.can_sing && (
//                         <div className="flex items-center justify-end gap-3">
//                           <span className="text-sm tracking-wider">CANTO</span>
//                           <Music className="w-4 h-4 text-amber-400" />
//                         </div>
//                       )}
//                       {currentTalent.languages && currentTalent.languages.length > 0 && (
//                         <div className="flex items-center justify-end gap-3">
//                           <span className="text-sm tracking-wider">{currentTalent.languages.length} IDIOMAS</span>
//                           <Languages className="w-4 h-4 text-amber-400" />
//                         </div>
//                       )}
//                       {currentTalent.instruments && currentTalent.instruments.length > 0 && (
//                         <div className="flex items-center justify-end gap-3">
//                           <span className="text-sm tracking-wider">
//                             {currentTalent.instruments.length} INSTRUMENTOS
//                           </span>
//                           <Music className="w-4 h-4 text-amber-400" />
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <div className="absolute inset-y-0 left-0 flex items-center z-20">
//               <motion.button
//                 whileHover={{ scale: 1.1, x: -5 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handlePrevious}
//                 className="ml-8 w-12 h-12 border border-white/30 hover:border-amber-400 hover:bg-amber-400/10 transition-all duration-300 flex items-center justify-center"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </motion.button>
//             </div>

//             <div className="absolute inset-y-0 right-0 flex items-center z-20">
//               <motion.button
//                 whileHover={{ scale: 1.1, x: 5 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handleNext}
//                 className="mr-8 w-12 h-12 border border-white/30 hover:border-amber-400 hover:bg-amber-400/10 transition-all duration-300 flex items-center justify-center"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </motion.button>
//             </div>

//             {/* Photo Progress */}
//             {currentTalentPhotos.length > 1 && (
//               <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
//                 <div className="flex gap-2">
//                   {currentTalentPhotos.map((_, idx) => (
//                     <motion.button
//                       key={idx}
//                       whileHover={{ scale: 1.2 }}
//                       onClick={() => setHeroPhotoIndex(idx)}
//                       className={`w-8 h-px transition-all duration-300 ${
//                         heroPhotoIndex === idx ? "bg-amber-400" : "bg-white/30 hover:bg-white/50"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </motion.div>

//       {/* Featured Talents Section */}
//       {featuredTalents.length > 0 && (
//         <section className="py-24 bg-gradient-to-b from-black to-gray-900">
//           <div className="max-w-7xl mx-auto px-8">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <h2 className="text-4xl md:text-6xl font-thin tracking-wider mb-4">
//                 TALENTOS <span className="text-amber-400">EXCLUSIVOS</span>
//               </h2>
//               <div className="w-24 h-px bg-amber-400 mx-auto"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {featuredTalents.slice(0, 6).map((talent, index) => {
//                 const mainPhoto = talentPhotos[talent.id]?.[0] || {}
//                 return (
//                   <motion.div
//                     key={talent.id}
//                     initial={{ opacity: 0, y: 50 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: index * 0.1 }}
//                     viewport={{ once: true }}
//                     whileHover={{ y: -10 }}
//                     className="group cursor-pointer"
//                     onClick={() => handleTalentClick(talent)}
//                   >
//                     <div className="relative aspect-[3/4] overflow-hidden mb-6">
//                       <img
//                         src={
//                           mainPhoto.url ||
//                           talent.cover ||
//                           "/placeholder.svg?height=600&width=450&query=fashion+model+portrait" ||
//                           "/placeholder.svg"
//                         }
//                         alt={talent.name}
//                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                         onError={(e) => {
//                           e.target.src = "/placeholder.svg?height=600&width=450"
//                         }}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                       {/* Crown badge */}
//                       <div className="absolute top-4 right-4">
//                         <Crown className="w-6 h-6 text-amber-400" />
//                       </div>

//                       {/* Hover overlay */}
//                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <div className="w-12 h-12 border border-white/50 flex items-center justify-center">
//                           <Eye className="w-6 h-6" />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="text-center">
//                       <h3 className="text-2xl font-light tracking-wider mb-2 group-hover:text-amber-400 transition-colors">
//                         {talent.name}
//                       </h3>
//                       <p className="text-gray-400 text-sm tracking-wider">
//                         {talent.tipo_talento?.toUpperCase() || "TALENTO"}
//                       </p>
//                     </div>
//                   </motion.div>
//                 )
//               })}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Gender Sections */}
//       <section className="py-24 bg-gray-900">
//         <div className="max-w-7xl mx-auto px-8">
//           {/* Filters */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="flex flex-col md:flex-row gap-8 items-center justify-between mb-16"
//           >
//             <div className="flex items-center gap-8">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="BUSCAR TALENTOS..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="bg-transparent border-b border-white/30 focus:border-amber-400 px-0 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors tracking-wider"
//                 />
//               </div>

//               <select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 className="bg-transparent border-b border-white/30 focus:border-amber-400 px-0 py-3 text-white focus:outline-none transition-colors tracking-wider"
//               >
//                 <option value="all" className="bg-gray-900">
//                   TODOS
//                 </option>
//                 <option value="destacados" className="bg-gray-900">
//                   DESTAQUES
//                 </option>
//                 <option value="disponivel" className="bg-gray-900">
//                   DISPONÍVEIS
//                 </option>
//                 <option value="ativo" className="bg-gray-900">
//                   ATIVOS
//                 </option>
//               </select>
//             </div>

//             <div className="flex items-center gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setGenderFilter("all")}
//                 className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
//                   genderFilter === "all"
//                     ? "border-amber-400 text-amber-400"
//                     : "border-white/30 text-white hover:border-white/50"
//                 }`}
//               >
//                 TODOS
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setGenderFilter("female")}
//                 className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
//                   genderFilter === "female"
//                     ? "border-amber-400 text-amber-400"
//                     : "border-white/30 text-white hover:border-white/50"
//                 }`}
//               >
//                 FEMININO
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setGenderFilter("male")}
//                 className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
//                   genderFilter === "male"
//                     ? "border-amber-400 text-amber-400"
//                     : "border-white/30 text-white hover:border-white/50"
//                 }`}
//               >
//                 MASCULINO
//               </motion.button>
//             </div>
//           </motion.div>

//           {/* Female Talents */}
//           {(genderFilter === "all" || genderFilter === "female") && femaleTalents.length > 0 && (
//             <div className="mb-24">
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.8 }}
//                 viewport={{ once: true }}
//                 className="flex items-center gap-4 mb-12"
//               >
//                 <h3 className="text-3xl md:text-4xl font-thin tracking-wider">FEMININO</h3>
//                 <div className="flex-1 h-px bg-gradient-to-r from-pink-400 to-transparent"></div>
//                 <span className="text-pink-400 text-sm tracking-wider">{femaleTalents.length} TALENTOS</span>
//               </motion.div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                 {femaleTalents.map((talent, index) => {
//                   const mainPhoto = talentPhotos[talent.id]?.[0] || {}
//                   return (
//                     <motion.div
//                       key={talent.id}
//                       initial={{ opacity: 0, y: 30 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5, delay: index * 0.05 }}
//                       viewport={{ once: true }}
//                       whileHover={{ y: -5, scale: 1.02 }}
//                       className="group cursor-pointer"
//                       onClick={() => handleTalentClick(talent)}
//                     >
//                       <div className="relative aspect-[3/4] overflow-hidden mb-4">
//                         <img
//                           src={
//                             mainPhoto.url ||
//                             talent.cover ||
//                             "/placeholder.svg?height=400&width=300&query=female+model+portrait" ||
//                             "/placeholder.svg"
//                           }
//                           alt={talent.name}
//                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                           onError={(e) => {
//                             e.target.src = "/placeholder.svg?height=400&width=300"
//                           }}
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                         {talent.destaque && (
//                           <div className="absolute top-3 right-3">
//                             <Crown className="w-4 h-4 text-amber-400" />
//                           </div>
//                         )}

//                         {/* Favorite button */}
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             toggleFavorite(talent.id)
//                           }}
//                           className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${
//                             favorites.has(talent.id)
//                               ? "bg-red-500 text-white"
//                               : "bg-white/20 text-white hover:bg-white/30"
//                           }`}
//                         >
//                           <Heart className={`w-4 h-4 ${favorites.has(talent.id) ? "fill-current" : ""}`} />
//                         </motion.button>
//                       </div>

//                       <div className="text-center">
//                         <h4 className="font-light tracking-wider mb-1 group-hover:text-pink-400 transition-colors">
//                           {talent.name}
//                         </h4>
//                         <p className="text-gray-400 text-xs tracking-wider">
//                           {talent.birth_date
//                             ? `${new Date().getFullYear() - new Date(talent.birth_date).getFullYear()} ANOS`
//                             : ""}
//                         </p>
//                       </div>
//                     </motion.div>
//                   )
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Male Talents */}
//           {(genderFilter === "all" || genderFilter === "male") && maleTalents.length > 0 && (
//             <div>
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.8 }}
//                 viewport={{ once: true }}
//                 className="flex items-center gap-4 mb-12"
//               >
//                 <h3 className="text-3xl md:text-4xl font-thin tracking-wider">MASCULINO</h3>
//                 <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
//                 <span className="text-blue-400 text-sm tracking-wider">{maleTalents.length} TALENTOS</span>
//               </motion.div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                 {maleTalents.map((talent, index) => {
//                   const mainPhoto = talentPhotos[talent.id]?.[0] || {}
//                   return (
//                     <motion.div
//                       key={talent.id}
//                       initial={{ opacity: 0, y: 30 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5, delay: index * 0.05 }}
//                       viewport={{ once: true }}
//                       whileHover={{ y: -5, scale: 1.02 }}
//                       className="group cursor-pointer"
//                       onClick={() => handleTalentClick(talent)}
//                     >
//                       <div className="relative aspect-[3/4] overflow-hidden mb-4">
//                         <img
//                           src={
//                             mainPhoto.url ||
//                             talent.cover ||
//                             "/placeholder.svg?height=400&width=300&query=male+model+portrait" ||
//                             "/placeholder.svg"
//                           }
//                           alt={talent.name}
//                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                           onError={(e) => {
//                             e.target.src = "/placeholder.svg?height=400&width=300"
//                           }}
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                         {talent.destaque && (
//                           <div className="absolute top-3 right-3">
//                             <Crown className="w-4 h-4 text-amber-400" />
//                           </div>
//                         )}

//                         {/* Favorite button */}
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             toggleFavorite(talent.id)
//                           }}
//                           className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${
//                             favorites.has(talent.id)
//                               ? "bg-red-500 text-white"
//                               : "bg-white/20 text-white hover:bg-white/30"
//                           }`}
//                         >
//                           <Heart className={`w-4 h-4 ${favorites.has(talent.id) ? "fill-current" : ""}`} />
//                         </motion.button>
//                       </div>

//                       <div className="text-center">
//                         <h4 className="font-light tracking-wider mb-1 group-hover:text-blue-400 transition-colors">
//                           {talent.name}
//                         </h4>
//                         <p className="text-gray-400 text-xs tracking-wider">
//                           {talent.birth_date
//                             ? `${new Date().getFullYear() - new Date(talent.birth_date).getFullYear()} ANOS`
//                             : ""}
//                         </p>
//                       </div>
//                     </motion.div>
//                   )
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   )
// }




























// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useTalent } from "../contexts/talents-context"
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
// import {
//   ChevronLeft,
//   ChevronRight,
//   Instagram,
//   Loader2,
//   Heart,
//   Eye,
//   Music,
//   Languages,
//   ArrowRight,
//   Crown,
//   Camera,
// } from "lucide-react"

// export default function TalentsGallery() {
//   const { talents, loading, fetchTalentById, fetchTalentPhotos, fetchTalents, error } = useTalent()

//   // State management
//   const [selectedTalent, setSelectedTalent] = useState(null)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [talentPhotos, setTalentPhotos] = useState({})
//   const [loadingPhotos, setLoadingPhotos] = useState({})
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(12)
//   const [viewMode, setViewMode] = useState("grid")
//   const [filterType, setFilterType] = useState("all")
//   const [genderFilter, setGenderFilter] = useState("all") // 'all', 'male', 'female'
//   const [searchTerm, setSearchTerm] = useState("")
//   const [favorites, setFavorites] = useState(new Set())
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false)
//   const [heroPhotoIndex, setHeroPhotoIndex] = useState(0)

//   // Refs
//   const heroRef = useRef(null)
//   const containerRef = useRef(null)
//   const { scrollYProgress } = useScroll({ target: containerRef })
//   const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
//   const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

//   // Auto-advance hero photos
//   useEffect(() => {
//     if (!selectedTalent || !talentPhotos[selectedTalent.id]?.length) return

//     const interval = setInterval(() => {
//       setHeroPhotoIndex((prev) => {
//         const maxIndex = talentPhotos[selectedTalent.id].length - 1
//         return prev >= maxIndex ? 0 : prev + 1
//       })
//     }, 4000)

//     return () => clearInterval(interval)
//   }, [selectedTalent, talentPhotos])

//   // Determine gender based on name patterns (basic implementation)
//   const determineGender = (name) => {
//     const femaleEndings = ["a", "ana", "ina", "ela", "lia", "ria", "ica", "isa", "ane", "ene", "ine"]
//     const maleEndings = ["o", "os", "an", "on", "el", "ar", "er", "ir", "or", "ur"]

//     const lowerName = name.toLowerCase()

//     // Check female endings
//     if (femaleEndings.some((ending) => lowerName.endsWith(ending))) {
//       return "female"
//     }

//     // Check male endings
//     if (maleEndings.some((ending) => lowerName.endsWith(ending))) {
//       return "male"
//     }

//     // Default fallback
//     return "unknown"
//   }

//   // Load talent photos - CORRIGIDO para usar apenas fotos da API
//   const loadTalentPhotos = async (talentId) => {
//     if (talentPhotos[talentId] || loadingPhotos[talentId]) return

//     setLoadingPhotos((prev) => ({ ...prev, [talentId]: true }))

//     try {
//       console.log(`Carregando fotos para talento ID: ${talentId}`)
//       const photos = await fetchTalentPhotos(talentId)
//       console.log(`Fotos recebidas para talento ${talentId}:`, photos)

//       if (Array.isArray(photos) && photos.length > 0) {
//         // Filtrar apenas fotos com release=true e processar URLs
//         const processedPhotos = photos
//           .filter((photo) => photo.release === true)
//           .map((photo) => ({
//             id: photo.id,
//             talent_id: photo.talent_id,
//             url: photo.image_url, // Usar image_url diretamente da API
//             public_id: photo.public_id,
//             short_url: photo.short_url,
//           }))

//         console.log(`Fotos processadas para talento ${talentId}:`, processedPhotos)

//         setTalentPhotos((prev) => ({
//           ...prev,
//           [talentId]: processedPhotos,
//         }))
//       } else {
//         console.log(`Nenhuma foto encontrada para talento ${talentId}`)
//         setTalentPhotos((prev) => ({
//           ...prev,
//           [talentId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error(`Erro ao carregar fotos do talento ${talentId}:`, error)
//       setTalentPhotos((prev) => ({
//         ...prev,
//         [talentId]: [],
//       }))
//     } finally {
//       setLoadingPhotos((prev) => ({ ...prev, [talentId]: false }))
//     }
//   }

//   // Load talent data
//   const loadTalentData = async (talentId) => {
//     try {
//       const talent = await fetchTalentById(talentId)
//       if (talent) {
//         setSelectedTalent(talent)
//         setHeroPhotoIndex(0)
//         await loadTalentPhotos(talentId)
//       }
//     } catch (error) {
//       console.error("Erro ao carregar dados do talento:", error)
//     }
//   }

//   // Initialize data
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         if (talents.length > 0) {
//           console.log("Inicializando com talentos existentes:", talents.length)

//           // Prioritize featured talents
//           const featuredTalents = talents.filter((t) => t.destaque)
//           const firstTalent = featuredTalents.length > 0 ? featuredTalents[0] : talents[0]

//           console.log("Primeiro talento selecionado:", firstTalent)
//           setSelectedTalent(firstTalent)
//           setCurrentIndex(talents.findIndex((t) => t.id === firstTalent.id))

//           // Carregar fotos do primeiro talento
//           await loadTalentPhotos(firstTalent.id)

//           // Preload photos for featured talents first, then others
//           const priorityTalents = [...featuredTalents, ...talents.filter((t) => !t.destaque)].slice(0, 10)

//           // Carregar fotos em paralelo com delay escalonado
//           priorityTalents.forEach((talent, index) => {
//             setTimeout(() => {
//               console.log(`Pré-carregando fotos do talento: ${talent.name} (ID: ${talent.id})`)
//               loadTalentPhotos(talent.id)
//             }, index * 200)
//           })

//           setInitialLoadComplete(true)
//           return
//         }

//         console.log("Buscando talentos da API...")
//         const data = await fetchTalents()
//         if (data && data.length > 0) {
//           console.log("Talentos carregados da API:", data.length)

//           const featuredTalents = data.filter((t) => t.destaque)
//           const firstTalent = featuredTalents.length > 0 ? featuredTalents[0] : data[0]

//           setSelectedTalent(firstTalent)
//           setCurrentIndex(data.findIndex((t) => t.id === firstTalent.id))
//           await loadTalentPhotos(firstTalent.id)

//           const priorityTalents = [...featuredTalents, ...data.filter((t) => !t.destaque)].slice(0, 10)
//           priorityTalents.forEach((talent, index) => {
//             setTimeout(() => loadTalentPhotos(talent.id), index * 200)
//           })
//         }

//         setInitialLoadComplete(true)
//       } catch (err) {
//         console.error("Erro ao inicializar dados:", err)
//         setInitialLoadComplete(true)
//       }
//     }

//     initializeData()
//   }, [talents, fetchTalents])

//   // Filter talents by gender and other criteria
//   const filteredTalents = talents.filter((talent) => {
//     const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesFilter =
//       filterType === "all" ||
//       (filterType === "destacados" && talent.destaque) ||
//       (filterType === "disponivel" && talent.disponivel) ||
//       (filterType === "ativo" && talent.ativo)

//     const gender = determineGender(talent.name)
//     const matchesGender =
//       genderFilter === "all" ||
//       (genderFilter === "male" && gender === "male") ||
//       (genderFilter === "female" && gender === "female")

//     return matchesSearch && matchesFilter && matchesGender
//   })

//   // Separate by gender for display
//   const maleTalents = filteredTalents.filter((talent) => determineGender(talent.name) === "male")
//   const femaleTalents = filteredTalents.filter((talent) => determineGender(talent.name) === "female")
//   const featuredTalents = filteredTalents.filter((talent) => talent.destaque)

//   // Navigation handlers
//   const handlePrevious = () => {
//     if (talents.length === 0) return
//     const newIndex = currentIndex > 0 ? currentIndex - 1 : talents.length - 1
//     setCurrentIndex(newIndex)
//     const talent = talents[newIndex]
//     setSelectedTalent(talent)
//     loadTalentPhotos(talent.id)
//   }

//   const handleNext = () => {
//     if (talents.length === 0) return
//     const newIndex = currentIndex < talents.length - 1 ? currentIndex + 1 : 0
//     setCurrentIndex(newIndex)
//     const talent = talents[newIndex]
//     setSelectedTalent(talent)
//     loadTalentPhotos(talent.id)
//   }

//   const handleTalentClick = (talent) => {
//     const talentIndex = talents.findIndex((t) => t.id === talent.id)
//     setCurrentIndex(talentIndex)
//     setSelectedTalent(talent)
//     loadTalentPhotos(talent.id)
//     heroRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   const toggleFavorite = (talentId) => {
//     setFavorites((prev) => {
//       const newFavorites = new Set(prev)
//       if (newFavorites.has(talentId)) {
//         newFavorites.delete(talentId)
//       } else {
//         newFavorites.add(talentId)
//       }
//       return newFavorites
//     })
//   }

//   // Get main photo for talent (first photo from API)
//   const getTalentMainPhoto = (talentId) => {
//     const photos = talentPhotos[talentId]
//     if (photos && photos.length > 0) {
//       return photos[0].url
//     }
//     return "/placeholder.svg?height=600&width=450"
//   }

//   // Loading state - FUNDO CLARO
//   if (loading && !initialLoadComplete && talents.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
//           <div className="relative mb-8">
//             <div className="w-20 h-20 border-2 border-amber-500 rounded-full animate-spin border-t-transparent mx-auto"></div>
//             <Crown className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//           </div>
//           <p className="text-gray-800 font-light tracking-wider">CARREGANDO TALENTOS EXCLUSIVOS</p>
//         </motion.div>
//       </div>
//     )
//   }

//   if (initialLoadComplete && talents.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center max-w-md mx-auto p-8"
//         >
//           <Crown className="w-16 h-16 text-amber-500 mx-auto mb-6" />
//           <h2 className="text-2xl font-light text-gray-800 mb-2 tracking-wider">NENHUM TALENTO ENCONTRADO</h2>
//           <p className="text-gray-600">{error ? `Erro: ${error}` : "Não há talentos disponíveis no momento."}</p>
//         </motion.div>
//       </div>
//     )
//   }

//   const currentTalent = selectedTalent || (talents.length > 0 ? talents[0] : null)

//   if (!currentTalent) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
//           <p className="text-gray-800 font-light tracking-wider">PREPARANDO GALERIA</p>
//         </motion.div>
//       </div>
//     )
//   }

//   const currentTalentPhotos = talentPhotos[currentTalent.id] || []
//   const currentHeroPhoto = currentTalentPhotos[heroPhotoIndex] || {}

//   return (
//     <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900">
//       {/* Hero Section - Fashion Magazine Style */}
//       <motion.div
//         ref={heroRef}
//         style={{ y: heroY, opacity: heroOpacity }}
//         className="relative h-screen overflow-hidden"
//       >
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={`${currentTalent.id}-${heroPhotoIndex}`}
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
//             className="absolute inset-0"
//           >
//             {/* Background Image - USANDO APENAS FOTOS DA API */}
//             <div className="absolute inset-0">
//               {currentHeroPhoto.url ? (
//                 <img
//                   src={currentHeroPhoto.url || "/placeholder.svg"}
//                   alt={`${currentTalent.name} - Foto ${heroPhotoIndex + 1}`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     console.error(`Erro ao carregar foto: ${currentHeroPhoto.url}`)
//                     e.target.src = "/placeholder.svg?height=1080&width=1920"
//                   }}
//                 />
//               ) : (
//                 <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
//                   {loadingPhotos[currentTalent.id] ? (
//                     <div className="text-center">
//                       <Loader2 className="w-16 h-16 animate-spin text-amber-500 mx-auto mb-4" />
//                       <p className="text-gray-700 font-light tracking-wider">CARREGANDO FOTOS...</p>
//                     </div>
//                   ) : (
//                     <div className="text-center">
//                       <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-500 font-light tracking-wider">NENHUMA FOTO DISPONÍVEL</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//               <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
//               <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30" />
//             </div>

//             {/* Content Overlay */}
//             <div className="relative z-10 h-full flex items-center">
//               <div className="max-w-7xl mx-auto px-8 w-full">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                   {/* Left Content */}
//                   <motion.div
//                     initial={{ opacity: 0, x: -50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.3, duration: 0.8 }}
//                     className="space-y-8"
//                   >
//                     {/* Featured Badge */}
//                     {currentTalent.destaque && (
//                       <motion.div
//                         initial={{ scale: 0, rotate: -10 }}
//                         animate={{ scale: 1, rotate: 0 }}
//                         transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
//                         className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-3 rounded-none font-bold text-sm tracking-wider"
//                       >
//                         <Crown className="w-5 h-5" />
//                         TALENTO EXCLUSIVO
//                       </motion.div>
//                     )}

//                     {/* Name */}
//                     <div>
//                       <motion.h1
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.4, duration: 0.8 }}
//                         className="text-6xl md:text-8xl font-thin tracking-tight leading-none mb-4 text-gray-900"
//                       >
//                         {currentTalent.name.split(" ")[0]}
//                       </motion.h1>
//                       {currentTalent.name.split(" ").length > 1 && (
//                         <motion.h2
//                           initial={{ opacity: 0, y: 30 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.6, duration: 0.8 }}
//                           className="text-4xl md:text-6xl font-light tracking-wider text-gray-600"
//                         >
//                           {currentTalent.name.split(" ").slice(1).join(" ")}
//                         </motion.h2>
//                       )}
//                     </div>

//                     {/* Details */}
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.8, duration: 0.6 }}
//                       className="flex flex-wrap gap-6 text-sm tracking-wider"
//                     >
//                       {currentTalent.birth_date && (
//                         <div className="flex items-center gap-2 text-gray-700">
//                           <div className="w-px h-4 bg-amber-500"></div>
//                           <span>
//                             {new Date().getFullYear() - new Date(currentTalent.birth_date).getFullYear()} ANOS
//                           </span>
//                         </div>
//                       )}
//                       {currentTalent.height && (
//                         <div className="flex items-center gap-2 text-gray-700">
//                           <div className="w-px h-4 bg-amber-500"></div>
//                           <span>{currentTalent.height}</span>
//                         </div>
//                       )}
//                       {currentTalent.tipo_talento && (
//                         <div className="flex items-center gap-2 text-gray-700">
//                           <div className="w-px h-4 bg-amber-500"></div>
//                           <span>{currentTalent.tipo_talento.toUpperCase()}</span>
//                         </div>
//                       )}
//                     </motion.div>

//                     {/* Instagram */}
//                     {currentTalent.instagram && (
//                       <motion.a
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: 1, duration: 0.6 }}
//                         href={`https://instagram.com/${currentTalent.instagram.replace(/^@/, "")}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-3 border border-gray-400 hover:border-amber-500 px-6 py-3 transition-all duration-300 group text-gray-800"
//                       >
//                         <Instagram className="w-5 h-5 group-hover:text-amber-500 transition-colors" />
//                         <span className="tracking-wider">@{currentTalent.instagram}</span>
//                         <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                       </motion.a>
//                     )}
//                   </motion.div>

//                   {/* Right Content - Stats */}
//                   <motion.div
//                     initial={{ opacity: 0, x: 50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.5, duration: 0.8 }}
//                     className="space-y-8 lg:text-right"
//                   >
//                     {/* Photo Counter */}
//                     {currentTalentPhotos.length > 0 && (
//                       <div className="text-right">
//                         <div className="text-4xl font-thin text-amber-500 mb-2">
//                           {String(heroPhotoIndex + 1).padStart(2, "0")}
//                         </div>
//                         <div className="text-sm tracking-wider text-gray-600">
//                           DE {String(currentTalentPhotos.length).padStart(2, "0")} FOTOS
//                         </div>
//                       </div>
//                     )}

//                     {/* Loading indicator for photos */}
//                     {loadingPhotos[currentTalent.id] && (
//                       <div className="text-right">
//                         <Loader2 className="w-6 h-6 animate-spin text-amber-500 ml-auto mb-2" />
//                         <div className="text-sm tracking-wider text-gray-600">CARREGANDO FOTOS...</div>
//                       </div>
//                     )}

//                     {/* Skills */}
//                     <div className="space-y-4">
//                       {currentTalent.can_sing && (
//                         <div className="flex items-center justify-end gap-3">
//                           <span className="text-sm tracking-wider text-gray-700">CANTO</span>
//                           <Music className="w-4 h-4 text-amber-500" />
//                         </div>
//                       )}
//                       {currentTalent.languages && currentTalent.languages.length > 0 && (
//                         <div className="flex items-center justify-end gap-3">
//                           <span className="text-sm tracking-wider text-gray-700">
//                             {currentTalent.languages.length} IDIOMAS
//                           </span>
//                           <Languages className="w-4 h-4 text-amber-500" />
//                         </div>
//                       )}
//                       {currentTalent.instruments && currentTalent.instruments.length > 0 && (
//                         <div className="flex items-center justify-end gap-3">
//                           <span className="text-sm tracking-wider text-gray-700">
//                             {currentTalent.instruments.length} INSTRUMENTOS
//                           </span>
//                           <Music className="w-4 h-4 text-amber-500" />
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <div className="absolute inset-y-0 left-0 flex items-center z-20">
//               <motion.button
//                 whileHover={{ scale: 1.1, x: -5 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handlePrevious}
//                 className="ml-8 w-12 h-12 border border-gray-400 hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300 flex items-center justify-center text-gray-800"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </motion.button>
//             </div>

//             <div className="absolute inset-y-0 right-0 flex items-center z-20">
//               <motion.button
//                 whileHover={{ scale: 1.1, x: 5 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handleNext}
//                 className="mr-8 w-12 h-12 border border-gray-400 hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300 flex items-center justify-center text-gray-800"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </motion.button>
//             </div>

//             {/* Photo Progress */}
//             {currentTalentPhotos.length > 1 && (
//               <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
//                 <div className="flex gap-2">
//                   {currentTalentPhotos.map((_, idx) => (
//                     <motion.button
//                       key={idx}
//                       whileHover={{ scale: 1.2 }}
//                       onClick={() => setHeroPhotoIndex(idx)}
//                       className={`w-8 h-px transition-all duration-300 ${
//                         heroPhotoIndex === idx ? "bg-amber-500" : "bg-gray-400 hover:bg-gray-600"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </motion.div>

//       {/* Featured Talents Section */}
//       {featuredTalents.length > 0 && (
//         <section className="py-24 bg-gradient-to-b from-white to-gray-50">
//           <div className="max-w-7xl mx-auto px-8">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <h2 className="text-4xl md:text-6xl font-thin tracking-wider mb-4 text-gray-900">
//                 TALENTOS <span className="text-amber-500">EXCLUSIVOS</span>
//               </h2>
//               <div className="w-24 h-px bg-amber-500 mx-auto"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {featuredTalents.slice(0, 6).map((talent, index) => {
//                 const mainPhotoUrl = getTalentMainPhoto(talent.id)
//                 return (
//                   <motion.div
//                     key={talent.id}
//                     initial={{ opacity: 0, y: 50 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: index * 0.1 }}
//                     viewport={{ once: true }}
//                     whileHover={{ y: -10 }}
//                     className="group cursor-pointer"
//                     onClick={() => handleTalentClick(talent)}
//                   >
//                     <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100 rounded-lg">
//                       {loadingPhotos[talent.id] ? (
//                         <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                           <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
//                         </div>
//                       ) : (
//                         <img
//                           src={mainPhotoUrl || "/placeholder.svg"}
//                           alt={talent.name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                           onError={(e) => {
//                             e.target.src = "/placeholder.svg?height=600&width=450"
//                           }}
//                         />
//                       )}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                       {/* Crown badge */}
//                       <div className="absolute top-4 right-4">
//                         <Crown className="w-6 h-6 text-amber-500" />
//                       </div>

//                       {/* Hover overlay */}
//                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <div className="w-12 h-12 border border-white/70 flex items-center justify-center">
//                           <Eye className="w-6 h-6 text-white" />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="text-center">
//                       <h3 className="text-2xl font-light tracking-wider mb-2 group-hover:text-amber-500 transition-colors text-gray-900">
//                         {talent.name}
//                       </h3>
//                       <p className="text-gray-600 text-sm tracking-wider">
//                         {talent.tipo_talento?.toUpperCase() || "TALENTO"}
//                       </p>
//                     </div>
//                   </motion.div>
//                 )
//               })}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Gender Sections */}
//       <section className="py-24 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-8">
//           {/* Filters */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="flex flex-col md:flex-row gap-8 items-center justify-between mb-16"
//           >
//             <div className="flex items-center gap-8">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="BUSCAR TALENTOS..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="bg-transparent border-b border-gray-400 focus:border-amber-500 px-0 py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-colors tracking-wider"
//                 />
//               </div>

//               <select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 className="bg-transparent border-b border-gray-400 focus:border-amber-500 px-0 py-3 text-gray-900 focus:outline-none transition-colors tracking-wider"
//               >
//                 <option value="all" className="bg-white">
//                   TODOS
//                 </option>
//                 <option value="destacados" className="bg-white">
//                   DESTAQUES
//                 </option>
//                 <option value="disponivel" className="bg-white">
//                   DISPONÍVEIS
//                 </option>
//                 <option value="ativo" className="bg-white">
//                   ATIVOS
//                 </option>
//               </select>
//             </div>

//             <div className="flex items-center gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setGenderFilter("all")}
//                 className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
//                   genderFilter === "all"
//                     ? "border-amber-500 text-amber-500"
//                     : "border-gray-400 text-gray-700 hover:border-gray-600"
//                 }`}
//               >
//                 TODOS
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setGenderFilter("female")}
//                 className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
//                   genderFilter === "female"
//                     ? "border-amber-500 text-amber-500"
//                     : "border-gray-400 text-gray-700 hover:border-gray-600"
//                 }`}
//               >
//                 FEMININO
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setGenderFilter("male")}
//                 className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
//                   genderFilter === "male"
//                     ? "border-amber-500 text-amber-500"
//                     : "border-gray-400 text-gray-700 hover:border-gray-600"
//                 }`}
//               >
//                 MASCULINO
//               </motion.button>
//             </div>
//           </motion.div>

//           {/* Female Talents */}
//           {(genderFilter === "all" || genderFilter === "female") && femaleTalents.length > 0 && (
//             <div className="mb-24">
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.8 }}
//                 viewport={{ once: true }}
//                 className="flex items-center gap-4 mb-12"
//               >
//                 <h3 className="text-3xl md:text-4xl font-thin tracking-wider text-gray-900">FEMININO</h3>
//                 <div className="flex-1 h-px bg-gradient-to-r from-pink-400 to-transparent"></div>
//                 <span className="text-pink-500 text-sm tracking-wider">{femaleTalents.length} TALENTOS</span>
//               </motion.div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                 {femaleTalents.map((talent, index) => {
//                   const mainPhotoUrl = getTalentMainPhoto(talent.id)
//                   return (
//                     <motion.div
//                       key={talent.id}
//                       initial={{ opacity: 0, y: 30 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5, delay: index * 0.05 }}
//                       viewport={{ once: true }}
//                       whileHover={{ y: -5, scale: 1.02 }}
//                       className="group cursor-pointer"
//                       onClick={() => handleTalentClick(talent)}
//                     >
//                       <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-100 rounded-lg">
//                         {loadingPhotos[talent.id] ? (
//                           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                             <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
//                           </div>
//                         ) : (
//                           <img
//                             src={mainPhotoUrl || "/placeholder.svg"}
//                             alt={talent.name}
//                             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                             onError={(e) => {
//                               e.target.src = "/placeholder.svg?height=400&width=300"
//                             }}
//                           />
//                         )}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                         {talent.destaque && (
//                           <div className="absolute top-3 right-3">
//                             <Crown className="w-4 h-4 text-amber-500" />
//                           </div>
//                         )}

//                         {/* Favorite button */}
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             toggleFavorite(talent.id)
//                           }}
//                           className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${
//                             favorites.has(talent.id)
//                               ? "bg-red-500 text-white"
//                               : "bg-white/80 text-gray-700 hover:bg-white"
//                           }`}
//                         >
//                           <Heart className={`w-4 h-4 ${favorites.has(talent.id) ? "fill-current" : ""}`} />
//                         </motion.button>
//                       </div>

//                       <div className="text-center">
//                         <h4 className="font-light tracking-wider mb-1 group-hover:text-pink-500 transition-colors text-gray-900">
//                           {talent.name}
//                         </h4>
//                         <p className="text-gray-600 text-xs tracking-wider">
//                           {talent.birth_date
//                             ? `${new Date().getFullYear() - new Date(talent.birth_date).getFullYear()} ANOS`
//                             : ""}
//                         </p>
//                       </div>
//                     </motion.div>
//                   )
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Male Talents */}
//           {(genderFilter === "all" || genderFilter === "male") && maleTalents.length > 0 && (
//             <div>
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.8 }}
//                 viewport={{ once: true }}
//                 className="flex items-center gap-4 mb-12"
//               >
//                 <h3 className="text-3xl md:text-4xl font-thin tracking-wider text-gray-900">MASCULINO</h3>
//                 <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
//                 <span className="text-blue-500 text-sm tracking-wider">{maleTalents.length} TALENTOS</span>
//               </motion.div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                 {maleTalents.map((talent, index) => {
//                   const mainPhotoUrl = getTalentMainPhoto(talent.id)
//                   return (
//                     <motion.div
//                       key={talent.id}
//                       initial={{ opacity: 0, y: 30 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5, delay: index * 0.05 }}
//                       viewport={{ once: true }}
//                       whileHover={{ y: -5, scale: 1.02 }}
//                       className="group cursor-pointer"
//                       onClick={() => handleTalentClick(talent)}
//                     >
//                       <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-100 rounded-lg">
//                         {loadingPhotos[talent.id] ? (
//                           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                             <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
//                           </div>
//                         ) : (
//                           <img
//                             src={mainPhotoUrl || "/placeholder.svg"}
//                             alt={talent.name}
//                             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                             onError={(e) => {
//                               e.target.src = "/placeholder.svg?height=400&width=300"
//                             }}
//                           />
//                         )}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                         {talent.destaque && (
//                           <div className="absolute top-3 right-3">
//                             <Crown className="w-4 h-4 text-amber-500" />
//                           </div>
//                         )}

//                         {/* Favorite button */}
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             toggleFavorite(talent.id)
//                           }}
//                           className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${
//                             favorites.has(talent.id)
//                               ? "bg-red-500 text-white"
//                               : "bg-white/80 text-gray-700 hover:bg-white"
//                           }`}
//                         >
//                           <Heart className={`w-4 h-4 ${favorites.has(talent.id) ? "fill-current" : ""}`} />
//                         </motion.button>
//                       </div>

//                       <div className="text-center">
//                         <h4 className="font-light tracking-wider mb-1 group-hover:text-blue-500 transition-colors text-gray-900">
//                           {talent.name}
//                         </h4>
//                         <p className="text-gray-600 text-xs tracking-wider">
//                           {talent.birth_date
//                             ? `${new Date().getFullYear() - new Date(talent.birth_date).getFullYear()} ANOS`
//                             : ""}
//                         </p>
//                       </div>
//                     </motion.div>
//                   )
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   )
// }






































"use client"

import { useState, useEffect, useRef } from "react"
import { useTalent } from "../contexts/talents-context"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Loader2,
  Heart,
  Eye,
  Music,
  Languages,
  ArrowRight,
  Crown,
  Camera,
} from "lucide-react"

export default function TalentsGallery() {
  const { talents, loading, fetchTalentById, fetchTalentPhotos, fetchTalents, error } = useTalent()

  // State management
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [talentPhotos, setTalentPhotos] = useState({})
  const [loadingPhotos, setLoadingPhotos] = useState({})
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [viewMode, setViewMode] = useState("grid")
  const [filterType, setFilterType] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all") // 'all', 'male', 'female'
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState(new Set())
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0)

  // Refs
  const heroRef = useRef(null)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  // Auto-advance hero photos
  useEffect(() => {
    if (!selectedTalent || !talentPhotos[selectedTalent.id]?.length) return

    const interval = setInterval(() => {
      setHeroPhotoIndex((prev) => {
        const maxIndex = talentPhotos[selectedTalent.id].length - 1
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [selectedTalent, talentPhotos])

  // Determine gender based on name patterns (basic implementation)
  const determineGender = (name) => {
    const femaleEndings = ["a", "ana", "ina", "ela", "lia", "ria", "ica", "isa", "ane", "ene", "ine"]
    const maleEndings = ["o", "os", "an", "on", "el", "ar", "er", "ir", "or", "ur"]

    const lowerName = name.toLowerCase()

    // Check female endings
    if (femaleEndings.some((ending) => lowerName.endsWith(ending))) {
      return "female"
    }

    // Check male endings
    if (maleEndings.some((ending) => lowerName.endsWith(ending))) {
      return "male"
    }

    // Default fallback
    return "unknown"
  }

  // Load talent photos - CORRIGIDO para ser mais robusto
  const loadTalentPhotos = async (talentId) => {
    if (talentPhotos[talentId] || loadingPhotos[talentId]) return

    setLoadingPhotos((prev) => ({ ...prev, [talentId]: true }))

    try {
      console.log(`Carregando fotos para talento ID: ${talentId}`)
      const photos = await fetchTalentPhotos(talentId)
      console.log(`Fotos recebidas para talento ${talentId}:`, photos)

      if (Array.isArray(photos) && photos.length > 0) {
        // CORRIGIDO: Processar todas as fotos sem filtrar por release
        const processedPhotos = photos
          .map((photo) => ({
            id: photo.id,
            talent_id: photo.talent_id,
            url: photo.image_url, // Usar image_url da API
            public_id: photo.public_id,
            short_url: photo.short_url,
            release: photo.release,
          }))
          .filter((photo) => photo.url && photo.url.trim() !== "") // Filtrar apenas URLs válidas

        console.log(`Fotos processadas para talento ${talentId}:`, processedPhotos)

        setTalentPhotos((prev) => ({
          ...prev,
          [talentId]: processedPhotos,
        }))
      } else {
        console.log(`Nenhuma foto encontrada para talento ${talentId}`)
        setTalentPhotos((prev) => ({
          ...prev,
          [talentId]: [],
        }))
      }
    } catch (error) {
      console.error(`Erro ao carregar fotos do talento ${talentId}:`, error)
      setTalentPhotos((prev) => ({
        ...prev,
        [talentId]: [],
      }))
    } finally {
      setLoadingPhotos((prev) => ({ ...prev, [talentId]: false }))
    }
  }

  // Load talent data
  const loadTalentData = async (talentId) => {
    try {
      const talent = await fetchTalentById(talentId)
      if (talent) {
        setSelectedTalent(talent)
        setHeroPhotoIndex(0)
        await loadTalentPhotos(talentId)
      }
    } catch (error) {
      console.error("Erro ao carregar dados do talento:", error)
    }
  }

  // Initialize data - CORRIGIDO com mais logs
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (talents.length > 0) {
          console.log("Inicializando com talentos existentes:", talents.length)

          // Prioritize featured talents
          const featuredTalents = talents.filter((t) => t.destaque)
          const firstTalent = featuredTalents.length > 0 ? featuredTalents[0] : talents[0]

          console.log("Primeiro talento selecionado:", firstTalent)
          setSelectedTalent(firstTalent)
          setCurrentIndex(talents.findIndex((t) => t.id === firstTalent.id))

          // CORRIGIDO: Aguardar o carregamento das fotos antes de continuar
          console.log("Carregando fotos do primeiro talento...")
          await loadTalentPhotos(firstTalent.id)
          console.log("Fotos do primeiro talento carregadas")

          // Preload photos for featured talents first, then others
          const priorityTalents = [...featuredTalents, ...talents.filter((t) => !t.destaque)].slice(0, 10)

          // Carregar fotos em paralelo com delay escalonado
          priorityTalents.forEach((talent, index) => {
            setTimeout(() => {
              console.log(`Pré-carregando fotos do talento: ${talent.name} (ID: ${talent.id})`)
              loadTalentPhotos(talent.id)
            }, index * 300) // Aumentar delay para 300ms
          })

          setInitialLoadComplete(true)
          return
        }

        console.log("Buscando talentos da API...")
        const data = await fetchTalents()
        if (data && data.length > 0) {
          console.log("Talentos carregados da API:", data.length)

          const featuredTalents = data.filter((t) => t.destaque)
          const firstTalent = featuredTalents.length > 0 ? featuredTalents[0] : data[0]

          console.log("Primeiro talento da API:", firstTalent)
          setSelectedTalent(firstTalent)
          setCurrentIndex(data.findIndex((t) => t.id === firstTalent.id))

          console.log("Carregando fotos do primeiro talento da API...")
          await loadTalentPhotos(firstTalent.id)

          const priorityTalents = [...featuredTalents, ...data.filter((t) => !t.destaque)].slice(0, 10)
          priorityTalents.forEach((talent, index) => {
            setTimeout(() => {
              console.log(`Pré-carregando fotos: ${talent.name} (ID: ${talent.id})`)
              loadTalentPhotos(talent.id)
            }, index * 300)
          })
        }

        setInitialLoadComplete(true)
      } catch (err) {
        console.error("Erro ao inicializar dados:", err)
        setInitialLoadComplete(true)
      }
    }

    initializeData()
  }, [talents, fetchTalents])

  // Filter talents by gender and other criteria
  const filteredTalents = talents.filter((talent) => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "destacados" && talent.destaque) ||
      (filterType === "disponivel" && talent.disponivel) ||
      (filterType === "ativo" && talent.ativo)

    const gender = determineGender(talent.name)
    const matchesGender =
      genderFilter === "all" ||
      (genderFilter === "male" && gender === "male") ||
      (genderFilter === "female" && gender === "female")

    return matchesSearch && matchesFilter && matchesGender
  })

  // Separate by gender for display
  const maleTalents = filteredTalents.filter((talent) => determineGender(talent.name) === "male")
  const femaleTalents = filteredTalents.filter((talent) => determineGender(talent.name) === "female")
  const featuredTalents = filteredTalents.filter((talent) => talent.destaque)

  // Navigation handlers
  const handlePrevious = () => {
    if (talents.length === 0) return
    const newIndex = currentIndex > 0 ? currentIndex - 1 : talents.length - 1
    setCurrentIndex(newIndex)
    const talent = talents[newIndex]
    setSelectedTalent(talent)
    loadTalentPhotos(talent.id)
  }

  const handleNext = () => {
    if (talents.length === 0) return
    const newIndex = currentIndex < talents.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    const talent = talents[newIndex]
    setSelectedTalent(talent)
    loadTalentPhotos(talent.id)
  }

  const handleTalentClick = (talent) => {
    const talentIndex = talents.findIndex((t) => t.id === talent.id)
    setCurrentIndex(talentIndex)
    setSelectedTalent(talent)
    loadTalentPhotos(talent.id)
    heroRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleFavorite = (talentId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(talentId)) {
        newFavorites.delete(talentId)
      } else {
        newFavorites.add(talentId)
      }
      return newFavorites
    })
  }

  // Get main photo for talent - CORRIGIDO para sempre mostrar a primeira foto
  const getTalentMainPhoto = (talentId) => {
    const photos = talentPhotos[talentId]
    console.log(`getTalentMainPhoto para talento ${talentId}:`, photos)

    if (photos && photos.length > 0) {
      // Sempre usar a primeira foto disponível, independente do release
      const firstPhoto = photos[0]
      console.log(`Primeira foto para talento ${talentId}:`, firstPhoto)

      if (firstPhoto && firstPhoto.url) {
        console.log(`URL da foto para talento ${talentId}:`, firstPhoto.url)
        return firstPhoto.url
      }
    }

    console.log(`Nenhuma foto encontrada para talento ${talentId}, usando placeholder`)
    return "/placeholder.svg?height=600&width=450&text=Sem+Foto"
  }

  // Loading state - FUNDO CLARO
  if (loading && !initialLoadComplete && talents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-2 border-amber-500 rounded-full animate-spin border-t-transparent mx-auto"></div>
            <Crown className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-800 font-light tracking-wider">CARREGANDO TALENTOS EXCLUSIVOS</p>
        </motion.div>
      </div>
    )
  }

  if (initialLoadComplete && talents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <Crown className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-light text-gray-800 mb-2 tracking-wider">NENHUM TALENTO ENCONTRADO</h2>
          <p className="text-gray-600">{error ? `Erro: ${error}` : "Não há talentos disponíveis no momento."}</p>
        </motion.div>
      </div>
    )
  }

  const currentTalent = selectedTalent || (talents.length > 0 ? talents[0] : null)

  if (!currentTalent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-800 font-light tracking-wider">PREPARANDO GALERIA</p>
        </motion.div>
      </div>
    )
  }

  const currentTalentPhotos = talentPhotos[currentTalent.id] || []
  const currentHeroPhoto = currentTalentPhotos[heroPhotoIndex] || {}

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900">
      {/* Hero Section - Fashion Magazine Style */}
      <motion.div
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative h-screen overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentTalent.id}-${heroPhotoIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            {/* Background Image - USANDO APENAS FOTOS DA API */}
            <div className="absolute inset-0">
              {currentHeroPhoto.url || (currentTalentPhotos.length > 0 && currentTalentPhotos[0].url) ? (
                <img
                  src={currentHeroPhoto.url || currentTalentPhotos[0]?.url || "/placeholder.svg"}
                  alt={`${currentTalent.name} - Foto ${heroPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Erro ao carregar foto: ${currentHeroPhoto.url || currentTalentPhotos[0]?.url}`)
                    e.target.src = "/placeholder.svg?height=1080&width=1920&text=Erro+ao+Carregar"
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {loadingPhotos[currentTalent.id] ? (
                    <div className="text-center">
                      <Loader2 className="w-16 h-16 animate-spin text-amber-500 mx-auto mb-4" />
                      <p className="text-gray-700 font-light tracking-wider">CARREGANDO FOTOS...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-light tracking-wider">NENHUMA FOTO DISPONÍVEL</p>
                    </div>
                  )}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="space-y-8"
                  >
                    {/* Featured Badge */}
                    {currentTalent.destaque && (
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-3 rounded-none font-bold text-sm tracking-wider"
                      >
                        <Crown className="w-5 h-5" />
                        TALENTO EXCLUSIVO
                      </motion.div>
                    )}

                    {/* Name */}
                    <div>
                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-thin tracking-tight leading-none mb-4 text-gray-900"
                      >
                        {currentTalent.name.split(" ")[0]}
                      </motion.h1>
                      {currentTalent.name.split(" ").length > 1 && (
                        <motion.h2
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                          className="text-4xl md:text-6xl font-light tracking-wider text-gray-600"
                        >
                          {currentTalent.name.split(" ").slice(1).join(" ")}
                        </motion.h2>
                      )}
                    </div>

                    {/* Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="flex flex-wrap gap-6 text-sm tracking-wider"
                    >
                      {currentTalent.birth_date && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-px h-4 bg-amber-500"></div>
                          <span>
                            {new Date().getFullYear() - new Date(currentTalent.birth_date).getFullYear()} ANOS
                          </span>
                        </div>
                      )}
                      {currentTalent.height && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-px h-4 bg-amber-500"></div>
                          <span>{currentTalent.height}</span>
                        </div>
                      )}
                      {currentTalent.tipo_talento && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-px h-4 bg-amber-500"></div>
                          <span>{currentTalent.tipo_talento.toUpperCase()}</span>
                        </div>
                      )}
                    </motion.div>

                    {/* Instagram */}
                    {currentTalent.instagram && (
                      <motion.a
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        href={`https://instagram.com/${currentTalent.instagram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 border border-gray-400 hover:border-amber-500 px-6 py-3 transition-all duration-300 group text-gray-800"
                      >
                        <Instagram className="w-5 h-5 group-hover:text-amber-500 transition-colors" />
                        <span className="tracking-wider">@{currentTalent.instagram}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.a>
                    )}
                  </motion.div>

                  {/* Right Content - Stats */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-8 lg:text-right"
                  >
                    {/* Photo Counter */}
                    {currentTalentPhotos.length > 0 && (
                      <div className="text-right">
                        <div className="text-4xl font-thin text-amber-500 mb-2">
                          {String(heroPhotoIndex + 1).padStart(2, "0")}
                        </div>
                        <div className="text-sm tracking-wider text-gray-600">
                          DE {String(currentTalentPhotos.length).padStart(2, "0")} FOTOS
                        </div>
                      </div>
                    )}

                    {/* Loading indicator for photos */}
                    {loadingPhotos[currentTalent.id] && (
                      <div className="text-right">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-500 ml-auto mb-2" />
                        <div className="text-sm tracking-wider text-gray-600">CARREGANDO FOTOS...</div>
                      </div>
                    )}

                    {/* Skills */}
                    <div className="space-y-4">
                      {currentTalent.can_sing && (
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-sm tracking-wider text-gray-700">CANTO</span>
                          <Music className="w-4 h-4 text-amber-500" />
                        </div>
                      )}
                      {currentTalent.languages && currentTalent.languages.length > 0 && (
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-sm tracking-wider text-gray-700">
                            {currentTalent.languages.length} IDIOMAS
                          </span>
                          <Languages className="w-4 h-4 text-amber-500" />
                        </div>
                      )}
                      {currentTalent.instruments && currentTalent.instruments.length > 0 && (
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-sm tracking-wider text-gray-700">
                            {currentTalent.instruments.length} INSTRUMENTOS
                          </span>
                          <Music className="w-4 h-4 text-amber-500" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute inset-y-0 left-0 flex items-center z-20">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevious}
                className="ml-8 w-12 h-12 border border-gray-400 hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300 flex items-center justify-center text-gray-800"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center z-20">
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="mr-8 w-12 h-12 border border-gray-400 hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300 flex items-center justify-center text-gray-800"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Photo Progress */}
            {currentTalentPhotos.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex gap-2">
                  {currentTalentPhotos.map((_, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setHeroPhotoIndex(idx)}
                      className={`w-8 h-px transition-all duration-300 ${
                        heroPhotoIndex === idx ? "bg-amber-500" : "bg-gray-400 hover:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Featured Talents Section */}
      {featuredTalents.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-thin tracking-wider mb-4 text-gray-900">
                TALENTOS <span className="text-amber-500">EXCLUSIVOS</span>
              </h2>
              <div className="w-24 h-px bg-amber-500 mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTalents.slice(0, 6).map((talent, index) => {
                const mainPhotoUrl = getTalentMainPhoto(talent.id)
                return (
                  <motion.div
                    key={talent.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer"
                    onClick={() => handleTalentClick(talent)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100 rounded-lg">
                      {loadingPhotos[talent.id] ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                        </div>
                      ) : (
                        <img
                          src={mainPhotoUrl || "/placeholder.svg"}
                          alt={talent.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=600&width=450"
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Crown badge */}
                      <div className="absolute top-4 right-4">
                        <Crown className="w-6 h-6 text-amber-500" />
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 border border-white/70 flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-2xl font-light tracking-wider mb-2 group-hover:text-amber-500 transition-colors text-gray-900">
                        {talent.name}
                      </h3>
                      <p className="text-gray-600 text-sm tracking-wider">
                        {talent.tipo_talento?.toUpperCase() || "TALENTO"}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gender Sections */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-center justify-between mb-16"
          >
            <div className="flex items-center gap-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="BUSCAR TALENTOS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-b border-gray-400 focus:border-amber-500 px-0 py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-colors tracking-wider"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-b border-gray-400 focus:border-amber-500 px-0 py-3 text-gray-900 focus:outline-none transition-colors tracking-wider"
              >
                <option value="all" className="bg-white">
                  TODOS
                </option>
                <option value="destacados" className="bg-white">
                  DESTAQUES
                </option>
                <option value="disponivel" className="bg-white">
                  DISPONÍVEIS
                </option>
                <option value="ativo" className="bg-white">
                  ATIVOS
                </option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGenderFilter("all")}
                className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
                  genderFilter === "all"
                    ? "border-amber-500 text-amber-500"
                    : "border-gray-400 text-gray-700 hover:border-gray-600"
                }`}
              >
                TODOS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGenderFilter("female")}
                className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
                  genderFilter === "female"
                    ? "border-amber-500 text-amber-500"
                    : "border-gray-400 text-gray-700 hover:border-gray-600"
                }`}
              >
                FEMININO
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGenderFilter("male")}
                className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
                  genderFilter === "male"
                    ? "border-amber-500 text-amber-500"
                    : "border-gray-400 text-gray-700 hover:border-gray-600"
                }`}
              >
                MASCULINO
              </motion.button>
            </div>
          </motion.div>

          {/* Female Talents */}
          {(genderFilter === "all" || genderFilter === "female") && femaleTalents.length > 0 && (
            <div className="mb-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-12"
              >
                <h3 className="text-3xl md:text-4xl font-thin tracking-wider text-gray-900">FEMININO</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-pink-400 to-transparent"></div>
                <span className="text-pink-500 text-sm tracking-wider">{femaleTalents.length} TALENTOS</span>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {femaleTalents.map((talent, index) => {
                  const mainPhotoUrl = getTalentMainPhoto(talent.id)
                  return (
                    <motion.div
                      key={talent.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group cursor-pointer"
                      onClick={() => handleTalentClick(talent)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-100 rounded-lg">
                        {(() => {
                          const photoUrl = getTalentMainPhoto(talent.id)
                          console.log(`Renderizando card para ${talent.name} (ID: ${talent.id}) com foto:`, photoUrl)
                          return null
                        })()}
                        {loadingPhotos[talent.id] ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                          </div>
                        ) : (
                          <img
                            src={mainPhotoUrl || "/placeholder.svg"}
                            alt={talent.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=400&width=300"
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {talent.destaque && (
                          <div className="absolute top-3 right-3">
                            <Crown className="w-4 h-4 text-amber-500" />
                          </div>
                        )}

                        {/* Favorite button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(talent.id)
                          }}
                          className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                            favorites.has(talent.id)
                              ? "bg-red-500 text-white"
                              : "bg-white/80 text-gray-700 hover:bg-white"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.has(talent.id) ? "fill-current" : ""}`} />
                        </motion.button>
                      </div>

                      <div className="text-center">
                        <h4 className="font-light tracking-wider mb-1 group-hover:text-pink-500 transition-colors text-gray-900">
                          {talent.name}
                        </h4>
                        <p className="text-gray-600 text-xs tracking-wider">
                          {talent.birth_date
                            ? `${new Date().getFullYear() - new Date(talent.birth_date).getFullYear()} ANOS`
                            : ""}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Male Talents */}
          {(genderFilter === "all" || genderFilter === "male") && maleTalents.length > 0 && (
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-12"
              >
                <h3 className="text-3xl md:text-4xl font-thin tracking-wider text-gray-900">MASCULINO</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
                <span className="text-blue-500 text-sm tracking-wider">{maleTalents.length} TALENTOS</span>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {maleTalents.map((talent, index) => {
                  const mainPhotoUrl = getTalentMainPhoto(talent.id)
                  return (
                    <motion.div
                      key={talent.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group cursor-pointer"
                      onClick={() => handleTalentClick(talent)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-100 rounded-lg">
                        {(() => {
                          const photoUrl = getTalentMainPhoto(talent.id)
                          console.log(`Renderizando card para ${talent.name} (ID: ${talent.id}) com foto:`, photoUrl)
                          return null
                        })()}
                        {loadingPhotos[talent.id] ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                          </div>
                        ) : (
                          <img
                            src={mainPhotoUrl || "/placeholder.svg"}
                            alt={talent.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=400&width=300"
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {talent.destaque && (
                          <div className="absolute top-3 right-3">
                            <Crown className="w-4 h-4 text-amber-500" />
                          </div>
                        )}

                        {/* Favorite button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(talent.id)
                          }}
                          className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                            favorites.has(talent.id)
                              ? "bg-red-500 text-white"
                              : "bg-white/80 text-gray-700 hover:bg-white"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.has(talent.id) ? "fill-current" : ""}`} />
                        </motion.button>
                      </div>

                      <div className="text-center">
                        <h4 className="font-light tracking-wider mb-1 group-hover:text-blue-500 transition-colors text-gray-900">
                          {talent.name}
                        </h4>
                        <p className="text-gray-600 text-xs tracking-wider">
                          {talent.birth_date
                            ? `${new Date().getFullYear() - new Date(talent.birth_date).getFullYear()} ANOS`
                            : ""}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
