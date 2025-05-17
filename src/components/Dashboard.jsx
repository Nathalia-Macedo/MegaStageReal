import { useState, useEffect } from "react"
import { useTalent } from "../contexts/talents-context"
import { useNotifications } from "../contexts/notification-context"
import { useAuth } from "../contexts/auth-context"
import { motion } from "framer-motion"
import {
  Users,
  Star,
  Bell,
  Calendar,
  TrendingUp,
  Activity,
  ChevronRight,
  Eye,
  Edit,
  UserPlus,
  Clock,
  RefreshCw,
  Filter,
  Trash,
} from "lucide-react"
import { toast } from "react-toastify"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import TalentModal from "./TalentModal"
import EditTalentModal from "./EditTalentModal"
// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const Dashboard = ({ onNavigate }) => {
  const { talents, loading: talentsLoading, fetchTalents, fetchTalentById, openModal } = useTalent()
  const { notifications, loading: notificationsLoading, fetchNotifications } = useNotifications()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    inactive: 0,
    highlighted: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [highlightedTalents, setHighlightedTalents] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadingTalent, setLoadingTalent] = useState({})

  // Estado para o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTalentId, setEditingTalentId] = useState(null)

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchTalents()
        if (fetchNotifications) {
          await fetchNotifications(true)
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error)
        toast.error("Erro ao carregar dados do dashboard")
      }
    }

    loadInitialData()
  }, [])

  // Efeito para processar os dados dos talentos
  useEffect(() => {
    if (talents && talents.length > 0) {
      // Calcular estatísticas
      const available = talents.filter((t) => t.disponivel && t.ativo).length
      const unavailable = talents.filter((t) => !t.disponivel && t.ativo).length
      const inactive = talents.filter((t) => !t.ativo).length
      const highlighted = talents.filter((t) => t.destaque).length

      setStats({
        total: talents.length,
        available,
        unavailable,
        inactive,
        highlighted,
      })

      // Filtrar talentos destacados
      const highlighted_talents = talents.filter((t) => t.destaque).slice(0, 4)
      setHighlightedTalents(highlighted_talents)
    }
  }, [talents])

  // Efeito para processar as notificações
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Transformar notificações em atividades recentes
      const activities = notifications.slice(0, 5).map((notification) => {
        let type = "update"
        let icon = "edit"

        if (notification.message.toLowerCase().includes("cadastr")) {
          type = "new"
          icon = "user-plus"
        } else if (notification.message.toLowerCase().includes("destaque")) {
          type = "highlight"
          icon = "star"
        } else if (notification.message.toLowerCase().includes("disponib")) {
          type = "availability"
          icon = "calendar"
        } else if (notification.message.toLowerCase().includes("exclu")) {
          type = "delete"
          icon = "trash"
        }

        return {
          id: notification.id,
          type,
          icon,
          title: notification.message.split(":")[0] || "Atualização",
          description: notification.message.split(":")[1] || notification.message,
          time: notification.time,
          read: notification.read,
        }
      })

      setRecentActivity(activities)
    }
  }, [notifications])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchTalents()
      if (fetchNotifications) {
        await fetchNotifications(true)
      }
      toast.success("Dashboard atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar dashboard:", error)
      toast.error("Erro ao atualizar dashboard")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Função para visualizar um talento
  const handleViewTalent = async (id) => {
    try {
      setLoadingTalent((prev) => ({ ...prev, [id]: true }))

      // Primeiro, encontramos o talento básico na lista
      const talent = talents.find((t) => t.id === id)
      if (talent) {
        // Abrimos o modal com os dados básicos primeiro
        openModal(talent)
      }

      // Depois buscamos os detalhes completos
      const detailedTalent = await fetchTalentById(id)
      // E atualizamos o modal com os detalhes completos
      openModal(detailedTalent)
    } catch (error) {
      console.error("Erro ao buscar detalhes do talento:", error)
      toast.error(`Erro ao carregar detalhes: ${error.message}`)
    } finally {
      setLoadingTalent((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Função para editar um talento
  const handleEditTalent = (id) => {
    setEditingTalentId(id)
    setIsEditModalOpen(true)
  }

  // Função para lidar com o salvamento do talento editado
  const handleSaveEditedTalent = (updatedTalent) => {
    // Atualizar a lista de talentos após a edição
    fetchTalents()
  }

  // Dados para o gráfico de rosca
  const doughnutData = {
    labels: ["Disponíveis", "Indisponíveis", "Inativos"],
    datasets: [
      {
        data: [stats.available, stats.unavailable, stats.inactive],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }

  // Variantes de animação para o Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Função para renderizar o ícone correto para cada atividade
  const renderActivityIcon = (type) => {
    switch (type) {
      case "new":
        return (
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <UserPlus size={18} />
          </div>
        )
      case "update":
        return (
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <Edit size={18} />
          </div>
        )
      case "highlight":
        return (
          <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
            <Star size={18} />
          </div>
        )
      case "availability":
        return (
          <div className="p-2 rounded-full bg-purple-100 text-purple-600">
            <Calendar size={18} />
          </div>
        )
      case "delete":
        return (
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <Trash size={18} />
          </div>
        )
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 text-gray-600">
            <Activity size={18} />
          </div>
        )
    }
  }

  // Função para renderizar o status do talento
  const renderTalentStatus = (talent) => {
    if (!talent.ativo) {
      return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Inativo</span>
    } else if (talent.disponivel) {
      return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Disponível</span>
    } else {
      // Modificação para dispositivos móveis
      if (talent.data_disponibilidade) {
        const dataFormatada = new Date(talent.data_disponibilidade).toLocaleDateString("pt-BR")
        return (
          <>
            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 sm:hidden">Indisponível</span>
            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 hidden sm:inline-block">
              Indisponível até {dataFormatada}
            </span>
          </>
        )
      } else {
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Indisponível</span>
      }
    }
  }

  // Calcular idade a partir da data de nascimento
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {" "}
      {/* Cabeçalho do Dashboard */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Bem-vindo, {user?.name || "Usuário"}! Aqui está um resumo do seu sistema.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-70"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Atualizando..." : "Atualizar Dashboard"}
        </button>
      </motion.div>
      {/* Cards de Estatísticas */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total de Talentos</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+12%</span>
            <span className="text-gray-400 ml-2">desde o último mês</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Talentos Disponíveis</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.available}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">{((stats.available / stats.total) * 100 || 0).toFixed(1)}% do total</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Talentos Destacados</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.highlighted}</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">{((stats.highlighted / stats.total) * 100 || 0).toFixed(1)}% do total</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Notificações</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{notifications?.length || 0}</h3>
            </div>
            <div className="p-3 bg-pink-50 rounded-full">
              <Bell className="h-6 w-6 text-pink-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-400">Atualizado agora</span>
          </div>
        </motion.div>
      </motion.div>
      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda - Gráficos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Gráfico de Rosca - Status dos Talentos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Status dos Talentos</h2>
            <div className="h-64 flex items-center justify-center">
              {talentsLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                  <p className="mt-3 text-gray-500">Carregando dados...</p>
                </div>
              ) : (
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          pointStyle: "circle",
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Coluna da Direita - Destaques e Atividades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Destaques da Semana */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Destaques da Semana</h2>
              <button
                onClick={() => onNavigate("destaques")}
                className="text-pink-500 hover:text-pink-600 text-sm font-medium flex items-center"
              >
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {talentsLoading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <p className="mt-3 text-gray-500">Carregando destaques...</p>
              </div>
            ) : highlightedTalents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-500 font-medium mb-1">Nenhum talento destacado</h3>
                <p className="text-gray-400 text-sm">Destaque talentos para que eles apareçam nesta seção.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlightedTalents.map((talent) => (
                  <motion.div
                    key={talent.id}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => handleViewTalent(talent.id)}
                  >
                    <div className="flex items-start p-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                        {talent.cover ? (
                          <img
                            src={talent.cover || "/placeholder.svg"}
                            alt={talent.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="24" fill="%23a0a0a0" textAnchor="middle" dy=".3em">${talent.name.charAt(0)}</text></svg>`
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xl">
                            {talent.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{talent.name}</h3>
                            <p className="text-gray-500 text-sm">{talent.tipo_talento || "Ator/Atriz"}</p>
                          </div>
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="mt-2 flex flex-wrap justify-between">
                          <div className="mb-1 mr-1">{renderTalentStatus(talent)}</div>
                          <span className="text-xs text-gray-500 mt-1">{calculateAge(talent.birth_date)} anos</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-white p-2 border-t border-gray-100 flex justify-between"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewTalent(talent.id)
                        }}
                        className="text-xs flex items-center text-blue-500 hover:text-blue-600"
                      >
                        {loadingTalent[talent.id] ? (
                          <div className="animate-spin h-3 w-3 mr-1 border-b border-blue-500 rounded-full"></div>
                        ) : (
                          <Eye className="h-3 w-3 mr-1" />
                        )}
                        Visualizar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditTalent(talent.id)
                        }}
                        className="text-xs flex items-center text-gray-500 hover:text-gray-600"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Atividades Recentes</h2>
            </div>

            {notificationsLoading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <p className="mt-3 text-gray-500">Carregando atividades...</p>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-500 font-medium mb-1">Nenhuma atividade recente</h3>
                <p className="text-gray-400 text-sm">As atividades aparecerão aqui quando ocorrerem.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start p-3 rounded-lg ${!activity.read ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    {renderActivityIcon(activity.type)}
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-800">{activity.title}</h4>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
                    </div>
                  </motion.div>
                ))}

                <div className="pt-2 text-center">
                  <button
onClick={(e) => {
  e.preventDefault()
  onNavigate("notificações", { returnTo: "dashboard" })
}}                    className="inline-flex items-center text-sm font-medium text-pink-500 hover:text-pink-600"
                  >
                    Ver todas as atividades
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {/* Modal de visualização de talento */}
      <TalentModal onClose={() => console.log("Modal fechado")} />
      {/* Modal de edição de talento */}
      <EditTalentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        talentId={editingTalentId}
        onSave={handleSaveEditedTalent}
      />
    </div>
  )
}

export default Dashboard
