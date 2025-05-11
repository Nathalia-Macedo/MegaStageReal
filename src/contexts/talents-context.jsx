// // import { createContext, useContext, useState } from "react"
// // import { useNotifications } from "./notification-context"

// // const TalentContext = createContext()

// // export const useTalent = () => useContext(TalentContext)

// // export const TalentProvider = ({ children }) => {
// //   const [token, setToken] = useState(() => localStorage.getItem("token")) // Assuming you have a token
// //   const [talents, setTalents] = useState([])
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState(null)
// //   const [selectedTalent, setSelectedTalent] = useState(null)
// //   const [isModalOpen, setIsModalOpen] = useState(false)
// //   const { notifyTalentUpdated, notifyTalentCreated, notifyTalentDeleted, notifyTalentHighlighted } =
// //     useNotifications || {}

// //   const fetchTalents = async () => {
// //     setLoading(true)
// //     setError(null)

// //     try {
// //       if (!token) {
// //         throw new Error("Token de autenticação não encontrado")
// //       }

// //       const response = await fetch("https://megastage.onrender.com/api/v1/talents", {
// //         method: "GET",
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       })

// //       if (!response.ok) {
// //         throw new Error(`Erro ao buscar talentos: ${response.status}`)
// //       }

// //       const data = await response.json()
// //       const filteredData = data.filter((talent) => talent.category === "STAGE"|| talent.category==="MEGASTAGE")
// //       setTalents(filteredData)
// //       return filteredData
// //     } catch (error) {
// //       setError(error.message)
// //       throw error // Relança o erro para ser tratado pelo consumidor
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const openModal = (talent) => {
// //     setSelectedTalent(talent)
// //     setIsModalOpen(true)
// //   }

// //   const closeModal = () => {
// //     setIsModalOpen(false)
// //     setSelectedTalent(null)
// //   }

// //   const fetchTalentById = async (id) => {
// //     setLoading(true)
// //     setError(null)

// //     try {
// //       if (!token) {
// //         throw new Error("Token de autenticação não encontrado")
// //       }

// //       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
// //         method: "GET",
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       })

// //       if (!response.ok) {
// //         throw new Error(`Erro ao buscar talento: ${response.status}`)
// //       }

