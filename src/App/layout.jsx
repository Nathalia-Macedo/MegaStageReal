import { AuthProvider } from "../contexts/auth-context"
import { NotificationsProvider } from "../contexts/notifications-context"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <NotificationsProvider>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
