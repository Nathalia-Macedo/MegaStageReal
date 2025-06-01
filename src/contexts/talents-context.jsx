// import { createContext, useContext, useState } from "react"
// import { useNotifications } from "./notification-context"

// const TalentContext = createContext()

// export const useTalent = () => useContext(TalentContext)

// export const TalentProvider = ({ children }) => {
//   const [token, setToken] = useState(() => localStorage.getItem("token")) // Assuming you have a token
//   const [talents, setTalents] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [selectedTalent, setSelectedTalent] = useState(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const { notifyTalentUpdated, notifyTalentCreated, notifyTalentDeleted, notifyTalentHighlighted } =
//     useNotifications || {}

//   // Adicionar estado e função para controlar o modal de edição
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [editingTalentId, setEditingTalentId] = useState(null)

//   // Adicionar estado para controlar o carregamento de talentos individuais
//   const [loadingTalentId, setLoadingTalentId] = useState(null)

//   const fetchTalents = async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       const response = await fetch("https://megastage.onrender.com/api/v1/talents", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Erro ao buscar talentos: ${response.status}`)
//       }

//       const data = await response.json()
//       const filteredData = data.filter((talent) => talent.category === "STAGE" || talent.category === "MEGASTAGE")
//       setTalents(filteredData)
//       return filteredData
//     } catch (error) {
//       setError(error.message)
//       throw error // Relança o erro para ser tratado pelo consumidor
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Simplificar a função openModal para evitar múltiplas renderizações
//   const openModal = (talent) => {
//     setSelectedTalent(talent)
//     setIsModalOpen(true)
//   }

//   const closeModal = () => {
//     setIsModalOpen(false)
//     // Aguardar a animação de fechamento antes de limpar o talento selecionado
//     setTimeout(() => {
//       setSelectedTalent(null)
//     }, 300)
//   }

//   // Adicionar função para abrir o modal de edição
//   const openEditModal = (id) => {
//     setEditingTalentId(id)
//     setIsEditModalOpen(true)
//   }

//   // Adicionar função para fechar o modal de edição
//   const closeEditModal = () => {
//     setIsEditModalOpen(false)
//     setEditingTalentId(null)
//   }

//   // Modificar fetchTalentById para usar o estado de carregamento específico
//   const fetchTalentById = async (id) => {
//     setLoadingTalentId(id)
//     setError(null)

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Erro ao buscar talento: ${response.status}`)
//       }

//       const data = await response.json()
//       return data
//     } catch (error) {
//       setError(error.message)
//       throw error
//     } finally {
//       setLoadingTalentId(null)
//     }
//   }

//   const createTalent = async (talentData) => {
//     setLoading(true)
//     setError(null)

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       // Preparar os dados para envio à API
//       const apiTalentData = {
//         name: talentData.name,
//         birth_date: talentData.birth_date,
//         height: talentData.height,
//         eye_color: talentData.eye_color,
//         hair_color: talentData.hair_color,
//         can_sing: talentData.can_sing,
//         instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
//         languages: Array.isArray(talentData.languages) ? talentData.languages : [],
//         ativo: talentData.ativo,
//         disponivel: talentData.disponivel,
//         data_disponibilidade: talentData.data_disponibilidade || "",
//         destaque: talentData.destaque,
//         category: "MEGASTAGE",
//         cover: talentData.cover, // Incluir a imagem em base64
//         instagram: talentData.instagram || "",
//         tipo_talento: talentData.type || "Ator", // Usar o tipo do talento (Ator/Atriz)
//       }

//       const response = await fetch("https://megastage.onrender.com/api/v1/talents", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiTalentData),
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`Erro ao criar talento: ${response.status} - ${errorData.message || ""}`)
//       }

//       const data = await response.json()
//       // Notificar criação de talento para atualizar notificações
//       if (notifyTalentCreated) {
//         notifyTalentCreated(data)
//       }

//       await fetchTalents()
//       return data
//     } catch (error) {
//       setError(error.message)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateTalent = async (id, talentData, skipFetch = false) => {
//     setLoading(true)
//     setError(null)

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       const apiTalentData = {
//         name: talentData.name,
//         birth_date: talentData.birth_date,
//         height: talentData.height,
//         eye_color: talentData.eye_color,
//         hair_color: talentData.hair_color,
//         can_sing: talentData.can_sing,
//         instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
//         languages: Array.isArray(talentData.languages) ? talentData.languages : [],
//         ativo: talentData.ativo,
//         disponivel: talentData.disponivel,
//         data_disponibilidade: talentData.data_disponibilidade || "",
//         destaque: talentData.destaque,
//         category: talentData.category,
//         cover: talentData.cover, // Incluir a imagem em base64
//         instagram: talentData.instagram || "",
//         tipo_talento: talentData.type || "Ator", // Usar o tipo do talento (Ator/Atriz)
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiTalentData),
//       })

//       if (!response.ok) {
//         throw new Error(`Erro ao atualizar talento: ${response.status}`)
//       }

//       const data = await response.json()

//       // Notificar atualização de talento para atualizar notificações
//       if (notifyTalentUpdated) {
//         notifyTalentUpdated(data)
//       }

//       // Só recarrega todos os talentos se skipFetch for false
//       if (!skipFetch) {
//         await fetchTalents()
//       }

//       return data
//     } catch (error) {
//       setError(error.message)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const deleteTalent = async (id) => {
//     setLoading(true)
//     setError(null)

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Erro ao excluir talento: ${response.status}`)
//       }

