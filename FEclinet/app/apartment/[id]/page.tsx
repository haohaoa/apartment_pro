"use client"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wifi, BedDouble, ShowerHead, Utensils, Waves, AlertCircle, MapPin, Navigation } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useApartment } from "@/context/apartment-context"
import { usebooking } from "@/context/booking-context"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import Swal from "sweetalert2"

export default function ApartmentDetailPage() {
  const { apartment, GetApartmentID } = useApartment()
  const id = useParams().id
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const today = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const { createBooking } = usebooking()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [note, setNote] = useState<string>("")

  useEffect(() => {
    if (id) {
      GetApartmentID(Number(id))
    }
  }, [id])

  const handleBooking = async () => {
    if (!selectedTime) {
      Swal.fire({
        title: "Đặt lịch thất bại!",
        text: "Vui lòng chọn khung giờ.",
        icon: "error",
        confirmButtonText: "OK",
      })
      return
    }
    const date = `${selectedDate} ${selectedTime}:00`
    const bookingData = {
      date,
      apartment_id: apartment?.id || 1,
      note,
    }
    await createBooking(bookingData)
  }

  const openInMaps = () => {
    if (apartment?.building.lat && apartment?.building.lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${apartment?.building.lat},${apartment?.building.lng}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <nav className="text-sm mb-6 flex items-center gap-2 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-3 w-fit">
          <MapPin className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-slate-200">{apartment?.address}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Description */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden mb-8">
              {apartment?.images?.slice(0, 5).map((img, idx) => (
                <div
                  key={img.id}
                  className={`relative ${idx === 0 ? "col-span-2 row-span-2 h-[300px] md:h-[450px]" : "h-[150px] md:h-[220px]"
                    } cursor-pointer group`}
                  onClick={() => {
                    setPhotoIndex(idx)
                    setLightboxOpen(true)
                  }}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_URL_IMG}${img.image_url}`}
                    alt={apartment?.address || "Apartment Image"}
                    fill
                    className="rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-slate-900">
                      Xem ảnh lớn
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && apartment?.images && (
              <Lightbox
                mainSrc={`${process.env.NEXT_PUBLIC_URL_IMG}${apartment.images[photoIndex].image_url}`}
                nextSrc={`${process.env.NEXT_PUBLIC_URL_IMG}${apartment.images[(photoIndex + 1) % apartment.images.length].image_url}`}
                prevSrc={`${process.env.NEXT_PUBLIC_URL_IMG}${apartment.images[(photoIndex + apartment.images.length - 1) % apartment.images.length].image_url}`}
                onCloseRequest={() => setLightboxOpen(false)}
                onMovePrevRequest={() =>
                  setPhotoIndex((photoIndex + apartment.images.length - 1) % apartment.images.length)
                }
                onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % apartment.images.length)}
              />
            )}

            <div className="mb-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {apartment?.address}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium px-4 py-1.5 rounded-full">
                  Căn hộ
                </span>
                {apartment?.building?.lat && apartment?.building?.lng && (
                  <button
                    onClick={openInMaps}
                    className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-purple-300 text-xs font-medium px-4 py-1.5 rounded-full transition-all group"
                  >
                    <Navigation className="w-3 h-3 group-hover:text-purple-400" />
                    <span>
                      {Number(apartment.building.lat).toFixed(6)}, {Number(apartment.building.lng).toFixed(6)}
                    </span>
                  </button>
                )}

              </div>
              <p className="text-slate-300 leading-relaxed">{apartment?.description}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-sm text-blue-200 p-5 rounded-2xl flex items-start gap-3 mb-6">
              <AlertCircle className="w-6 h-6 flex-shrink-0 text-blue-400" />
              <p className="font-medium">Chỉ còn 2 phòng với mức giá tốt nhất này!</p>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl shadow-2xl shadow-purple-500/10">
              <div className="text-center mb-6 pb-6 border-b border-slate-700/50">
                <span className="block text-slate-400 text-sm mb-2">Giá thuê / tháng</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {Number(apartment?.price || 0).toLocaleString("vi-VN")}
                  <span className="text-lg ml-1">VNĐ</span>
                </span>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 p-4 rounded-xl mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                <p className="text-sm font-medium leading-snug">
                  Nên đặt lịch xem phòng sớm vì phòng có thể được khách khác đặt trước.
                </p>
              </div>

              {/* Booking Form */}
              <div className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Chọn ngày xem phòng</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={today}
                    onChange={(e) => {
                      setSelectedDate(e.target.value)
                      setSelectedTime(null)
                    }}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Mặc định là hôm nay. Những khung giờ mờ bên dưới là các khung đã qua.
                  </p>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">Chọn khung giờ</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["07:00", "08:00", "09:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((time) => {
                      const [y, m, d] = (selectedDate || today).split("-").map(Number)
                      const [hh, mm] = time.split(":").map(Number)
                      const slotDate = new Date(y, m - 1, d, hh, mm, 0)
                      const now = new Date()

                      const disabled = slotDate <= now
                      const isActive = selectedTime === time

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            if (disabled) return
                            setSelectedTime(time)
                          }}
                          disabled={disabled}
                          className={`rounded-xl py-2.5 text-sm font-medium transition-all
                  ${isActive
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30"
                              : "bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:border-purple-500/50"
                            }
                  ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-2 text-xs text-slate-400">
                    Khung giờ mờ là đã trôi qua theo thời gian hiện tại.
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Ghi chú thêm cho chủ nhà</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Vui lòng gọi trước khi đến..."
                    rows={3}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-lg py-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all"
                  onClick={handleBooking}
                >
                  Xác nhận đặt lịch
                </Button>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 text-slate-200">Tiện ích chính</h3>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2">
                    <Wifi className="text-purple-400 w-5 h-5" /> Wifi miễn phí
                  </div>
                  <div className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2">
                    <BedDouble className="text-purple-400 w-5 h-5" /> Giường đôi
                  </div>
                  <div className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2">
                    <ShowerHead className="text-purple-400 w-5 h-5" /> Phòng tắm riêng
                  </div>
                  <div className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2">
                    <Utensils className="text-purple-400 w-5 h-5" /> Nhà bếp
                  </div>
                  <div className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2">
                    <Waves className="text-purple-400 w-5 h-5" /> Hồ bơi
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
