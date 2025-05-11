// import { NotificationsProvider } from "../contexts/notification-context"
// import { useState, useEffect } from "react"
// import { AuthProvider, useAuth } from "../contexts/auth-context"
// import { TalentProvider } from "../contexts/talents-context"
// import { PasswordResetProvider } from "../contexts/password-reset-context"
// import LoginPage from "../components/login-page"
// import Header from "../components/header"
// import TalentsManager from "../components/TalentManager"
// import { ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import SettingsPage from "../components/settings/SettingsPage"
// import { UsersProvider } from "../contexts/users-context.jsx"
// import ProfilePage from "../Pages/ProfilePage.jsx"
// import Dashboard from "../components/Dashboard.jsx"

// function AuthenticatedApp() {
//   const { user, logout } = useAuth()
//   const [currentPage, setCurrentPage] = useState("dashboard")

//   // Função para navegar entre páginas
//   const navigateTo = (page) => {
//     setCurrentPage(page)
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
//       case "configurações":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab="configurações" />
//             <main className="flex-grow bg-gray-100">
//               <SettingsPage />
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
//       case "dashboard":
//       default:
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab={currentPage} />
//             <main className="flex-grow bg-gray-100">
//               <Dashboard onNavigate={navigateTo} />
//             </main>
//           </div>
//         )
//     }
//   }

//   return (
//     <UsersProvider>
//       <TalentProvider>{renderPage()}</TalentProvider>
//     </UsersProvider>
//   )
// }

// // Componente wrapper que usa o contexto de autenticação
// function AppContent() {
//   const { user } = useAuth()
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   // Verificar se o usuário já está logado ao carregar a página
//   useEffect(() => {
//     const storedAuth = localStorage.getItem("megaStageAuth") || sessionStorage.getItem("megaStageAuth")
//     if (storedAuth) {
//       setIsLoggedIn(true)
//     }
//   }, [])

//   // Atualizar o estado de login quando o usuário mudar
//   useEffect(() => {
//     if (user) {
//       setIsLoggedIn(true)
//     } else {
//       setIsLoggedIn(false)
//     }
//   }, [user])

//   // Função para simular login bem-sucedido
//   const handleSuccessfulLogin = () => {
//     setIsLoggedIn(true)
//   }

//   return (
//     <>
//       {isLoggedIn ? <AuthenticatedApp /> : <LoginPage onSuccessfulLogin={handleSuccessfulLogin} />}

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
import { useState, useEffect } from "react"
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
import SettingsPage from '../components/settings/SettingsPage.jsx'
import "react-toastify/dist/ReactToastify.css"
import HighlightsPage from "../components/HighlightsPage.jsx"
function AuthenticatedApp() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")

  // Função para navegar entre páginas
  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  // Renderizar a página atual
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
              <SettingsPage />
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
      case "dashboard":
      default:
        return (
          <div className="flex flex-col min-h-screen">
            <Header onNavigate={navigateTo} activeTab={currentPage} />
            <main className="flex-grow bg-gray-100">
              <Dashboard onNavigate={navigateTo} />
            </main>
          </div>
        )
    }
  }

  return (
    <UsersProvider>
      <TalentProvider>{renderPage()}</TalentProvider>
    </UsersProvider>
  )
}

// Componente wrapper que usa o contexto de autenticação
function AppContent() {
  const { user } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Verificar se o usuário já está logado ao carregar a página
  useEffect(() => {
    const storedAuth = localStorage.getItem("megaStageAuth") || sessionStorage.getItem("megaStageAuth")
    if (storedAuth) {
      setIsLoggedIn(true)
    }
  }, [])

  // Atualizar o estado de login quando o usuário mudar
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [user])

  // Função para simular login bem-sucedido
  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <>
      {isLoggedIn ? <AuthenticatedApp /> : <LoginPage onSuccessfulLogin={handleSuccessfulLogin} />}

      {/* ToastContainer para exibir notificações */}
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
