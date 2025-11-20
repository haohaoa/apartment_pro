"use client"

import { Button } from "@/components/ui/button"
import {
  X, Calendar, User, Home, DollarSign,
  FileText, ArrowLeft, MapPin, Phone,
  ExternalLink, XCircle
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { useClickContext } from "@/context/handleClick-context"
import { usebooking } from "@/context/booking-context"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ViewingSchedule } from "@/lib/types"
import Swal from "sweetalert2"
import Image from "next/image"

export function BookingPanel() {
  const { isBookingPanelOpen, BookingPanel, allbooking, setallbooking } = useClickContext()
  const { listbooking, fetchAllBooking, deleteBooking } = usebooking()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await fetchAllBooking()
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (user && isBookingPanelOpen) fetchData()
  }, [user, isBookingPanelOpen])

  const handleBookingClick = (bk: ViewingSchedule) => setallbooking(bk)
  const handleBackToList = () => setallbooking(null)

  const handleCancelBooking = (id: number) => {
    Swal.fire({
      title: `Hủy lịch đặt phòng?`,
      text: `Bạn có chắc chắn muốn hủy lịch đặt phòng cho căn hộ "${allbooking?.apartment?.title}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, hủy ngay",
      cancelButtonText: "Không",
      confirmButtonColor: "#7C3AED"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(id)
          .then(() => {
            setallbooking(null)
            Swal.fire({
              title: "Đã hủy thành công!",
              icon: "success",
              confirmButtonColor: "#7C3AED"
            })
          })
          .catch(() => {
            Swal.fire({
              title: "Hủy thất bại!",
              text: "Vui lòng thử lại.",
              icon: "error",
              confirmButtonColor: "#7C3AED"
            })
          })
      }
    })
  }

  const handleSignContract = () => {
    const apartmentId = allbooking?.id || null
    if (apartmentId) window.location.href = `/contract?apartmentId=${apartmentId}`
  }

  return (
    <AnimatePresence>
      {isBookingPanelOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-0 right-0 h-full w-full md:w-[460px]
          bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(124,58,237,0.15)]
          z-50 border-l border-indigo-100 rounded-l-2xl overflow-hidden"
        >
          <div className="flex flex-col h-full">

            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 text-white shadow-md">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <h2 className="text-lg font-semibold tracking-wide">Lịch đặt phòng</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={BookingPanel}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* CHƯA ĐĂNG NHẬP */}
            {!user && (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <User className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                  <p className="text-gray-700 font-medium">
                    Vui lòng đăng nhập để xem lịch đặt phòng.
                  </p>
                </div>
              </div>
            )}

            {/* ĐÃ ĐĂNG NHẬP */}
            {user && (
              <>
                {allbooking ? (
                  // --- CHI TIẾT BOOKING ---
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 overflow-y-auto p-6"
                  >
                    <Button
                      variant="ghost"
                      onClick={handleBackToList}
                      className="mb-6 hover:bg-indigo-50 text-indigo-600"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại danh sách
                    </Button>

                    <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
                      <CardContent className="p-6 space-y-6">
                        {/* ẢNH ĐẠI DIỆN */}
                        <div className="relative h-48 rounded-xl overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_URL_IMG}${allbooking?.apartment?.images?.[0]?.image_url || "/placeholder.svg"}`}
                            alt="apartment"
                            width={80}
                            height={60}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                            <h3 className="text-lg font-semibold">
                              {allbooking.apartment?.title}
                            </h3>
                          </div>
                        </div>

                        {/* THÔNG TIN */}
                        <div className="space-y-3 text-sm text-gray-700">
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            {allbooking.apartment?.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" />
                            {allbooking.apartment?.building?.owner?.name}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-indigo-500" />
                            {allbooking.apartment?.building?.owner?.phone ?? "Chưa có"}
                          </p>
                        </div>

                        {/* GIÁ */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-4 text-center text-xl font-bold shadow-inner">
                          {(Number(allbooking.apartment?.price) || 0).toLocaleString("vi-VN")} ₫ / tháng
                        </div>

                        {/* NÚT HÀNH ĐỘNG */}
                        <div className="flex flex-col gap-3 pt-2">
                          <Button
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-md"
                            onClick={handleSignContract}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Ký hợp đồng
                          </Button>
                          <Button
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md"
                            onClick={() => handleCancelBooking(allbooking.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Hủy đặt lịch
                          </Button>
                          <Link
                            href={`/apartment/${allbooking.apartment?.id}`}
                            className="w-full flex items-center justify-center gap-2 border border-indigo-200 text-indigo-600 font-semibold py-2 rounded-lg hover:bg-indigo-50 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Xem chi tiết căn hộ
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : loading ? (
                  // --- LOADING ---
                  <div className="flex justify-center items-center h-full bg-white/80 backdrop-blur-sm">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"
                    />
                  </div>
                ) : (
                  // --- DANH SÁCH BOOKING ---
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {listbooking?.data.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Calendar className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                          <p className="text-gray-600 font-medium">Chưa có lịch đặt phòng nào.</p>
                        </div>
                      </div>
                    ) : (
                      listbooking?.data.map((bk: ViewingSchedule) => (
                        <motion.div
                          key={bk.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Card
                            className="cursor-pointer bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300 rounded-xl overflow-hidden"
                            onClick={() => handleBookingClick(bk)}
                          >
                            <CardContent className="p-4 flex gap-3">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_URL_IMG}${bk?.apartment?.images?.[0]?.image_url || "/placeholder.svg"}`}
                                alt={bk.apartment?.title}
                                width={80}
                                height={60}
                                className="w-20 h-20 rounded-lg object-cover shadow-sm"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-1 mb-1">
                                  <Home className="w-4 h-4 text-indigo-500" />
                                  {bk.apartment?.title}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-4 h-4" /> {bk.scheduled_at}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <User className="w-4 h-4" /> {bk.apartment?.building?.owner?.name}
                                </p>
                              </div>
                              <div className="text-[11px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded-full self-start">
                                Đang chờ
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
