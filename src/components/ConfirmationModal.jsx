// import { useEffect, useRef } from "react"
// import { AlertTriangle, AlertCircle, Info } from "lucide-react"

// export default function ConfirmationModal({
//   isOpen,
//   onClose,
//   onConfirm,
//   title,
//   message,
//   confirmText = "Confirmar",
//   cancelText = "Cancelar",
//   type = "danger", // danger, warning, info
// }) {
//   const modalRef = useRef(null)

//   // Fechar o modal ao pressionar ESC
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === "Escape" && isOpen) {
//         onClose()
//       }
//     }

//     document.addEventListener("keydown", handleEscape)
//     return () => {
//       document.removeEventListener("keydown", handleEscape)
//     }
//   }, [isOpen, onClose])

//   // Fechar o modal ao clicar fora dele
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
//         onClose()
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen, onClose])

//   if (!isOpen) return null

//   // Configurações baseadas no tipo
//   const typeConfig = {
//     danger: {
//       icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
//       iconBg: "bg-red-100",
//       confirmBg: "bg-red-600 hover:bg-red-700",
//       confirmRing: "focus:ring-red-500",
//     },
//     warning: {
//       icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
//       iconBg: "bg-yellow-100",
//       confirmBg: "bg-yellow-600 hover:bg-yellow-700",
//       confirmRing: "focus:ring-yellow-500",
//     },
//     info: {
//       icon: <Info className="h-6 w-6 text-blue-600" />,
//       iconBg: "bg-blue-100",
//       confirmBg: "bg-blue-600 hover:bg-blue-700",
//       confirmRing: "focus:ring-blue-500",
//     },
//   }

//   const config = typeConfig[type] || typeConfig.danger

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto animate-scaleIn"
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="modal-title"
//       >
//         <div className="p-6">
//           <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4 transition-all duration-200 ease-in-out transform hover:scale-105 hover:rotate-12 cursor-default">
//             <div className={`flex items-center justify-center w-12 h-12 rounded-full ${config.iconBg}`}>
//               {config.icon}
//             </div>
//           </div>
//           <h3 id="modal-title" className="text-lg font-medium text-center text-gray-900 mb-2">
//             {title}
//           </h3>
//           <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
//           <div className="flex justify-center space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
//             >
//               {cancelText}
//             </button>
//             <button
//               type="button"
//               onClick={onConfirm}
//               className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${config.confirmBg} focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmRing} transition-colors duration-200`}
//             >
//               {confirmText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useRef } from "react"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger", // danger, warning, info
}) {
  const modalRef = useRef(null)

  // Fechar o modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Fechar o modal ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Configurações baseadas no tipo
  const typeConfig = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      iconBg: "bg-red-100",
      confirmBg: "bg-red-600 hover:bg-red-700",
      confirmRing: "focus:ring-red-500",
    },
    warning: {
      icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
      iconBg: "bg-yellow-100",
      confirmBg: "bg-yellow-600 hover:bg-yellow-700",
      confirmRing: "focus:ring-yellow-500",
    },
    info: {
      icon: <Info className="h-6 w-6 text-blue-600" />,
      iconBg: "bg-blue-100",
      confirmBg: "bg-blue-600 hover:bg-blue-700",
      confirmRing: "focus:ring-blue-500",
    },
  }

  const config = typeConfig[type] || typeConfig.danger

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto animate-scaleIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4 transition-all duration-200 ease-in-out transform hover:scale-105 hover:rotate-12 cursor-default">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${config.iconBg}`}>
              {config.icon}
            </div>
          </div>
          <h3 id="modal-title" className="text-lg font-medium text-center text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${config.confirmBg} focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmRing} transition-colors duration-200`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
