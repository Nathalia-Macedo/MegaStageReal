// import { NotificationsProvider } from "../contexts/notification-context"
// import { useState } from "react"
// import { AuthProvider, useAuth } from "../contexts/auth-context"
// import { TalentProvider } from "../contexts/talents-context"
// import { PasswordResetProvider } from "../contexts/password-reset-context"
// import Header from "../components/header"
// import TalentsManager from "../components/TalentManager"
// import { ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import { UsersProvider } from "../contexts/users-context.jsx"
// import ProfilePage from "../Pages/ProfilePage.jsx"
// import Dashboard from "../components/Dashboard.jsx"
// import SettingsPage from "../components/settings/SettingsPage.jsx"
// import "react-toastify/dist/ReactToastify.css"
// import HighlightsPage from "../components/HighlightsPage.jsx"
// import NotificationsPage from "../components/NotificationsPage.jsx"
// import EditTalentModal from "../components/EditTalentModal"
// import EditTalentModalWrapper from "../components/EditTalentModalWrapper.jsx"
// import TalentsGallery from "../components/TalentsGallery"

// function AuthenticatedApp() {
//   const { user, logout } = useAuth()
//   const [currentPage, setCurrentPage] = useState("galeria")
//   const [pageParams, setPageParams] = useState({})

//   // Função para navegar entre páginas
//   const navigateTo = (page, params = {}) => {
//     setCurrentPage(page)
//     setPageParams(params)
//   }

//   // Renderizar a página atual
//   const renderPage = () => {
//     switch (currentPage) {
//       case "talentos":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab="talentos" />
//             <main className="flex-grow bg-gray-100">
//               <TalentsManager />
//             </main>
//           </div>
//         )
//       case "dashboard":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab="dashboard" />
//             <main className="flex-grow bg-gray-100">
//               <Dashboard onNavigate={navigateTo} />
//             </main>
//           </div>
//         )
//       case "destaques":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab="destaques" />
//             <main className="flex-grow bg-gray-100">
//               <HighlightsPage />
//             </main>
//           </div>
//         )
//       case "configurações":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab="configurações" />
//             <main className="flex-grow bg-gray-100">
//               <SettingsPage params={pageParams} />
//             </main>
//           </div>
//         )
//       case "perfil":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab="perfil" />
//             <main className="flex-grow bg-gray-100">
//               <ProfilePage onBack={() => navigateTo("dashboard")} />
//             </main>
//           </div>
//         )
//       case "notificações":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <NotificationsPage onGoBack={() => navigateTo(pageParams.returnTo || "dashboard")} />
//           </div>
//         )
//       case "galeria":
//       default:
//         return <TalentsGallery onPageNavigate={navigateTo} />
//     }
//   }

//   return (
//     <UsersProvider>
//       <TalentProvider>
//         {renderPage()}
//         <EditTalentModalWrapper />
//         <EditTalentModal />
//       </TalentProvider>
//     </UsersProvider>
//   )
// }

// // Componente wrapper que usa o contexto de autenticação
// function AppContent() {
//   // Sempre renderiza AuthenticatedApp ao invés de verificar login
//   return (
//     <>
//       <AuthenticatedApp />

//       {/* ToastContainer para exibir notificações */}
//       <ToastContainer
//         position="bottom-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="dark"
//       />
//     </>
//   )
// }

// function App() {
//   return (
//     <PasswordResetProvider>
//       <AuthProvider>
//         <NotificationsProvider>
//           <AppContent />
//         </NotificationsProvider>
//       </AuthProvider>
//     </PasswordResetProvider>
//   )
// }

// export default App
"use client"

import { NotificationsProvider } from "../contexts/notification-context"
import { useState } from "react"
import { AuthProvider, useAuth } from "../contexts/auth-context"
import { TalentProvider } from "../contexts/talents-context"
import { PasswordResetProvider } from "../contexts/password-reset-context"
import LoginPage from "../components/login-page"
import Header from "../components/header"
import TalentsManager from "../components/TalentManager"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { UsersProvider } from "../contexts/users-context.jsx"
import ProfilePage from "../Pages/ProfilePage.jsx"
import Dashboard from "../components/Dashboard.jsx"
import SettingsPage from "../components/settings/SettingsPage.jsx"
import "react-toastify/dist/ReactToastify.css"
import HighlightsPage from "../components/HighlightsPage.jsx"
import NotificationsPage from "../components/NotificationsPage.jsx"
import EditTalentModal from "../components/EditTalentModal"
import EditTalentModalWrapper from "../components/EditTalentModalWrapper.jsx"
import TalentsGallery from "../components/TalentsGallery"

function AuthenticatedApp() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("galeria")
  const [pageParams, setPageParams] = useState({})
  const [showLogin, setShowLogin] = useState(false)
  const [targetPage, setTargetPage] = useState("")

  const navigateTo = (page, params = {}) => {
    if (page === "dashboard") {
      const storedAuth = localStorage.getItem("megaStageAuth") || sessionStorage.getItem("megaStageAuth")
      if (!storedAuth) {
        setTargetPage("dashboard")
        setShowLogin(true)
        return
      }
    }

    setCurrentPage(page)
    setPageParams(params)
  }

  const handleSuccessfulLogin = () => {
    setShowLogin(false)
    if (targetPage) {
      setCurrentPage(targetPage)
      setTargetPage("")
    }
  }

  if (showLogin) {
    return <LoginPage onSuccessfulLogin={handleSuccessfulLogin} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "talentos":
        return (
          <div className="flex flex-col min-h-screen">
            <Header onNavigate={navigateTo} activeTab="talentos" />
            <main className="flex-grow bg-gray-100">
              <TalentsManager />
            </main>
          </div>
        )
      case "dashboard":
        return (
          <div className="flex flex-col min-h-screen">
            <Header onNavigate={navigateTo} activeTab="dashboard" />
            <main className="flex-grow bg-gray-100">
              <Dashboard onNavigate={navigateTo} />
            </main>
          </div>
        )
      case "destaques":
        return (
          <div className="flex flex-col min-h-screen">
            <Header onNavigate={navigateTo} activeTab="destaques" />
            <main className="flex-grow bg-gray-100">
              <HighlightsPage />
            </main>
          </div>
        )
      case "configurações":
        return (
          <div className="flex flex-col min-h-screen">
            <Header onNavigate={navigateTo} activeTab="configurações" />
            <main className="flex-grow bg-gray-100">
              <SettingsPage params={pageParams} />
            </main>
          </div>
        )
      case "perfil":
        return (
          <div className="flex flex-col min-h-screen">
            <Header onNavigate={navigateTo} activeTab="perfil" />
            <main className="flex-grow bg-gray-100">
              <ProfilePage onBack={() => navigateTo("dashboard")} />
            </main>
          </div>
        )
      case "notificações":
        return (
          <div className="flex flex-col min-h-screen">
            <NotificationsPage onGoBack={() => navigateTo(pageParams.returnTo || "dashboard")} />
          </div>
        )
      case "galeria":
      default:
        return <TalentsGallery onPageNavigate={navigateTo} />
    }
  }

  return (
    <UsersProvider>
      <TalentProvider>
        {renderPage()}
        <EditTalentModalWrapper />
        <EditTalentModal />
      </TalentProvider>
    </UsersProvider>
  )
}

function AppContent() {
  return (
    <>
      <AuthenticatedApp />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

function App() {
  return (
    <PasswordResetProvider>
      <AuthProvider>
        <NotificationsProvider>
          <AppContent />
        </NotificationsProvider>
      </AuthProvider>
    </PasswordResetProvider>
  )
}

export default App
