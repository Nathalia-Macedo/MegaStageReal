// import { useState } from "react"
// import { Menu, X, Settings, Instagram, Youtube } from 'lucide-react'

// const Header = ({ onNavigate }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen)
//   }

//  const handleNavClick = (section) => {
//   console.log("handleNavClick called with section:", section, "onNavigate:", onNavigate)
//   if (onNavigate) {
//     onNavigate(section)
//   }
//   setIsMenuOpen(false)
// }

//   return (
//     <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-amber-400/20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Top tier - Logo, Social Media, Dashboard */}
//         <div className="flex items-center justify-between h-16 border-b border-gray-800/50">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <img
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mega%20Stage%20Branco-m7bEuZkcotsi4oqaKuleo1RSShlJTh.png"
//               alt="Mega Stage"
//               className="h-10 w-auto"
//             />
//           </div>

//           {/* Social Media & Dashboard - Desktop */}
//           <div className="hidden md:flex items-center space-x-3">
//             <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-900/50 border border-gray-700/50">
//               <a
//                 href="https://www.tiktok.com/@megastageoficial"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-400 hover:text-amber-400 p-1.5 rounded-full hover:bg-amber-400/10 transition-all duration-200"
//                 title="TikTok"
//               >
//                 <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
//                 </svg>
//               </a>
//               <a
//                 href="https://www.instagram.com/megastageoficial/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-400 hover:text-amber-400 p-1.5 rounded-full hover:bg-amber-400/10 transition-all duration-200"
//                 title="Instagram"
//               >
//                 <Instagram className="h-4 w-4" />
//               </a>
//               <a
//                 href="https://www.youtube.com/@MegaStageOficial"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-400 hover:text-amber-400 p-1.5 rounded-full hover:bg-amber-400/10 transition-all duration-200"
//                 title="YouTube"
//               >
//                 <Youtube className="h-4 w-4" />
//               </a>
//             </div>
//             <button
//               onClick={() => handleNavClick("dashboard")}
//               className="text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-amber-400/10 border border-gray-700/50 transition-all duration-200"
//               title="Dashboard (Funcionários)"
//             >
//               <Settings className="h-4 w-4" />
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button onClick={toggleMenu} className="text-white hover:text-amber-400 p-2">
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Bottom tier - Main Navigation */}
//         <div className="hidden md:flex items-center justify-center h-16">
//           <nav className="flex items-center space-x-1">
//             <button
//               onClick={() => handleNavClick("feminino")}
//               className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
//             >
//               Feminino
//             </button>
//             <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
//             <button
//               onClick={() => handleNavClick("masculino")}
//               className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
//             >
//               Masculino
//             </button>
//             <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
//             {/* <CHANGE> Adicionando opção "Quem Somos" no header desktop */}
//             <button
//               onClick={() => handleNavClick("quem-somos")}
//               className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
//             >
//               Quem Somos
//             </button>
//             <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
//             <button
//               onClick={() => handleNavClick("em-desenvolvimento")}
//               className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
//             >
//               Em Desenvolvimento
//             </button>
//             <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
//             <button
//               onClick={() => handleNavClick("faca-parte")}
//               className="text-amber-400 hover:text-amber-300 px-6 py-3 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-200 bg-amber-400/10 rounded-lg border border-amber-400/30 hover:border-amber-400/50 hover:bg-amber-400/15"
//             >
//               Faça Parte
//             </button>
//             <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
//             <button
//               onClick={() => handleNavClick("contato")}
//               className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
//             >
//               Contato
//             </button>
//           </nav>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
//               <button
//                 onClick={() => handleNavClick("feminino")}
//                 className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
//               >
//                 Feminino
//               </button>
//               <button
//                 onClick={() => handleNavClick("masculino")}
//                 className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
//               >
//                 Masculino
//               </button>
//               {/* <CHANGE> Adicionando opção "Quem Somos" no header mobile */}
//               <button
//                 onClick={() => handleNavClick("quem-somos")}
//                 className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
//               >
//                 Quem Somos
//               </button>
//               <button
//                 onClick={() => handleNavClick("em-desenvolvimento")}
//                 className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
//               >
//                 Em Desenvolvimento
//               </button>
//               <button
//                 onClick={() => handleNavClick("faca-parte")}
//                 className="block w-full text-left px-3 py-3 text-base font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 tracking-[0.1em] uppercase transition-colors rounded-lg"
//               >
//                 Faça Parte
//               </button>
//               <button
//                 onClick={() => handleNavClick("contato")}
//                 className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
//               >
//                 Contato
//               </button>

