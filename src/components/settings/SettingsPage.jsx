// import { useState } from "react"
// import { motion } from "framer-motion"
// import {
//   Settings,
//   HelpCircle,
//   User,
//   Bell,
//   Shield,
//   Layout,
//   Database,
//   Users,
//   ChevronRight,
//   Moon,
//   Sun,
//   Globe,
//   LogOut,
// } from "lucide-react"
// import DashboardHelp from "../helpers/DashboardHelper"
// import TalentsHelp from "../helpers/TalentsHelp"
// import UserManagement from "./UserManagement"
// const SettingsPage = () => {
//   const [activeTab, setActiveTab] = useState("help")
//   const [activeHelpSection, setActiveHelpSection] = useState("dashboard")

//   const tabs = [
//     { id: "profile", label: "Perfil", icon: <User size={20} /> },
//     { id: "users", label: "Usuários", icon: <Users size={20} /> },
//     { id: "help", label: "Ajuda", icon: <HelpCircle size={20} /> },
//   ]

//   const helpSections = [
//     { id: "dashboard", label: "Dashboard", description: "Aprenda a usar o dashboard principal" },
//     { id: "talents", label: "Talentos", description: "Gerenciamento de talentos" },
//     { id: "highlights", label: "Destaques", description: "Como destacar talentos" },
//     { id: "users", label: "Usuários", description: "Gerenciamento de usuários" },
//     { id: "notifications", label: "Notificações", description: "Sistema de notificações" },
//   ]

//   const renderHelpContent = () => {
//     switch (activeHelpSection) {
//       case "dashboard":
//         return <DashboardHelp />
//       case "talents":
//         return <TalentsHelp />
//       case "highlights":
//         return (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Ajuda - Destaques</h2>
//             <p className="text-gray-600">Conteúdo de ajuda para a seção de destaques será exibido aqui.</p>
//           </div>
//         )
//       case "users":
//         return <UserManagement />
//       case "notifications":
//         return (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Ajuda - Notificações</h2>
//             <p className="text-gray-600">Conteúdo de ajuda para a seção de notificações será exibido aqui.</p>
//           </div>
//         )
//       default:
//         return <DashboardHelp />
//     }
//   }

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "help":
//         return (
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 px-2">Tópicos de Ajuda</h3>
//                 <ul className="space-y-1">
//                   {helpSections.map((section) => (
//                     <li key={section.id}>
//                       <button
//                         onClick={() => setActiveHelpSection(section.id)}
//                         className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
//                           activeHelpSection === section.id
//                             ? "bg-pink-50 text-pink-600"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         <div className="flex flex-col items-start">
//                           <span className="font-medium">{section.label}</span>
//                           <span className="text-xs text-gray-500">{section.description}</span>
//                         </div>
//                         <ChevronRight
//                           size={16}
//                           className={activeHelpSection === section.id ? "text-pink-500" : "text-gray-400"}
//                         />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div className="lg:col-span-3">{renderHelpContent()}</div>
//           </div>
//         )
//       case "profile":
//         return (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações de Perfil</h2>
//             <p className="text-gray-600">Gerencie suas informações de perfil.</p>
//           </div>
//         )
//       case "appearance":
//         return (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações de Aparência</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//               <div className="border border-gray-200 rounded-lg p-4">
//                 <h3 className="text-lg font-medium text-gray-800 mb-3">Tema</h3>
//                 <div className="flex space-x-4">
//                   <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
//                     <Sun size={24} className="text-yellow-500 mb-2" />
//                     <span className="text-sm font-medium">Claro</span>
//                   </button>
//                   <button className="flex flex-col items-center justify-center p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-pink-500 transition-colors">
//                     <Moon size={24} className="text-blue-400 mb-2" />
//                     <span className="text-sm font-medium text-white">Escuro</span>
//                   </button>
//                   <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
//                     <div className="flex mb-2">
//                       <Sun size={24} className="text-yellow-500" />
//                       <Moon size={24} className="text-blue-400" />
//                     </div>
//                     <span className="text-sm font-medium">Sistema</span>
//                   </button>
//                 </div>
//               </div>

