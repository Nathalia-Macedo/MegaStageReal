"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import PasswordResetPage from "./PasswordPage"
export default function LoginPage({ onSuccessfulLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)
  const [showResetPage, setShowResetPage] = useState(false)
  const [errors, setErrors] = useState({})

  const { login, loading, error, forgotPassword } = useAuth()

  const validateForm = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido"
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateResetEmail = () => {
    const newErrors = {}

    if (!resetEmail) {
      newErrors.resetEmail = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      newErrors.resetEmail = "Email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const response = await login(email, password, rememberMe)

      // Salvar o token no localStorage
      if (response && response.token) {
        localStorage.setItem("token", response.token)
      }

      // Chama a função de callback após login bem-sucedido
      if (onSuccessfulLogin) {
        onSuccessfulLogin()
      }
    } catch (err) {
      // O erro já é tratado no contexto
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()

    if (!validateResetEmail()) return

    try {
      await forgotPassword(resetEmail)
      setResetSent(true)
      // Mostrar a página de redefinição de senha com os três campos
      setShowResetPage(true)
    } catch (err) {
      setErrors({ resetEmail: err.message })
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleBackToLogin = () => {
    setForgotPasswordMode(false)
    setResetSent(false)
    setShowResetPage(false)
  }

  // Se estiver na página de redefinição de senha, mostrar o componente PasswordResetPage
  if (showResetPage) {
    return <PasswordResetPage onBackToLogin={handleBackToLogin} />
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

          {!forgotPasswordMode ? (
            <>
              <h2 className="mt-2 text-2xl font-bold text-white">Bem-vindo de volta</h2>
              <p className="mt-2 text-sm text-gray-400">Entre com suas credenciais para acessar sua conta</p>
            </>
          ) : (
            <>
              <h2 className="mt-2 text-2xl font-bold text-white">Recuperar senha</h2>
              <p className="mt-2 text-sm text-gray-400">Enviaremos instruções para o seu email</p>
            </>
          )}
        </div>

        {!forgotPasswordMode ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Senha
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-700"
                    } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="••••••••"
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
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 rounded bg-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Lembrar-me
                </label>
              </div>

              <button
                type="button"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                onClick={() => {
                  setForgotPasswordMode(true)
                  setResetEmail(email)
                }}
              >
                Esqueceu sua senha?
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded-md">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            {!resetSent ? (
              <>
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.resetEmail ? "border-red-500" : "border-gray-700"
                      } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="seu@email.com"
                    />
                    {errors.resetEmail && <p className="mt-1 text-sm text-red-500">{errors.resetEmail}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                    onClick={() => setForgotPasswordMode(false)}
                  >
                    Voltar ao login
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Enviar instruções
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-500/20 border border-green-500 rounded-md">
                  <p className="text-sm text-green-500">
                    Enviamos instruções para recuperar sua senha para o email {resetEmail}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    onClick={() => setShowResetPage(true)}
                  >
                    Continuar para redefinição
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 border border-gray-700 rounded-md text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    onClick={() => {
                      setForgotPasswordMode(false)
                      setResetSent(false)
                    }}
                  >
                    Voltar ao login
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
