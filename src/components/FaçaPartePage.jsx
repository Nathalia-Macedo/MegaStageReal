"use client"

import { useState } from "react"
import { Crown, Upload, Mail, Phone, User, FileText, Video, CheckCircle, AlertCircle, MapPin } from "lucide-react"

export default function FacaPartePage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    curriculo: null,
    monologoCaseiro: "",
    apresentacaoCaseira: "",
    linkTrabalho1: "",
    linkTrabalho2: "",
    linkTrabalho3: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Campos obrigatórios
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido"
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório"
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória"
    }

    if (!formData.curriculo) {
      newErrors.curriculo = "Currículo em PDF é obrigatório"
    }

    if (!formData.monologoCaseiro.trim()) {
      newErrors.monologoCaseiro = "Link do monólogo caseiro é obrigatório"
    } else if (!isValidVideoLink(formData.monologoCaseiro)) {
      newErrors.monologoCaseiro = "Link deve ser do Vimeo ou YouTube"
    }

    if (!formData.apresentacaoCaseira.trim()) {
      newErrors.apresentacaoCaseira = "Link da apresentação caseira é obrigatório"
    } else if (!isValidVideoLink(formData.apresentacaoCaseira)) {
      newErrors.apresentacaoCaseira = "Link deve ser do Vimeo ou YouTube"
    }

    // Validar links opcionais se preenchidos
    if (formData.linkTrabalho1 && !isValidVideoLink(formData.linkTrabalho1)) {
      newErrors.linkTrabalho1 = "Link deve ser do Vimeo ou YouTube"
    }
    if (formData.linkTrabalho2 && !isValidVideoLink(formData.linkTrabalho2)) {
      newErrors.linkTrabalho2 = "Link deve ser do Vimeo ou YouTube"
    }
    if (formData.linkTrabalho3 && !isValidVideoLink(formData.linkTrabalho3)) {
      newErrors.linkTrabalho3 = "Link deve ser do Vimeo ou YouTube"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidVideoLink = (url) => {
    return url.includes("vimeo.com") || url.includes("youtube.com") || url.includes("youtu.be")
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, curriculo: file }))
      if (errors.curriculo) {
        setErrors((prev) => ({ ...prev, curriculo: "" }))
      }
    } else {
      setErrors((prev) => ({ ...prev, curriculo: "Apenas arquivos PDF são aceitos" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simular envio do formulário
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Aqui seria implementado o envio real para o email
      console.log("Dados do formulário:", formData)

      setIsSubmitted(true)
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-wide">
            MATERIAL ENVIADO COM <span className="text-amber-500">SUCESSO!</span>
          </h1>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>Obrigado pelo envio do seu material!</strong>
            </p>
            <p className="text-gray-600 leading-relaxed">
              Aguarde, você receberá um e-mail logo que for avaliado.
              <br />
              <span className="text-sm">
                (nosso prazo de retorno pode variar conforme as demandas internas, e lembramos que nenhum valor é
                cobrado para essa avaliação)
              </span>
            </p>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                nome: "",
                email: "",
                telefone: "",
                dataNascimento: "",
                curriculo: null,
                monologoCaseiro: "",
                apresentacaoCaseira: "",
                linkTrabalho1: "",
                linkTrabalho2: "",
                linkTrabalho3: "",
              })
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-black rounded-sm transition-colors font-medium"
          >
            <User className="w-4 h-4" />
            <span className="tracking-wide">ENVIAR NOVO MATERIAL</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-amber-100 border border-amber-200 rounded-full px-6 py-2 mb-8">
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="text-amber-600 font-medium tracking-wide">OPORTUNIDADE EXCLUSIVA</span>
          </div>

          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-8 tracking-tight">
            FAÇA <span className="text-amber-500">PARTE</span>
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-amber-400 to-transparent mx-auto mb-8"></div>

          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Junte-se ao casting mais exclusivo do Brasil. Transforme seu talento em oportunidades reais e faça parte de
            uma agência que valoriza a excelência artística.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 lg:p-12 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-wide">
                ENVIE SEU <span className="text-amber-500">MATERIAL</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Preencha todos os campos obrigatórios para iniciar sua jornada conosco
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Pessoais */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 flex items-center gap-3">
                  <User className="w-5 h-5 text-amber-500" />
                  INFORMAÇÕES PESSOAIS
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                        errors.nome ? "border-red-500" : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="Digite seu nome completo"
                    />
                    {errors.nome && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.nome}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento *</label>
                    <input
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                        errors.dataNascimento ? "border-red-500" : "border-gray-300 focus:border-amber-500"
                      }`}
                    />
                    {errors.dataNascimento && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.dataNascimento}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                        errors.email ? "border-red-500" : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone de Contato *</label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                        errors.telefone ? "border-red-500" : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.telefone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.telefone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Material Obrigatório */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-500" />
                  MATERIAL OBRIGATÓRIO
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currículo (PDF) *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="curriculo-upload"
                    />
                    <label
                      htmlFor="curriculo-upload"
                      className={`w-full px-4 py-6 border-2 border-dashed rounded-sm cursor-pointer transition-colors flex flex-col items-center gap-3 hover:bg-gray-50 ${
                        errors.curriculo ? "border-red-500" : "border-gray-300 hover:border-amber-500"
                      }`}
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <div className="text-center">
                        <p className="text-gray-600">
                          {formData.curriculo ? formData.curriculo.name : "Clique para enviar seu currículo"}
                        </p>
                        <p className="text-sm text-gray-500">Apenas arquivos PDF</p>
                      </div>
                    </label>
                  </div>
                  {errors.curriculo && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.curriculo}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monólogo Caseiro (Link) *</label>
                    <input
                      type="url"
                      value={formData.monologoCaseiro}
                      onChange={(e) => handleInputChange("monologoCaseiro", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                        errors.monologoCaseiro ? "border-red-500" : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="https://vimeo.com/... ou https://youtube.com/..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Vídeo deve ser enviado na horizontal (Vimeo ou YouTube)
                    </p>
                    {errors.monologoCaseiro && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.monologoCaseiro}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apresentação Caseira (Link) *
                    </label>
                    <input
                      type="url"
                      value={formData.apresentacaoCaseira}
                      onChange={(e) => handleInputChange("apresentacaoCaseira", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                        errors.apresentacaoCaseira ? "border-red-500" : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="https://vimeo.com/... ou https://youtube.com/..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Vídeo deve ser enviado na horizontal (Vimeo ou YouTube)
                    </p>
                    {errors.apresentacaoCaseira && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.apresentacaoCaseira}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Links de Trabalho Opcionais */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 flex items-center gap-3">
                  <Video className="w-5 h-5 text-amber-500" />
                  LINKS DE TRABALHO (OPCIONAL)
                </h3>

                <p className="text-gray-600 text-sm">
                  Compartilhe até 3 links de trabalhos anteriores (Vimeo ou YouTube)
                </p>

                <div className="space-y-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link de Trabalho {num}</label>
                      <input
                        type="url"
                        value={formData[`linkTrabalho${num}`]}
                        onChange={(e) => handleInputChange(`linkTrabalho${num}`, e.target.value)}
                        className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                          errors[`linkTrabalho${num}`] ? "border-red-500" : "border-gray-300 focus:border-amber-500"
                        }`}
                        placeholder="https://vimeo.com/... ou https://youtube.com/..."
                      />
                      {errors[`linkTrabalho${num}`] && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors[`linkTrabalho${num}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Envio */}
              <div className="pt-8 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 px-12 py-4 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-400 text-black rounded-sm transition-colors font-medium text-lg shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span className="tracking-wide">ENVIANDO...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span className="tracking-wide">ENVIAR MATERIAL</span>
                    </>
                  )}
                </button>

                <p className="mt-4 text-sm text-gray-500">* Campos obrigatórios</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Seção de Contato */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-2 mb-6 shadow-sm">
              <Phone className="w-5 h-5 text-amber-600" />
              <span className="text-gray-700 font-medium">FALE CONOSCO</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-wide">
              INFORMAÇÕES DE <span className="text-amber-500">CONTATO</span>
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-amber-400 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Estamos aqui para esclarecer suas dúvidas e acompanhar sua jornada artística
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">E-mail Corporativo</h3>
                    <p className="text-gray-600 mb-4">Para dúvidas sobre o processo seletivo</p>
                    <a
                      href="mailto:stage@megastage.com.br"
                      className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      stage@megastage.com.br
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Atendimento Direto</h3>
                    <p className="text-gray-600 mb-4">Disponível de segunda a sexta, 9h às 18h</p>
                    <a
                      href="tel:+551138184800"
                      className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      55 11 3818-4800
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Localização</h3>
                    <p className="text-gray-600 mb-4">Mega Business Group</p>
                    <div className="text-amber-600 font-medium">
                      <p>Avenida Lineu de Paula Machado, 988</p>
                      <p>Jardim Everest - 05601-001</p>
                      <p>São Paulo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-12 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
                  PRONTO PARA BRILHAR
                  <br />
                  <span className="font-medium">NOS PALCOS?</span>
                </h3>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Nossa equipe especializada está pronta para avaliar seu potencial e conectar você às melhores
                  oportunidades do mercado artístico. Cada talento é cuidadosamente analisado para garantir o melhor
                  direcionamento de carreira.
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:stage@megastage.com.br"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-black rounded-sm transition-all duration-300 font-medium group shadow-lg hover:shadow-xl"
                  >
                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="tracking-wide">FALAR COM ESPECIALISTA</span>
                  </a>
                  <p className="text-sm text-gray-600">Resposta garantida em até 48 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
