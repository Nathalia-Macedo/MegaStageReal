import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Crown, Users, Award, Star, Building, Briefcase } from "lucide-react"
import { useTalent } from "../contexts/talents-context"
const QuemSomosPage = () => {
  const { fetchAbout, loading, error } = useTalent()
  const [aboutContent, setAboutContent] = useState(null)
  // Variáveis para a seção "Quem Somos"
  const [aboutDescription, setAboutDescription] = useState(""); // Para armazenar a descrição do "Quem Somos"
  const [isAboutExisting, setIsAboutExisting] = useState(false); // Para verificar se a descrição existe
  const [aboutMessage, setAboutMessage] = useState(""); // Para armazenar mensagens sobre a descrição
  // Fetch "Quem Somos" content on mount
  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await fetchAbout()
        // Split description by double newlines (\n\n) or fallback to single string
        const sections = data.description
          ? data.description.split("\n\n").filter((section) => section.trim() !== "")
          : ["Informações sobre o MegaSTAGE não disponíveis no momento."]
        setAboutContent(sections)
      } catch (err) {
        console.error("Erro ao carregar Quem Somos:", err)
      }
    }
    loadAbout()
  }, [fetchAbout])

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Section titles and icons for each content block
  const sectionHeaders = [
    {
      title: "O MEGASTAGE",
      highlight: "MEGASTAGE",
      icon: <Award className="w-6 h-6 text-amber-500" />,
    },
    {
      title: "ATUAÇÃO COMERCIAL",
      highlight: "COMERCIAL",
      icon: <Building className="w-6 h-6 text-amber-500" />,
    },
    {
      title: "MERCADO AUDIOVISUAL",
      highlight: "AUDIOVISUAL",
      icon: <Users className="w-6 h-6 text-amber-500" />,
    },
    {
      title: "NOSSA EXCELÊNCIA",
      highlight: "EXCELÊNCIA",
      icon: <Star className="w-8 h-8 text-white" />,
      isCentered: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-br from-white to-gray-50 py-20 lg:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-3 bg-amber-100 border border-amber-200 rounded-full px-6 py-2 mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="text-amber-600 font-medium tracking-wide">NOSSA HISTÓRIA</span>
          </motion.div>

          <motion.h1
            className="text-4xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-8 tracking-tight"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            QUEM <span className="text-amber-500">SOMOS</span>
          </motion.h1>

          <motion.div
            className="w-24 h-px bg-gradient-to-r from-amber-400 to-transparent mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>

          <motion.p
            className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
          >
            Excelência na gestão e desenvolvimento de carreiras artísticas, conectando talentos às melhores
            oportunidades do mercado audiovisual.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-600 text-lg">Carregando...</div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg">Erro: {error}</div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-12"
            >
              {aboutContent &&
                aboutContent.map((section, index) => {
                  const header = sectionHeaders[index] || {
                    title: `SEÇÃO ${index + 1}`,
                    highlight: "",
                    icon: <Star className="w-6 h-6 text-amber-500" />,
                  }
                  return (
                    <motion.div
                      key={index}
                      className={`bg-gradient-to-br ${
                        header.isCentered ? "from-amber-50 to-amber-100" : "from-gray-50 to-white"
                      } border ${header.isCentered ? "border-amber-200" : "border-gray-200"} rounded-2xl p-8 lg:p-12 shadow-sm`}
                      variants={fadeInUp}
                    >
                      {header.isCentered ? (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-8">
                            {header.icon}
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-light text-gray-900 mb-6 tracking-wide">
                            {header.title.split(" ").map((word, i) =>
                              word === header.highlight ? (
                                <span key={i} className="text-amber-500">
                                  {word}{" "}
                                </span>
                              ) : (
                                word + " "
                              ),
                            )}
                          </h3>
                          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">{section}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-6">
                            {header.icon}
                            <h2 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-wide">
                              {header.title.split(" ").map((word, i) =>
                                word === header.highlight ? (
                                  <span key={i} className="text-amber-500">
                                    {word}{" "}
                                  </span>
                                ) : (
                                  word + " "
                                ),
                              )}
                            </h2>
                          </div>
                          <p className="text-lg text-gray-700 leading-relaxed">{section}</p>
                        </>
                      )}
                    </motion.div>
                  )
                })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-2 mb-6 shadow-sm">
              <Briefcase className="w-5 h-5 text-amber-600" />
              <span className="text-gray-700 font-medium">FAÇA PARTE</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-wide">
              PRONTO PARA <span className="text-amber-500">BRILHAR?</span>
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-amber-400 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Junte-se ao casting mais exclusivo do Brasil e transforme seu talento em oportunidades reais.
            </p>
            <motion.a
              href="/faca-parte"
              className="inline-flex items-center gap-3 px-12 py-4 bg-amber-400 hover:bg-amber-500 text-black rounded-sm transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-5 h-5" />
              <span className="tracking-wide">ENVIAR MATERIAL</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default QuemSomosPage