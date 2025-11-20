"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, FileText, Wrench, MapPin, Home, Users, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useBuilding } from "@/context/building-context"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import EditApartmentForm from "@/components/update-apartment-form"
export default function UnitDetailPage() {
  const router = useRouter()
  const { apartments, viewApartment } = useBuilding()
  const [openCreate, setOpenCreate] = useState(false);
  const params = useParams();

  // 🟢 Gọi API khi vào trang
  useEffect(() => {
    if (params?.id) {
      viewApartment(Number(params.id))
    }
  }, [params])
  
  if (!apartments?.id) {
    return <div className="text-center p-10 text-muted-foreground">Đang tải dữ liệu căn hộ...</div>
  }

  const unit = apartments
  const contractStatusMap: Record<string, string> = {
    pending: "Đang chờ xử lý",
    approved: "Đã duyệt",
    rejected: "Bị từ chối",
    completed: "Hoàn thành",
    check_out: "Đã trả nhà",
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary">Còn trống</Badge>
      case "rented":
        return <Badge variant="default">Đã thuê</Badge>
      case "maintenance":
        return <Badge variant="destructive">Bảo trì</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{unit?.title}</h2>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {unit?.address}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Wrench className="mr-2 h-4 w-4" />
            Báo bảo trì
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Tạo hợp đồng
          </Button>
          <Button onClick={() => setOpenCreate(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Sửa căn hộ
          </Button>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <EditApartmentForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Thông tin tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{unit?.status_text || "còn trống"}</div>
            <p className="text-xs text-muted-foreground">Số phòng: {unit?.id}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tiền thuê</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(unit?.price).toLocaleString("vi-VN")}₫
            </div>
            <p className="text-xs text-muted-foreground">
              Tiền cọc: {Number(unit?.deposit).toLocaleString("vi-VN")}₫
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tòa nhà</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{unit?.building?.name}</div>
            <p className="text-xs text-muted-foreground">ID: {unit?.building?.id}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ngày tạo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold">
              {new Date(unit?.created_at).toLocaleDateString("vi-VN")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="contracts">Hợp đồng</TabsTrigger>
          <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
        </TabsList>

        {/* Tổng quan */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả căn hộ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{unit?.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hợp đồng */}
        {/* Hợp đồng */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Hợp đồng thuê</CardTitle>
              <CardDescription>Danh sách hợp đồng của căn hộ</CardDescription>
            </CardHeader>
            <CardContent>
              {unit?.rental_orders?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách thuê</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hành động</TableHead> {/* thêm cột mới */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unit?.rental_orders.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.user?.name}</TableCell>
                        <TableCell>
                          {r.start_date} - {r.end_date}
                        </TableCell>
                        <TableCell>{contractStatusMap[r.status] || r.status}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/contracts/${r.id}`)} // chuyển sang trang chi tiết hợp đồng
                          >
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-sm">Chưa có hợp đồng nào</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>


        {/* Bảo trì */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử bảo trì</CardTitle>
            </CardHeader>
            <CardContent>
              {unit?.maintenance_requests?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unit?.maintenance_requests.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.description}</TableCell>
                        <TableCell>{m.status}</TableCell>
                        <TableCell>{m.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-sm">Không có yêu cầu bảo trì</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hình ảnh */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unit?.images?.map((img) => (
                  <div key={img.id} className="aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_URL_IMG}${img.image_url}`}
                      alt={unit?.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
