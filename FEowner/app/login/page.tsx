
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
    document.title = "Đăng nhập / Đăng ký | StayTalk"
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
              <CardTitle className="text-2xl font-bold text-foreground">Chào mừng trở lại</CardTitle>
              <CardDescription className="text-muted-foreground">
                Đăng nhập vào tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm onSuccess={handleLoginSuccess} />
              <button
                onClick={() => setStep("register")}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                👉 Chưa có tài khoản? Đăng ký
              </button>
            </CardContent>
          </Card>
        )}

        {step === "register" && (
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Tạo tài khoản</CardTitle>
              <CardDescription className="text-muted-foreground">
                Điền thông tin để tạo tài khoản mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm onSuccess={handleLoginSuccess} />
              <button
                onClick={() => setStep("login")}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                🔙 Quay lại đăng nhập
              </button>
            </CardContent>
          </Card>
        )}

        {step === "otp" && (
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Xác thực email</CardTitle>
              <CardDescription className="text-muted-foreground">
                Nhập mã xác thực để hoàn tất đăng ký
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OtpVerification />
              <button
                onClick={() => setStep("login")}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                🔙 Quay lại đăng nhập
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
