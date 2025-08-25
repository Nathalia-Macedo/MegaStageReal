import { NotificationsProvider } from "../contexts/notification-context"
import { useState } from "react"
import { AuthProvider, useAuth } from "../contexts/auth-context"
import { TalentProvider } from "../contexts/talents-context"
import { PasswordResetProvider } from "../contexts/password-reset-context"
import LoginPage from "../components/login-page"
import Header from "../components/HeaderSite.jsx"
import HeaderDashboard from "../components/header.jsx"
import TalentsManager from "../components/TalentManager"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { UsersProvider } from "../contexts/users-context.jsx"
import ProfilePage from "../Pages/ProfilePage.jsx"
import Dashboard from "../components/Dashboard.jsx"
import SettingsPage from "../components/settings/SettingsPage.jsx"
import HighlightsPage from "../components/HighlightsPage.jsx"
import NotificationsPage from "../components/NotificationsPage.jsx"
import EditTalentModal from "../components/EditTalentModal"
import EditTalentModalWrapper from "../components/EditTalentModalWrapper.jsx"
import TalentsGallery from "../components/TalentsGallery"
import QuemSomosPage from "../components/QuemSomosPage.jsx"
import FacaPartePage from "../components/FaçaPartePage.jsx"
import Footer from "../components/Footer.jsx"
function AuthenticatedApp() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("galeria")
  const [pageParams, setPageParams] = useState({})
  const [showLogin, setShowLogin] = useState(false)
  const [targetPage, setTargetPage] = useState("")