//               <div className="border border-gray-200 rounded-lg p-4">
//                 <h3 className="text-lg font-medium text-gray-800 mb-3">Idioma</h3>
//                 <div className="flex space-x-4">
//                   <button className="flex items-center p-3 bg-white border border-pink-500 rounded-lg text-pink-500">
//                     <Globe size={20} className="mr-2" />
//                     <span className="text-sm font-medium">Português</span>
//                   </button>
//                   <button className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
//                     <Globe size={20} className="mr-2" />
//                     <span className="text-sm font-medium">English</span>
//                   </button>
//                   <button className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
//                     <Globe size={20} className="mr-2" />
//                     <span className="text-sm font-medium">Español</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )
//       case "users":
//         return <UserManagement />
//       default:
//         return (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               Configurações de {tabs.find((t) => t.id === activeTab)?.label}
//             </h2>
//             <p className="text-gray-600">Conteúdo para a aba {activeTab} será exibido aqui.</p>
//           </div>
//         )
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//           <Settings className="mr-2 text-pink-500" size={28} />
//           Configurações
//         </h1>
//         <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
//           <LogOut className="w-5 h-5 mr-2" />
//           Sair
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         <div className="bg-white rounded-lg shadow-sm p-1">
//           <div className="flex overflow-x-auto scrollbar-hide">
//             {tabs.map((tab) => (
//               <motion.button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center px-4 py-3 whitespace-nowrap transition-colors ${
//                   activeTab === tab.id
//                     ? "text-pink-600 border-b-2 border-pink-500"
//                     : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//                 }`}
//                 whileHover={{ y: -2 }}
//                 whileTap={{ y: 0 }}
//               >
//                 <span className="mr-2">{tab.icon}</span>
//                 <span className="font-medium">{tab.label}</span>
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         <motion.div
//           key={activeTab}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//         >
//           {renderTabContent()}
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// // export default SettingsPage
// import { useState } from "react"
// import { motion } from "framer-motion"
// import {
//   Settings,
//   HelpCircle,
//   User,
//   Bell,
//   Shield,
//   Layout,
//   Database,
//   Users,
//   ChevronRight,
//   Moon,
//   Sun,
//   Globe,
//   LogOut,
// } from "lucide-react"
// import DashboardHelp from "../helpers/DashboardHelper"
// import TalentsHelp from "../helpers/TalentsHelp"
// import UserManagement from "./UserManagement"
// import HighlightsHelp from "./HighlightHelp"
// import NotificationHelpPage from "./NotificationHelpPage"
// const SettingsPage = () => {
//   const [activeTab, setActiveTab] = useState("help")
//   const [activeHelpSection, setActiveHelpSection] = useState("dashboard")

//   const tabs = [
//     { id: "profile", label: "Perfil", icon: <User size={20} /> },
//     { id: "users", label: "Usuários", icon: <Users size={20} /> },
//     { id: "help", label: "Ajuda", icon: <HelpCircle size={20} /> },
//   ]

//   const helpSections = [
//     { id: "dashboard", label: "Dashboard", description: "Aprenda a usar o dashboard principal" },
//     { id: "talents", label: "Talentos", description: "Gerenciamento de talentos" },
//     { id: "highlights", label: "Destaques", description: "Como destacar talentos" },
//     { id: "users", label: "Usuários", description: "Gerenciamento de usuários" },
//     { id: "notifications", label: "Notificações", description: "Sistema de notificações" },
//   ]

//   const renderHelpContent = () => {
//     switch (activeHelpSection) {
//       case "dashboard":
//         return <DashboardHelp />
//       case "talents":
//         return <TalentsHelp />
//       case "highlights":
//         return <HighlightsHelp /> // Novo componente renderizado
//       case "users":
//         return <UserManagement />
//       case "notifications":
//         return <NotificationHelpPage/>
//       default:
//         return <DashboardHelp />
//     }
//   }

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "help":
//         return (
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 px-2">Tópicos de Ajuda</h3>
//                 <ul className="space-y-1">
//                   {helpSections.map((section) => (
//                     <li key={section.id}>
//                       <button
//                         onClick={() => setActiveHelpSection(section.id)}
//                         className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
//                           activeHelpSection === section.id
//                             ? "bg-pink-50 text-pink-600"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         <div className="flex flex-col items-start">
//                           <span className="font-medium">{section.label}</span>
//                           <span className="text-xs text-gray-500">{section.description}</span>
//                         </div>
//                         <ChevronRight
//                           size={16}
//                           className={activeHelpSection === section.id ? "text-pink-500" : "text-gray-400"}
//                         />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div className="lg:col-span-3">{renderHelpContent()}</div>
//           </div>
//         )
//       case "profile":
//         return (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações de Perfil</h2>
//             <p className="text-gray-600">Gerencie suas informações de perfil.</p>
//           </div>
//         )
//       case "appearance":
//         return (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações de Aparência</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//               <div className="border border-gray-200 rounded-lg p-4">
//                 <h3 className="text-lg font-medium text-gray-800 mb-3">Tema</h3>
//                 <div className="flex space-x-4">
//                   <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
//                     <Sun size={24} className="text-yellow-500 mb-2" />
//                     <span className="text-sm font-medium">Claro</span>
//                   </button>
//                   <button className="flex flex-col items-center justify-center p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-pink-500 transition-colors">
//                     <Moon size={24} className="text-blue-400 mb-2" />
//                     <span className="text-sm font-medium text-white">Escuro</span>
//                   </button>
//                   <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
//                     <div className="flex mb-2">
//                       <Sun size={24} className="text-yellow-500" />
//                       <Moon size={24} className="text-blue-400" />
//                     </div>
//                     <span className="text-sm font-medium">Sistema</span>
//                   </button>
//                 </div>
//               </div>

