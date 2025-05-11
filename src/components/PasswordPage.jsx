"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"

export default function PasswordResetPage({ onBackToLogin }) {
  // Estados para os campos
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [resetSuccess, setResetSuccess] = useState(false)

  const { confirmPasswordReset, error } = useAuth()

  const validateForm = () => {
    const newErrors = {}

    if (!resetToken) {
      newErrors.resetToken = "O código de redefinição é obrigatório"
    }

    if (!newPassword) {
      newErrors.newPassword = "A nova senha é obrigatória"
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "A senha deve ter pelo menos 6 caracteres"
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await confirmPasswordReset(resetToken, newPassword)
      setResetSuccess(true)
    } catch (err) {
      // O erro já é tratado no contexto
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800">
        <div className="flex flex-col items-center justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mega%20Stage%20Branco-m7bEuZkcotsi4oqaKuleo1RSShlJTh.png"
            alt="Mega Stage"
            className="h-16 mb-6"
          />

          <h2 className="mt-2 text-2xl font-bold text-white">Redefinir senha</h2>
          <p className="mt-2 text-sm text-gray-400">Digite o código recebido por e-mail e escolha uma nova senha</p>
        </div>

        {resetSuccess ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-500/20 border border-green-500 rounded-md">
              <p className="text-sm text-green-500">
                Sua senha foi redefinida com sucesso! Agora você pode fazer login com sua nova senha.
              </p>
            </div>
            <button
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              onClick={onBackToLogin}
            >
              Voltar ao login
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              {/* Campo para o código de redefinição */}
              <div>
                <label htmlFor="resetToken" className="block text-sm font-medium text-gray-300">
                  Código de redefinição
                </label>
                <div className="mt-1">
                  <input
                    id="resetToken"
                    name="resetToken"
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.resetToken ? "border-red-500" : "border-gray-700"
                    } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Digite o código recebido por e-mail"
                  />
                  {errors.resetToken && <p className="mt-1 text-sm text-red-500">{errors.resetToken}</p>}
                </div>
              </div>

              {/* Campo para a nova senha */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  Nova senha
                </label>
                <div className="mt-1 relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.newPassword ? "border-red-500" : "border-gray-700"
                    } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                  {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
                </div>
              </div>

              {/* Campo para confirmar a senha */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirmar senha
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-700"
                    } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Confirme sua nova senha"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded-md">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                onClick={onBackToLogin}
              >
                Voltar ao login
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? "Processando..." : "Redefinir senha"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
