"use client"

import { useRef, useState, useEffect } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Edit3, Plus, PenLine, Shield, Sparkles, FileCheck } from "lucide-react"

import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { SignatureAPI } from "@/services/api"

export default function SignaturePage() {
  const sigCanvas = useRef<SignatureCanvas | null>(null)
  const [savedSignature, setSavedSignature] = useState<string | null>(null)
  const [showCanvas, setShowCanvas] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const { setUsers } = useAuth()
  useEffect(() => {
    getsignature()
  }, [])

  async function getsignature() {
    try {
      const res = await SignatureAPI.get()
      if (res.data.success && res.data.data.signature) {
        setSavedSignature(res.data.data.signature)
      }
    } catch (error) {
      console.error("Lỗi khi lấy chữ ký:", error)
    }
  }

  const handleClear = () => {
    sigCanvas.current?.clear()
  }

  const handleSave = async () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Vui lòng ký trước khi lưu!")
      return
    }

    setIsLoading(true)

    try {
      const data = sigCanvas.current?.getCanvas().toDataURL("image/png")
      const res = await SignatureAPI.create(data)
      if (res.data.success) {
        toast.success("Lưu chữ ký thành công 🎉")
        localStorage.setItem("userSignature", data || "")
        setSavedSignature(data || null)
        setShowCanvas(false)
        setShowSuccessMessage(true)
        setUsers(null)
      }
    } catch (error) {
      console.error("Lỗi khi lưu chữ ký:", error)
      toast.error("Có lỗi xảy ra khi lưu chữ ký, vui lòng thử lại!")
    } finally {
      setIsLoading(false)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }
  }

  const handleAddNew = () => {
    setShowCanvas(true)
    setShowSuccessMessage(false)
  }

  const handleSignAgain = () => {
    setShowCanvas(true)
    setShowSuccessMessage(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="inset-0 bg-[radial-gradient(ellipse_at_top,_var(--secondary)_0%,_transparent_50%)] opacity-60" />
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <PenLine className="h-10 w-10 text-primary" />
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="p-3 bg-accent/10 rounded-2xl">
              <Shield className="h-10 w-10 text-accent" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">
            Chữ ký điện tử
            <span className="text-primary"> an toàn</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Tạo và quản lý chữ ký điện tử của bạn một cách an toàn, tiện lợi và chuyên nghiệp
          </p>

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              <span>Bảo mật cao</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Dễ sử dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Tuân thủ pháp lý</span>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Alert className="border-primary/20 bg-primary/5 shadow-lg backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-primary" />
                <AlertDescription className="text-primary font-medium">
                  Chữ ký của bạn đã được lưu thành công và sẵn sàng sử dụng.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="mb-10 border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10 shadow-lg backdrop-blur-sm">
            <CardContent className="pt-6">
              <Alert className="border-none bg-transparent">
                <Shield className="h-5 w-5 text-accent" />
                <AlertDescription className="text-accent-foreground leading-relaxed text-base">
                  <strong className="font-semibold">Lưu ý quan trọng:</strong> Chữ ký này sẽ được sử dụng thay thế chữ
                  ký thật của bạn trong các hợp đồng và giấy tờ liên quan. Vui lòng ký chính xác và chỉ ký khi bạn hoàn
                  toàn đồng ý.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="mb-10 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-card-foreground">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Edit3 className="h-6 w-6 text-primary" />
                </div>
                Chữ ký hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedSignature ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className="inline-block p-8 border-2 border-dashed border-primary/20 rounded-3xl bg-background/50 mb-6 shadow-inner backdrop-blur-sm">
                    <img
                      src={savedSignature || "/placeholder.svg"}
                      alt="Chữ ký hiện tại"
                      className="max-w-full h-auto drop-shadow-sm"
                      style={{ maxHeight: "180px" }}
                    />
                  </div>
                  <Button
                    onClick={handleSignAgain}
                    variant="outline"
                    size="lg"
                    className="gap-3 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 font-medium bg-transparent"
                  >
                    <Edit3 className="h-5 w-5" />
                    Ký lại
                  </Button>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <PenLine className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-lg text-muted-foreground mb-2">Bạn chưa có chữ ký nào</p>
                    <p className="text-sm text-muted-foreground">Tạo chữ ký điện tử đầu tiên của bạn</p>
                  </div>
                  <Button
                    onClick={handleAddNew}
                    size="lg"
                    className="gap-3 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                  >
                    <Plus className="h-5 w-5" />
                    Thêm chữ ký mới
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showCanvas && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-xl">
                      <Sparkles className="h-6 w-6 text-accent" />
                    </div>
                    Tạo chữ ký mới
                  </CardTitle>
                  <p className="text-muted-foreground">Vẽ chữ ký của bạn trong khung bên dưới</p>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="inline-block border-2 border-dashed border-primary/30 rounded-3xl bg-background/80 mb-8 shadow-inner backdrop-blur-sm overflow-hidden">
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor="#374151"
                        canvasProps={{
                          width: 700,
                          height: 280,
                          className: "sigCanvas",
                        }}
                      />
                    </div>

                    <div className="flex gap-4 justify-center flex-wrap">
                      <Button
                        variant="outline"
                        onClick={handleClear}
                        size="lg"
                        className="gap-2 hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive transition-all duration-200 bg-transparent"
                      >
                        Xóa
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        size="lg"
                        className="min-w-[160px] gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Lưu chữ ký
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowCanvas(false)}
                        size="lg"
                        className="gap-2 hover:bg-muted transition-all duration-200"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
