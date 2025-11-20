"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context"

// Định nghĩa kiểu User
type User = {
    emailVerified: boolean
}

// Định nghĩa props cho LoginForm
type LoginFormProps = {
    onSuccess?: (user: User) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false) // state loading

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: Record<string, string> = {}

        if (!formData.email) {
            newErrors.email = "Vui lòng nhập email"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu"
        }

        // Nếu có lỗi validation, không gửi API
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true) // bật loading

        try {
            const res = await login(formData.email, formData.password)
            if (res) {
                if (res.email_verified_at == null) {
                    const fakeUser: User = { emailVerified: false }
                    return onSuccess?.(fakeUser)
                }
                window.location.href = "/";
            }
        } catch (error) {
            setErrors({ general: "Đăng nhập thất bại. Vui lòng thử lại." })
        } finally {
            setIsLoading(false) // tắt loading
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                </Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Mật khẩu
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {/* Login button */}
            <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                disabled={isLoading} // disable khi loading
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>

            <div className="text-center">
                <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground">
                    Quên mật khẩu?
                </Button>
            </div>
        </form>
    )
}
