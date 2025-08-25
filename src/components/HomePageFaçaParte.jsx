import { Link } from "react-router-dom"
import { Crown, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-amber-100 border border-amber-200 rounded-full px-6 py-2 mb-8">
          <Crown className="w-5 h-5 text-amber-600" />
          <span className="text-amber-600 font-medium tracking-wide">MEGASTAGE</span>
        </div>

        <h1 className="text-4xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-8 tracking-tight">
          AGÊNCIA DE <span className="text-amber-500">TALENTOS</span>
        </h1>

        <div className="w-24 h-px bg-gradient-to-r from-amber-400 to-transparent mx-auto mb-8"></div>

        <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light mb-12">
          Conectamos talentos excepcionais às melhores oportunidades do mercado artístico brasileiro
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={"/faca-parte"}
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-black rounded-sm transition-colors font-medium group"
          >
            <Crown className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">FAÇA PARTE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