//       // Notificar exclusão de talento para atualizar notificações
//       if (notifyTalentDeleted) {
//         notifyTalentDeleted(id)
//       }

//       // Atualizar a lista de talentos após a exclusão
//       setTalents(talents.filter((talent) => talent.id !== id))

//       return true
//     } catch (error) {
//       setError(error.message)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleHighlight = async (id, isHighlighted) => {
//     try {
//       // Atualizar o estado local imediatamente para feedback visual rápido
//       setTalents((prevTalents) =>
//         prevTalents.map((talent) => (talent.id === id ? { ...talent, destaque: !isHighlighted } : talent)),
//       )

//       // Obter os dados completos do talento
//       const talent = await fetchTalentById(id)

//       // Preparar os dados para atualização, alterando apenas o campo destaque
//       const updateData = {
//         ...talent,
//         destaque: !isHighlighted,
//       }

//       // Enviar a atualização para a API, mas pular a recarga completa dos talentos
//       const updatedTalent = await updateTalent(id, updateData, true)

//       // Notificar destaque de talento para atualizar notificações
//       if (notifyTalentHighlighted) {
//         notifyTalentHighlighted(updatedTalent)
//       }

//       return true
//     } catch (error) {
//       // Em caso de erro, reverter a alteração local
//       setTalents((prevTalents) =>
//         prevTalents.map((talent) => (talent.id === id ? { ...talent, destaque: isHighlighted } : talent)),
//       )
//       console.error("Erro ao alternar destaque:", error)
//       throw error
//     }
//   }

//   // Adicionar a função importFromManager ao contexto, logo após a função toggleHighlight

//   const importFromManager = async (incremental) => {
//     setLoading(true)
//     setError(null)

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/integration/${incremental}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Erro ao importar talentos do Manager: ${response.status}`)
//       }

//       const data = await response.json()

//       // Atualizar a lista de talentos após a importação
//       await fetchTalents()

//       return {
//         success: true,
//         message: incremental
//           ? `${data.imported || 0} novos talentos importados com sucesso!`
//           : `${data.imported || 0} talentos importados com sucesso!`,
//         count: data.imported || 0,
//       }
//     } catch (error) {
//       setError(error.message)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Adicionar as seguintes funções após a função importFromManager:

//   // Função para adicionar fotos a um talento
//   const addTalentPhotos = async (talentId, photosBase64) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       // Preparar os dados para envio à API
//       const photoData = {
//         photos: photosBase64.map((base64) => ({ image_base64: base64 })),
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(photoData),
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`Erro ao adicionar fotos: ${response.status} - ${errorData.message || ""}`)
//       }

//       const data = await response.json()

//       // Notificar atualização de talento
//       if (notifyTalentUpdated) {
//         notifyTalentUpdated({ id: talentId })
//       }

//       return data
//     } catch (error) {
//       setError(error.message)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Função para buscar fotos de um talento
//   const fetchTalentPhotos = async (talentId) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Erro ao buscar fotos do talento: ${response.status}`)
//       }

//       const data = await response.json()
//       return data
//     } catch (error) {
//       setError(error.message)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Função para excluir uma foto de um talento
//   const deleteTalentPhoto = async (talentId, photoId) => {
//     setLoading(true)
//     setError(null)

//     try {
//       if (!token) {
//         throw new Error("Token de autenticação não encontrado")
//       }

//       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos/${photoId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Erro ao excluir foto: ${response.status}`)
//       }

//       // Notificar atualização de talento
//       if (notifyTalentUpdated) {
//         notifyTalentUpdated({ id: talentId })
//       }

//       return true
//     } catch (error) {
//       setError(error.message)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Adicionar a função importFromManager ao objeto value
//   const value = {
//     talents,
//     loading,
//     loadingTalentId,
//     error,
//     selectedTalent,
//     isModalOpen,
//     openModal,
//     closeModal,
//     fetchTalents,
//     fetchTalentById,
//     createTalent,
//     updateTalent,
//     deleteTalent,
//     toggleHighlight,
//     importFromManager,
//     isEditModalOpen,
//     editingTalentId,
//     openEditModal,
//     closeEditModal,
//     addTalentPhotos,
//     fetchTalentPhotos,
//     deleteTalentPhoto,
//   }