const navigateTo = (page, params = {}) => {
  console.log("[v0] Navegando para seção:", page, "com params:", params)
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
  console.log("[v0] Current page set to:", page, "Estado atual:", currentPage)
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

  // const renderPage = () => {
  //   switch (currentPage) {
  //     case "talentos":
  //       return (
  //         <div className="flex flex-col min-h-screen">
  //           <HeaderDashboard onNavigate={navigateTo} activeTab="talentos" />
  //           <main className="flex-grow bg-gray-100">
  //             <TalentsManager />
  //           </main>
  //         </div>
  //       )
  //     case "dashboard":
  //       return (
  //         <div className="flex flex-col min-h-screen">
  //           <HeaderDashboard onNavigate={navigateTo} activeTab="dashboard" />
  //           <main className="flex-grow bg-gray-100">
  //             <Dashboard onNavigate={navigateTo} />
  //           </main>
  //         </div>
  //       )
  //     case "faca-parte":
  //       return (
  //         <div className="flex flex-col min-h-screen">
  //           <Header onNavigate={navigateTo} activeTab="faca-parte" />
  //           <main className="flex-grow">
  //             <FacaPartePage />
  //           </main>
  //         </div>
  //       )
  //     case "quem-somos":
  //       return (
  //         <div className="flex flex-col min-h-screen">
  //           <Header onNavigate={navigateTo} activeTab="quem-somos" />
  //           <main className="flex-grow">
  //             <QuemSomosPage />
  //           </main>
  //         </div>
  //       )
  //     case "destaques":
  //       return (
  //         <div className="flex flex-col min-h-screen">
  //           <HeaderDashboard onNavigate={navigateTo} activeTab="destaques" />
  //           <main className="flex-grow bg-gray-100">
  //             <HighlightsPage />
  //           </main>
  //         </div>
  //       )
  //     case "configurações":
  //       return (
  //         <div className="flex flex-col min-h-screen">
  //           <HeaderDashboard onNavigate={navigateTo} activeTab="configurações" />
  //           <main className="flex-grow bg-gray-100">
  //             <SettingsPage params={pageParams} />
  //           </main>
  //         </div>
  //       )
  //     case "perfil":
  //       return (
  //         <div className="flex flex-col min-h-screen">
  //           <HeaderDashboard onNavigate={navigateTo} activeTab="perfil" />
  //           <main className="flex-grow bg-gray-100">
  //             <ProfilePage onBack={() => navigateTo("dashboard")} />
  //           </main>
  //         </div>
  //       )
  //     case "notificações":
  //       return (
  //         <div className="flex flex-col min-h-screen">
  //           <NotificationsPage onGoBack={() => navigateTo(pageParams.returnTo || "dashboard")} />
  //         </div>
  //       )
  //     case "galeria":
  //     default:
  //       return <TalentsGallery onPageNavigate={navigateTo} />
  //   }
  // }



  const renderPage = () => {
  console.log("[v0] Rendering page:", currentPage, "with params:", pageParams)
  switch (currentPage) {
    case "talentos":
      return (
        <div className="flex flex-col min-h-screen">
          <HeaderDashboard onNavigate={navigateTo} activeTab="talentos" />
          <main className="flex-grow bg-gray-100">
            <TalentsManager />
          </main>
        </div>
      )
    case "dashboard":
      return (
        <div className="flex flex-col min-h-screen">
          <HeaderDashboard onNavigate={navigateTo} activeTab="dashboard" />
          <main className="flex-grow bg-gray-100">
            <Dashboard onNavigate={navigateTo} />
          </main>
        </div>
      )
    case "faca-parte":
      return (
        <div className="flex flex-col min-h-screen">
          <Header onNavigate={navigateTo} activeTab="faca-parte" />
          <main className="flex-grow">
            <FacaPartePage />
          </main>
          <Footer/>
        </div>
      )
    case "quem-somos":
      console.log("[v0] Rendering QuemSomosPage")
      return (
        <div className="flex flex-col min-h-screen">
          <Header onNavigate={navigateTo} activeTab="quem-somos" />
          <main className="flex-grow">
            <QuemSomosPage />
          </main>
          <Footer/>
        </div>
      )
    case "destaques":
      return (
        <div className="flex flex-col min-h-screen">
          <HeaderDashboard onNavigate={navigateTo} activeTab="destaques" />
          <main className="flex-grow bg-gray-100">
            <HighlightsPage />
          </main>
        </div>
      )
    case "configurações":
      return (
        <div className="flex flex-col min-h-screen">
          <HeaderDashboard onNavigate={navigateTo} activeTab="configurações" />
          <main className="flex-grow bg-gray-100">
            <SettingsPage params={pageParams} />
          </main>
        </div>
      )
    case "perfil":
      return (
        <div className="flex flex-col min-h-screen">
          <HeaderDashboard onNavigate={navigateTo} activeTab="perfil" />
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
      console.log("[v0] Rendering TalentsGallery")
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


















// "use client"

// import { NotificationsProvider } from "../contexts/notification-context"
// import { useState } from "react"
// import { AuthProvider, useAuth } from "../contexts/auth-context"
// import { TalentProvider } from "../contexts/talents-context"
// import { PasswordResetProvider } from "../contexts/password-reset-context"
// import LoginPage from "../components/login-page"
// import Header from "../components/HeaderSite.jsx"
// import HeaderDashboard from "../components/header.jsx"
// import TalentsManager from "../components/TalentManager"
// import { ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import { UsersProvider } from "../contexts/users-context.jsx"
// import ProfilePage from "../Pages/ProfilePage.jsx"
// import Dashboard from "../components/Dashboard.jsx"
// import SettingsPage from "../components/settings/SettingsPage.jsx"
// import HighlightsPage from "../components/HighlightsPage.jsx"
// import NotificationsPage from "../components/NotificationsPage.jsx"
// import EditTalentModal from "../components/EditTalentModal"
// import EditTalentModalWrapper from "../components/EditTalentModalWrapper.jsx"
// import TalentsGallery from "../components/TalentsGallery"
// import FacaPartePage from "../components/FaçaPartePage.jsx"
// import QuemSomosPage from "../components/QuemSomosPage.jsx"
// import FemininoPage from "../components/FemininoPage.jsx"

// function AuthenticatedApp() {
//   const { user, logout } = useAuth()
//   const [currentPage, setCurrentPage] = useState("galeria")
//   const [pageParams, setPageParams] = useState({})
//   const [showLogin, setShowLogin] = useState(false)
//   const [targetPage, setTargetPage] = useState("")

//   const navigateTo = (page, params = {}) => {
//     console.log("Navigating to:", page, "with params:", params) // Adicione este log
//     if (page === "dashboard") {
//       const storedAuth = localStorage.getItem("megaStageAuth") || sessionStorage.getItem("megaStageAuth")
//       if (!storedAuth) {
//         setTargetPage("dashboard")
//         setShowLogin(true)
//         return
//       }
//     }

//     setCurrentPage(page)
//     setPageParams(params)
//     console.log("Current page set to:", page) // Adicione este log
//   }

//   const handleSuccessfulLogin = () => {
//     setShowLogin(false)
//     if (targetPage) {
//       setCurrentPage(targetPage)
//       setTargetPage("")
//     }
//   }

//   if (showLogin) {
//     return <LoginPage onSuccessfulLogin={handleSuccessfulLogin} />
//   }

//   const renderPage = () => {
//     switch (currentPage) {
//       case "talentos":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <HeaderDashboard onNavigate={navigateTo} activeTab="talentos" />
//             <main className="flex-grow bg-gray-100">
//               <TalentsManager />
//             </main>
//           </div>
//         )
//       case "dashboard":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <HeaderDashboard onNavigate={navigateTo} activeTab="dashboard" />
//             <main className="flex-grow bg-gray-100">
//               <Dashboard onNavigate={navigateTo} />
//             </main>
//           </div>
//         )
//       case "faca-parte":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab="faca-parte" />
//             <main className="flex-grow">
//               <FacaPartePage />
//             </main>
//           </div>
//         )
//       case "quem-somos":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <Header onNavigate={navigateTo} activeTab="quem-somos" />
//             <main className="flex-grow">
//               <QuemSomosPage />
//             </main>
//           </div>
//         )
//       case "feminino":
//         return (
//           <TalentProvider>
//             <div className="flex flex-col min-h-screen">
//               <Header onNavigate={navigateTo} activeTab="feminino" />
//               <main className="flex-grow">
//                 <FemininoPage />
//               </main>
//             </div>
//           </TalentProvider>
//         )
//       case "destaques":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <HeaderDashboard onNavigate={navigateTo} activeTab="destaques" />
//             <main className="flex-grow bg-gray-100">
//               <HighlightsPage />
//             </main>
//           </div>
//         )
//       case "configurações":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <HeaderDashboard onNavigate={navigateTo} activeTab="configurações" />
//             <main className="flex-grow bg-gray-100">
//               <SettingsPage params={pageParams} />
//             </main>
//           </div>
//         )
//       case "perfil":
//         return (
//           <div className="flex flex-col min-h-screen">
//             <HeaderDashboard onNavigate={navigateTo} activeTab="perfil" />
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

// function AppContent() {
//   return (
//     <>
//       <AuthenticatedApp />

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
