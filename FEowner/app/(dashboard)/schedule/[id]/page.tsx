"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  Trash2,
  ArrowLeft,
  Bed,
  Bath,
  Ruler,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useViewschedule } from "@/context/ViewingSchedule-context"
import Image from "next/image"

export default function ScheduleDetailPage() {
  const params = useParams()
  const scheduleId = params.id as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { viewSchedule, getScheduleById , deleleScheduleById} = useViewschedule()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if (scheduleId) {
        const data = await getScheduleById(scheduleId)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const formatPrice = (price: string | number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(price))

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleCancelSchedule = () => {
    deleleScheduleById(scheduleId);
    setShowCancelConfirm(false)
  }

  if (loading) return <p className="text-center py-20">Đang tải dữ liệu...</p>
  if (!viewSchedule) return <p className="text-center py-20">Không tìm thấy lịch hẹn</p>

  const detail = viewSchedule

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-card border-b border-border z-20 px-6 py-4 flex items-center justify-between">
        <Link href="/schedule" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại</span>
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Chi tiết lịch xem phòng</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Image Carousel */}
        <div className="relative w-full h-[420px] bg-muted">
          <Image
            src={`${process.env.NEXT_PUBLIC_URL_IMG}${detail.apartment?.images?.[currentImageIndex]?.image_url || "/placeholder.svg"}`}
            alt={detail.apartment?.title || "Ảnh căn hộ"}
            width={200}
            height={150}
            className="w-full h-full object-cover rounded-none"
          />
          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {detail.apartment?.images?.map((_, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentImageIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <section className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Title & Address */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{detail.apartment?.title}</h2>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 mt-1" />
              <p>{detail.apartment?.address}</p>
            </div>
            <p className="text-2xl font-semibold text-primary">{formatPrice(detail.apartment?.price)}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Mô tả</h3>
            <p className="text-muted-foreground leading-relaxed">{detail.apartment?.description}</p>
          </div>

          {/* Schedule Info */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Thông tin lịch xem</h3>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày xem</p>
                <p className="font-medium text-foreground">{formatDate(detail.scheduled_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Thời gian</p>
                <p className="font-medium text-foreground">{new Date(detail.scheduled_at).toLocaleTimeString("vi-VN")}</p>
              </div>
            </div>
          </div>

          {/* Viewer Info */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Thông tin người xem</h3>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Họ tên</p>
                <p className="font-medium text-foreground">{detail.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="font-medium text-foreground">{detail.user?.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{detail.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <Button variant="destructive" className="flex-1 gap-2" onClick={() => setShowCancelConfirm(true)}>
              <Trash2 className="w-4 h-4" /> Hủy lịch
            </Button>
          </div>
        </section>
      </main>

      {/* Modal Hủy */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">Xác nhận hủy lịch</h3>
            <p className="text-muted-foreground mb-6">
              Bạn có chắc chắn muốn hủy lịch xem phòng này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCancelConfirm(false)}>
                Không
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleCancelSchedule}>
                Hủy lịch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
