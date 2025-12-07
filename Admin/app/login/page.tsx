
"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { OtpVerification } from "@/components/otp-verification"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthPage() {
  // login | register | otp
  const [step, setStep] = useState<"login" | "register" | "otp">("login")
  useEffect(() => {
    document.title = "Quản trị viên | StayTalk"
  }, [])

  const handleLoginSuccess = (user: { emailVerified: boolean }) => {
    console.log("Login thành công:", user)
    if (!user.emailVerified) {
      setStep("otp") // chỉ đổi khi bạn muốn
    } 
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "login" && (
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-foreground">ADMIN</CardTitle>
              <CardDescription className="text-muted-foreground">
                Đăng nhập vào tài khoản quản trị
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm onSuccess={handleLoginSuccess} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
