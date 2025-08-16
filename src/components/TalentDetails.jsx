import { useState, useEffect } from "react"
import { useTalent } from "../contexts/talents-context"
import {
  ArrowLeft,
  Instagram,
  Crown,
  Calendar,
  Ruler,
  Eye,
  Palette,
  Music,
  Languages,
  Play,
  Pause,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Footer from "./Footer"
export default function TalentDetails({ talent, onBack }) {
  const { fetchTalentPhotos, fetchTalentVideosProxy, fetchPreviousJobsProxy, loading, error } = useTalent()

  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [previousJobs, setPreviousJobs] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [loadingData, setLoadingData] = useState(true)
  const [loadedImages, setLoadedImages] = useState({})
  const [imageErrors, setImageErrors] = useState({})
  const [playingVideos, setPlayingVideos] = useState({})

  useEffect(() => {
    const loadTalentData = async () => {
      if (!talent?.id) return

      setLoadingData(true)
      try {
        console.log("[v0] Carregando dados para talento:", talent.id)

        try {
          const photosData = await fetchTalentPhotos(talent.id)
          console.log("[v0] Fotos recebidas - dados brutos:", photosData)
          console.log("[v0] Tipo de dados das fotos:", typeof photosData)
          console.log("[v0] É array?", Array.isArray(photosData))

          if (Array.isArray(photosData)) {
            console.log("[v0] Quantidade de fotos:", photosData.length)
            photosData.forEach((photo, index) => {
              console.log(`[v0] Foto ${index}:`, {
                id: photo.id,
                url: photo.url,
                file_url: photo.file_url,
                photo_url: photo.photo_url,
                src: photo.src,
                image_url: photo.image_url,
                todas_propriedades: Object.keys(photo),
              })
            })
          }

          setPhotos(Array.isArray(photosData) ? photosData : [])
        } catch (photoError) {
          console.log("[v0] Erro ao carregar fotos:", photoError)
          setPhotos([])
        }

        try {
          const videosData = await fetchTalentVideosProxy(talent.id)
          console.log("[v0] Vídeos recebidos - dados brutos:", videosData)
          console.log("[v0] Tipo de dados dos vídeos:", typeof videosData)

          if (Array.isArray(videosData)) {
            console.log("[v0] Quantidade de vídeos:", videosData.length)
            videosData.forEach((video, index) => {
              console.log(`[v0] Vídeo ${index}:`, {
                id: video.id,
                url: video.url,
                file_url: video.file_url,
                video_url: video.video_url,
                src: video.src,
                todas_propriedades: Object.keys(video),
              })
            })
          }

          setVideos(Array.isArray(videosData) ? videosData : [])
        } catch (videoError) {
          console.log("[v0] Erro ao carregar vídeos:", videoError)
          setVideos([])
        }

        try {
          const jobsData = await fetchPreviousJobsProxy(talent.id)
          console.log("[v0] Trabalhos recebidos:", jobsData)
          setPreviousJobs(Array.isArray(jobsData) ? jobsData : [])
        } catch (jobError) {
          console.log("[v0] Erro ao carregar trabalhos:", jobError)
          setPreviousJobs([])
        }
      } catch (error) {
        console.error("[v0] Erro ao carregar dados do talento:", error)
      } finally {
        setLoadingData(false)
      }
    }

    loadTalentData()
  }, [talent?.id])

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const getPhotoUrl = (photo) => {
    const possibleUrls = [photo?.image_url, photo?.url, photo?.file_url, photo?.photo_url, photo?.src].filter(Boolean)

    console.log("[v0] URLs possíveis para foto:", possibleUrls)
    return possibleUrls[0] || "/placeholder.svg?height=600&width=450"
  }

  const getVideoUrl = (video) => {
    const possibleUrls = [video?.url, video?.file_url, video?.video_url, video?.src].filter(Boolean)

    console.log("[v0] URLs possíveis para vídeo:", possibleUrls)
    return possibleUrls[0]
  }

  const getVideoThumbnail = (video) => {
    const possibleThumbnails = [video?.thumbnail_url, video?.image_url, video?.preview_url].filter(Boolean)
    console.log("[v0] URLs possíveis para thumbnail:", possibleThumbnails)
    return possibleThumbnails[0] || "/placeholder.svg?height=300&width=400"
  }

  const getTextAlignment = (textFormat) => {
    if (!textFormat) return "text-left"
console.log("Alinhamento do texto:", textFormat);
    switch (textFormat.toLowerCase()) {
      case "centralizado":
        return "text-center"
      case "justificado":
        return "text-justify"
      case "alinhado a direita":
        return "text-right"
      case "alinhado a esquerda":
      default:
        return "text-left"
    }
  }

  const formatJobDescription = (description) => {
    if (!description) return ""
    return description.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < description.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  const handleVideoPlay = (event) => {
    const videoElement = event.target
    if (videoElement.paused) {
      videoElement.play().catch((error) => {
        console.log("[v0] Erro ao tentar reproduzir vídeo:", error)
        // Try to reload the video if there's an error
        videoElement.load()
      })
    } else {
      videoElement.pause()
    }
  }

  const handleImageLoad = (imageKey, imageUrl) => {
    setLoadedImages((prev) => ({
      ...prev,
      [imageKey]: imageUrl,
    }))
  }

  const handleImageError = (imageKey, fallbackUrl) => {
    const errorKey = `${imageKey}-error`
    if (imageErrors[errorKey]) {
      return // Already handled this error
    }

    setImageErrors((prev) => ({
      ...prev,
      [errorKey]: true,
    }))
  }

  const generateVideoThumbnail = (videoElement, videoId) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      const generateThumbnail = () => {
        try {
          canvas.width = videoElement.videoWidth
          canvas.height = videoElement.videoHeight
          ctx.drawImage(videoElement, 0, 0)
          const thumbnailUrl = canvas.toDataURL()
          resolve(thumbnailUrl)
        } catch (error) {
          console.log("[v0] CORS error ao gerar thumbnail, usando fallback:", error)
          // Return existing poster or placeholder if CORS fails
          resolve(videoElement.poster || "/placeholder.svg?height=300&width=400")
        }
      }

      // Seek to 1 second for better thumbnail
      videoElement.currentTime = 1
      videoElement.addEventListener("seeked", generateThumbnail, { once: true })
    })
  }

  const handleVideoPlayPause = async (videoId, videoElement) => {
    if (videoElement.paused) {
      try {
        await videoElement.play()
        setPlayingVideos((prev) => ({ ...prev, [videoId]: true }))
      } catch (error) {
        console.log("[v0] Erro ao tentar reproduzir vídeo:", error)
        videoElement.load()
      }
    } else {
      videoElement.pause()
      setPlayingVideos((prev) => ({ ...prev, [videoId]: false }))
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do talento...</p>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Talento não encontrado</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-amber-400 text-black rounded-sm hover:bg-amber-500 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  const currentPhoto = photos[currentPhotoIndex]

  return (
    <>
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>

            {talent.destaque && (
              <div className="flex items-center gap-2 bg-amber-400 text-black px-3 py-1 rounded-sm text-sm font-medium">
                <Crown className="w-4 h-4" />
                DESTAQUE
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section com foto e informações principais */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Foto Principal */}
            <div className="relative order-1 lg:order-1">
              {photos.length > 0 ? (
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={getPhotoUrl(currentPhoto) || "/placeholder.svg"}
                    alt={talent.name}
                    className="w-full h-full object-contain"
                    onLoad={() => handleImageLoad(`main-photo-${currentPhotoIndex}`, getPhotoUrl(currentPhoto))}
                    onError={(e) => {
                      console.log("[v0] Erro ao carregar foto:", getPhotoUrl(currentPhoto))
                      handleImageError(`main-photo-${currentPhotoIndex}`, "/placeholder.svg?height=600&width=450")
                      e.target.src = "/placeholder.svg?height=600&width=450"
                    }}
                  />

                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800/80 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800/80 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Indicadores */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Nenhuma foto disponível</p>
                </div>
              )}
            </div>

            {/* Informações do Talento */}
            <div className="order-2 lg:order-2 space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-gray-900 mb-2">
                  {talent.name}
                </h1>
                <p className="text-xl text-gray-700 font-medium">{talent.tipo_talento || "Talento"}</p>
              </div>

              {/* Informações básicas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {talent.birth_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm text-gray-600">Idade</p>
                      <p className="font-medium text-gray-900">
                        {new Date().getFullYear() - new Date(talent.birth_date).getFullYear()} anos
                      </p>
                    </div>
                  </div>
                )}

                {talent.height && (
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm text-gray-600">Altura</p>
                      <p className="font-medium text-gray-900">{talent.height}</p>
                    </div>
                  </div>
                )}

                {talent.eye_color && (
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm text-gray-600">Cor dos Olhos</p>
                      <p className="font-medium text-gray-900">{talent.eye_color}</p>
                    </div>
                  </div>
                )}

                {talent.hair_color && (
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm text-gray-600">Cor do Cabelo</p>
                      <p className="font-medium text-gray-900">{talent.hair_color}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Habilidades */}
              <div className="space-y-4">
                {talent.can_sing && (
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-gray-900">Canta</span>
                  </div>
                )}

                {talent.instruments && talent.instruments.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Music className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Instrumentos</p>
                      <p className="font-medium text-gray-900">{talent.instruments.join(", ")}</p>
                    </div>
                  </div>
                )}

                {talent.languages && talent.languages.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Languages className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Idiomas</p>
                      <p className="font-medium text-gray-900">{talent.languages.join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram */}
              {talent.instagram && (
                <a
                  href={`https://instagram.com/${talent.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-sm text-gray-800 hover:bg-gray-50 transition-colors font-medium"
                >
                  <Instagram className="w-4 h-4" />
                  {talent.instagram}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {videos.length > 0 && (
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-2 mb-6 shadow-sm">
                <Play className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700 font-medium">Showreel</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Vídeos em <span className="text-amber-500">Destaque</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Confira os melhores momentos e trabalhos em vídeo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {videos.map((video, index) => {
                const videoUrl = getVideoUrl(video)
                const thumbnailUrl = getVideoThumbnail(video)
                const videoId = `video-${video.id}-${index}`
                const isPlaying = playingVideos[videoId]
                console.log(`[v0] Renderizando vídeo ${index} com URL:`, videoUrl, "Thumbnail:", thumbnailUrl)

                return (
                  <div
                    key={videoId}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-video relative bg-gray-100">
                      <video
                        ref={(el) => {
                          if (el) {
                            el.addEventListener("play", () =>
                              setPlayingVideos((prev) => ({ ...prev, [videoId]: true })),
                            )
                            el.addEventListener("pause", () =>
                              setPlayingVideos((prev) => ({ ...prev, [videoId]: false })),
                            )
                            el.addEventListener("ended", () =>
                              setPlayingVideos((prev) => ({ ...prev, [videoId]: false })),
                            )
                          }
                        }}
                        src={videoUrl}
                        className="w-full h-full object-cover cursor-pointer"
                        poster={thumbnailUrl}
                        controls
                        preload="metadata"
                        playsInline
                        muted={false}
                        crossOrigin="anonymous"
                        onLoadedMetadata={async (e) => {
                          console.log("[v0] Metadados do vídeo carregados:", videoUrl)
                          if (!thumbnailUrl || thumbnailUrl.includes("placeholder")) {
                            try {
                              const thumbnail = await generateVideoThumbnail(e.target, videoId)
                              e.target.poster = thumbnail
                            } catch (error) {
                              console.log("[v0] Erro ao gerar thumbnail:", error)
                            }
                          }
                        }}
                        onCanPlay={(e) => {
                          console.log("[v0] Vídeo pronto para reprodução:", videoUrl)
                        }}
                        onError={(e) => {
                          console.log("[v0] Erro ao carregar vídeo:", videoUrl)
                          console.log("[v0] Tipo de erro:", e.target.error)
                          // Try different video formats
                          const video = e.target
                          if (videoUrl && !video.dataset.retried) {
                            video.dataset.retried = "true"
                            // Try adding different video format extensions
                            const formats = [".mp4", ".webm", ".mov", ".avi"]
                            const baseUrl = videoUrl.split(".").slice(0, -1).join(".")
                            const currentExt = "." + videoUrl.split(".").pop()

                            const nextFormat = formats.find((fmt) => fmt !== currentExt)
                            if (nextFormat) {
                              video.src = baseUrl + nextFormat
                              video.load()
                            }
                          }
                        }}
                      >
                        <source src={videoUrl} type="video/mp4" />
                        <source src={videoUrl} type="video/webm" />
                        <source src={videoUrl} type="video/mov" />
                        <source src={videoUrl} type="video/avi" />
                        Seu navegador não suporta o elemento de vídeo ou o formato fornecido.
                      </video>

                      <div
                        className={`absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center cursor-pointer ${isPlaying ? "pointer-events-auto" : "pointer-events-none"}`}
                        onClick={(e) => {
                          e.preventDefault()
                          const videoElement = e.currentTarget.previousElementSibling
                          handleVideoPlayPause(videoId, videoElement)
                        }}
                      >
                        <div
                          className={`w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-gray-800" />
                          ) : (
                            <Play className="w-8 h-8 text-gray-800 ml-1" />
                          )}
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 flex gap-2">
                        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">HD</div>
                        {isPlaying && (
                          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                            LIVE
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {video.title || video.name || `Vídeo ${index + 1}`}
                      </h3>
                      {video.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="bg-gray-100 px-2 py-1 rounded">#{video.id}</span>
                        {video.public_id && (
                          <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded">
                            {video.public_id.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Seção de Trabalhos Anteriores - Layout timeline */}
      {previousJobs.length > 0 && (
        <div className="py-20 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-full px-6 py-2 mb-6">
                <Briefcase className="w-5 h-5 text-amber-600" />
                <span className="text-amber-600 font-medium">Experiência</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Trabalhos <span className="text-amber-500">Anteriores</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Uma jornada através dos projetos e experiências profissionais
              </p>
            </div>

            <div className="relative">
              {/* Linha vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-amber-300 to-amber-200"></div>

              <div className="space-y-12">
     {previousJobs.map((job, index) => (
  <div key={`job-${job.id}-${index}`} className="relative flex items-start gap-8 group">
    {/* Ponto na timeline */}
    <div className="relative z-10 w-16 h-16 bg-white border-4 border-amber-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
      <Briefcase className="w-6 h-6 text-amber-600" />
    </div>

    {/* Conteúdo */}
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-amber-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          {job.project_name && (
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.project_name}</h3>
          )}
          {job.role && <p className="text-amber-600 font-medium mb-3">{job.role}</p>}
        </div>
        {job.year && (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            {job.year}
          </span>
        )}
      </div>

      {/* Aplicar o alinhamento do texto aqui usando operador ternário */}
      <div className={`text-gray-700 leading-relaxed mb-4 ${
        job.text_format === "center" ? "text-center" :
        job.text_format === "justify" ? "text-justify" :
        job.text_format === "right" ? "text-right" :
        "text-left" // padrão
      }`}>
        {formatJobDescription(job.job_description)}
      </div>

      {job.company && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          <span>{job.company}</span>
        </div>
      )}
    </div>
  </div>
))}


              </div>
            </div>
          </div>
        </div>
      )}

      {/* Galeria de Fotos - Layout masonry */}
      {photos.length > 1 && (
        <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-2 mb-6 shadow-sm">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">Portfolio</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Galeria <span className="text-amber-500">Completa</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Explore todas as fotos e momentos capturados</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id || index}
                  className={`group relative bg-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-lg ${
                    index % 7 === 0
                      ? "md:row-span-3 aspect-[3/4]"
                      : index % 5 === 0
                        ? "lg:col-span-2 aspect-[4/3]"
                        : "aspect-[3/4]"
                  }`}
                  onClick={() => setCurrentPhotoIndex(index)}
                >
                  <img
                    src={getPhotoUrl(photo) || "/placeholder.svg"}
                    alt={`${talent.name} - Foto ${index + 1}`}
                    className="w-full h-full object-contain bg-gray-50"
                    onLoad={() => handleImageLoad(`gallery-photo-${index}`, getPhotoUrl(photo))}
                    onError={(e) => {
                      console.log("[v0] Erro ao carregar foto da galeria:", getPhotoUrl(photo))
                      handleImageError(`gallery-photo-${index}`, "/placeholder.svg?height=600&width=450")
                      e.target.src = "/placeholder.svg?height=600&width=450"
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">Foto {index + 1}</p>
                  </div>

                  {/* Efeito de hover */}
                  <div className="absolute inset-0 border-2 border-amber-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  )
}
