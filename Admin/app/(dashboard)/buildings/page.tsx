"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { BuildingDialog } from "@/components/building-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import Link from "next/link"
import { useBuilding } from "@/context/building-context"

export default function BuildingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<any>(null)
  const [deleteBuilding, setDeleteBuilding] = useState<any>(null)
  const { building, getBuilding, deleteBuiding } = useBuilding()

  const filteredBuildings = building.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  // State lưu tòa nhà đang chọn để xóa

  // Hàm gọi API xóa
  const handleDeleteBuilding = async (id: number) => {
    const success = await deleteBuiding(id); // gọi API thực tế
  };


  //call api building
  useEffect(() => {
    fetchBuilding()
  }, [])

  const fetchBuilding = async () => {
    await getBuilding()
  }

  const handleEdit = (building: any) => {
    setEditingBuilding(building)
    setIsDialogOpen(true)
  }

  const handleDelete = (building: any) => {
    fetchBuilding()
    setDeleteBuilding(building)
  }

  const handleAddNew = () => {
    setEditingBuilding(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tòa nhà</h2>
          <p className="text-muted-foreground">Quản lý các tòa nhà căn hộ của bạn</p>
        </div>
        {/* <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tòa nhà
        </Button> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả tòa nhà</CardTitle>
          <CardDescription>Danh sách tất cả tòa nhà căn hộ của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tòa nhà..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Tên</TableHead>
                <TableHead className="w-[250px]">Địa chỉ</TableHead>
                <TableHead className="w-[80px] text-right">Tổng căn</TableHead>
                <TableHead className="w-[80px] text-right">Đã thuê</TableHead>
                <TableHead className="w-[80px] text-right">Trống</TableHead>
                <TableHead className="w-[150px] text-right">Doanh thu tháng</TableHead>
                <TableHead className="w-[70px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredBuildings.map((building) => (
                <TableRow key={building.id}>
                  <TableCell className="font-medium truncate max-w-[200px]" title={building.name}>
                    <Link href={`/buildings/${building.id}`} className="hover:underline">
                      {building.name}
                    </Link>
                  </TableCell>

                  <TableCell className="truncate max-w-[250px]" title={building.address}>
                    {building.address}
                  </TableCell>

                  <TableCell className="text-right">{building.totalUnits}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">{building.occupiedUnits}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{building.vacantUnits}</Badge>
                  </TableCell>

                  <TableCell className="text-right truncate max-w-[150px]" title={`${Number(building.totalRents ?? 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} VND`}>
                    {Number(building.totalRents ?? 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} VND
                  </TableCell>


                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/buildings/${building.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(building)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(building)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BuildingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} building={editingBuilding} />

      <DeleteConfirmDialog
        open={!!deleteBuilding}
        onOpenChange={() => setDeleteBuilding(null)}
        title="Xóa tòa nhà"
        description={`Bạn có chắc chắn muốn xóa "${deleteBuilding?.name}" không? Hành động này sẽ không thể hoàn tác.`}
        onConfirm={() => {
          if (deleteBuilding) {
            handleDeleteBuilding(deleteBuilding.id);
            setDeleteBuilding(null);
          }
        }}
      />
    </div>
  )
}