// //       const data = await response.json()
// //       return data
// //     } catch (error) {
// //       setError(error.message)
// //       throw error
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const createTalent = async (talentData) => {
// //     setLoading(true)
// //     setError(null)

// //     try {
// //       if (!token) {
// //         throw new Error("Token de autenticação não encontrado")
// //       }

// //       // Preparar os dados para envio à API
// //       const apiTalentData = {
// //         name: talentData.name,
// //         birth_date: talentData.birth_date,
// //         height: talentData.height,
// //         eye_color: talentData.eye_color,
// //         hair_color: talentData.hair_color,
// //         can_sing: talentData.can_sing,
// //         instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
// //         languages: Array.isArray(talentData.languages) ? talentData.languages : [],
// //         ativo: talentData.ativo,
// //         disponivel: talentData.disponivel,
// //         data_disponibilidade: talentData.data_disponibilidade || "",
// //         destaque: talentData.destaque,
// //         category: "MEGASTAGE",
// //         cover: talentData.cover, // Incluir a imagem em base64
// //         instagram: talentData.instagram || "",
// //         tipo_talento: talentData.type || "Ator", // Usar o tipo do talento (Ator/Atriz)
// //       }


// //       const response = await fetch("https://megastage.onrender.com/api/v1/talents", {
// //         method: "POST",
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(apiTalentData),
// //       })

// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({}))
// //         throw new Error(`Erro ao criar talento: ${response.status} - ${errorData.message || ""}`)
// //       }

// //       const data = await response.json()
// //       // Notificar criação de talento para atualizar notificações
// //       if (notifyTalentCreated) {
// //         notifyTalentCreated(data)
// //       }

// //       await fetchTalents()
// //       return data
// //     } catch (error) {
// //       setError(error.message)
// //       throw error
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const updateTalent = async (id, talentData) => {
// //     setLoading(true)
// //     setError(null)

// //     try {
// //       if (!token) {
// //         throw new Error("Token de autenticação não encontrado")
// //       }

// //       const apiTalentData = {
// //         name: talentData.name,
// //         birth_date: talentData.birth_date,
// //         height: talentData.height,
// //         eye_color: talentData.eye_color,
// //         hair_color: talentData.hair_color,
// //         can_sing: talentData.can_sing,
// //         instruments: Array.isArray(talentData.instruments) ? talentData.instruments : [],
// //         languages: Array.isArray(talentData.languages) ? talentData.languages : [],
// //         ativo: talentData.ativo,
// //         disponivel: talentData.disponivel,
// //         data_disponibilidade: talentData.data_disponibilidade || "",
// //         destaque: talentData.destaque,
// //         category: talentData.category,
// //         cover: talentData.cover, // Incluir a imagem em base64
// //         instagram: talentData.instagram || "",
// //         tipo_talento: talentData.type || "Ator", // Usar o tipo do talento (Ator/Atriz)
// //       }

// //       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
// //         method: "PUT",
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(apiTalentData),
// //       })

// //       if (!response.ok) {
// //         throw new Error(`Erro ao atualizar talento: ${response.status}`)
// //       }

// //       const data = await response.json()

// //       // Notificar atualização de talento para atualizar notificações
// //       if (notifyTalentUpdated) {
// //         notifyTalentUpdated(data)
// //       }

// //       await fetchTalents()
// //       return data
// //     } catch (error) {
// //       setError(error.message)
// //       throw error
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const deleteTalent = async (id) => {
// //     setLoading(true)
// //     setError(null)

// //     try {
// //       if (!token) {
// //         throw new Error("Token de autenticação não encontrado")
// //       }

// //       const response = await fetch(`https://megastage.onrender.com/api/v1/talents/${id}`, {
// //         method: "DELETE",
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       })

// //       if (!response.ok) {
// //         throw new Error(`Erro ao excluir talento: ${response.status}`)
// //       }

// //       // Notificar exclusão de talento para atualizar notificações
// //       if (notifyTalentDeleted) {
// //         notifyTalentDeleted(id)
// //       }

// //       // Atualizar a lista de talentos após a exclusão
// //       setTalents(talents.filter((talent) => talent.id !== id))

// //       return true
// //     } catch (error) {
// //       setError(error.message)
// //       throw error
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const toggleHighlight = async (id, isHighlighted) => {
// //     try {
// //       // Atualizar o estado local imediatamente para feedback visual rápido
// //       setTalents((prevTalents) =>
// //         prevTalents.map((talent) => (talent.id === id ? { ...talent, destaque: !isHighlighted } : talent)),
// //       )

// //       // Obter os dados completos do talento
// //       const talent = await fetchTalentById(id)

// //       // Preparar os dados para atualização, alterando apenas o campo destaque
// //       const updateData = {
// //         ...talent,
// //         destaque: !isHighlighted,
// //       }

// //       // Enviar a atualização para a API
// //       const updatedTalent = await updateTalent(id, updateData)

// //       // Notificar destaque de talento para atualizar notificações
// //       if (notifyTalentHighlighted) {
// //         notifyTalentHighlighted(updatedTalent)
// //       }

// //       return true
// //     } catch (error) {
// //       // Em caso de erro, reverter a alteração local
// //       setTalents((prevTalents) =>
// //         prevTalents.map((talent) => (talent.id === id ? { ...talent, destaque: isHighlighted } : talent)),
// //       )
// //       console.error("Erro ao alternar destaque:", error)
// //       throw error
// //     }
// //   }

// //   const value = {
// //     talents,
// //     loading,
// //     error,
// //     selectedTalent,
// //     isModalOpen,
// //     openModal,
// //     closeModal,
// //     fetchTalents,
// //     fetchTalentById,
// //     createTalent,
// //     updateTalent,
// //     deleteTalent,
// //     toggleHighlight,
// //   }

// //   return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>
// // }



// "use client"

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

//   const openModal = (talent) => {
//     setSelectedTalent(talent)
//     setIsModalOpen(true)
//   }

//   const closeModal = () => {
//     setIsModalOpen(false)
//     setSelectedTalent(null)
//   }

//   const fetchTalentById = async (id) => {
//     setLoading(true)
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
//       setLoading(false)
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

//   const value = {
//     talents,
//     loading,
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
//   }

//   return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>
// }
"use client"

import { createContext, useContext, useState } from "react"
import { useNotifications } from "./notification-context"

const TalentContext = createContext()

export const useTalent = () => useContext(TalentContext)

export const TalentProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token")) // Assuming you have a token
  const [talents, setTalents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { notifyTalentUpdated, notifyTalentCreated, notifyTalentDeleted, notifyTalentHighlighted } =
    useNotifications || {}

  const fetchTalents = async () => {
    // Evitar definir loading se já estiver carregando
    if (loading) return talents

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

      // Atualizar o estado em uma única operação para evitar re-renderizações
      setTalents(filteredData)

      // Pequeno atraso antes de desativar o estado de carregamento
      // para evitar flashes na interface
      setTimeout(() => {
        setLoading(false)
      }, 50)

      return filteredData
    } catch (error) {
      setError(error.message)
      setLoading(false)
      throw error // Relança o erro para ser tratado pelo consumidor
    }
  }

  const openModal = (talent) => {
    setSelectedTalent(talent)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTalent(null)
  }

  const fetchTalentById = async (id) => {
    // Não definir loading global para busca de um único talento
    // para evitar re-renderização de toda a lista
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
    }
  }

  const createTalent = async (talentData) => {
    setLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      // Preparar os dados para envio à API
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
        cover: talentData.cover, // Incluir a imagem em base64
        instagram: talentData.instagram || "",
        tipo_talento: talentData.type || "Ator", // Usar o tipo do talento (Ator/Atriz)
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
      // Notificar criação de talento para atualizar notificações
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
        cover: talentData.cover, // Incluir a imagem em base64
        instagram: talentData.instagram || "",
        tipo_talento: talentData.type || "Ator", // Usar o tipo do talento (Ator/Atriz)
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

      // Notificar atualização de talento para atualizar notificações
      if (notifyTalentUpdated) {
        notifyTalentUpdated(data)
      }

      // Só recarrega todos os talentos se skipFetch for false
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

      // Notificar exclusão de talento para atualizar notificações
      if (notifyTalentDeleted) {
        notifyTalentDeleted(id)
      }

      // Atualizar a lista de talentos após a exclusão
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
      // Atualizar o estado local imediatamente para feedback visual rápido
      setTalents((prevTalents) =>
        prevTalents.map((talent) => (talent.id === id ? { ...talent, destaque: !isHighlighted } : talent)),
      )

      // Obter os dados completos do talento
      const talent = await fetchTalentById(id)

      // Preparar os dados para atualização, alterando apenas o campo destaque
      const updateData = {
        ...talent,
        destaque: !isHighlighted,
      }

      // Enviar a atualização para a API, mas pular a recarga completa dos talentos
      const updatedTalent = await updateTalent(id, updateData, true)

      // Notificar destaque de talento para atualizar notificações
      if (notifyTalentHighlighted) {
        notifyTalentHighlighted(updatedTalent)
      }

      return true
    } catch (error) {
      // Em caso de erro, reverter a alteração local
      setTalents((prevTalents) =>
        prevTalents.map((talent) => (talent.id === id ? { ...talent, destaque: isHighlighted } : talent)),
      )
      console.error("Erro ao alternar destaque:", error)
      throw error
    }
  }

  const value = {
    talents,
    loading,
    error,
    setLoading,
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
  }

  return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>
}
