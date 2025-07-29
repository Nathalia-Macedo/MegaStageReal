import { motion } from "framer-motion"
import {
  Search,
  Filter,
  Star,
  Eye,
  Grid,
  List,
  RefreshCw,
  Plus,
  Upload,
  HelpCircle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Edit,
  ImageIcon,
  Video,
  User,
} from "lucide-react"
import { useState } from "react"
const TalentsHelp = () => {
  const sections = [
    {
      id: "overview",
      title: "Visão Geral",
      icon: <HelpCircle className="w-5 h-5 text-pink-500" />,
      description: "A seção de Talentos permite gerenciar todos os perfis cadastrados na plataforma.",
      items: [
        {
          id: "main-actions",
          title: "Ações Principais",
          icon: <Plus className="w-5 h-5 text-blue-500" />,
          description: "Botões para adicionar novos talentos ou importar do Manager.",
          tip: "Use o botão 'Adicionar Talento' para cadastrar manualmente um novo perfil.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          id: "search-filter",
          title: "Busca e Filtros",
          icon: <Search className="w-5 h-5 text-green-500" />,
          description: "Ferramentas para encontrar talentos específicos rapidamente.",
          tip: "Utilize os filtros avançados para refinar sua busca por categoria, destaque ou idade.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "view-modes",
          title: "Modos de Visualização",
          icon: <Grid className="w-5 h-5 text-purple-500" />,
          description: "Alterne entre visualização em tabela ou cards.",
          tip: "A visualização em cards é ideal para ver fotos dos talentos, enquanto a tabela é melhor para comparar informações.",
          color: "border-purple-200",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-500",
        },
        {
          id: "talent-actions",
          title: "Ações por Talento",
          icon: <Eye className="w-5 h-5 text-yellow-500" />,
          description: "Visualize, edite, destaque ou exclua talentos individualmente.",
          tip: "Clique na estrela para marcar um talento como destaque, tornando-o mais visível na plataforma.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
      ],
    },
    {
      id: "talent-status",
      title: "Status dos Talentos",
      icon: <CheckCircle className="w-5 h-5 text-pink-500" />,
      description: "Entenda os diferentes status que um talento pode ter na plataforma.",
      items: [
        {
          id: "available",
          title: "Disponível",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          description: "Talentos que estão ativos e disponíveis para trabalhos.",
          tip: "Estes talentos aparecem nas buscas e podem ser contratados imediatamente.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "unavailable",
          title: "Indisponível",
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          description: "Talentos que estão ativos, mas temporariamente indisponíveis.",
          tip: "Você pode ver a data prevista de disponibilidade destes talentos.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
        {
          id: "inactive",
          title: "Inativo",
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          description: "Talentos que não estão ativos na plataforma.",
          tip: "Talentos inativos não aparecem nas buscas públicas.",
          color: "border-red-200",
          iconBg: "bg-red-100",
          iconColor: "text-red-500",
        },
        {
          id: "highlighted",
          title: "Destacado",
          icon: <Star className="w-5 h-5 text-yellow-500" />,
          description: "Talentos marcados como destaque na plataforma.",
          tip: "Talentos destacados aparecem com prioridade nas buscas e na página inicial.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
      ],
    },
    {
      id: "advanced-features",
      title: "Recursos Avançados",
      icon: <Sliders className="w-5 h-5 text-pink-500" />,
      description: "Conheça os recursos avançados disponíveis na gestão de talentos.",
      items: [
        {
          id: "advanced-filters",
          title: "Filtros Avançados",
          icon: <Filter className="w-5 h-5 text-indigo-500" />,
          description: "Filtre talentos por categoria, destaque, idade e muito mais.",
          tip: "Combine diferentes filtros para encontrar exatamente o que procura.",
          color: "border-indigo-200",
          iconBg: "bg-indigo-100",
          iconColor: "text-indigo-500",
        },
        {
          id: "sorting",
          title: "Ordenação",
          icon: <RefreshCw className="w-5 h-5 text-blue-500" />,
          description: "Ordene talentos por nome, idade ou data de cadastro.",
          tip: "Clique nos cabeçalhos da tabela para ordenar rapidamente por aquela coluna.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          id: "pagination",
          title: "Paginação",
          icon: <List className="w-5 h-5 text-green-500" />,
          description: "Navegue entre páginas de resultados e ajuste a quantidade de itens exibidos.",
          tip: "Você pode escolher exibir 5, 10, 20 ou 50 talentos por página.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "import",
          title: "Importação",
          icon: <Upload className="w-5 h-5 text-purple-500" />,
          description: "Importe talentos diretamente do Manager para a plataforma.",
          tip: "Esta função permite adicionar vários talentos de uma só vez.",
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
      description: "Saiba como editar as informações de um talento.",
      items: [
        {
          id: "edit-basics",
          title: "Editar Informações Básicas",
          icon: <User className="w-5 h-5 text-blue-500" />,
          description: "Altere nome, idade, altura, cor de cabelo e olhos.",
          tip: "Clique em 'Editar Perfil' no modal de visualização para abrir esta tela.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          id: "add-photos",
          title: "Adicionar Fotos",
          icon: <ImageIcon className="w-5 h-5 text-green-500" />,
          description: "Envie novas fotos do talento para o portfólio.",
          tip: "Arraste e solte as fotos ou clique para selecioná-las e enviá-las.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "add-videos",
          title: "Adicionar Vídeos",
          icon: <Video className="w-5 h-5 text-purple-500" />,
          description: "Adicione vídeos para mostrar o trabalho do talento.",
          tip: "Use o botão 'Adicionar Vídeo' para enviar arquivos de vídeo.",
          color: "border-purple-200",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-500",
        },
        {
          id: "save-changes",
          title: "Salvar Alterações",
          icon: <CheckCircle className="w-5 h-5 text-yellow-500" />,
          description: "Confirme as mudanças feitas no perfil.",
          tip: "Clique em 'Salvar' para guardar tudo ou 'Cancelar' para voltar sem salvar.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
      ],
    },
    {
      id: "view-modal",
      title: "Modal de Visualização",
      icon: <Eye className="w-5 h-5 text-pink-500" />,
      description: "Aprenda a ver os detalhes de um talento.",
      items: [
        {
          id: "view-details",
          title: "Detalhes do Talento",
          icon: <Info className="w-5 h-5 text-blue-500" />,
          description: "Veja nome, idade, altura, idiomas e mais informações.",
          tip: "Role a tela para ver tudo ou clique fora para fechar.",
          color: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          id: "view-photos",
          title: "Galeria de Fotos",
          icon: <ImageIcon className="w-5 h-5 text-green-500" />,
          description: "Explore as fotos do portfólio do talento.",
          tip: "Clique em uma foto para ampliar e use as setas para navegar.",
          color: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          id: "view-videos",
          title: "Vídeos do Talento",
          icon: <Video className="w-5 h-5 text-purple-500" />,
          description: "Assista aos vídeos adicionados pelo talento.",
          tip: "Clique no botão de play para começar a assistir.",
          color: "border-purple-200",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-500",
        },
        {
          id: "edit-action",
          title: "Ação de Edição",
          icon: <Edit className="w-5 h-5 text-yellow-500" />,
          description: "Abra o modal de edição a partir da visualização.",
          tip: "Clique em 'Editar Perfil' para mudar algo no talento.",
          color: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
      ],
    },
  ]

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 1 // Uma seção por página

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
          Talentos - Guia Completo
        </h2>
        <p className="text-gray-600 mt-2">
          A seção de Talentos é o centro de gerenciamento de todos os perfis cadastrados na plataforma, permitindo
          adicionar, editar, visualizar e organizar talentos de forma eficiente.
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Info className="text-blue-500 mr-3 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-700">
            Esta tela permite gerenciar todos os talentos da plataforma. Você pode adicionar novos talentos, editar
            informações, marcar como destaque, filtrar por diferentes critérios e muito mais.
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

export default TalentsHelp