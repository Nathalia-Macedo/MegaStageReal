import { createContext, useContext, useState } from "react"
import { useNotifications } from "./notification-context"

const TalentContext = createContext()

export const useTalent = () => useContext(TalentContext)

export const TalentProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [talents, setTalents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { notifyTalentUpdated, notifyTalentCreated, notifyTalentDeleted, notifyTalentHighlighted } =
    useNotifications || {}
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTalentId, setEditingTalentId] = useState(null)
  const [loadingTalentId, setLoadingTalentId] = useState(null)

  // CORRIGIDO: Rota pública sem autenticação
  const fetchTalents = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Buscando talentos da rota pública...")
      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/proxy/talents", {
        method: "GET",
        headers: {
          Accept: "application/json", // Mantém apenas o Accept, se necessário
          "ngrok-skip-browser-warning": "true",
        },
      })
      console.log("Response status:", response.status)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao buscar talentos: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      console.log("Talentos recebidos:", data)
      setTalents(data)
      return data
    } catch (error) {
      console.error("Erro ao buscar talentos:", error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // CORRIGIDO: Usar dados já carregados ao invés de fazer nova requisição
  const fetchTalentById = async (talent_id) => {
    setLoadingTalentId(talent_id)
    setError(null)
    try {
      console.log(`Buscando talento ID ${talent_id} nos dados já carregados...`)
      // Primeiro, tentar encontrar nos dados já carregados
      const existingTalent = talents.find((t) => t.id === Number.parseInt(talent_id))
      if (existingTalent) {
        console.log(`Talento ${talent_id} encontrado nos dados existentes:`, existingTalent)
        return existingTalent
      }
      // Se não encontrou e não há talentos carregados, carregar todos primeiro
      if (talents.length === 0) {
        console.log("Nenhum talento carregado, buscando todos primeiro...")
        const allTalents = await fetchTalents()
        const talent = allTalents.find((t) => t.id === Number.parseInt(talent_id))
        if (talent) {
          console.log(`Talento ${talent_id} encontrado após carregar todos:`, talent)
          return talent
        }
      }
      // Se ainda não encontrou, talento não existe
      throw new Error(`Talento com ID ${talent_id} não encontrado`)
    } catch (error) {
      console.error(`Erro ao buscar talento ${talent_id}:`, error)
      setError(error.message)
      throw error
    } finally {
      setLoadingTalentId(null)
    }
  }

  // CORRIGIDO: Rota pública sem autenticação
  const fetchTalentPhotos = async (talentId) => {
    // CORRIGIDO: Não usar setLoading global para não interferir
    setError(null)
    try {
      console.log(`Buscando fotos do talento ${talentId} da rota pública...`)
      const response = await fetch(
        `https://working-lucky-ringtail.ngrok-free.app/api/v1/proxy/talents/${talentId}/photos`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      )
      console.log(`Response status para fotos do talento ${talentId}:`, response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Erro na resposta para fotos do talento ${talentId}:`, errorText)
        throw new Error(`Erro ao buscar fotos do talento: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      console.log(`Fotos do talento ${talentId}:`, data)
      return data
    } catch (error) {
      console.error(`Erro ao buscar fotos do talento ${talentId}:`, error)
      setError(error.message)
      throw error
    }
  }

  const createTalent = async (talentData) => {
    setLoading(true)
    setError(null)
    try {
      if (!token) throw new Error("Token de autenticação não encontrado")
      const apiTalentData = {
        name: talentData.name,
        birth_date: talentData.birth_date,
        height: talentData.height,
        eye_color: talentData.eye_color,
        hair_color: talentData.hair_color,
        can_sing: talentData.can_sing,
        instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
        languages: Array.isArray(talentData.languages) ? talentData.languages : [],
        ativo: talentData.ativo,
        disponivel: talentData.disponivel,
        data_disponibilidade: talentData.data_disponibilidade || "",
        destaque: talentData.destaque,
        category: "MEGASTAGE",
        cover: talentData.cover,
        instagram: talentData.instagram || "",
        tipo_talento: talentData.type || "Ator",
      }
      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/talents", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(apiTalentData),
      })
      if (!response.ok) throw new Error(`Erro ao criar talento: ${response.status}`)
      const data = await response.json()
      if (notifyTalentCreated) notifyTalentCreated(data)
      await fetchTalents()
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateTalent = async (talent_id, talentData, skipFetch = false) => {
    setLoading(true)
    setError(null)
    try {
      if (!token) throw new Error("Token de autenticação não encontrado")
      const apiTalentData = {
        name: talentData.name,
        birth_date: talentData.birth_date,
        height: talentData.height,
        eye_color: talentData.eye_color,
        hair_color: talentData.hair_color,
        can_sing: talentData.can_sing,
        instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
        languages: Array.isArray(talentData.languages) ? talentData.languages : [],
        ativo: talentData.ativo,
        disponivel: talentData.disponivel,
        data_disponibilidade: talentData.data_disponibilidade || "",
        destaque: talentData.destaque,
        category: talentData.category,
        cover: talentData.cover,
        instagram: talentData.instagram || "",
        tipo_talento: talentData.tipo_talento || "Ator",
      }
      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/talents/${talent_id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(apiTalentData),
      })
      if (!response.ok) throw new Error(`Erro ao atualizar talento: ${response.status}`)
      const data = await response.json()
      if (notifyTalentUpdated) notifyTalentUpdated(data)
      if (!skipFetch) await fetchTalents()
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteTalent = async (talent_id) => {
    setLoading(true)
    setError(null)
    try {
      if (!token) throw new Error("Token de autenticação não encontrado")
      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/talents/${talent_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`Erro ao excluir talento: ${response.status}`)
      if (notifyTalentDeleted) notifyTalentDeleted(talent_id)
      setTalents(talents.filter((t) => t.talent_id !== talent_id))
      return true
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const toggleHighlight = async (id, isHighlighted) => {
    try {
      const talent = await fetchTalentById(id)
      const updateData = { ...talent, destaque: !isHighlighted }
      const updatedTalent = await updateTalent(id, updateData, true)
      if (notifyTalentHighlighted) notifyTalentHighlighted(updatedTalent)
      return true
    } catch (error) {
      throw error
    }
  }

  const importFromManager = async (incremental) => {
    setLoading(true)
    setError(null)
    try {
      if (!token) throw new Error("Token de autenticação não encontrado")
      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/integration/${incremental}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`Erro ao importar talentos do Manager: ${response.status}`)
      const data = await response.json()
      await fetchTalents()
      return {
        success: true,
        message: incremental
          ? `${data.imported || 0} novos talentos importados com sucesso!`
          : `${data.imported || 0} talentos importados com sucesso!`,
        count: data.imported || 0,
      }
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const addTalentPhotos = async (talentId, files) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))
      formData.append("release", "false")
      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/talents/${talentId}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao adicionar fotos: ${response.status} - ${errorData.detail || ""}`)
      }
      const data = await response.json()
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId })
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteTalentPhoto = async (talentId, photoId) => {
    setLoading(true)
    setError(null)
    try {
      if (!token) throw new Error("Token de autenticação não encontrado")
      const response = await fetch(
        `https://working-lucky-ringtail.ngrok-free.app/api/v1/talents/${talentId}/photos/${photoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        },
      )
      if (!response.ok) throw new Error(`Erro ao excluir foto: ${response.status}`)
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId })
      return true
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // CORRIGIDO: Função para adicionar vídeos usando multipart/form-data
  const addTalentVideos = async (talentId, videoFiles) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      // CORRIGIDO: Usar FormData para enviar arquivos de vídeo
      const formData = new FormData()
      videoFiles.forEach((file) => formData.append("files", file))

      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/talents/${talentId}/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // NÃO definir Content-Type - deixar o browser definir automaticamente para multipart/form-data
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao adicionar vídeos: ${response.status} - ${errorData.message || errorData.detail || ""}`)
      }

      const data = await response.json()
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId })
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchTalentVideos = async (talentId) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")
      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/talents/${talentId}/videos`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`Erro ao buscar vídeos do talento: ${response.status}`)
      const data = await response.json()
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchTalentVideosProxy = async (talentId) => {
    setError(null)
    try {
      console.log(`Buscando vídeos do talento ${talentId} da rota pública...`)
      const response = await fetch(
        `https://working-lucky-ringtail.ngrok-free.app/api/v1/proxy/talents/${talentId}/videos`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      )
      console.log(`Response status para vídeos do talento ${talentId}:`, response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Erro na resposta para vídeos do talento ${talentId}:`, errorText)
        throw new Error(`Erro ao buscar vídeos do talento: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      console.log(`Vídeos do talento ${talentId}:`, data)
      return data
    } catch (error) {
      console.error(`Erro ao buscar vídeos do talento ${talentId}:`, error)
      setError(error.message)
      throw error
    }
  }

  const deleteTalentVideo = async (talentId, videoId) => {
    setLoading(true)
    setError(null)
    try {
      if (!token) throw new Error("Token de autenticação não encontrado")
      const response = await fetch(
        `https://working-lucky-ringtail.ngrok-free.app/api/v1/talents/${talentId}/videos/${videoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        },
      )
      if (!response.ok) throw new Error(`Erro ao excluir vídeo: ${response.status}`)
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId })
      return true
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ===== FUNÇÕES CRUD PARA TRABALHOS ANTERIORES =====

  // Buscar todos os trabalhos anteriores de um talento
  const fetchPreviousJobs = async (talentId) => {
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/previous_jobs/${talentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",

        },
      })

      if (!response.ok) throw new Error(`Erro ao buscar trabalhos anteriores: ${response.status}`)

      const data = await response.json()
      console.log(`Trabalhos anteriores do talento ${talentId}:`, data)
      return data
    } catch (error) {
      console.error(`Erro ao buscar trabalhos anteriores do talento ${talentId}:`, error)
      setError(error.message)
      throw error
    }
  }

  const fetchPreviousJobsProxy = async (talentId) => {
    setError(null)
    try {
      console.log(`Buscando trabalhos anteriores do talento ${talentId} da rota pública...`)
      const response = await fetch(
        `https://working-lucky-ringtail.ngrok-free.app/api/v1/proxy/talents/${talentId}/previous_jobs`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      )
      console.log(`Response status para trabalhos anteriores do talento ${talentId}:`, response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Erro na resposta para trabalhos anteriores do talento ${talentId}:`, errorText)
        throw new Error(`Erro ao buscar trabalhos anteriores: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      console.log(`Trabalhos anteriores do talento ${talentId}:`, data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erro ao buscar trabalhos anteriores do talento ${talentId}:`, error)
      setError(error.message)
      throw error
    }
  }

  // Buscar um trabalho anterior específico
  const fetchPreviousJobById = async (previousJobId) => {
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const response = await fetch(
        `https://working-lucky-ringtail.ngrok-free.app/api/v1/previous_jobs/${previousJobId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      )

      if (!response.ok) throw new Error(`Erro ao buscar trabalho anterior: ${response.status}`)

      const data = await response.json()
      console.log(`Trabalho anterior ${previousJobId}:`, data)
      return data
    } catch (error) {
      console.error(`Erro ao buscar trabalho anterior ${previousJobId}:`, error)
      setError(error.message)
      throw error
    }
  }

  // Criar um novo trabalho anterior
  const createPreviousJob = async (talentId, jobDescription) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const requestData = {
        talent_id: Number.parseInt(talentId),
        job_description: jobDescription,
      }

      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/previous_jobs/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao criar trabalho anterior: ${response.status} - ${errorData.detail || ""}`)
      }

      const data = await response.json()
      console.log("Trabalho anterior criado:", data)
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId })
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Atualizar um trabalho anterior
  const updatePreviousJob = async (previousJobId, talentId, jobDescription) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const requestData = {
        talent_id: Number.parseInt(talentId),
        job_description: jobDescription,
      }

      const response = await fetch(
        `https://working-lucky-ringtail.ngrok-free.app/api/v1/previous_jobs/${previousJobId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao atualizar trabalho anterior: ${response.status} - ${errorData.detail || ""}`)
      }

      const data = await response.json()
      console.log("Trabalho anterior atualizado:", data)
      if (notifyTalentUpdated) notifyTalentUpdated({ id: talentId })
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Deletar um trabalho anterior
  const deletePreviousJob = async (previousJobId) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const response = await fetch(
        `https://working-lucky-ringtail.ngrok-free.app/api/v1/previous_jobs/${previousJobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) throw new Error(`Erro ao excluir trabalho anterior: ${response.status}`)

      const data = await response.json()
      console.log("Trabalho anterior excluído:", data)
      if (notifyTalentUpdated) notifyTalentUpdated({ id: data.talent_id })
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const openModal = (talent) => {
    setSelectedTalent(talent)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedTalent(null), 300)
  }

  const openEditModal = (id) => {
    setEditingTalentId(id)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingTalentId(null)
  }

  const value = {
    talents,
    loading,
    loadingTalentId,
    error,
    selectedTalent,
    isModalOpen,
    openModal,
    closeModal,
    fetchTalents,
    fetchTalentById,
    createTalent,
    updateTalent,
    deleteTalent,
    toggleHighlight,
    importFromManager,
    isEditModalOpen,
    editingTalentId,
    openEditModal,
    closeEditModal,
    addTalentPhotos,
    fetchTalentPhotos,
    deleteTalentPhoto,
    addTalentVideos,
    fetchTalentVideos,
    fetchTalentVideosProxy, // Adicionando nova função proxy para vídeos
    deleteTalentVideo,
    // Funções de trabalhos anteriores
    fetchPreviousJobs,
    fetchPreviousJobsProxy, // Adicionando nova função proxy para trabalhos anteriores
    fetchPreviousJobById,
    createPreviousJob,
    updatePreviousJob,
    deletePreviousJob,
  }

  return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>
}
