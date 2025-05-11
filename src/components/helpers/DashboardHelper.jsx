import { motion } from "framer-motion"
import { Users, Calendar, Star, Bell, RefreshCw, HelpCircle, AlertCircle,Clock, Info,BarChart3,CheckCircle } from 'lucide-react'

const DashboardHelp = () => {
  const cards = [
    {
      id: "total-talents",
      title: "Total de Talentos",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      description: "Mostra o número total de talentos cadastrados no sistema.",
      tip: "Você pode ver o crescimento percentual em relação ao mês anterior.",
      color: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      id: "available-talents",
      title: "Talentos Disponíveis",
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      description: "Exibe a quantidade de talentos disponíveis para trabalhos.",
      tip: "A porcentagem mostra quanto do total de talentos está disponível.",
      color: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      id: "featured-talents",
      title: "Talentos Destacados",
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      description: "Apresenta o número de talentos marcados como destaque.",
      tip: "Talentos destacados aparecem com prioridade nas buscas.",
      color: "border-yellow-200",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    {
      id: "notifications",
      title: "Notificações",
      icon: <Bell className="w-5 h-5 text-pink-500" />,
      description: "Mostra o número de notificações pendentes.",
      tip: "Clique no ícone de sino no topo da página para ver todas as notificações.",
      color: "border-pink-200",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
    },
  ]

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <HelpCircle className="mr-2 text-pink-500" size={20} />
          Dashboard - Visão Geral
        </h2>
        <p className="text-gray-600 mt-2">
          O Dashboard é sua central de controle, exibindo as principais métricas e informações do sistema.
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Info className="text-blue-500 mr-3 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-700">
            Os quatro cards no topo do dashboard fornecem uma visão rápida dos principais números do sistema.
            Cada card é atualizado em tempo real quando você clica no botão "Atualizar Dashboard".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className={`border ${card.color} rounded-lg p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-center mb-3">
                <div className={`${card.iconBg} p-2 rounded-lg mr-3`}>
                  {card.icon}
                </div>
                <h3 className="font-medium text-gray-800">{card.title}</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{card.description}</p>
              
              <div className="flex items-start mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                <span className="text-pink-500 mr-2 text-lg">💡</span>
                <span className="text-xs text-gray-600">{card.tip}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <div className="flex items-center mb-2">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <RefreshCw className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-medium text-gray-800">Botão de Atualização</h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">
            O botão "Atualizar Dashboard" recarrega todos os dados para exibir as informações mais recentes.
          </p>
          
          <div className="flex items-start mt-2 bg-white p-2 rounded border border-gray-100">
            <span className="text-pink-500 mr-2 text-lg">💡</span>
            <span className="text-xs text-gray-600">
              Use este botão sempre que quiser garantir que está vendo os dados mais atualizados.
            </span>
          </div>
        </div>

       
      </div>

    </motion.div>
  )
}

export default DashboardHelp