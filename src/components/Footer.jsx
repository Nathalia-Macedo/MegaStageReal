// import { Instagram, Linkedin, Github, ExternalLink, Heart } from "lucide-react"

// const Footer = () => {
//   return (
//     <footer className="bg-background border-t border-border text-foreground">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Logo and Description */}
//           <div className="lg:col-span-2">
//             <img
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mega%20Stage%20Branco-m7bEuZkcotsi4oqaKuleo1RSShlJTh.png"
//               alt="Mega Stage"
//               className="h-8 w-auto mb-4"
//             />
//             <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
//               Plataforma líder em casting e representação artística. Conectamos talentos excepcionais com as melhores
//               oportunidades do mercado de entretenimento.
//             </p>
//             <div className="flex items-center mt-4 text-sm text-muted-foreground">
//               <div className="w-2 h-2 bg-chart-2 rounded-full mr-2 animate-pulse"></div>
//               Online agora
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <div>
//             <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Navegação</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="#atrizes" className="text-muted-foreground hover:text-primary text-sm transition-colors">
//                   Atrizes
//                 </a>
//               </li>
//               <li>
//                 <a href="#atores" className="text-muted-foreground hover:text-primary text-sm transition-colors">
//                   Atores
//                 </a>
//               </li>
//               <li>
//                 <a href="#contato" className="text-muted-foreground hover:text-primary text-sm transition-colors">
//                   Contato
//                 </a>
//               </li>
//               <li>
//                 <a href="#dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">
//                   Dashboard
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Developer Links */}
//           <div>
//             <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Desenvolvido por</h3>
//             <div className="space-y-3">
//               <a
//                 href="https://www.instagram.com/nath_dev_"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
//               >
//                 <Instagram className="w-4 h-4 mr-2" />
//                 @nath_dev_
//               </a>
//               <a
//                 href="https://www.linkedin.com/in/nathalia-de-macedo-martins-nathdev"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
//               >
//                 <Linkedin className="w-4 h-4 mr-2" />
//                 LinkedIn
//               </a>
//               <a
//                 href="https://nathalia-macedo.vercel.app"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
//               >
//                 <ExternalLink className="w-4 h-4 mr-2" />
//                 Portfólio
//               </a>
//               <a
//                 href="https://github.com/Nathalia-Macedo"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
//               >
//                 <Github className="w-4 h-4 mr-2" />
//                 GitHub
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="border-t border-border mt-8 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground mb-4 md:mb-0">
//               <a href="#" className="hover:text-primary transition-colors">
//                 Termos de Uso
//               </a>
//               <a href="#" className="hover:text-primary transition-colors">
//                 Política de Privacidade
//               </a>
//               <a href="#" className="hover:text-primary transition-colors">
//                 Cookies
//               </a>
//               <a href="#" className="hover:text-primary transition-colors">
//                 Suporte
//               </a>
//             </div>
//             <div className="flex items-center text-sm text-muted-foreground">
//               <span>Feito com</span>
//               <Heart className="w-4 h-4 mx-1 text-chart-1 fill-current" />
//               <span>por Nathália Macedo</span>
//             </div>
//           </div>
//           <div className="text-center md:text-left mt-4 text-sm text-muted-foreground">
//             © 2025 Mega Stage. Todos os direitos reservados.
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer
import { Instagram, Linkedin, Github, ExternalLink, Heart, Youtube, Music } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mega%20Stage%20Branco-m7bEuZkcotsi4oqaKuleo1RSShlJTh.png"
              alt="Mega Stage"
              className="h-8 w-auto mb-4"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Plataforma líder em casting e representação artística. Conectamos talentos excepcionais com as melhores
              oportunidades do mercado de entretenimento.
            </p>
            <div className="flex items-center mt-4 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-chart-2 rounded-full mr-2 animate-pulse"></div>
              Online agora
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Redes Sociais</h3>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/megastageoficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                <Instagram className="w-4 h-4 mr-2" />
                @megastageoficial
              </a>
              <a
                href="https://www.youtube.com/@MegaStageOficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                <Youtube className="w-4 h-4 mr-2" />
                MegaStage Oficial
              </a>
              <a
                href="https://www.tiktok.com/@megastageoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                <Music className="w-4 h-4 mr-2" />
                @megastageoficial
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <a href="#atrizes" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Atrizes
                </a>
              </li>
              <li>
                <a href="#atores" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Atores
                </a>
              </li>
              <li>
                <a href="#contato" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Desenvolvido por</h3>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/nath_dev_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                <Instagram className="w-4 h-4 mr-2" />
                @nath_dev_
              </a>
              <a
                href="https://www.linkedin.com/in/nathalia-de-macedo-martins-nathdev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
              <a
                href="https://nathalia-macedo.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Portfólio
              </a>
              <a
                href="https://github.com/Nathalia-Macedo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-3">Contato</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Mega Business Group</p>
                <p>55 11 3818-4800</p>
                <p>stage@megastage.com.br</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-3">Endereço</h3>
              <div className="text-sm text-muted-foreground">
                <p>Avenida Lineu de Paula Machado, 988</p>
                <p>Jardim Everest - 05601-001</p>
                <p>São Paulo - SP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground mb-4 md:mb-0">
              <a href="#" className="hover:text-primary transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookies
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Suporte
              </a>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Feito com</span>
              <Heart className="w-4 h-4 mx-1 text-chart-1 fill-current" />
              <span>por Nathália Macedo</span>
            </div>
          </div>
          <div className="text-center md:text-left mt-4 text-sm text-muted-foreground">
            © 2025 Mega Stage. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
