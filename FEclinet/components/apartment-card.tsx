import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Apartment } from "@/lib/data"

type ApartmentCardProps = {
  apartment: Apartment
}

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Card className="w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Image
        src={apartment.image || "/placeholder.svg"}
        alt={apartment.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{apartment.name}</h3>
        <p className="text-gray-600 mb-2">Giá: {apartment.price.toLocaleString("vi-VN")} VNĐ/tháng</p>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{apartment.description}</p>
        <Link href={`/apartment/${apartment.id}`} passHref>
          <Button className="w-full">Xem chi tiết</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
