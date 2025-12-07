import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { AuthProvider } from "@/context/auth-context"
import { BuildingProvider } from "@/context/building-context"
import { Toaster } from "sonner"
import { ContractProvider } from '@/context/contract-context'
import { NotificationProvider } from "@/context/notification-context"
import { ViewingScheduleProvider } from "@/context/ViewingSchedule-context"
import { MaintenanceProvider } from "@/context/maintenance-context"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Apartment Management System",
  description: "Manage your apartment buildings and units efficiently",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MaintenanceProvider>
          <ViewingScheduleProvider>
            <NotificationProvider>
              <ContractProvider>
                <BuildingProvider>
                  <AuthProvider>
                    <Providers>
                      {children}
                      {/* 🔔 Toast của sonner */}
                      <Toaster richColors position="top-right" expand={true} duration={4000} />
                    </Providers>
                  </AuthProvider>
                </BuildingProvider>
              </ContractProvider>
            </NotificationProvider>
          </ViewingScheduleProvider>
        </MaintenanceProvider>
      </body>
    </html>
  )
}
