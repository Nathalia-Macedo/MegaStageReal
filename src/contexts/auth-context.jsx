import { createContext, useContext, useState, useEffect } from "react"
import { usePasswordReset } from "./password-reset-context"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { requestPasswordReset, confirmPasswordReset: resetPassword, resetStatus } = usePasswordReset()

  // Verificar se o usuário já está logado ao carregar a página
  useEffect(() => {
    const storedAuth = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth)
        setUser(parsedAuth)
      } catch (err) {
        console.error("Erro ao analisar dados de autenticação armazenados:", err)
      }
    }
  }, [])

  const login = async (email, password, rememberMe = false) => {
    setLoading(true)
    setError(null)

    try {
      // Simulação de chamada de API
      const response = await fetch("https://working-lucky-ringtail.ngrok-free.app/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Usuário ou senha incorretos")
      }

      // Armazenar dados do usuário com nome e sobrenome
      const userData = {
        id: data.user_id,
        email: data.email,
        token: data.token,
        name: data.name, // Adicionado o nome
        last_name: data.last_name, // Adicionado o sobrenome
        photo: data.photo, // Adicionado a foto
      }

      // Armazenar no localStorage ou sessionStorage
      if (rememberMe) {
        localStorage.setItem("token", JSON.stringify(userData))
      } else {
        sessionStorage.setItem("token", JSON.stringify(userData))
      }

      // Armazenar o token separadamente para facilitar o acesso
      localStorage.setItem("token", data.token)

      setUser(userData)
      return data
    } catch (err) {
      setError(err.message || "Ocorreu um erro durante o login")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    localStorage.removeItem("token")
    setUser(null)
  }

  const forgotPassword = async (email) => {
    setLoading(true)
    setError(null)

    try {
      await requestPasswordReset(email)
      return { success: true }
    } catch (err) {
      setError(err.message || "Ocorreu um erro ao solicitar redefinição de senha")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const confirmPasswordReset = async (resetToken, newPassword) => {
    setLoading(true)
    setError(null)

    try {
      await resetPassword(resetToken, newPassword)
      return { success: true }
    } catch (err) {
      setError(err.message || "Ocorreu um erro ao redefinir a senha")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Função auxiliar para obter o nome completo do usuário
  const getFullName = () => {
    if (!user) return ""
    return `${user.name || ""} ${user.last_name || ""}`.trim()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // Exportando setUser para permitir atualizações
        loading,
        error,
        resetStatus,
        login,
        logout,
        forgotPassword,
        confirmPasswordReset,
        getFullName, // Adicionada função para obter o nome completo
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }

  return context
}
