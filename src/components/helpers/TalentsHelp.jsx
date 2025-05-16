"use client"

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
} from "lucide-react"

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

        {sections.map((section) => (
          <div key={section.id} className="mt-8">
            <div className="flex items-center mb-4">
              {section.icon}
              <h3 className="text-lg font-semibold text-gray-800 ml-2">{section.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{section.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {section.items.map((item) => (
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
        ))}

        <div className="mt-8 p-4 border border-pink-200 rounded-lg bg-pink-50">
          <div className="flex items-center mb-2">
            <div className="bg-pink-100 p-2 rounded-lg mr-3">
              <Star className="w-5 h-5 text-pink-500" />
            </div>
            <h3 className="font-medium text-gray-800">Destaque de Talentos</h3>
          </div>

          <p className="text-gray-600 text-sm mb-3">
            Marcar um talento como destaque o torna mais visível na plataforma. Talentos destacados aparecem na seção
            "Destaques da Semana" no Dashboard e têm prioridade nas buscas.
          </p>

          <div className="flex items-start mt-2 bg-white p-2 rounded border border-gray-100">
            <span className="text-pink-500 mr-2 text-lg">💡</span>
            <span className="text-xs text-gray-600">
              Para destacar um talento, clique no ícone de estrela na linha do talento ou use o menu de ações.
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center mb-2">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-medium text-gray-800">Visualização de Perfil</h3>
          </div>

          <p className="text-gray-600 text-sm mb-3">
            Ao clicar no botão "Visualizar" ou no ícone de olho, você pode ver todos os detalhes do perfil do talento,
            incluindo fotos, informações de contato, experiências e muito mais.
          </p>

          <div className="flex items-start mt-2 bg-white p-2 rounded border border-gray-100">
            <span className="text-pink-500 mr-2 text-lg">💡</span>
            <span className="text-xs text-gray-600">
              A visualização de perfil mostra exatamente como o talento aparece para os visitantes da plataforma.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TalentsHelp
