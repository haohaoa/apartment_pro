"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Bed, Bath, Maximize } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { Apartment } from "@/lib/types"



type SearchResultCardProps = {
   apartment: Pick<Apartment, "id" | "title" | "address" | "price" | "images" | "rating">;
}

export function SearchResultCard({ apartment }: SearchResultCardProps) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = apartment.images?.[0] || "/modern-apartment-living.png"


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <Link href={`/apartment/${apartment.id}`}>
      <Card className="group overflow-hidden bg-slate-900/50 border-slate-800 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300 h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
          src={`${process.env.NEXT_PUBLIC_URL_IMG}${apartment.images?.[0]?.image_url || "/placeholder.svg"}`}
            alt={apartment.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>

          {/* Rating Badge */}
          {apartment.rating && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-slate-900/90 backdrop-blur-sm border-slate-700 text-white flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {apartment.rating}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {apartment.title}
          </h3>

          <div className="flex items-start gap-2 mb-3">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-400 line-clamp-2">{apartment.address}</p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-500">Giá thuê/tháng</p>
              <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {formatPrice(apartment.price)}
              </p>
            </div>
            {/* {apartment.reviews && <p className="text-xs text-slate-500">{apartment.reviews} đánh giá</p>} */}
          </div>
        </div>
      </Card>
    </Link>
  )
}