//   return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>
// }

"use client"

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

  const fetchTalents = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch("https://megastage.onrender.com/api/v1/talents", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar talentos: ${response.status}`)
      }

      const data = await response.json()
      const filteredData = data.filter((talent) => talent.category === "STAGE" || talent.category === "MEGASTAGE")
      setTalents(filteredData)
      return filteredData
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
    setTimeout(() => {
      setSelectedTalent(null)
    }, 300)
  }

  const openEditModal = (id) => {
    setEditingTalentId(id)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingTalentId(null)
  }

  const fetchTalentById = async (id) => {
    setLoadingTalentId(id)
    setError(null)

    try {
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
        throw new Error(`Erro ao buscar talento: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoadingTalentId(null)
    }
  }

  const createTalent = async (talentData) => {
    setLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

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

      const response = await fetch("https://megastage.onrender.com/api/v1/talents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiTalentData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao criar talento: ${response.status} - ${errorData.message || ""}`)
      }

      const data = await response.json()
      if (notifyTalentCreated) {
        notifyTalentCreated(data)
      }

      await fetchTalents()
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateTalent = async (id, talentData, skipFetch = false) => {
    setLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

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
        tipo_talento: talentData.type || "Ator",
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiTalentData),
      })

      if (!response.ok) {
        throw new Error(`Erro ao atualizar talento: ${response.status}`)
      }

      const data = await response.json()

      if (notifyTalentUpdated) {
        notifyTalentUpdated(data)
      }

      if (!skipFetch) {
        await fetchTalents()
      }

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteTalent = async (id) => {
    setLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao excluir talento: ${response.status}`)
      }

      if (notifyTalentDeleted) {
        notifyTalentDeleted(id)
      }

      setTalents(talents.filter((talent) => talent.id !== id))
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
      setTalents((prevTalents) =>
        prevTalents.map((talent) => (talent.id === id ? { ...talent, destaque: !isHighlighted } : talent)),
      )

      const talent = await fetchTalentById(id)
      const updateData = {
        ...talent,
        destaque: !isHighlighted,
      }

      const updatedTalent = await updateTalent(id, updateData, true)

      if (notifyTalentHighlighted) {
        notifyTalentHighlighted(updatedTalent)
      }

      return true
    } catch (error) {
      setTalents((prevTalents) =>
        prevTalents.map((talent) => (talent.id === id ? { ...talent, destaque: isHighlighted } : talent)),
      )
      console.error("Erro ao alternar destaque:", error)
      throw error
    }
  }

  const importFromManager = async (incremental) => {
    setLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/integration/${incremental}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao importar talentos do Manager: ${response.status}`)
      }

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

  // ===== FUNÇÕES PARA FOTOS =====
  const addTalentPhotos = async (talentId, photosBase64) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const photoData = {
        photos: photosBase64.map((base64) => ({ image_base64: base64 })),
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(photoData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao adicionar fotos: ${response.status} - ${errorData.message || ""}`)
      }

      const data = await response.json()

      if (notifyTalentUpdated) {
        notifyTalentUpdated({ id: talentId })
      }

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchTalentPhotos = async (talentId) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar fotos do talento: ${response.status}`)
      }

      const data = await response.json()
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
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao excluir foto: ${response.status}`)
      }

      if (notifyTalentUpdated) {
        notifyTalentUpdated({ id: talentId })
      }

      return true
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ===== FUNÇÕES PARA VÍDEOS =====
  const addTalentVideos = async (talentId, videoUrls) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      // Criar FormData para envio multipart/form-data
      const formData = new FormData()

      // Adicionar cada URL de vídeo ao FormData
      videoUrls.forEach((url) => {
        formData.append("videos", url)
      })

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Não definir Content-Type para FormData - o browser define automaticamente
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao adicionar vídeos: ${response.status} - ${errorData.message || ""}`)
      }

      const data = await response.json()

      if (notifyTalentUpdated) {
        notifyTalentUpdated({ id: talentId })
      }

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
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar vídeos do talento: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteTalentVideo = async (talentId, videoId) => {
    setLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${talentId}/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao excluir vídeo: ${response.status}`)
      }

      if (notifyTalentUpdated) {
        notifyTalentUpdated({ id: talentId })
      }

      return true
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
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
    // Funções de fotos
    addTalentPhotos,
    fetchTalentPhotos,
    deleteTalentPhoto,
    // Funções de vídeos
    addTalentVideos,
    fetchTalentVideos,
    deleteTalentVideo,
  }

  return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>
}
