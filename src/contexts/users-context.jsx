// import { createContext, useContext, useState, useCallback } from "react"
// import { toast } from "react-toastify"
// import { useAuth } from "./auth-context"

// const UsersContext = createContext()

// export function UsersProvider({ children }) {
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const { user: currentUser, setUser: setCurrentUser } = useAuth()

//   const fetchUsers = useCallback(async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const token = localStorage.getItem("token")
//       if (!token) throw new Error("Token de autenticação não encontrado")

//       const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/users", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) throw new Error(`Erro ao buscar usuários: ${response.status}`)

//       const data = await response.json()
//       setUsers(data)
//       return data
//     } catch (error) {
//       console.error("Erro ao buscar usuários:", error)
//       setError(error.message)
//       toast.error(`Erro ao carregar usuários: ${error.message}`)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const deleteUser = useCallback(async (userId) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const token = localStorage.getItem("token")
//       if (!token) throw new Error("Token de autenticação não encontrado")

//       const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/users/${userId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) throw new Error(`Erro ao excluir usuário: ${response.status}`)

//       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
//       toast.success("Usuário excluído com sucesso!")
//       return true
//     } catch (error) {
//       console.error("Erro ao excluir usuário:", error)
//       setError(error.message)
//       toast.error(`Erro ao excluir usuário: ${error.message}`)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const createUser = useCallback(async (userData) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const token = localStorage.getItem("token")
//       if (!token) throw new Error("Token de autenticação não encontrado")

//       const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/users", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.message || `Erro ao criar usuário: ${response.status}`)
//       }

//       const newUser = await response.json()
//       setUsers((prevUsers) => [...prevUsers, newUser])
//       toast.success("Usuário criado com sucesso!")
//       return newUser
//     } catch (error) {
//       console.error("Erro ao criar usuário:", error)
//       setError(error.message)
//       toast.error(`Erro ao criar usuário: ${error.message}`)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const updateUser = useCallback(async (userId, userData) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const token = localStorage.getItem("token")
//       if (!token) throw new Error("Token de autenticação não encontrado")

//       const formData = new FormData()
//       formData.append("email", userData.email || "")
//       formData.append("first_name", userData.first_name || "")
//       formData.append("last_name", userData.last_name || "")

//       if (userData.photo) {
//         if (userData.photo instanceof File) {
//           formData.append("photo", userData.photo)
//         } else if (typeof userData.photo === "string" && userData.photo.startsWith("data:image/")) {
//           const byteString = atob(userData.photo.split(",")[1])
//           const mimeString = userData.photo.split(",")[0].split(":")[1].split(";")[0]
//           const ab = new ArrayBuffer(byteString.length)
//           const ia = new Uint8Array(ab)
//           for (let i = 0; i < byteString.length; i++) {
//             ia[i] = byteString.charCodeAt(i)
//           }
//           const blob = new Blob([ab], { type: mimeString })
//           formData.append("photo", blob, "photo.jpg")
//         }
//       }

//       const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/users/${userId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.message || `Erro ao atualizar usuário: ${response.status}`)
//       }

//       const updatedUser = await response.json()
//       setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedUser } : user)))

//       if (currentUser && currentUser.id === userId) {
//         const updatedCurrentUser = {
//           ...currentUser,
//           email: updatedUser.email || userData.email,
//           name: updatedUser.first_name || userData.first_name,
//           last_name: updatedUser.last_name || userData.last_name,
//           photo: updatedUser.photo || userData.photo,
//         }

//         localStorage.setItem("user", JSON.stringify(updatedCurrentUser))
//         if (setCurrentUser) setCurrentUser(updatedCurrentUser)
//       }

//       toast.success("Usuário atualizado com sucesso!")
//       return updatedUser
//     } catch (error) {
//       console.error("Erro ao atualizar usuário:", error)
//       setError(error.message)
//       toast.error(`Erro ao atualizar usuário: ${error.message}`)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }, [currentUser, setCurrentUser])

//   const value = {
//     users,
//     loading,
//     error,
//     fetchUsers,
//     deleteUser,
//     createUser,
//     updateUser,
//   }

//   return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
// }

// export function useUsers() {
//   const context = useContext(UsersContext)
//   if (context === undefined) {
//     throw new Error("useUsers deve ser usado dentro de um UsersProvider")
//   }
//   return context
// }
"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAuth } from "./auth-context"

const UsersContext = createContext()

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user: currentUser, setUser: setCurrentUser } = useAuth()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error(`Erro ao buscar usuários: ${response.status}`)

      const data = await response.json()
      setUsers(data)
      return data
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      setError(error.message)
      toast.error(`Erro ao carregar usuários: ${error.message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (userId) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error(`Erro ao excluir usuário: ${response.status}`)

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
      toast.success("Usuário excluído com sucesso!")
      return true
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
      setError(error.message)
      toast.error(`Erro ao excluir usuário: ${error.message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = useCallback(async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token de autenticação não encontrado")

      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao criar usuário: ${response.status}`)
      }

      const newUser = await response.json()
      setUsers((prevUsers) => [...prevUsers, newUser])
      toast.success("Usuário criado com sucesso!")
      return newUser
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      setError(error.message)
      toast.error(`Erro ao criar usuário: ${error.message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(
    async (userId, userData) => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Token de autenticação não encontrado")

        const formData = new FormData()
        formData.append("email", userData.email || "")
        formData.append("first_name", userData.first_name || "")
        formData.append("last_name", userData.last_name || "")

        if (userData.photo) {
          if (userData.photo instanceof File) {
            formData.append("photo", userData.photo)
          } else if (typeof userData.photo === "string" && userData.photo.startsWith("data:image/")) {
            const byteString = atob(userData.photo.split(",")[1])
            const mimeString = userData.photo.split(",")[0].split(":")[1].split(";")[0]
            const ab = new ArrayBuffer(byteString.length)
            const ia = new Uint8Array(ab)
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i)
            }
            const blob = new Blob([ab], { type: mimeString })
            formData.append("photo", blob, "photo.jpg")
          }
        }

        const response = await fetch(`https://working-lucky-ringtail.ngrok-free.app/api/v1/users/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Erro ao atualizar usuário: ${response.status}`)
        }

        const updatedUser = await response.json()
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedUser } : user)))

        if (currentUser && currentUser.id === userId) {
          const updatedCurrentUser = {
            ...currentUser,
            email: updatedUser.email || userData.email,
            name: updatedUser.first_name || userData.first_name,
            last_name: updatedUser.last_name || userData.last_name,
            photo: updatedUser.photo || userData.photo,
          }

          localStorage.setItem("user", JSON.stringify(updatedCurrentUser))
          if (setCurrentUser) setCurrentUser(updatedCurrentUser)
        }

        toast.success("Usuário atualizado com sucesso!")
        return updatedUser
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error)
        setError(error.message)
        toast.error(`Erro ao atualizar usuário: ${error.message}`)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [currentUser, setCurrentUser],
  )

  const value = {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
    createUser,
    updateUser,
  }

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers deve ser usado dentro de um UsersProvider")
  }
  return context
}
