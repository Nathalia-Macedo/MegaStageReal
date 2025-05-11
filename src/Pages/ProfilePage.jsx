"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/auth-context"
import { useUsers } from "../contexts/users-context"
import { toast } from "react-toastify"
import { User, Mail, Edit2, Camera, Save, X, Loader2, ArrowLeft, CheckCircle, AlertCircle,Upload,ImageIcon } from "lucide-react"

export default function ProfilePage({ onBack }) {
  const { user } = useAuth()
  const { updateUser, loading } = useUsers()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    photo: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  // Inicializar o formulário com os dados do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        first_name: user.name || "",
        last_name: user.last_name || "",
        photo: user.photo || "",
      })
      setPreviewImage(user.photo || null)
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpar erro do campo quando o usuário digitar
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    processFile(file)
  }

  const processFile = (file) => {
    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
    if (!validTypes.includes(file.type)) {
      toast.error("Formato de arquivo inválido. Use JPG, PNG ou GIF.")
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.")
      return
    }

    // Criar URL para preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result)
      setFormData((prev) => ({
        ...prev,
        photo: reader.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.email) errors.email = "Email é obrigatório"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email inválido"

    if (!formData.first_name) errors.first_name = "Nome é obrigatório"
    if (!formData.last_name) errors.last_name = "Sobrenome é obrigatório"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSaving(true)
    try {
      await updateUser(user.id, formData)
      toast.success("Perfil atualizado com sucesso!")
      setIsEditing(false)
    } catch (err) {
      toast.error(`Erro ao atualizar perfil: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Restaurar dados originais
    if (user) {
      setFormData({
        email: user.email || "",
        first_name: user.name || "",
        last_name: user.last_name || "",
        photo: user.photo || "",
      })
      setPreviewImage(user.photo || null)
    }
    setFormErrors({})
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-pink-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Meu Perfil</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-auto flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Editar Perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da foto de perfil */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Foto de Perfil</h2>

            <div
              ref={dropZoneRef}
              className={`relative rounded-lg overflow-hidden ${isEditing ? "cursor-pointer" : ""} ${
                isDragging ? "border-2 border-dashed border-pink-500 bg-pink-50" : "border border-gray-200"
              }`}
              onClick={isEditing ? triggerFileInput : undefined}
              onDragEnter={isEditing ? handleDragEnter : undefined}
              onDragLeave={isEditing ? handleDragLeave : undefined}
              onDragOver={isEditing ? handleDragOver : undefined}
              onDrop={isEditing ? handleDrop : undefined}
            >
              <div className="aspect-square w-full flex items-center justify-center bg-gray-100">
                {previewImage ? (
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt={`${formData.first_name} ${formData.last_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f0f0f0"/><text x="50%" y="50%" fontFamily="Arial" fontSize="72" fill="%23a0a0a0" textAnchor="middle" dy=".3em">${formData.first_name.charAt(0)}</text></svg>`
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <User className="h-20 w-20 text-gray-300 mb-4" />
                    <p className="text-gray-500">Nenhuma foto de perfil</p>
                  </div>
                )}

                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <Upload className="h-12 w-12 mb-2" />
                    <p className="text-sm font-medium">
                      {isDragging ? "Solte a imagem aqui" : "Clique ou arraste uma imagem"}
                    </p>
                    <p className="text-xs mt-1 max-w-xs text-center text-gray-200">JPG, PNG ou GIF (máx. 5MB)</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/jpeg, image/png, image/jpg, image/gif"
              />
            </div>

            {isEditing && (
              <div className="mt-4">
                <button
                  onClick={triggerFileInput}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Selecionar Imagem
                </button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Uma foto de perfil profissional melhora sua identificação no sistema
                </p>
              </div>
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">Suas informações são usadas apenas dentro do sistema MegaStage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna das informações pessoais */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Informações Pessoais</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`pl-10 block w-full rounded-md border ${
                        formErrors.first_name ? "border-red-300" : "border-gray-300"
                      } ${
                        !isEditing ? "bg-gray-50 text-gray-500" : "bg-white text-gray-900"
                      } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5`}
                      placeholder="Nome"
                    />
                  </div>
                  {formErrors.first_name && <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`block w-full rounded-md border ${
                      formErrors.last_name ? "border-red-300" : "border-gray-300"
                    } ${
                      !isEditing ? "bg-gray-50 text-gray-500" : "bg-white text-gray-900"
                    } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5`}
                    placeholder="Sobrenome"
                  />
                  {formErrors.last_name && <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`pl-10 block w-full rounded-md border ${
                        formErrors.email ? "border-red-300" : "border-gray-300"
                      } ${
                        !isEditing ? "bg-gray-50 text-gray-500" : "bg-white text-gray-900"
                      } focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5`}
                      placeholder="usuario@exemplo.com"
                    />
                  </div>
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-pink-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>

            {!isEditing && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">Informações da Conta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">ID do Usuário</p>
                    <p className="font-medium text-gray-700">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tipo de Conta</p>
                    <p className="font-medium text-gray-700">Administrador</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
