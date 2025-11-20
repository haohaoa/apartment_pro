import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { AppProvider } from "@/context/app-context"
import { Header } from "@/components/header"
import { ChatPanel } from "@/components/chat-panel"
import { BookingPanel } from "@/components/booking-panel"
import { FloatingActionButtons } from "@/components/floating-action-buttons"
import { Footer } from "@/components/footer"
import { AIChatProvider } from "@/context/chat-context"
import { ApartmentProvider } from "@/context/apartment-context"
import { BookingProvider } from "@/context/booking-context"
import { ClickProvider } from "@/context/handleClick-context"
import { ToastContainer } from 'react-toastify';
import { NotificationProvider } from "@/context/notification-context"
import { Toaster } from "sonner"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quản lý căn hộ",
  description: "Ứng dụng quản lý căn hộ với AI chat và booking",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          <ClickProvider>
            <BookingProvider>
              <ApartmentProvider>
                <AIChatProvider>
                  <AuthProvider>
                    <AppProvider>
                      <Header />
                      <main className="flex-1 pt-16">
                        {" "}
                        {/* Add padding-top equal to header height */}
                        {children}
                      </main>
                      <Toaster richColors position="top-right" expand={true} duration={4000} />
                      <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                      />
                      <ChatPanel />
                      <BookingPanel />
                      <FloatingActionButtons />
                      <Footer />
                    </AppProvider>
                  </AuthProvider>
                </AIChatProvider>
              </ApartmentProvider>
            </BookingProvider>
          </ClickProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
