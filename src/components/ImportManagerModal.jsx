"use client"

import { useState, useEffect } from "react"
import { useTalent } from "../contexts/talents-context"
import { toast } from "react-toastify"
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Info,
  Database,
  ArrowDownCircle,
  Clock,
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ImportManagerModal({ isOpen, onClose }) {
  const { importFromManager, loading } = useTalent()
  const [importType, setImportType] = useState("incremental")
  const [importResult, setImportResult] = useState(null)
  const [importError, setImportError] = useState(null)
  const [isImporting, setIsImporting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setImportResult(null)
      setImportError(null)
      setIsImporting(false)
      setShowConfetti(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleImport = async () => {
    setIsImporting(true)
    setImportResult(null)
    setImportError(null)

    try {
      const isIncremental = importType === "incremental"
      const result = await importFromManager(isIncremental)

      setImportResult(result)
      setShowConfetti(true)

      toast.success(result.message, {
        icon: <CheckCircle className="text-green-500" size={18} />,
      })
    } catch (error) {
      setImportError(error.message || "Erro ao importar talentos do Manager")

      toast.error(`Erro ao importar talentos: ${error.message}`, {
        icon: <AlertCircle className="text-red-500" size={18} />,
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Confetti animation component
  const Confetti = () => {
    if (!showConfetti) return null

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: [
                "#FF5733",
                "#33FF57",
                "#3357FF",
                "#F3FF33",
                "#FF33F3",
                "#33FFF3",
                "#FF3333",
                "#33FF33",
                "#3333FF",
                "#FFFF33",
                "#FF33FF",
                "#33FFFF",
              ][Math.floor(Math.random() * 12)],
              top: `${Math.random() * -10}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: window.innerHeight,
              x: Math.random() * 200 - 100,
              rotate: Math.random() * 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              ease: "easeOut",
              delay: Math.random() * 0.5,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl"></div>

                <div className="relative z-10 flex items-center">
                  <Database className="h-8 w-8 mr-3 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold">Importar Talentos</h2>
                    <p className="text-white/80 text-sm mt-1">Sincronize talentos do Manager para o sistema</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {!importResult && !importError && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Escolha o tipo de importação:
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Incremental Import Option */}
                      <motion.div
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                          importType === "incremental"
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-800/50"
                        }`}
                        onClick={() => setImportType("incremental")}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                              importType === "incremental"
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            <Plus className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Importação Incremental</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Importa apenas os novos talentos, preservando os dados existentes.
                            </p>
                            <div className="flex items-center mt-3 text-xs text-pink-600 dark:text-pink-400 font-medium">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>Recomendado para atualizações regulares</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Complete Import Option */}
                      <motion.div
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                          importType === "complete"
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-800/50"
                        }`}
                        onClick={() => setImportType("complete")}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                              importType === "complete"
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            <ArrowDownCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Importação Completa</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Importa todos os talentos do Manager, atualizando o sistema por completo.
                            </p>
                            <div className="flex items-center mt-3 text-xs text-pink-600 dark:text-pink-400 font-medium">
                              <Info className="h-3.5 w-3.5 mr-1" />
                              <span>Ideal para sincronização total dos dados</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex">
                        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm">Sobre a importação</h4>
                          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300/80">
                            {importType === "incremental"
                              ? "A importação incremental busca apenas os novos talentos do Manager, preservando todos os dados já existentes no sistema."
                              : "A importação completa busca todos os talentos do Manager novamente, garantindo que o sistema esteja totalmente sincronizado."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                <AnimatePresence>
                  {importResult && (
                    <motion.div
                      className="mb-6 p-5 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-start">
                        <div className="bg-green-100 dark:bg-green-800 rounded-full p-2 mr-4">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                            Importação concluída com sucesso!
                          </h3>
                          <p className="mt-1 text-green-700 dark:text-green-300/80">{importResult.message}</p>
                          <div className="mt-4 flex items-center">
                            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                              {importResult.count}
                            </span>
                            <span className="ml-2 text-sm text-green-700 dark:text-green-300/80">
                              {importResult.count === 1 ? "talento importado" : "talentos importados"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {importError && (
                    <motion.div
                      className="mb-6 p-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-start">
                        <div className="bg-red-100 dark:bg-red-800 rounded-full p-2 mr-4">
                          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Erro na importação</h3>
                          <p className="mt-1 text-red-700 dark:text-red-300/80">{importError}</p>
                          <button
                            onClick={() => {
                              setImportError(null)
                              setImportResult(null)
                            }}
                            className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
                          >
                            Tentar novamente
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-full sm:w-auto">
                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      disabled={isImporting}
                      type="button"
                    >
                      {importResult ? "Fechar" : "Cancelar"}
                    </button>
                  </div>

                  {!importResult && (
                    <div className="w-full sm:w-auto">
                      <motion.button
                        onClick={handleImport}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 font-medium flex items-center justify-center"
                        disabled={isImporting}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isImporting ? (
                          <>
                            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                            Importando...
                          </>
                        ) : importType === "incremental" ? (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Importar Novos Talentos
                          </>
                        ) : (
                          <>
                            <ArrowDownCircle className="h-4 w-4 mr-2" />
                            Importar Todos os Talentos
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render confetti on successful import */}
      <Confetti />
    </>
  )
}
