// "use client"

// import { useState, useEffect } from "react"
// import { useTalent } from "../contexts/talents-context"
// import { motion, AnimatePresence } from "framer-motion"
// import { ChevronLeft, ChevronRight, Star, Instagram, Loader2 } from "lucide-react"

// export default function TalentsGallery() {
//   const { talents, loading, fetchTalents } = useTalent()
//   const [selectedTalent, setSelectedTalent] = useState(null)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [talentPhotos, setTalentPhotos] = useState({})
//   const [loadingPhotos, setLoadingPhotos] = useState({})
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState({})

//   useEffect(() => {
//     fetchTalents()
//   }, [])

//   useEffect(() => {
//     if (selectedTalent || talents[0]) {
//       const talent = selectedTalent || talents[0]
//       loadTalentPhotos(talent.id)
//     }
//   }, [selectedTalent, talents])

//   const loadTalentPhotos = async (talentId) => {
//     if (!talentPhotos[talentId] && !loadingPhotos[talentId]) {
//       setLoadingPhotos(prev => ({ ...prev, [talentId]: true }))
//       try {
//        const response = await fetch(`https://megastage.onrender.com/api/v1/talents/public/${talentId}/photos`, {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })


//         if (!response.ok) {
//           throw new Error(`Erro ao carregar fotos: ${response.status}`)
//         }

//         const photos = await response.json()
//         setTalentPhotos(prev => ({
//           ...prev,
//           [talentId]: photos
//         }))
//       } catch (error) {
//         console.error("Erro ao carregar fotos:", error)
//       } finally {
//         setLoadingPhotos(prev => ({ ...prev, [talentId]: false }))
//       }
//     }
//   }

//   const handlePrevious = () => {
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : talents.length - 1))
//     const newTalent = talents[currentIndex > 0 ? currentIndex - 1 : talents.length - 1]
//     setSelectedTalent(newTalent)
//     loadTalentPhotos(newTalent.id)
//   }

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev < talents.length - 1 ? prev + 1 : 0))
//     const newTalent = talents[currentIndex < talents.length - 1 ? currentIndex + 1 : 0]
//     setSelectedTalent(newTalent)
//     loadTalentPhotos(newTalent.id)
//   }

//   const handleTalentClick = (talent, index) => {
//     setSelectedTalent(talent)
//     setCurrentIndex(index)
//     loadTalentPhotos(talent.id)
//   }

//   const handlePhotoClick = (talentId, photoIndex) => {
//     setCurrentPhotoIndex(prev => ({
//       ...prev,
//       [talentId]: photoIndex
//     }))
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
//       </div>
//     )
//   }

//   const currentTalent = selectedTalent || talents[0]
//   const currentTalentPhotos = currentTalent ? talentPhotos[currentTalent.id] : []
//   const currentTalentPhotoIndex = currentTalent ? (currentPhotoIndex[currentTalent.id] || 0) : 0

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section com Talento Selecionado */}
//       <div className="container mx-auto px-4 py-8">
//         {currentTalent ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="relative rounded-xl overflow-hidden bg-white shadow-xl"
//           >
//             <div className="flex flex-col md:flex-row items-stretch">
//               {/* Galeria de Fotos Principal */}
//               <div className="w-full md:w-2/3 relative aspect-[16/9] overflow-hidden bg-gray-100">
//                 <AnimatePresence mode="wait">
//                   {loadingPhotos[currentTalent.id] ? (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
//                     </div>
//                   ) : currentTalentPhotos?.length > 0 ? (
//                     <motion.img
//                       key={currentTalentPhotos[currentTalentPhotoIndex]?.url}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       src={currentTalentPhotos[currentTalentPhotoIndex]?.url}
//                       alt={`${currentTalent.name} - Foto ${currentTalentPhotoIndex + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <motion.img
//                       key="cover"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       src={currentTalent.cover}
//                       alt={currentTalent.name}
//                       className="w-full h-full object-cover"
//                     />
//                   )}
//                 </AnimatePresence>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
//               </div>

