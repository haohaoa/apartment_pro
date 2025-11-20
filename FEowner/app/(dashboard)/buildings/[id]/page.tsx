"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ArrowLeft, Edit, MapPin, Trash2, MoreHorizontal, Eye } from "lucide-react"
import Link from "next/link"
import { useBuilding } from "@/context/building-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import CreateApartmentForm from "@/components/add-apartment-form"

export default function BuildingDetailPage({ params }: { params: { id: number } }) {
  const [statusFilter, setStatusFilter] = useState("all")
  const { data, getBuildingById, deleteApartment } = useBuilding()
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Gọi API lấy chi tiết tòa nhà
  useEffect(() => {
    if (params?.id) {
      getBuildingById(params.id)
    }
  }, [params?.id])

  if (!data) return <p>Đang tải dữ liệu...</p>

  const building = data
  const apartments = building.apartments || []

  // Bộ lọc trạng thái
  const filteredUnits = apartments.filter((apt: any) => {
    if (statusFilter === "all") return true
    if (statusFilter === "occupied") return apt.is_rented === true
    if (statusFilter === "vacant") return apt.is_rented === false
    if (statusFilter === "maintenance") return apt.status === "maintenance"
    return true
  })

  // Hàm xóa căn hộ
  const handleDelete = async () => {
    if (!apartmentToDelete) return
    setLoading(true)
    try {
      await deleteApartment(apartmentToDelete)
      setConfirmDelete(false)
    } finally {
      setLoading(false)
      setApartmentToDelete(null)
    }
  }

  const getStatusBadge = (apt: any) => {
    if (apt.is_rented) return <Badge variant="default">Đã thuê</Badge>
    switch (apt.status) {
      case "available": return <Badge variant="secondary">Trống</Badge>
      case "maintenance": return <Badge variant="destructive">Bảo trì</Badge>
      default: return <Badge variant="outline">{apt.status_text}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/buildings">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Tòa nhà
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{building.name}</h2>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {building.address}
          </p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" /> Sửa tòa nhà
        </Button>
      </div>

      {/* Apartments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Căn hộ</CardTitle>
            <CardDescription>Tất cả căn hộ trong {building.name}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="occupied">Đã thuê</SelectItem>
                <SelectItem value="vacant">Trống</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setOpenCreate(true)}>
              <Plus className="mr-2 h-4 w-4" /> Thêm căn hộ
            </Button>
          </div>

          {/* Dialog thêm căn hộ */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogContent className="max-w-4xl">
              <CreateApartmentForm />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Giá thuê</TableHead>
                <TableHead>Đặt cọc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người thuê</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUnits.map((apt: any) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">
                    <Link href={`/units/${apt.id}`} className="hover:underline">
                      {apt.title}
                    </Link>
                  </TableCell>
                  <TableCell>{apt.address}</TableCell>
                  <TableCell>{Number(apt.price).toLocaleString()}đ</TableCell>
                  <TableCell>{Number(apt.deposit).toLocaleString()}đ</TableCell>
                  <TableCell>{getStatusBadge(apt)}</TableCell>
                  <TableCell>{apt.tenant_name || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/units/${apt.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" /> Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setApartmentToDelete(apt.id);
                            setConfirmDelete(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Dialog xác nhận xóa */}
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa căn hộ này không? Hành động này sẽ không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Đang xóa..." : "Xóa"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