//               {/* Mobile Social Media */}
//               <div className="flex items-center justify-center space-x-6 py-4 border-t border-gray-700 mt-4">
//                 <a
//                   href="https://www.tiktok.com/@megastageoficial"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-amber-400/10 transition-all duration-200"
//                   title="TikTok"
//                 >
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z" />
//                   </svg>
//                 </a>
//                 <a
//                   href="https://www.instagram.com/megastageoficial/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-amber-400/10 transition-all duration-200"
//                   title="Instagram"
//                 >
//                   <Instagram className="h-5 w-5" />
//                 </a>
//                 <a
//                   href="https://www.youtube.com/@MegaStageOficial"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-amber-400/10 transition-all duration-200"
//                   title="YouTube"
//                 >
//                   <Youtube className="h-5 w-5" />
//                 </a>
//               </div>

//               <button
//                 onClick={() => handleNavClick("dashboard")}
//                 className="flex items-center w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg border-t border-gray-700 mt-2 pt-4"
//               >
//                 <Settings className="h-4 w-4 mr-3" />
//                 Dashboard
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }

// export default Header
import { useState } from "react"
import { Menu, X, Settings, Instagram, Youtube } from 'lucide-react'

const Header = ({ onNavigate }) => {
  console.log("[v0] Header recebeu onNavigate:", onNavigate)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavClick = (section) => {
    console.log("[v0] handleNavClick called with section:", section, "onNavigate:", onNavigate)
    if (onNavigate) {
      onNavigate(section)
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-amber-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-gray-800/50">
          <div className="flex-shrink-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mega%20Stage%20Branco-m7bEuZkcotsi4oqaKuleo1RSShlJTh.png"
              alt="Mega Stage"
              className="h-10 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-900/50 border border-gray-700/50">
              <a
                href="https://www.tiktok.com/@megastageoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 p-1.5 rounded-full hover:bg-amber-400/10 transition-all duration-200"
                title="TikTok"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/megastageoficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 p-1.5 rounded-full hover:bg-amber-400/10 transition-all duration-200"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@MegaStageOficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 p-1.5 rounded-full hover:bg-amber-400/10 transition-all duration-200"
                title="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            <button
              onClick={() => handleNavClick("dashboard")}
              className="text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-amber-400/10 border border-gray-700/50 transition-all duration-200"
              title="Dashboard (Funcionários)"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white hover:text-amber-400 p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center h-16">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => handleNavClick("feminino")}
              className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
            >
              Feminino
            </button>
            <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
            <button
              onClick={() => handleNavClick("masculino")}
              className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
            >
              Masculino
            </button>
            <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
            <button
              onClick={() => handleNavClick("quem-somos")}
              className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
            >
              Quem Somos
            </button>
            <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
            <button
              onClick={() => handleNavClick("em-desenvolvimento")}
              className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
            >
              Em Desenvolvimento
            </button>
            <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
            <button
              onClick={() => handleNavClick("faca-parte")}
              className="text-amber-400 hover:text-amber-300 px-6 py-3 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-200 bg-amber-400/10 rounded-lg border border-amber-400/30 hover:border-amber-400/50 hover:bg-amber-400/15"
            >
              Faça Parte
            </button>
            <div className="w-px h-6 bg-gray-700/50 mx-2"></div>
            <button
              onClick={() => handleNavClick("contato")}
              className="text-white hover:text-amber-400 px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber-400/5 rounded-lg border border-transparent hover:border-amber-400/20"
            >
              Contato
            </button>
          </nav>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
              <button
                onClick={() => handleNavClick("feminino")}
                className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
              >
                Feminino
              </button>
              <button
                onClick={() => handleNavClick("masculino")}
                className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
              >
                Masculino
              </button>
              <button
                onClick={() => handleNavClick("quem-somos")}
                className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
              >
                Quem Somos
              </button>
              <button
                onClick={() => handleNavClick("em-desenvolvimento")}
                className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
              >
                Em Desenvolvimento
              </button>
              <button
                onClick={() => handleNavClick("faca-parte")}
                className="block w-full text-left px-3 py-3 text-base font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 tracking-[0.1em] uppercase transition-colors rounded-lg"
              >
                Faça Parte
              </button>
              <button
                onClick={() => handleNavClick("contato")}
                className="block w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg"
              >
                Contato
              </button>
              <div className="flex items-center justify-center space-x-6 py-4 border-t border-gray-700 mt-4">
                <a
                  href="https://www.tiktok.com/@megastageoficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-amber-400/10 transition-all duration-200"
                  title="TikTok"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/megastageoficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-amber-400/10 transition-all duration-200"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.youtube.com/@MegaStageOficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-amber-400/10 transition-all duration-200"
                  title="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
              <button
                onClick={() => handleNavClick("dashboard")}
                className="flex items-center w-full text-left px-3 py-3 text-base font-light text-white hover:text-amber-400 hover:bg-gray-900/50 tracking-[0.1em] uppercase transition-colors rounded-lg border-t border-gray-700 mt-2 pt-4"
              >
                <Settings className="h-4 w-4 mr-3" />
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header