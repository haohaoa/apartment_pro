"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, RefreshCw, CheckCircle } from "lucide-react"
import {useAuth} from "@/context/auth-context"

export function OtpVerification() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [error, setError] = useState("")
    const [isVerified, setIsVerified] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const { user ,resendOTP, verifyOTP } = useAuth()

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) return // Only allow single digit

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError("")

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        const newOtp = [...otp]

        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i]
        }
        setOtp(newOtp)

        // Focus the next empty input or the last input
        const nextIndex = Math.min(pastedData.length, 5)
        inputRefs.current[nextIndex]?.focus()
    }

    const handleVerify = async () => {
        const otpCode = otp.join("")

        if (otpCode.length !== 6) {
            setError("Vui lòng nhập đầy đủ 6 chữ số")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            // Simulate API call
           const res = await verifyOTP(Number(otpCode), String(user?.email) )
            console.log(res);
            
            // Simulate verification (replace with actual API call)
            if (res) {
                setIsVerified(true)
            } else {
                setError("Mã OTP không chính xác. Vui lòng thử lại.")
            }
        } catch (err) {
            setError("Có lỗi xảy ra. Vui lòng thử lại.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        setIsResending(true)
        setError("")

        try {
            // Simulate API call
            await resendOTP(String(user?.email))
            setCountdown(60) // 60 seconds countdown
            setOtp(["", "", "", "", "", ""]) // Clear current OTP
            inputRefs.current[0]?.focus()
        } catch (err) {
            setError("Không thể gửi lại mã. Vui lòng thử lại.")
        } finally {
            setIsResending(false)
        }
    }

    if (isVerified) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Xác thực thành công!</h3>
                    <p className="text-muted-foreground">Email của bạn đã được xác thực thành công.</p>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => {window.location.href = "/login"}}
                >Quay về đăng nhập</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex justify-center">
                    <div className="p-3 bg-accent/10 rounded-full">
                        <Mail className="h-6 w-6 text-accent" />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">Chúng tôi đã gửi mã xác thực 6 chữ số đến email của bạn</p>
                <p className="text-sm font-medium text-foreground">example@email.com</p>
            </div>

            <div className="space-y-4">
                <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                    Nhập mã xác thực
                </Label>

                <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-12 h-12 text-center text-lg font-semibold border-border focus:border-accent focus:ring-accent/20"
                            disabled={isLoading}
                        />

                    ))}
                </div>

                {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </div>

            <div className="space-y-4">
                <Button
                    onClick={handleVerify}
                    disabled={isLoading || otp.join("").length !== 6}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Đang xác thực...
                        </>
                    ) : (
                        "Xác thực"
                    )}
                </Button>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Không nhận được mã?</p>
                    <Button
                        variant="ghost"
                        onClick={handleResend}
                        disabled={isResending || countdown > 0}
                        className="text-black hover:text-black hover:bg-gray-100"
                    >
                        {isResending ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Đang gửi...
                            </>
                        ) : countdown > 0 ? (
                            `Gửi lại sau ${countdown}s`
                        ) : (
                            "Gửi lại mã"
                        )}
                    </Button>
                </div>

            </div>
        </div>
    )
}
