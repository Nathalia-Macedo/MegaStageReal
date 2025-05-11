"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { useNotifications } from "../contexts/notification-context"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Save,
  Loader2,
  Calendar,
  Ruler,
  Eye,
  Music,
  Globe,
  Instagram,
  ImageIcon,
  User,
  AlertCircle,
  Edit,
  Plus,
  Palette,
  Check,
  Clock,
  ChevronDown,
  Info,
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Languages,
  FileText,
  Mic,
  Briefcase,
  Trash2,
} from "lucide-react"

export default function EditTalentModal({ isOpen, onClose, talentId, onSave }) {
  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const { notifyTalentUpdated } = useNotifications || {}
  const modalRef = useRef(null)
  const [activeSection, setActiveSection] = useState("basic")
  const [formTouched, setFormTouched] = useState(false)
  const [imagePreviewHover, setImagePreviewHover] = useState(false)
  const [showTooltip, setShowTooltip] = useState({})

  // Estados para os campos editáveis
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    height: "",
    eye_color: "",
    hair_color: "",
    can_sing: false,
    instruments: [],
    languages: [],
    ativo: true,
    disponivel: true,
    data_disponibilidade: "",
    destaque: false,
    category: "",
    instagram: "",
    tipo_talento: "",
    cover: "",
  })

  // Estado para controlar erros de validação
  const [formErrors, setFormErrors] = useState({})

  // Estado para controlar campos de array (instrumentos e idiomas)
  const [newInstrument, setNewInstrument] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  // Efeito para fechar o modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (formTouched) {
          // Confirmar antes de fechar se houver alterações
          if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
            onClose()
          }
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose, formTouched])

  // Efeito para fechar o modal com a tecla ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (formTouched) {
          // Confirmar antes de fechar se houver alterações
          if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
            onClose()
          }
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscKey)
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose, formTouched])

  // Buscar dados do talento quando o modal for aberto
  useEffect(() => {
    if (isOpen && talentId) {
      fetchTalentDetails(talentId)
      setFormTouched(false)
    }
  }, [isOpen, talentId])

  // Função para buscar os detalhes do talento
  const fetchTalentDetails = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes do talento: ${response.status}`)
      }

      const data = await response.json()
      setTalent(data)

      // Preencher o formulário com os dados do talento
      setFormData({
        name: data.name || "",
        birth_date: data.birth_date ? formatDateForInput(data.birth_date) : "",
        height: data.height || "",
        eye_color: data.eye_color || "",
        hair_color: data.hair_color || "",
        can_sing: data.can_sing || false,
        instruments: data.instruments || [],
        languages: data.languages || [],
        ativo: data.ativo !== undefined ? data.ativo : true,
        disponivel: data.disponivel !== undefined ? data.disponivel : true,
        data_disponibilidade: data.data_disponibilidade ? formatDateForInput(data.data_disponibilidade) : "",
        destaque: data.destaque || false,
        category: data.category || "",
        instagram: data.instagram || "",
        tipo_talento: data.tipo_talento || "",
        cover: data.cover || "",
      })
    } catch (error) {
      console.error("Erro ao buscar detalhes do talento:", error)
      setError(error.message)
      toast.error(`Erro ao carregar detalhes: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Função para formatar data para o formato do input date (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    } catch (error) {
      return ""
    }
  }

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Marcar o formulário como alterado
    setFormTouched(true)

    // Limpar erro do campo quando o usuário digitar
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }

    // Validação em tempo real para alguns campos
    if (name === "instagram" && value && !value.startsWith("@")) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "Instagram deve começar com @",
      }))
    }
  }

  // Funções para lidar com arrays (instrumentos e idiomas)
  const addInstrument = () => {
    if (newInstrument.trim()) {
      setFormData((prev) => ({
        ...prev,
        instruments: [...prev.instruments, newInstrument.trim()],
      }))
      setNewInstrument("")
      setFormTouched(true)
    }
  }

  const removeInstrument = (index) => {
    setFormData((prev) => ({
      ...prev,
      instruments: prev.instruments.filter((_, i) => i !== index),
    }))
    setFormTouched(true)
  }

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }))
      setNewLanguage("")
      setFormTouched(true)
    }
  }

  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }))
    setFormTouched(true)
  }

  // Validação do formulário
  const validateForm = () => {
    const errors = {}

    if (!formData.name) errors.name = "Nome é obrigatório"
    if (!formData.category) errors.category = "Categoria é obrigatória"
    if (!formData.birth_date) errors.birth_date = "Data de nascimento é obrigatória"

    // Validar formato de Instagram (opcional)
    if (formData.instagram && !formData.instagram.startsWith("@")) {
      errors.instagram = "Instagram deve começar com @"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Função para salvar as alterações
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário", {
        icon: <AlertCircle className="text-red-500" />,
      })
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao atualizar talento: ${response.status}`)
      }

      const updatedTalent = await response.json()
      toast.success("Talento atualizado com sucesso!", {
        icon: <CheckCircle className="text-green-500" />,
      })

      // Notificar atualização para buscar novas notificações
      if (notifyTalentUpdated) {
        notifyTalentUpdated(updatedTalent)
      }

      // Chamar a função de callback com o talento atualizado
      if (onSave) {
        onSave(updatedTalent)
      }

      setFormTouched(false)
      // Fechar o modal
      onClose()
    } catch (error) {
      console.error("Erro ao atualizar talento:", error)
      toast.error(`Erro ao atualizar talento: ${error.message}`, {
        icon: <XCircle className="text-red-500" />,
      })
    } finally {
      setSaving(false)
    }
  }

  // Função para mostrar tooltip
  const handleShowTooltip = (id) => {
    setShowTooltip((prev) => ({ ...prev, [id]: true }))
  }

  // Função para esconder tooltip
  const handleHideTooltip = (id) => {
    setShowTooltip((prev) => ({ ...prev, [id]: false }))
  }

  // Função para simular upload de imagem
  const handleImageUpload = () => {
    toast.info("Funcionalidade de upload em desenvolvimento", {
      icon: <Info className="text-blue-500" />,
    })
  }

  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) return null

  const renderBasicInfoSection = () => (
    <div className={`space-y-6 ${activeSection !== "basic" ? "hidden" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            Nome <span className="text-red-500 ml-1">*</span>
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("name")}
              onMouseLeave={() => handleHideTooltip("name")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              {showTooltip.name && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Nome completo do talento como será exibido no sistema
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`pl-10 block w-full rounded-lg border ${
                formErrors.name
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-pink-500 focus:border-pink-500"
              } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white text-gray-900 transition-all`}
              placeholder="Nome completo"
            />
            <AnimatePresence>
              {formErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1.5 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            Categoria <span className="text-red-500 ml-1">*</span>
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("category")}
              onMouseLeave={() => handleHideTooltip("category")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              {showTooltip.category && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Categoria principal do talento
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`block w-full rounded-lg border ${
                formErrors.category
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-pink-500 focus:border-pink-500"
              } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white text-gray-900 appearance-none pr-10 transition-all`}
            >
              <option value="">Selecione uma categoria</option>
              <option value="Ator">Ator</option>
              <option value="Atriz">Atriz</option>
              <option value="Modelo">Modelo</option>
              <option value="Músico">Músico</option>
              <option value="Dançarino">Dançarino</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
            </div>
            <AnimatePresence>
              {formErrors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1.5 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.category}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Talento */}
        <div>
          <label htmlFor="tipo_talento" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            Tipo de Talento
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("tipo_talento")}
              onMouseLeave={() => handleHideTooltip("tipo_talento")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              {showTooltip.tipo_talento && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Especificação adicional do tipo de talento
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Briefcase className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
            </div>
            <input
              type="text"
              id="tipo_talento"
              name="tipo_talento"
              value={formData.tipo_talento}
              onChange={handleInputChange}
              className="pl-10 block w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:border-pink-500 sm:text-sm p-3 bg-white text-gray-900 transition-all"
              placeholder="Tipo de talento"
            />
          </div>
        </div>

        {/* Data de Nascimento */}
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            Data de Nascimento <span className="text-red-500 ml-1">*</span>
            <div
              className="relative ml-1.5"
              onMouseEnter={() => handleShowTooltip("birth_date")}
              onMouseLeave={() => handleHideTooltip("birth_date")}
            >
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              {showTooltip.birth_date && (
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  Data de nascimento para cálculo de idade
                </div>
              )}
            </div>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
            </div>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
              className={`pl-10 block w-full rounded-lg border ${
                formErrors.birth_date
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-pink-500 focus:border-pink-500"
              } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white text-gray-900 transition-all`}
            />
            <AnimatePresence>
              {formErrors.birth_date && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1.5 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.birth_date}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Instagram */}
      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
          Instagram
          <div
            className="relative ml-1.5"
            onMouseEnter={() => handleShowTooltip("instagram")}
            onMouseLeave={() => handleHideTooltip("instagram")}
          >
            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            {showTooltip.instagram && (
              <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Perfil do Instagram (deve começar com @)
              </div>
            )}
          </div>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Instagram className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            type="text"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            className={`pl-10 block w-full rounded-lg border ${
              formErrors.instagram
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-pink-500 focus:border-pink-500"
            } shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 bg-white text-gray-900 transition-all`}
            placeholder="@usuario"
          />
          <AnimatePresence>
            {formErrors.instagram && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1.5 text-sm text-red-600 flex items-center"
              >
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                {formErrors.instagram}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Imagem de Capa */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700 flex items-center">
            <Camera className="h-4 w-4 mr-1.5 text-pink-500" />
            Imagem de Perfil
          </label>
          <button
            type="button"
            onClick={handleImageUpload}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-pink-700 bg-pink-50 hover:bg-pink-100 transition-colors"
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Upload
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <ImageIcon className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            type="text"
            id="cover"
            name="cover"
            value={formData.cover || ""}
            onChange={handleInputChange}
            className="pl-10 block w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:border-pink-500 sm:text-sm p-3 bg-white text-gray-900 transition-all"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        {/* Prévia da imagem */}
        {formData.cover && (
          <div className="mt-4">
            <div
              className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
              onMouseEnter={() => setImagePreviewHover(true)}
              onMouseLeave={() => setImagePreviewHover(false)}
            >
              <img
                src={formData.cover || "/placeholder.svg"}
                alt="Prévia"
                className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="18" fill="%23a0a0a0" textAnchor="middle" dy=".3em">Imagem não disponível</text></svg>`
                }}
              />
              <AnimatePresence>
                {imagePreviewHover && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                  >
                    <div className="text-white text-sm font-medium">Visualizar imagem</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic">
              Esta imagem será exibida no perfil do talento e nas listagens
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const renderCharacteristicsSection = () => (
    <div className={`space-y-6 ${activeSection !== "characteristics" ? "hidden" : ""}`}>
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-sm font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center">
          <User className="h-4 w-4 mr-2 text-pink-500" />
          Características Físicas
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Altura */}
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1.5">
              Altura
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Ruler className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
              </div>
              <input
                type="text"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:border-pink-500 sm:text-sm p-3 bg-white text-gray-900 transition-all"
                placeholder="170 cm"
              />
            </div>
          </div>

          {/* Cor dos Olhos */}
          <div>
            <label htmlFor="eye_color" className="block text-sm font-medium text-gray-700 mb-1.5">
              Cor dos Olhos
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Eye className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
              </div>
              <input
                type="text"
                id="eye_color"
                name="eye_color"
                value={formData.eye_color}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:border-pink-500 sm:text-sm p-3 bg-white text-gray-900 transition-all"
                placeholder="Castanhos"
              />
            </div>
          </div>

          {/* Cor do Cabelo */}
          <div>
            <label htmlFor="hair_color" className="block text-sm font-medium text-gray-700 mb-1.5">
              Cor do Cabelo
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Palette className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
              </div>
              <input
                type="text"
                id="hair_color"
                name="hair_color"
                value={formData.hair_color}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:border-pink-500 sm:text-sm p-3 bg-white text-gray-900 transition-all"
                placeholder="Castanho"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Habilidades Musicais */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-sm font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center">
          <Music className="h-4 w-4 mr-2 text-pink-500" />
          Habilidades Musicais
        </h4>

        <div className="flex items-center mb-4 bg-white p-3 rounded-lg border border-gray-100 hover:border-pink-200 transition-colors">
          <input
            type="checkbox"
            id="can_sing"
            name="can_sing"
            checked={formData.can_sing}
            onChange={handleInputChange}
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label htmlFor="can_sing" className="ml-2 block text-sm text-gray-700 flex items-center">
            <Mic className="h-4 w-4 mr-1.5 text-pink-500" />
            Canta
          </label>
        </div>

        <div>
          <label htmlFor="new-instrument" className="block text-sm font-medium text-gray-700 mb-2">
            Instrumentos
          </label>
          <div className="flex">
            <input
              type="text"
              id="new-instrument"
              value={newInstrument}
              onChange={(e) => setNewInstrument(e.target.value)}
              className="block w-full rounded-l-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:border-pink-500 sm:text-sm p-3 bg-white text-gray-900 transition-all"
              placeholder="Adicionar instrumento"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addInstrument()
                }
              }}
            />
            <button
              type="button"
              onClick={addInstrument}
              className="px-4 py-3 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.instruments.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Nenhum instrumento adicionado</p>
            ) : (
              formData.instruments.map((instrument, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:border-pink-200 transition-all"
                >
                  <Music className="h-3.5 w-3.5 mr-1.5 text-pink-500" />
                  {instrument}
                  <button
                    type="button"
                    onClick={() => removeInstrument(index)}
                    className="ml-1.5 text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Idiomas */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-sm font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center">
          <Languages className="h-4 w-4 mr-2 text-pink-500" />
          Idiomas
        </h4>
        <div className="flex">
          <input
            type="text"
            id="new-language"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            className="block w-full rounded-l-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:border-pink-500 sm:text-sm p-3 bg-white text-gray-900 transition-all"
            placeholder="Adicionar idioma"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addLanguage()
              }
            }}
          />
          <button
            type="button"
            onClick={addLanguage}
            className="px-4 py-3 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {formData.languages.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Nenhum idioma adicionado</p>
          ) : (
            formData.languages.map((language, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:border-pink-200 transition-all"
              >
                <Globe className="h-3.5 w-3.5 mr-1.5 text-pink-500" />
                {language}
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="ml-1.5 text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-red-50 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  const renderStatusSection = () => (
    <div className={`space-y-6 ${activeSection !== "status" ? "hidden" : ""}`}>
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-4 pb-2 border-b border-gray-100 flex items-center">
          <FileText className="h-4 w-4 mr-2 text-pink-500" />
          Status do Talento
        </h4>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={formData.ativo}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700 flex items-center">
              <Check className="h-4 w-4 mr-1.5 text-green-500" />
              <span className="font-medium">Ativo no sistema</span>
              <span className="ml-2 text-xs text-gray-500">
                (Talentos inativos não aparecem nas listagens públicas)
              </span>
            </label>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
            <input
              type="checkbox"
              id="disponivel"
              name="disponivel"
              checked={formData.disponivel}
              onChange={handleInputChange}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-700 flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-amber-500" />
              <span className="font-medium">Disponível para trabalhos</span>
              <span className="ml-2 text-xs text-gray-500">(Indica se o talento está disponível para contratação)</span>
            </label>
          </div>

          <AnimatePresence>
            {!formData.disponivel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-7 mt-2 p-4 bg-amber-50 rounded-lg border border-amber-100 shadow-sm"
              >
                <label htmlFor="data_disponibilidade" className="block text-sm font-medium text-amber-800 mb-2">
                  Disponível a partir de:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-amber-500" />
                  </div>
                  <input
                    type="date"
                    id="data_disponibilidade"
                    name="data_disponibilidade"
                    value={formData.data_disponibilidade}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-lg border border-amber-200 shadow-sm focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 focus:border-amber-500 sm:text-sm p-3 bg-white text-gray-900 transition-all"
                  />
                  <p className="mt-2 text-xs text-amber-700">
                    Esta data será exibida para indicar quando o talento estará disponível novamente.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all">
            <input
              type="checkbox"
              id="destaque"
              name="destaque"
              checked={formData.destaque}
              onChange={handleInputChange}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="destaque" className="ml-2 block text-sm text-gray-700 flex items-center">
              <Sparkles className="h-4 w-4 mr-1.5 text-yellow-500" />
              <span className="font-medium">Destacar talento</span>
              <span className="ml-2 text-xs text-gray-500">(Talentos destacados aparecem em seções especiais)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh]"
          >
            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Editar Talento
              </h2>
              <button
                onClick={() => {
                  if (formTouched) {
                    if (window.confirm("Há alterações não salvas. Deseja realmente sair?")) {
                      onClose()
                    }
                  } else {
                    onClose()
                  }
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 64px)" }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Loader2 className="h-12 w-12 text-pink-500" />
                  </motion.div>
                  <p className="mt-4 text-gray-600 font-medium">Carregando informações do talento...</p>
                </div>
              ) : error ? (
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
                  >
                    <p className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {error}
                    </p>
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                      >
                        Fechar
                      </button>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                    <button
                      type="button"
                      onClick={() => setActiveSection("basic")}
                      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeSection === "basic"
                          ? "text-pink-600 border-b-2 border-pink-500"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <User className={`h-4 w-4 mr-2 ${activeSection === "basic" ? "text-pink-500" : ""}`} />
                      Informações Básicas
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("characteristics")}
                      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeSection === "characteristics"
                          ? "text-pink-600 border-b-2 border-pink-500"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Palette
                        className={`h-4 w-4 mr-2 ${activeSection === "characteristics" ? "text-pink-500" : ""}`}
                      />
                      Características
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("status")}
                      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeSection === "status"
                          ? "text-pink-600 border-b-2 border-pink-500"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Info className={`h-4 w-4 mr-2 ${activeSection === "status" ? "text-pink-500" : ""}`} />
                      Status
                    </button>
                  </div>

                  <div className="p-6">
                    {renderBasicInfoSection()}
                    {renderCharacteristicsSection()}
                    {renderStatusSection()}

                    {/* Botões de ação */}
                    <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                        onClick={onClose}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Cancelar edição
                      </button>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          Descartar alterações
                        </button>
                        <motion.button
                          type="submit"
                          disabled={saving}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-pink-600 hover:to-pink-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex items-center ${
                            saving ? "opacity-80 cursor-not-allowed" : ""
                          }`}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Salvar Alterações
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
