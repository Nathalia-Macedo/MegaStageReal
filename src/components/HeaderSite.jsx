// "use client"

// import { useState } from "react"
// import { Menu, X, Settings } from "lucide-react"

// const Header = ({ onNavigate }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen)
//   }

//   const handleNavClick = (section) => {
//     if (onNavigate) {
//       onNavigate(section)
//     }
//     setIsMenuOpen(false)
//   }

//   return (
//     <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <img
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mega%20Stage%20Branco-m7bEuZkcotsi4oqaKuleo1RSShlJTh.png"
//               alt="Mega Stage"
//               className="h-12 w-auto"
//             />
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-12">
//             <button
//               onClick={() => handleNavClick("atrizes")}
//               className="text-white hover:text-amber-400 px-4 py-2 text-base font-medium tracking-wider transition-colors"
//             >
//               ATRIZES
//             </button>
//             <button
//               onClick={() => handleNavClick("atores")}
//               className="text-white hover:text-amber-400 px-4 py-2 text-base font-medium tracking-wider transition-colors"
//             >
//               ATORES
//             </button>
//             <button
//               onClick={() => handleNavClick("contato")}
//               className="text-white hover:text-amber-400 px-4 py-2 text-base font-medium tracking-wider transition-colors"
//             >
//               CONTATO
//             </button>
//             <button
//               onClick={() => handleNavClick("dashboard")}
//               className="text-white hover:text-amber-400 p-2 rounded-lg transition-colors"
//               title="Dashboard (Funcionários)"
//             >
//               <Settings className="h-5 w-5" />
//             </button>
//           </nav>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button onClick={toggleMenu} className="text-white hover:text-amber-400 p-2">
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
//               <button
//                 onClick={() => handleNavClick("atrizes")}
//                 className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-amber-400 hover:bg-gray-900 tracking-wide transition-colors"
//               >
//                 ATRIZES
//               </button>
//               <button
//                 onClick={() => handleNavClick("atores")}
//                 className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-amber-400 hover:bg-gray-900 tracking-wide transition-colors"
//               >
//                 ATORES
//               </button>
//               <button
//                 onClick={() => handleNavClick("contato")}
//                 className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-amber-400 hover:bg-gray-900 tracking-wide transition-colors"
//               >
//                 CONTATO
//               </button>
//               <button
//                 onClick={() => handleNavClick("dashboard")}
//                 className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-white hover:text-amber-400 hover:bg-gray-900 tracking-wide transition-colors"
//               >
//                 <Settings className="h-4 w-4 mr-2" />
//                 DASHBOARD
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }

// export default Header
"use client"

import { useState } from "react"
import { Menu, X, Settings } from "lucide-react"

const Header = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavClick = (section) => {
    if (onNavigate) {
      onNavigate(section)
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mega%20Stage%20Branco-m7bEuZkcotsi4oqaKuleo1RSShlJTh.png"
              alt="Mega Stage"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <button
              onClick={() => handleNavClick("atrizes")}
              className="text-white hover:text-amber-400 px-4 py-2 text-base font-medium tracking-wider transition-colors"
            >
              ATRIZES
            </button>
            <button
              onClick={() => handleNavClick("atores")}
              className="text-white hover:text-amber-400 px-4 py-2 text-base font-medium tracking-wider transition-colors"
            >
              ATORES
            </button>
            <button
              onClick={() => handleNavClick("contato")}
              className="text-white hover:text-amber-400 px-4 py-2 text-base font-medium tracking-wider transition-colors"
            >
              CONTATO
            </button>
            <button
              onClick={() => handleNavClick("dashboard")}
              className="text-white hover:text-amber-400 p-2 rounded-lg transition-colors"
              title="Dashboard (Funcionários)"
            >
              <Settings className="h-5 w-5" />
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white hover:text-amber-400 p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
              <button
                onClick={() => handleNavClick("atrizes")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-amber-400 hover:bg-gray-900 tracking-wide transition-colors"
              >
                ATRIZES
              </button>
              <button
                onClick={() => handleNavClick("atores")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-amber-400 hover:bg-gray-900 tracking-wide transition-colors"
              >
                ATORES
              </button>
              <button
                onClick={() => handleNavClick("contato")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-amber-400 hover:bg-gray-900 tracking-wide transition-colors"
              >
                CONTATO
              </button>
              <button
                onClick={() => handleNavClick("dashboard")}
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-white hover:text-amber-400 hover:bg-gray-900 tracking-wide transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                DASHBOARD
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
