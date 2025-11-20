"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, ArrowLeft, CheckCircle, X, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usebooking } from "@/context/booking-context"
import { useParams } from "next/navigation"

export default function PaymentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "cancelled">("pending")
  const { infoPayment, getInfoPayment, markAsPaid } = usebooking()
  const { id } = useParams()


  useEffect(() => {
    // ✅ dùng async function đúng cách trong useEffect
    const fetchData = async () => {
      if (id) {
        const success = await getInfoPayment(id as string)
        if (!success) {
          console.error("❌ Không thể lấy thông tin thanh toán!")
        }
      }
    }

    fetchData()
  }, [id]) // ✅ thêm id vào dependency array


  const paymentDetails = {
    accountNumber: infoPayment?.rental_order?.owner?.bank_account_number ?? "",
    bankCode: infoPayment?.rental_order?.owner?.bank_name ?? "",
    accountName: infoPayment?.rental_order?.owner?.name ?? "",
    apartmentName: infoPayment?.rental_order?.contract?.landlord_data?.address ?? "",
    amount: Number(infoPayment?.rental_order?.contract?.monthly_rent ?? 0),
    month: "Tháng " + (infoPayment?.month ?? ""),
    dueDate: infoPayment?.period_start ?? "",
    transactionId: "Thanh toán " + (infoPayment?.rental_order?.contract?.apartment_address ?? ""),
  }

  // ✅ Tạo URL QR an toàn
  const qrUrl = `https://img.vietqr.io/image/${paymentDetails.bankCode}-${paymentDetails.accountNumber}-compact2.jpg?amount=${encodeURIComponent(
    paymentDetails.amount
  )}&addInfo=${encodeURIComponent(paymentDetails.transactionId)}&accountName=${encodeURIComponent(
    paymentDetails.accountName
  )}`

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

  const handlePaymentConfirm = async () => {
    await markAsPaid(id as string)
    setTimeout(() => router.push("/dashboard"), 2500)
  }

  const handleCancel = () => {
    setPaymentStatus("cancelled")
    setTimeout(() => router.push("/dashboard"), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-10">
      <AnimatePresence mode="wait">
        {paymentStatus === "pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl"
          >
            <div className="mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại Dashboard
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Thông tin thanh toán */}
              <Card className="bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                      Thông tin thanh toán
                    </CardTitle>
                    <span className="text-sm text-gray-400">An toàn - Bảo mật</span>
                  </div>
                  <CardDescription className="text-gray-400 mt-1">
                    Vui lòng quét mã QR để thực hiện thanh toán
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-300">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span>Phòng</span>
                    <span className="font-semibold text-white">{paymentDetails.apartmentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span>Kỳ thanh toán</span>
                    <span className="font-semibold text-white">{paymentDetails.month}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span>Hạn thanh toán</span>
                    <span className="font-semibold text-white">
                      {new Date(paymentDetails.dueDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-medium text-gray-400">Tổng số tiền</span>
                    <span className="text-3xl font-bold text-blue-400">
                      {formatCurrency(paymentDetails.amount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card className="bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-white flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-400" /> Mã QR Thanh Toán
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Quét bằng app ngân hàng để chuyển khoản
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <img
                      src={qrUrl}
                      alt="QR Code thanh toán"
                      className="w-64 h-64 rounded-md object-cover"
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 w-full text-center">
                    <p className="text-gray-300 text-sm mb-1">Nội dung chuyển khoản</p>
                    <p className="font-mono text-blue-300 font-semibold">
                      {paymentDetails.transactionId}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button
                      onClick={handlePaymentConfirm}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 transition-all"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Đã thanh toán
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <X className="w-4 h-4 mr-2" /> Hủy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Thanh toán thành công */}
        {paymentStatus === "paid" && (
          <motion.div
            key="paid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-6"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
            <h2 className="text-3xl font-bold text-white">Thanh toán thành công</h2>
            <p className="text-gray-400">Cảm ơn bạn đã hoàn tất giao dịch!</p>
            <p className="text-blue-400 font-mono">{paymentDetails.transactionId}</p>
          </motion.div>
        )}

        {/* Hủy thanh toán */}
        {paymentStatus === "cancelled" && (
          <motion.div
            key="cancelled"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-6"
          >
            <X className="w-20 h-20 text-red-400 mx-auto" />
            <h2 className="text-3xl font-bold text-white">Đã hủy thanh toán</h2>
            <p className="text-gray-400">Giao dịch của bạn đã bị hủy.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