//               <div className="border border-gray-200 rounded-lg p-4">
//                 <h3 className="text-lg font-medium text-gray-800 mb-3">Idioma</h3>
//                 <div className="flex space-x-4">
//                   <button className="flex items-center p-3 bg-white border border-pink-500 rounded-lg text-pink-500">
//                     <Globe size={20} className="mr-2" />
//                     <span className="text-sm font-medium">Português</span>
//                   </button>
//                   <button className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
//                     <Globe size={20} className="mr-2" />
//                     <span className="text-sm font-medium">English</span>
//                   </button>
//                   <button className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
//                     <Globe size={20} className="mr-2" />
//                     <span className="text-sm font-medium">Español</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )
//       case "users":
//         return <UserManagement />
//       default:
//         return (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               Configurações de {tabs.find((t) => t.id === activeTab)?.label}
//             </h2>
//             <p className="text-gray-600">Conteúdo para a aba {activeTab} será exibido aqui.</p>
//           </div>
//         )
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//           <Settings className="mr-2 text-pink-500" size={28} />
//           Configurações
//         </h1>
//         <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
//           <LogOut className="w-5 h-5 mr-2" />
//           Sair
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         <div className="bg-white rounded-lg shadow-sm p-1">
//           <div className="flex overflow-x-auto scrollbar-hide">
//             {tabs.map((tab) => (
//               <motion.button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center px-4 py-3 whitespace-nowrap transition-colors ${
//                   activeTab === tab.id
//                     ? "text-pink-600 border-b-2 border-pink-500"
//                     : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//                 }`}
//                 whileHover={{ y: -2 }}
//                 whileTap={{ y: 0 }}
//               >
//                 <span className="mr-2">{tab.icon}</span>
//                 <span className="font-medium">{tab.label}</span>
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         <motion.div
//           key={activeTab}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//         >
//           {renderTabContent()}
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default SettingsPage




import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  HelpCircle,
  User,
  Bell,
  Shield,
  Layout,
  Database,
  Users,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  LogOut,
} from "lucide-react"
import DashboardHelp from "../helpers/DashboardHelper"
import TalentsHelp from "../helpers/TalentsHelp"
import UserManagement from "./UserManagement"
import HighlightsHelp from "./HighlightHelp"
import NotificationHelpPage from "./NotificationHelpPage"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("help")
  const [activeHelpSection, setActiveHelpSection] = useState("dashboard")

  const tabs = [
    { id: "profile", label: "Perfil", icon: <User size={20} /> },
    { id: "users", label: "Usuários", icon: <Users size={20} /> },
    { id: "help", label: "Ajuda", icon: <HelpCircle size={20} /> },
  ]

  const helpSections = [
    { id: "dashboard", label: "Dashboard", description: "Aprenda a usar o dashboard principal" },
    { id: "talents", label: "Talentos", description: "Gerenciamento de talentos" },
    { id: "highlights", label: "Destaques", description: "Como destacar talentos" },
    { id: "users", label: "Usuários", description: "Gerenciamento de usuários" },
    { id: "notifications", label: "Notificações", description: "Sistema de notificações" },
  ]

  const renderHelpContent = () => {
    switch (activeHelpSection) {
      case "dashboard":
        return <DashboardHelp />
      case "talents":
        return <TalentsHelp />
      case "highlights":
        return <HighlightsHelp />
      case "users":
        return <UserManagement />
      case "notifications":
        return <NotificationHelpPage setActiveTab={setActiveTab} />
      default:
        return <DashboardHelp />
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "help":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 px-2">Tópicos de Ajuda</h3>
                <ul className="space-y-1">
                  {helpSections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveHelpSection(section.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
                          activeHelpSection === section.id
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{section.label}</span>
                          <span className="text-xs text-gray-500">{section.description}</span>
                        </div>
                        <ChevronRight
                          size={16}
                          className={activeHelpSection === section.id ? "text-pink-500" : "text-gray-400"}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-3">{renderHelpContent()}</div>
          </div>
        )
      case "profile":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações de Perfil</h2>
            <p className="text-gray-600">Gerencie suas informações de perfil.</p>
          </div>
        )
      case "appearance":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações de Aparência</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Tema</h3>
                <div className="flex space-x-4">
                  <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
                    <Sun size={24} className="text-yellow-500 mb-2" />
                    <span className="text-sm font-medium">Claro</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-pink-500 transition-colors">
                    <Moon size={24} className="text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-white">Escuro</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
                    <div className="flex mb-2">
                      <Sun size={24} className="text-yellow-500" />
                      <Moon size={24} className="text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">Sistema</span>
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Idioma</h3>
                <div className="flex space-x-4">
                  <button className="flex items-center p-3 bg-white border border-pink-500 rounded-lg text-pink-500">
                    <Globe size={20} className="mr-2" />
                    <span className="text-sm font-medium">Português</span>
                  </button>
                  <button className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
                    <Globe size={20} className="mr-2" />
                    <span className="text-sm font-medium">English</span>
                  </button>
                  <button className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
                    <Globe size={20} className="mr-2" />
                    <span className="text-sm font-medium">Español</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case "users":
        return <UserManagement />
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Configurações de {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">Conteúdo para a aba {activeTab} será exibido aqui.</p>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Settings className="mr-2 text-pink-500" size={28} />
          Configurações
        </h1>
        <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-1">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-pink-600 border-b-2 border-pink-500"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage