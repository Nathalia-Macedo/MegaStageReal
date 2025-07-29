import { useState } from "react"
import { motion } from "framer-motion"
import {
  HelpCircle,
  Bell,
  CheckCircle,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const NotificationHelpPage = ({ setActiveTab }) => {
  const sections = [
    {
      id: "overview",
      title: "Visão Geral das Notificações",
      icon: <HelpCircle className="w-5 h-5 text-pink-500" />,
      description: "Entenda como as notificações ajudam você a se manter atualizado na plataforma.",
      items: [
        {
          id: "what-are-notifications",
          title: "O que são Notificações?",
          icon: <Bell className="w-5 h-5 text-blue-500" />,
          description: "Notificações alertam sobre novas mensagens, atualizações ou eventos importantes.",
          tip: "Verifique o ícone de sino na barra de navegação para novidades.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          id: "access-notifications",
          title: "Acessando Notificações",
          icon: <Bell className="w-5 h-5 text-yellow-500" />,
          description: "Clique no ícone de sino para ver o menu de notificações.",
          tip: "Um distintivo mostra a quantidade de notificações não lidas.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
      ],
    },
    {
      id: "bell-options",
      title: "Opções do Ícone de Sino",
      icon: <Bell className="w-5 h-5 text-pink-500" />,
      description: "Saiba como usar as opções disponíveis ao clicar no ícone de sino.",
      items: [
        {
          id: "mark-all-read",
          title: "Marcar Todas como Lidas",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          description: "Marca todas as notificações não lidas como lidas instantaneamente.",
          tip: "Use para limpar o distintivo de notificações rapidamente.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "view-all",
          title: "Ver Todas as Notificações",
          icon: <Eye className="w-5 h-5 text-blue-500" />,
          description: "Acesse a página completa de notificações para ver detalhes.",
          tip: "Interaja com cada notificação clicando para ver mais ou descartá-la.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
      ],
    },
    {
      id: "management-tips",
      title: "Dicas de Gerenciamento",
      icon: <Info className="w-5 h-5 text-pink-500" />,
      description: "Melhores práticas para gerenciar suas notificações de forma eficiente.",
      items: [
        {
          id: "regular-check",
          title: "Verificação Regular",
          icon: <Bell className="w-5 h-5 text-yellow-500" />,
          description: "Cheque o ícone de sino regularmente para não perder atualizações.",
          tip: "Configure notificações push para alertas em tempo real.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
        {
          id: "customize-settings",
          title: "Personalizar Notificações",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          description: "Ajuste quais notificações deseja receber na seção de configurações.",
          tip: "Desative notificações menos relevantes para reduzir distrações.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
      ],
    },
  ]

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 1
  const totalPages = sections.length
  const currentSection = sections[currentPage]

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
          Notificações - Guia Completo
        </h2>
        <p className="text-gray-600 mt-2">
          Aprenda a gerenciar notificações de forma simples e eficiente na plataforma.
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Info className="text-blue-500 mr-3 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-700">
            Aqui você encontra tudo sobre como usar o sistema de notificações e gerenciar alertas.
          </p>
        </div>

        {currentSection && (
          <div className="mt-8">
            <div className="flex items-center mb-4">
              {currentSection.icon}
              <h3 className="text-lg font-semibold text-gray-800 ml-2">{currentSection.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{currentSection.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {currentSection.items.map((item) => (
                <div key={item.id} className={`border ${item.color} rounded-lg p-4 transition-all hover:shadow-md`}>
                  <div className="flex items-center mb-3">
                    <div className={`${item.iconBg} p-2 rounded-lg mr-3`}>{item.icon}</div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                  <div className="flex items-start mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="text-pink-500 mr-2 text-lg">💡</span>
                    <span className="text-xs text-gray-600">{item.tip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-800"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-800"
            >
              Próximo
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default NotificationHelpPage