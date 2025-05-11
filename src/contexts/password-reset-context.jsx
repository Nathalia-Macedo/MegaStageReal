"use client"

import { createContext, useContext, useState } from "react"

const PasswordResetContext = createContext(undefined)

export function PasswordResetProvider({ children }) {
  const [resetStatus, setResetStatus] = useState({
    success: false,
    error: false,
    message: null,
  })

  const clearStatus = () => {
    setResetStatus({
      success: false,
      error: false,
      message: null,
    })
  }

  const requestPasswordReset = async (email) => {
    clearStatus()

    try {
      // Obter o token do localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch("https://megastage.onrender.com/api/v1/password-reset/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      // Log para verificar o formato da resposta

      if (!response.ok) {
        throw new Error(data.message || "Erro ao solicitar redefinição de senha")
      }

      setResetStatus({
        success: true,
        error: false,
        message: data.message || "E-mail de redefinição enviado com sucesso!",
      })

      return data
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error)

      setResetStatus({
        success: false,
        error: true,
        message: error.message || "Ocorreu um erro ao processar sua solicitação",
      })

      throw error
    }
  }

  // Nova função para confirmar a redefinição de senha
  const confirmPasswordReset = async (resetToken, newPassword) => {
    clearStatus()

    try {
      // Obter o token do localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const response = await fetch("https://megastage.onrender.com/api/v1/password-reset/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: newPassword,
        }),
      })

      const data = await response.json()

      // Log para verificar o formato da resposta

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha")
      }

      setResetStatus({
        success: true,
        error: false,
        message: data.message || "Senha redefinida com sucesso!",
      })

      return data
    } catch (error) {
      console.error("Erro ao redefinir senha:", error)

      setResetStatus({
        success: false,
        error: true,
        message: error.message || "Ocorreu um erro ao redefinir sua senha",
      })

      throw error
    }
  }

  return (
    <PasswordResetContext.Provider value={{ requestPasswordReset, confirmPasswordReset, resetStatus, clearStatus }}>
      {children}
    </PasswordResetContext.Provider>
  )
}

export function usePasswordReset() {
  const context = useContext(PasswordResetContext)

  if (context === undefined) {
    throw new Error("usePasswordReset deve ser usado dentro de um PasswordResetProvider")
  }

  return context
}
