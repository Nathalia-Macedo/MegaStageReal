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

      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch("https://megastage.onrender.com/api/v1/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`)
      }

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

      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch(`https://megastage.onrender.com/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao excluir usuário: ${response.status}`)
      }

      // Atualiza a lista de usuários após a exclusão
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

      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch("https://megastage.onrender.com/api/v1/users", {
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

  // Na função updateUser, verifique se o token está sendo obtido corretamente
  // e se os dados estão sendo enviados no formato correto

  // Substitua a função updateUser atual por esta versão corrigida:
  const updateUser = useCallback(
    async (userId, userData) => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("Token de autenticação não encontrado")
        }

        // Garantir que a foto seja uma string base64 válida
        let photoBase64 = userData.photo

        // Se a foto for um objeto File, converta para base64
        if (userData.photo instanceof File) {
          photoBase64 = await convertToBase64(userData.photo)
        }

        // Preparar os dados para envio à API no formato correto
        const updateData = {
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          photo: photoBase64,
        }

        console.log("", {
          ...updateData,
          photo: updateData.photo ? `${updateData.photo.substring(0, 30)}...` : null,
        })

        const response = await fetch(`https://megastage.onrender.com/api/v1/users/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Erro ao atualizar usuário: ${response.status}`)
        }

        const updatedUser = await response.json()

        // Atualizar a lista de usuários
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedUser } : user)))

        // Atualizar o usuário no localStorage/sessionStorage se for o usuário atual
        if (currentUser && currentUser.id === userId) {
          const updatedCurrentUser = {
            ...currentUser,
            email: updatedUser.email || userData.email,
            name: updatedUser.first_name || userData.first_name,
            last_name: updatedUser.last_name || userData.last_name,
            photo: updatedUser.photo || photoBase64,
          }

          // Atualizar no localStorage
          localStorage.setItem("token", JSON.stringify(updatedCurrentUser))

          // Atualizar o estado do usuário no contexto de autenticação
          if (setCurrentUser) {
            setCurrentUser(updatedCurrentUser)
          }
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

  // Adicione esta função auxiliar para converter arquivos para base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null)
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

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
