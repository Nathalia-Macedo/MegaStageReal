import { useState } from "react"
import { motion } from "framer-motion"
import {
  HelpCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Filter,
  Info,ImageIcon,User,Video,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Instagram,
} from "lucide-react"

const HighlightsHelp = () => {
  const sections = [
    {
      id: "overview",
      title: "Visão Geral dos Destaques",
      icon: <HelpCircle className="w-5 h-5 text-pink-500" />,
      description: "Saiba como usar a seção de destaques para promover talentos na plataforma.",
      items: [
        {
          id: "what-are-highlights",
          title: "O que são Destaques?",
          icon: <Star className="w-5 h-5 text-yellow-500" />,
          description: "Destaques são talentos especiais que aparecem em destaque na plataforma.",
          tip: "Use destaques para mostrar os melhores talentos na página inicial.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
        {
          id: "how-to-highlight",
          title: "Como Destacar um Talento",
          icon: <Star className="w-5 h-5 text-yellow-500" />,
          description: "Clique na estrela ao lado do talento para marcá-lo como destaque.",
          tip: "O destaque aparece automaticamente na seção 'Destaques da Semana'.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
        {
          id: "instagram-link",
          title: "Link do Instagram",
          icon: <Instagram className="w-5 h-5 text-pink-500" />,
          description: "Clique no nome do Instagram para visitar o perfil da pessoa.",
          tip: "Isso abre o Instagram em uma nova aba no seu navegador.",
          color: "border-pink-200",
          iconBg: "bg-pink-100",
          iconColor: "text-pink-500",
        },
        {
          id: "update-button",
          title: "Botão de Atualizar",
          icon: <RefreshCw className="w-5 h-5 text-blue-500" />,
          description: "Atualize a lista de talentos destacados com os dados mais recentes.",
          tip: "Clique no ícone de atualizar para recarregar a página.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
      ],
    },
    {
      id: "talent-status",
      title: "Status dos Talentos",
      icon: <CheckCircle className="w-5 h-5 text-pink-500" />,
      description: "Entenda os diferentes estados que um talento pode ter na seção de destaques.",
      items: [
        {
          id: "available",
          title: "Disponível",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          description: "Talentos prontos para trabalhos e ativos.",
          tip: "Aparecem nas buscas e podem ser contratados agora.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "unavailable",
          title: "Indisponível",
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          description: "Talentos ativos, mas ocupados por agora.",
          tip: "Veja a data de volta na visualização do perfil.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
        {
          id: "inactive",
          title: "Inativo",
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          description: "Talentos que não estão em uso na plataforma.",
          tip: "Não aparecem em buscas públicas.",
          color: "border-red-200",
          iconBg: "bg-red-100",
          iconColor: "text-red-500",
        },
      ],
    },
    {
      id: "filters",
      title: "Filtros na Seção de Destaques",
      icon: <Filter className="w-5 h-5 text-pink-500" />,
      description: "Use os filtros para encontrar talentos destacados facilmente.",
      items: [
        {
          id: "category-filter",
          title: "Filtro por Categoria",
          icon: <Filter className="w-5 h-5 text-blue-500" />,
          description: "Escolha entre atores, atrizes ou outros tipos de talentos.",
          tip: "Selecione a categoria no menu de filtros para ver apenas o desejado.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          id: "highlight-filter",
          title: "Filtro por Destaque",
          icon: <Star className="w-5 h-5 text-yellow-500" />,
          description: "Mostre apenas talentos marcados como destaque.",
          tip: "Ative o filtro 'Destaque' para ver os mais importantes.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
        {
          id: "age-filter",
          title: "Filtro por Idade",
          icon: <Clock className="w-5 h-5 text-green-500" />,
          description: "Filtre talentos por faixa etária.",
          tip: "Use o controle de idade para ajustar entre 18 e 80 anos.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
      ],
    },
    {
      id: "view-modal",
      title: "Modal de Visualização",
      icon: <Eye className="w-5 h-5 text-pink-500" />,
      description: "Veja todos os detalhes de um talento destacado ao clicar em 'Visualizar'.",
      items: [
        {
          id: "view-details",
          title: "Detalhes do Talento",
          icon: <Info className="w-5 h-5 text-blue-500" />,
          description: "Confira nome, idade, altura e mais ao abrir o modal.",
          tip: "Role a tela ou clique fora para fechar.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          id: "view-photos",
          title: "Galeria de Fotos",
          icon: <ImageIcon className="w-5 h-5 text-green-500" />,
          description: "Veja as fotos do portfólio no modal de visualização.",
          tip: "Clique em uma foto para ampliar e navegue com as setas.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "view-videos",
          title: "Vídeos do Talento",
          icon: <Video className="w-5 h-5 text-purple-500" />,
          description: "Assista aos vídeos no modal de visualização.",
          tip: "Clique no play para começar.",
          color: "border-purple-200",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-500",
        },
      ],
    },
    {
      id: "edit-modal",
      title: "Modal de Edição",
      icon: <Edit className="w-5 h-5 text-pink-500" />,
      description: "Edite as informações de um talento destacado ao clicar em 'Editar'.",
      items: [
        {
          id: "edit-basics",
          title: "Editar Informações",
          icon: <User className="w-5 h-5 text-blue-500" />,
          description: "Mude nome, idade, altura e outros dados no modal de edição.",
          tip: "Clique em 'Editar Perfil' no modal de visualização para abrir.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          id: "add-photos-videos",
          title: "Adicionar Fotos ou Vídeos",
          icon: <ImageIcon className="w-5 h-5 text-green-500" />,
          description: "Envie novas fotos ou vídeos no modal de edição.",
          tip: "Arraste os arquivos ou clique para selecionar.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "save-changes",
          title: "Salvar Alterações",
          icon: <CheckCircle className="w-5 h-5 text-yellow-500" />,
          description: "Guarde as mudanças feitas no modal de edição.",
          tip: "Clique em 'Salvar' ou 'Cancelar' para sair.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
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
          Destaques - Guia Completo
        </h2>
        <p className="text-gray-600 mt-2">
          Aprenda a gerenciar e destacar talentos na plataforma de forma simples e eficiente.
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Info className="text-blue-500 mr-3 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-700">
            Aqui você encontra tudo sobre como destacar talentos, usar filtros e gerenciar perfis.
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

export default HighlightsHelp