//               {/* Informações do Talento */}
//               <div className="w-full md:w-1/3 p-8 bg-white">
//                 <h1 className="text-4xl font-bold mb-4 text-gray-900">{currentTalent.name}</h1>
//                 <div className="flex items-center gap-4 mb-6">
//                   {currentTalent.destaque && (
//                     <span className="flex items-center gap-1">
//                       <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
//                       <span className="text-yellow-600">Destaque</span>
//                     </span>
//                   )}
//                   {currentTalent.instagram && (
//                     <a
//                       href={`https://instagram.com/${currentTalent.instagram}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-colors"
//                     >
//                       <Instagram className="w-5 h-5" />
//                       <span>@{currentTalent.instagram}</span>
//                     </a>
//                   )}
//                 </div>
//                 <div className="space-y-4 text-gray-600">
//                   <p>
//                     <span className="font-semibold text-gray-900">Idade:</span>{" "}
//                     {currentTalent.birth_date
//                       ? new Date().getFullYear() - new Date(currentTalent.birth_date).getFullYear()
//                       : "Não informada"}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-900">Altura:</span>{" "}
//                     {currentTalent.height || "Não informada"}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-900">Tipo:</span>{" "}
//                     {currentTalent.tipo_talento || "Não informado"}
//                   </p>
//                 </div>

//                 {/* Miniaturas das Fotos */}
//                 {currentTalentPhotos?.length > 0 && (
//                   <div className="mt-6">
//                     <h3 className="text-sm font-semibold text-gray-900 mb-3">Fotos</h3>
//                     <div className="flex gap-2 overflow-x-auto pb-2">
//                       {currentTalentPhotos.map((photo, idx) => (
//                         <motion.img
//                           key={photo.url}
//                           src={photo.url}
//                           alt={`Foto ${idx + 1} de ${currentTalent.name}`}
//                           className={`w-16 h-16 object-cover rounded-lg cursor-pointer ${
//                             currentTalentPhotoIndex === idx ? 'ring-2 ring-pink-500' : ''
//                           }`}
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           onClick={() => handlePhotoClick(currentTalent.id, idx)}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         ) : null}
//       </div>

//       {/* Galeria de Talentos */}
//       <div className="container mx-auto px-4 pb-8">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={handlePrevious}
//             className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg"
//           >
//             <ChevronLeft className="w-6 h-6 text-gray-900" />
//           </button>
//           <div className="flex-1 overflow-hidden">
//             <div className="flex gap-4 transition-transform duration-300 ease-in-out">
//               {talents.map((talent, index) => (
//                 <motion.div
//                   key={talent.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   className={`relative flex-shrink-0 cursor-pointer group ${
//                     selectedTalent?.id === talent.id ? "ring-2 ring-pink-500" : ""
//                   }`}
//                   onClick={() => handleTalentClick(talent, index)}
//                 >
//                   <div className="w-32 h-32 overflow-hidden rounded-xl">
//                     <img
//                       src={talent.cover}
//                       alt={talent.name}
//                       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   </div>
//                   {talent.destaque && (
//                     <div className="absolute top-2 right-2">
//                       <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
//                     </div>
//                   )}
//                   <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
//                     {talent.name}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//           <button
//             onClick={handleNext}
//             className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg"
//           >
//             <ChevronRight className="w-6 h-6 text-gray-900" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// } 



import { useState, useEffect } from "react";
import { useTalent } from "../contexts/talents-context";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Instagram, Loader2 } from "lucide-react";

