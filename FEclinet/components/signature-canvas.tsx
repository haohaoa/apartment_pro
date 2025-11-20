"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenTool, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react"

interface SignatureCanvasProps {
  tenantSignature: string
  setTenantSignature: (signature: string) => void
  onNext: () => void
  onBack: () => void
}

export function SignatureCanvas({
  tenantSignature,
  setTenantSignature,
  onNext,
  onBack,
}: SignatureCanvasProps) {
  const tenantCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // thiết lập bút vẽ
  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }
  }

  useEffect(() => {
    if (tenantCanvasRef.current) setupCanvas(tenantCanvasRef.current)
  }, [])

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = tenantCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const { x, y } = getMousePos(e, canvas)
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = tenantCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const { x, y } = getMousePos(e, canvas)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = tenantCanvasRef.current
      if (canvas) {
        const dataURL = canvas.toDataURL()
        setTenantSignature(dataURL)
      }
    }
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = tenantCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setTenantSignature("")
      }
    }
  }

  const isFormValid = !!tenantSignature

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" />
            Ký hợp đồng điện tử
          </CardTitle>
          <CardDescription>
            Vui lòng ký tên vào khung bên dưới để hoàn tất hợp đồng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">Chữ ký Bên B (Người thuê)</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Xóa
              </Button>
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-card">
              <canvas
                ref={tenantCanvasRef}
                width={400}
                height={150}
                className="border border-border rounded cursor-crosshair bg-white w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Nhấn và kéo chuột để ký tên
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Button
          onClick={onNext}
          disabled={!isFormValid}
          className="flex items-center gap-2"
        >
          Hoàn tất và xuất PDF
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
