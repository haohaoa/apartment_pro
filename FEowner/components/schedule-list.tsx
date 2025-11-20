"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Calendar, Clock, CheckCircle, XCircle, Hourglass } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useViewschedule } from "@/context/ViewingSchedule-context"

export default function ScheduleList() {
  const { getSchedule, listViewingSchedule } = useViewschedule()

  useEffect(() => {
    getSchedule() // Gọi API khi load trang
  }, [])

  const formatPrice = (price: string | number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(price))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return { label: "Đã xác nhận", color: "bg-green-100 text-green-600", icon: <CheckCircle className="w-4 h-4" /> }
      case "pending":
        return { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700", icon: <Hourglass className="w-4 h-4" /> }
      case "cancelled":
        return { label: "Đã hủy", color: "bg-red-100 text-red-600", icon: <XCircle className="w-4 h-4" /> }
      default:
        return { label: "Không xác định", color: "bg-gray-100 text-gray-600", icon: null }
    }
  }

  const schedules = listViewingSchedule || []

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Lịch Xem Phòng</h1>
        <p className="text-sm text-muted-foreground mt-1">{schedules.length} lịch hẹn</p>
      </div>

      {/* Grid view */}
      <div className="flex-1 overflow-y-auto p-4">
        {schedules.length === 0 ? (
          <div className="text-center text-muted-foreground mt-10">Chưa có lịch hẹn nào.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => {
              const statusStyle = getStatusStyle(schedule.status)
              const apartment = schedule.apartment

              return (
                <Link
                  href={`/schedule/${schedule.id}`}
                  key={schedule.id}
                  className="block bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  {/* Hình ảnh + Trạng thái */}
                  <div className="relative w-full h-36 overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_URL_IMG}${apartment.images?.[0]?.image_url || "/placeholder.svg"}`}
                      alt={apartment.title || "Ảnh căn hộ"}
                      width={200}
                      height={150}
                      className="w-full h-36 object-cover rounded-xl"
                    />
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusStyle.color}`}
                    >
                      {statusStyle.icon}
                      <span>{statusStyle.label}</span>
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                      {apartment?.title || "Không có tên căn hộ"}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{apartment?.address}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(apartment?.price || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(schedule.scheduled_at)}</span>
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{new Date(schedule.scheduled_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