export default function TalentsGallery() {
  const { talentIds, loading, fetchTalentById, fetchTalentPhotos, fetchTalents, error } = useTalent();
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [talentPhotos, setTalentPhotos] = useState({});
  const [loadingPhotos, setLoadingPhotos] = useState({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && talentIds.length === 0) {
      console.log("Executando fetchTalents na montagem inicial");
      fetchTalents().catch((err) => console.error("Erro ao carregar talentos:", err));
      setIsInitialLoad(false);
    }
  }, [fetchTalents, isInitialLoad, talentIds]);

  useEffect(() => {
    if (talentIds.length > 0 && (!selectedTalent || !talentIds.includes(selectedTalent.id))) {
      loadTalentData(talentIds[0]);
    }
  }, [talentIds]);

  const loadTalentData = async (talentId) => {
    const talent = await fetchTalentById(talentId);
    setSelectedTalent(talent);
    loadTalentPhotos(talentId);
  };

  const loadTalentPhotos = async (talentId) => {
    if (!talentPhotos[talentId] && !loadingPhotos[talentId]) {
      setLoadingPhotos((prev) => ({ ...prev, [talentId]: true }));
      try {
        const photos = await fetchTalentPhotos(talentId);
        setTalentPhotos((prev) => ({
          ...prev,
          [talentId]: photos.filter((photo) => photo.release).map((photo) => ({
            ...photo,
            url: `data:image/jpeg;base64,${photo.image_base64}`,
          })),
        }));
      } catch (error) {
        console.error("Erro ao carregar fotos:", error);
      } finally {
        setLoadingPhotos((prev) => ({ ...prev, [talentId]: false }));
      }
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : talentIds.length - 1));
    loadTalentData(talentIds[currentIndex > 0 ? currentIndex - 1 : talentIds.length - 1]);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < talentIds.length - 1 ? prev + 1 : 0));
    loadTalentData(talentIds[currentIndex < talentIds.length - 1 ? currentIndex + 1 : 0]);
  };

  const handleTalentClick = (talentId, index) => {
    loadTalentData(talentId);
    setCurrentIndex(index);
  };

  const handlePhotoClick = (talentId, photoIndex) => {
    setCurrentPhotoIndex((prev) => ({
      ...prev,
      [talentId]: photoIndex,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-pink-600" />
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>
    );
  }

  const currentTalentId = talentIds[currentIndex];
  const currentTalent = selectedTalent;
  const currentTalentPhotos = currentTalent ? talentPhotos[currentTalent.id] || [] : [];
  const currentTalentPhotoIndex = currentTalent ? currentPhotoIndex[currentTalent.id] || 0 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        {currentTalent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="flex flex-col md:flex-row">
              {/* Main Image Gallery */}
              <div className="w-full md:w-2/3 relative aspect-[16/9] bg-gray-100">
                <AnimatePresence mode="wait">
                  {loadingPhotos[currentTalent.id] ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
                    </div>
                  ) : currentTalentPhotos.length > 0 ? (
                    <motion.img
                      key={currentTalentPhotos[currentTalentPhotoIndex]?.url}
                      src={currentTalentPhotos[currentTalentPhotoIndex]?.url}
                      alt={`${currentTalent.name} - Foto ${currentTalentPhotoIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.img
                      key="cover"
                      src={currentTalent.cover}
                      alt={currentTalent.name}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-pink-100 transition-colors shadow-md"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-pink-100 transition-colors shadow-md"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </div>

              {/* Talent Info */}
              <div className="w-full md:w-1/3 p-6">
                <h1 className="text-3xl font-semibold text-gray-900 mb-4">{currentTalent.name}</h1>
                <div className="flex items-center gap-3 mb-5">
                  {currentTalent.destaque && (
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-current" />
                      Destaque
                    </span>
                  )}
                  {currentTalent.instagram && (
                    <a
                      href={`https://instagram.com/${currentTalent.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm font-medium transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      @{currentTalent.instagram}
                    </a>
                  )}
                </div>
                <div className="space-y-3 text-gray-600">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Idade:</span>{" "}
                    {currentTalent.birth_date
                      ? new Date().getFullYear() - new Date(currentTalent.birth_date).getFullYear()
                      : "Não informada"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Altura:</span>{" "}
                    {currentTalent.height || "Não informada"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Tipo:</span>{" "}
                    {currentTalent.tipo_talento || "Não informado"}
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    className="w-full bg-pink-600 text-white font-medium py-2 rounded-lg hover:bg-pink-700 transition-colors shadow-md"
                    onClick={() => alert("Contratar talento!")}
                  >
                    Contratar Agora
                  </button>
                </div>
              </div>
            </div>

            {/* Photo Thumbnails */}
            {currentTalentPhotos.length > 0 && (
              <div className="p-6 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Galeria de Fotos</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {currentTalentPhotos.map((photo, idx) => (
                    <motion.img
                      key={photo.id}
                      src={photo.url}
                      alt={`Foto ${idx + 1} de ${currentTalent.name}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${
                        currentTalentPhotoIndex === idx ? "ring-2 ring-pink-600" : ""
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePhotoClick(currentTalent.id, idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Talent Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {talentIds.map((talentId, index) => (
            <motion.div
              key={talentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              onClick={() => handleTalentClick(talentId, index)}
            >
              {currentTalent && currentTalent.id === talentId && (
                <div className="absolute inset-0 bg-pink-600/20 z-10" />
              )}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={currentTalent && currentTalent.id === talentId ? currentTalent.cover : "/placeholder.jpg"}
                  alt={currentTalent ? currentTalent.name : `Talento ${talentId}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              {currentTalent && currentTalent.id === talentId && currentTalent.destaque && (
                <div className="absolute top-2 right-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
              )}
              <div className="p-4 bg-white">
                <h4 className="text-lg font-medium text-gray-900">
                  {currentTalent && currentTalent.id === talentId ? currentTalent.name : "Carregando..."}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}