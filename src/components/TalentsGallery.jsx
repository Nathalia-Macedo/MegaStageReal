import { useState, useEffect, useRef } from "react"
import { useTalent } from "../contexts/talents-context"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronLeft, ChevronRight, Instagram, Loader2, Eye, ArrowRight, Crown, ChevronDown } from "lucide-react"
import TalentDetails from "./TalentDetails"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Header from "./HeaderSite"
import Footer from "./Footer"
export default function TalentsGallery({ onPageNavigate }) {
  const [showDetails, setShowDetails] = useState(false)
  const [selectedTalentForDetails, setSelectedTalentForDetails] = useState(null)

  const { talents, loading, fetchTalentById, fetchTalentPhotos, fetchTalents, error } = useTalent()

  // State management
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [talentPhotos, setTalentPhotos] = useState({})
  const [loadingPhotos, setLoadingPhotos] = useState({})
  const [loadedImages, setLoadedImages] = useState({})
  const [imageErrors, setImageErrors] = useState({})
  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Pagination states
  const [atrizesPage, setAtrizesPage] = useState(1)
  const [atoresPage, setAtoresPage] = useState(1)
  const itemsPerPage = 10

  // Filter states
  const [filterType, setFilterType] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Refs
  const heroRef = useRef(null)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  // Auto-advance hero photos
  const currentTalent = selectedTalent || (talents.length > 0 ? talents[0] : null)
  const currentTalentPhotos = currentTalent ? talentPhotos[currentTalent.id] || [] : []

  useEffect(() => {
    if (!currentTalent || !currentTalentPhotos?.length || currentTalentPhotos.length <= 1) return

    const interval = setInterval(() => {
      setHeroPhotoIndex((prev) => {
        const maxIndex = currentTalentPhotos.length - 1
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 5000) // Reduzindo de 7000ms para 5000ms para melhor experiência

    return () => clearInterval(interval)
  }, [currentTalent, currentTalentPhotos]) // Usando currentTalentPhotos em vez de talentPhotos[selectedTalent.id]

  const getFeaturedTalentsFirst = (talentsList) => {
    const featured = talentsList.filter((talent) => talent.destaque === true)
    const regular = talentsList.filter((talent) => talent.destaque !== true)
    return [...featured, ...regular]
  }

  // Função para determinar o tipo do talento
  const getTalentType = (talent) => {
    if (!talent.tipo_talento) return "indefinido"
    return talent.tipo_talento.toLowerCase()
  }

  // Função para renderizar o tipo do talento
  const renderTalentType = (talent) => {
    const tipo = talent.tipo_talento
    if (!tipo || tipo.trim() === "") return "A definir"
    return tipo
  }

  // Load talent photos - CORRIGIDO para carregar todas as fotos
  const loadTalentPhotos = async (talentId) => {
    if (talentPhotos[talentId] && talentPhotos[talentId].length > 0) return
    if (loadingPhotos[talentId]) return

    setLoadingPhotos((prev) => ({ ...prev, [talentId]: true }))
    try {
      console.log(`Carregando fotos para talento ID: ${talentId}`)
      const photos = await fetchTalentPhotos(talentId)
      console.log(`Fotos recebidas para talento ${talentId}:`, photos)
      if (Array.isArray(photos) && photos.length > 0) {
        const processedPhotos = photos
          .map((photo) => ({
            id: photo.id,
            talent_id: photo.talent_id,
            url: photo.image_url,
            public_id: photo.public_id,
            short_url: photo.short_url,
            release: photo.release,
          }))
          .filter((photo) => photo.url && photo.url.trim() !== "")
        console.log(`Fotos processadas para talento ${talentId}:`, processedPhotos)

        setTalentPhotos((prev) => {
          if (prev[talentId] && prev[talentId].length > 0) {
            return prev // Don't replace existing photos
          }
          return {
            ...prev,
            [talentId]: processedPhotos,
          }
        })
      } else {
        console.log(`Nenhuma foto encontrada para talento ${talentId}`)
        setTalentPhotos((prev) => ({
          ...prev,
          [talentId]: prev[talentId] || [],
        }))
      }
    } catch (error) {
      console.error(`Erro ao carregar fotos do talento ${talentId}:`, error)
      setTalentPhotos((prev) => ({
        ...prev,
        [talentId]: prev[talentId] || [],
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

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (talents.length === 0) {
          console.log("Buscando talentos da API...")
          const data = await fetchTalents()
          console.log("Dados retornados por fetchTalents:", data)
          if (!data || data.length === 0) {
            console.log("Nenhum talento retornado da API")
            setInitialLoadComplete(true)
            return
          }
          console.log("Talentos carregados da API:", data.length)
          const prioritizedTalents = getFeaturedTalentsFirst(data)
          const firstTalent = prioritizedTalents[0]
          console.log("Talento selecionado:", firstTalent)
          setSelectedTalent(firstTalent)
          setCurrentIndex(data.findIndex((t) => t.id === firstTalent.id))
          // Carregar fotos do primeiro talento imediatamente
          await loadTalentPhotos(firstTalent.id)
        } else {
          console.log("Inicializando com talentos existentes:", talents.length)
          if (!selectedTalent) {
            const prioritizedTalents = getFeaturedTalentsFirst(talents)
            const firstTalent = prioritizedTalents[0]
            setSelectedTalent(firstTalent)
            setCurrentIndex(talents.findIndex((t) => t.id === firstTalent.id))
            // Carregar fotos do primeiro talento
            await loadTalentPhotos(firstTalent.id)
          }
        }

        if (talents.length > 0 && selectedTalent) {
          const batchSize = 3
          const otherTalents = talents.filter((t) => t.id !== selectedTalent.id)
          for (let i = 0; i < otherTalents.length; i += batchSize) {
            const batch = otherTalents.slice(i, i + batchSize)
            setTimeout(
              () => {
                batch.forEach((talent) => loadTalentPhotos(talent.id))
              },
              (i / batchSize) * 2000,
            )
          }
        }

        setInitialLoadComplete(true)
      } catch (err) {
        console.error("Erro ao inicializar dados:", err)
        setInitialLoadComplete(true)
      }
    }

    initializeData()
  }, [talents, fetchTalents, fetchTalentPhotos])

  // Filter talents
  const filteredTalents = talents.filter((talent) => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "destacados" && talent.destaque) ||
      (filterType === "disponivel" && talent.disponivel) ||
      (filterType === "ativo" && talent.ativo)
    const talentType = getTalentType(talent)
    const matchesGender =
      genderFilter === "all" ||
      (genderFilter === "atriz" && talentType === "atriz") ||
      (genderFilter === "ator" && talentType === "ator")
    return matchesSearch && matchesFilter && matchesGender
  })

  // Separate by tipo_talento for display
  const atoresTalents = filteredTalents.filter((talent) => getTalentType(talent) === "ator")
  const atrizesTalents = filteredTalents.filter((talent) => getTalentType(talent) === "atriz")

  // Pagination logic
  const paginatedAtrizes = atrizesTalents.slice((atrizesPage - 1) * itemsPerPage, atrizesPage * itemsPerPage)
  const paginatedAtores = atoresTalents.slice((atoresPage - 1) * itemsPerPage, atoresPage * itemsPerPage)
  const totalAtrizesPages = Math.ceil(atrizesTalents.length / itemsPerPage)
  const totalAtoresPages = Math.ceil(atoresTalents.length / itemsPerPage)

  const handlePrevious = () => {
    if (talents.length === 0) return
    const prioritizedTalents = getFeaturedTalentsFirst(talents)
    const currentPriorityIndex = prioritizedTalents.findIndex((t) => t.id === selectedTalent?.id)
    const newPriorityIndex = currentPriorityIndex > 0 ? currentPriorityIndex - 1 : prioritizedTalents.length - 1
    const talent = prioritizedTalents[newPriorityIndex]
    const originalIndex = talents.findIndex((t) => t.id === talent.id)
    setCurrentIndex(originalIndex)
    setSelectedTalent(talent)
    loadTalentPhotos(talent.id)
  }

  const handleNext = () => {
    if (talents.length === 0) return
    const prioritizedTalents = getFeaturedTalentsFirst(talents)
    const currentPriorityIndex = prioritizedTalents.findIndex((t) => t.id === selectedTalent?.id)
    const newPriorityIndex = currentPriorityIndex < prioritizedTalents.length - 1 ? currentPriorityIndex + 1 : 0
    const talent = prioritizedTalents[newPriorityIndex]
    const originalIndex = talents.findIndex((t) => t.id === talent.id)
    setCurrentIndex(originalIndex)
    setSelectedTalent(talent)
    loadTalentPhotos(talent.id)
  }

  const handleTalentClick = (talent) => {
    handleViewDetails(talent.id)
  }

  // Get main photo for talent - CORRIGIDO
  const getTalentMainPhoto = (talentId) => {
    const imageKey = `talent-${talentId}-main`
    if (loadedImages[imageKey]) {
      return loadedImages[imageKey]
    }

    const photos = talentPhotos[talentId]
    if (photos && photos.length > 0) {
      const firstPhoto = photos[0]
      if (firstPhoto && firstPhoto.url) {
        return firstPhoto.url
      }
    }
    return "/placeholder.svg?height=600&width=450&text=Sem+Foto"
  }

  const currentHeroPhoto = currentTalentPhotos[heroPhotoIndex] || {}

  const handlePrevTalent = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : currentTalent?.photos?.length - 1))
  }

  const handleNextTalent = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex < currentTalent?.photos?.length - 1 ? prevIndex + 1 : 0))
  }

  const handleViewDetails = (talentId) => {
    const talent = talents.find((t) => t.id === talentId)
    setSelectedTalentForDetails(talent)
    setShowDetails(true)
  }

  const handleBackFromDetails = () => {
    setShowDetails(false)
    setSelectedTalentForDetails(null)
  }

  const handleImageLoad = (imageKey, imageUrl) => {
    setLoadedImages((prev) => ({
      ...prev,
      [imageKey]: imageUrl,
    }))
  }

  const handleImageError = (imageKey, talentId) => {
    const errorKey = `${imageKey}-error`
    if (imageErrors[errorKey]) {
      return // Already handled this error, prevent infinite loops
    }

    setImageErrors((prev) => ({
      ...prev,
      [errorKey]: true,
    }))

    // Don't update loadedImages for errors to keep placeholder
  }

  const handleNavigation = (section) => {
    console.log(`[v0] Navegando para seção: ${section}`)

    if (section === "dashboard") {
      console.log(`[v0] Redirecionando para dashboard`)

      if (onPageNavigate && typeof onPageNavigate === "function") {
        onPageNavigate("dashboard")
        return
      }

      // Try to call parent navigation function if available
      if (window.navigateTo && typeof window.navigateTo === "function") {
        window.navigateTo("dashboard")
        return
      }

      // Try to dispatch a custom event for parent components to listen
      window.dispatchEvent(new CustomEvent("navigate", { detail: { route: "dashboard" } }))

      // Fallback: try to navigate using window.location if in a single-page setup
      if (window.location.hash !== undefined) {
        window.location.hash = "#dashboard"
      }

      return
    }

    // Handle section scrolling
    const element = document.getElementById(section)
    if (element) {
      console.log(`[v0] Elemento encontrado para ${section}, fazendo scroll`)
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    } else {
      console.log(`[v0] Elemento não encontrado para seção: ${section}`)
    }
  }

  if (showDetails && selectedTalentForDetails) {
    return <TalentDetails talent={selectedTalentForDetails} onBack={handleBackFromDetails} />
  }

  return (
    <>
      <Header onNavigate={handleNavigation} />
      <div ref={containerRef} className="min-h-screen bg-white text-gray-900">
        {/* Hero Section - Redesign completo para ser digno de prêmio */}
        <motion.div
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-[98vh] lg:h-[100vh] overflow-hidden bg-white" // Aumentou altura de min-h-[95vh] para min-h-[98vh]
        >
          {currentTalent ? (
            <section className="relative min-h-[98vh] lg:h-[100vh] bg-white overflow-hidden">
              <div className="h-full flex flex-col lg:flex-row">
                <div className="lg:hidden relative h-96 sm:h-[450px] order-1">
                  {loadingPhotos[currentTalent.id] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
                    </div>
                  ) : currentTalentPhotos.length > 0 && currentHeroPhoto.url ? (
                    <img
                      src={currentHeroPhoto.url || "/placeholder.svg"}
                      alt={`${currentTalent.name} - Foto ${heroPhotoIndex + 1}`}
                      className="w-full h-full object-contain"
                      onLoad={() => handleImageLoad(`hero-${currentTalent.id}-${heroPhotoIndex}`, currentHeroPhoto.url)}
                      onError={(e) => {
                        handleImageError(`hero-${currentTalent.id}-${heroPhotoIndex}`, currentTalent.id)
                        e.target.src = "/placeholder.svg?height=450&width=400"
                      }}
                    />
                  ) : (
                    <img
                      src="/placeholder.svg?height=450&width=400"
                      alt={currentTalent.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                  {/* Contador de fotos mobile */}
                  {currentTalentPhotos.length > 1 && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-sm">
                      <div className="text-right">
                        <div className="text-lg font-light text-gray-900">
                          {String(heroPhotoIndex + 1).padStart(2, "0")}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          DE {String(currentTalentPhotos.length).padStart(2, "0")} FOTOS
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Indicadores de foto mobile */}
                  {currentTalentPhotos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                        {currentTalentPhotos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setHeroPhotoIndex(index)}
                            className={`transition-all duration-300 ${
                              index === heroPhotoIndex
                                ? "w-6 h-1 bg-amber-400"
                                : "w-3 h-1 bg-gray-300 hover:bg-gray-400"
                            } rounded-full`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-8 lg:py-16 relative z-10 order-2">
                  <div className="max-w-lg mx-auto lg:mx-0">
                    {/* Adicionou mx-auto para centralizar no mobile */}
                    <div className="mb-6 lg:mb-12 text-center lg:text-left">
                      {/* Centralizou no mobile */}
                      {currentTalent.destaque && (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-4 py-2 rounded-sm font-medium text-sm mb-6 lg:mb-12">
                          <Crown className="w-4 h-4" />
                          TALENTO EXCLUSIVO
                        </div>
                      )}
                      <div className="space-y-1 lg:space-y-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 leading-none">
                          {currentTalent.name?.split(" ")[0] || "Nome"}
                        </h1>
                        <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light text-gray-600 leading-none">
                          {currentTalent.name?.split(" ").slice(1).join(" ") || ""}
                        </h2>
                      </div>
                    </div>
                    <div className="space-y-4 lg:space-y-8 mb-6 lg:mb-12 text-center lg:text-left">
                      {/* Centralizou no mobile */}
                      {currentTalent.birth_date && (
                        <div className="flex items-center gap-4 justify-center lg:justify-start">
                          {/* Centralizou no mobile */}
                          <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
                          <span className="text-sm lg:text-base text-gray-600 font-medium tracking-wide">
                            {new Date().getFullYear() - new Date(currentTalent.birth_date).getFullYear()} ANOS
                          </span>
                        </div>
                      )}
                      {currentTalent.height && (
                        <div className="flex items-center gap-4 justify-center lg:justify-start">
                          {/* Centralizou no mobile */}
                          <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
                          <span className="text-sm lg:text-base text-gray-600 font-medium tracking-wide">
                            {currentTalent.height}
                          </span>
                        </div>
                      )}
                      {currentTalent.tipo_talento && (
                        <div className="flex items-center gap-4 justify-center lg:justify-start">
                          {/* Centralizou no mobile */}
                          <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
                          <span className="text-sm lg:text-base text-gray-600 font-medium tracking-wide">
                            {renderTalentType(currentTalent).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 lg:space-y-8 text-center lg:text-left">
                      {/* Centralizou no mobile */}
                      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        {/* Centralizou no mobile */}
                        {currentTalent.can_sing && (
                          <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-full">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                            <span className="text-xs lg:text-sm text-gray-600">CANTO</span>
                          </div>
                        )}
                        {currentTalent.languages && currentTalent.languages.length > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-full">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                            <span className="text-xs lg:text-sm text-gray-600">
                              {currentTalent.languages.length} IDIOMAS
                            </span>
                          </div>
                        )}
                        {currentTalent.instruments && currentTalent.instruments.length > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-full">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                            <span className="text-xs lg:text-sm text-gray-600">
                              {currentTalent.instruments.length} INSTRUMENTOS
                            </span>
                          </div>
                        )}
                      </div>
                      {currentTalent.instagram && (
                        <div className="pt-2 lg:pt-8 flex justify-center lg:justify-start">
                          {/* Centralizou no mobile */}
                          <a
                            href={`https://instagram.com/${currentTalent.instagram?.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-sm hover:border-gray-400 transition-colors group"
                          >
                            <Instagram className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                              {currentTalent.instagram}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </a>
                        </div>
                      )}
                      <div className="pt-4 lg:pt-6 flex justify-center lg:justify-start">
                        <button
                          onClick={() => handleViewDetails(currentTalent.id)}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-black rounded-sm transition-colors group font-medium"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm tracking-wide">VER DETALHES</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block lg:w-[55%] relative order-1">
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="relative w-full max-w-md h-full max-h-[600px]">
                      {loadingPhotos[currentTalent.id] ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <Loader2 className="w-16 h-16 animate-spin text-amber-500" />
                        </div>
                      ) : currentTalentPhotos.length > 0 && currentHeroPhoto.url ? (
                        <img
                          src={currentHeroPhoto.url || "/placeholder.svg"}
                          alt={`${currentTalent.name} - Foto ${heroPhotoIndex + 1}`}
                          className="w-full h-full object-contain"
                          onLoad={() =>
                            handleImageLoad(`hero-desktop-${currentTalent.id}-${heroPhotoIndex}`, currentHeroPhoto.url)
                          }
                          onError={(e) => {
                            handleImageError(`hero-desktop-${currentTalent.id}-${heroPhotoIndex}`, currentTalent.id)
                            e.target.src = "/placeholder.svg?height=600&width=400"
                          }}
                        />
                      ) : (
                        <img
                          src="/placeholder.svg?height=600&width=400"
                          alt={currentTalent.name}
                          className="w-full h-full object-contain"
                        />
                      )}

                      {/* Contador de fotos */}
                      {currentTalentPhotos.length > 1 && (
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-sm">
                          <div className="text-right">
                            <div className="text-2xl font-light text-gray-900">
                              {String(heroPhotoIndex + 1).padStart(2, "0")}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">
                              DE {String(currentTalentPhotos.length).padStart(2, "0")} FOTOS
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indicadores de foto (desktop) */}
                  {currentTalentPhotos.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                        {currentTalentPhotos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setHeroPhotoIndex(index)}
                            className={`transition-all duration-300 ${
                              index === heroPhotoIndex
                                ? "w-8 h-1 bg-amber-400"
                                : "w-4 h-1 bg-gray-300 hover:bg-gray-400"
                            } rounded-full`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Botões de navegação */}
              {talents.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center hover:bg-white hover:border-gray-300 transition-all z-20"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center hover:bg-white hover:border-gray-300 transition-all z-20"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </section>
          ) : (
            // Estado de loading
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
              <div className="text-center">
                {!initialLoadComplete ? (
                  <>
                    <div className="relative mb-12">
                      <div className="w-24 h-24 border border-amber-500/30 animate-spin mx-auto">
                        <div className="absolute inset-2 border-t-2 border-amber-500 animate-spin"></div>
                      </div>
                      <Crown className="w-10 h-10 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-gray-700 font-light tracking-[0.2em] text-xl">CARREGANDO TALENTOS EXCLUSIVOS</p>
                  </>
                ) : talents.length === 0 ? (
                  <>
                    <Crown className="w-20 h-20 text-amber-500 mx-auto mb-8" />
                    <p className="text-gray-700 font-light tracking-[0.2em] text-xl">NENHUM TALENTO ENCONTRADO</p>
                    {error && <p className="text-gray-500 text-sm mt-4">Erro: {error}</p>}
                  </>
                ) : (
                  <>
                    <Crown className="w-20 h-20 text-amber-500 mx-auto mb-8" />
                    <p className="text-gray-700 font-light tracking-[0.2em] text-xl">PREPARANDO GALERIA DE TALENTOS</p>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>

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
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-transparent border-b border-gray-400 focus:border-amber-500 px-0 py-3 text-gray-900 focus:outline-none transition-colors tracking-wider min-w-[120px] cursor-pointer hover:border-gray-600 flex items-center justify-between">
                    <span>
                      {filterType === "all" && "TODOS"}
                      {filterType === "destacados" && "DESTAQUES"}
                      {filterType === "disponivel" && "DISPONÍVEIS"}
                      {filterType === "ativo" && "ATIVOS"}
                    </span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                    <DropdownMenuItem onClick={() => setFilterType("all")} className="cursor-pointer hover:bg-gray-50">
                      TODOS
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterType("destacados")}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      DESTAQUES
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterType("disponivel")}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      DISPONÍVEIS
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterType("ativo")}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      ATIVOS
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  onClick={() => setGenderFilter("atriz")}
                  className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
                    genderFilter === "atriz"
                      ? "border-amber-500 text-amber-500"
                      : "border-gray-400 text-gray-700 hover:border-gray-600"
                  }`}
                >
                  ATRIZES
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGenderFilter("ator")}
                  className={`px-6 py-2 border transition-all duration-300 tracking-wider ${
                    genderFilter === "ator"
                      ? "border-amber-500 text-amber-500"
                      : "border-gray-400 text-gray-700 hover:border-gray-600"
                  }`}
                >
                  ATORES
                </motion.button>
              </div>
            </motion.div>

            {/* Atrizes Section */}
            {(genderFilter === "all" || genderFilter === "atriz") && atrizesTalents.length > 0 && (
              <div id="atrizes" className="mb-24">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 mb-12"
                >
                  <h3 className="text-3xl md:text-4xl font-thin tracking-wider text-gray-900">ATRIZES</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-pink-400 to-transparent"></div>
                  <span className="text-pink-500 text-sm tracking-wider">{atrizesTalents.length} TALENTOS</span>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {paginatedAtrizes.map((talent, index) => {
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
                          {loadingPhotos[talent.id] ? (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                            </div>
                          ) : (
                            <img
                              src={mainPhotoUrl || "/placeholder.svg"}
                              alt={talent.name}
                              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                              onLoad={() => handleImageLoad(`talent-${talent.id}-main`, mainPhotoUrl)}
                              onError={(e) => {
                                handleImageError(`talent-${talent.id}-main`, talent.id)
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
                {/* Pagination for Atrizes */}
                {totalAtrizesPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() => setAtrizesPage((prev) => Math.max(prev - 1, 1))}
                      disabled={atrizesPage === 1}
                      className="px-4 py-2 border border-gray-400 text-gray-700 hover:border-pink-500 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalAtrizesPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setAtrizesPage(page)}
                          className={`px-3 py-1 text-sm transition-colors ${
                            atrizesPage === page ? "bg-pink-500 text-white" : "text-gray-700 hover:text-pink-500"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setAtrizesPage((prev) => Math.min(prev + 1, totalAtrizesPages))}
                      disabled={atrizesPage === totalAtrizesPages}
                      className="px-4 py-2 border border-gray-400 text-gray-700 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Atores Section */}
            {(genderFilter === "all" || genderFilter === "ator") && atoresTalents.length > 0 && (
              <div id="atores">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 mb-12"
                >
                  <h3 className="text-3xl md:text-4xl font-thin tracking-wider text-gray-900">ATORES</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
                  <span className="text-blue-500 text-sm tracking-wider">{atoresTalents.length} TALENTOS</span>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {paginatedAtores.map((talent, index) => {
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
                          {loadingPhotos[talent.id] ? (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                            </div>
                          ) : (
                            <img
                              src={mainPhotoUrl || "/placeholder.svg"}
                              alt={talent.name}
                              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                              onLoad={() => handleImageLoad(`talent-${talent.id}-main`, mainPhotoUrl)}
                              onError={(e) => {
                                handleImageError(`talent-${talent.id}-main`, talent.id)
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
                {/* Pagination for Atores */}
                {totalAtoresPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() => setAtoresPage((prev) => Math.max(prev - 1, 1))}
                      disabled={atoresPage === 1}
                      className="px-4 py-2 border border-gray-400 text-gray-700 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalAtoresPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setAtoresPage(page)}
                          className={`px-3 py-1 text-sm transition-colors ${
                            atoresPage === page ? "bg-blue-500 text-white" : "text-gray-700 hover:text-blue-500"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setAtoresPage((prev) => Math.min(prev + 1, totalAtoresPages))}
                      disabled={atoresPage === totalAtoresPages}
                      className="px-4 py-2 border border-gray-400 text-gray-700 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contato" className="py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl md:text-5xl font-thin tracking-wider text-gray-900 mb-6">CONTATO</h3>
              <div className="w-24 h-px bg-gradient-to-r from-amber-400 to-transparent mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Conecte-se conosco para descobrir talentos excepcionais que transformarão seu projeto em uma experiência
                inesquecível.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-900 mb-2">Email Corporativo</h4>
                      <p className="text-gray-600 mb-4">Para parcerias e contratações profissionais</p>
                      <a
                        href="mailto:contato@megastage.com"
                        className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                      >
                        contato@megastage.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-900 mb-2">Atendimento Direto</h4>
                      <p className="text-gray-600 mb-4">Disponível de segunda a sexta, 9h às 18h</p>
                      <a
                        href="tel:+5511999999999"
                        className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                      >
                        (11) 99999-9999
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-900 mb-2">Localização</h4>
                      <p className="text-gray-600 mb-4">Atendemos em todo território nacional</p>
                      <span className="text-amber-600 font-medium">São Paulo, Brasil</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-amber-50 to-amber-100 p-12 rounded-2xl"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
                    PRONTO PARA DESCOBRIR
                    <br />
                    <span className="font-medium">TALENTOS EXCEPCIONAIS?</span>
                  </h4>
                  <p className="text-gray-700 mb-8 leading-relaxed">
                    Nossa equipe especializada está pronta para conectar você aos melhores profissionais do mercado.
                    Cada talento é cuidadosamente selecionado para garantir excelência em seu projeto.
                  </p>
                  <div className="space-y-4">
                    <a
                      href="mailto:contato@megastage.com"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-black rounded-lg transition-all duration-300 font-medium group shadow-lg hover:shadow-xl"
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="tracking-wide">INICIAR CONVERSA</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-sm text-gray-600">Resposta garantida em até 24 horas</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
