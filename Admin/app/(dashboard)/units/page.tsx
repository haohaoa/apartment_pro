"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, FileText, Wrench } from "lucide-react"
import Link from "next/link"

const units = [
  {
    id: "1",
    unitNumber: "A-101",
    building: "Chung cư Hoàng Hôn",
    buildingId: "1",
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
    rent: 12000000,
    status: "occupied",
    tenant: "Nguyễn Thị Lan",
  },
  {
    id: "2",
    unitNumber: "A-102",
    building: "Chung cư Hoàng Hôn",
    buildingId: "1",
    area: 90,
    bedrooms: 2,
    bathrooms: 2,
    rent: 13500000,
    status: "vacant",
    tenant: null,
  },
  {
    id: "3",
    unitNumber: "B-205",
    building: "Tòa Hướng Biển",
    buildingId: "2",
    area: 110,
    bedrooms: 3,
    bathrooms: 2,
    rent: 15000000,
    status: "maintenance",
    tenant: "Trần Văn Nam",
  },
  {
    id: "4",
    unitNumber: "C-301",
    building: "Trung tâm Thành phố",
    buildingId: "3",
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    rent: 18000000,
    status: "occupied",
    tenant: "Lê Thị Hoa",
  },
]

const buildings = [
  { id: "1", name: "Chung cư Hoàng Hôn" },
  { id: "2", name: "Tòa Hướng Biển" },
  { id: "3", name: "Trung tâm Thành phố" },
  { id: "4", name: "Khu Vườn Cao" },
]

export default function UnitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [buildingFilter, setBuildingFilter] = useState("all")

  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.tenant && unit.tenant.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || unit.status === statusFilter
    const matchesBuilding = buildingFilter === "all" || unit.buildingId === buildingFilter

    return matchesSearch && matchesStatus && matchesBuilding
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "occupied":
        return <Badge variant="default">Đã thuê</Badge>
      case "vacant":
        return <Badge variant="secondary">Trống</Badge>
      case "maintenance":
        return <Badge variant="destructive">Bảo trì</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Căn hộ</h2>
          <p className="text-muted-foreground">Quản lý các căn hộ của bạn</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm căn hộ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả căn hộ</CardTitle>
          <CardDescription>Danh sách tất cả căn hộ trong các tòa nhà của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm căn hộ, khách thuê..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo tòa nhà" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tòa nhà</SelectItem>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="occupied">Đã thuê</SelectItem>
                <SelectItem value="vacant">Trống</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Tòa nhà</TableHead>
                <TableHead>Diện tích</TableHead>
                <TableHead>PN/WC</TableHead>
                <TableHead>Tiền thuê</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Khách thuê</TableHead>
                <TableHead className="w-[70px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">
                    <Link href={`/units/${unit.id}`} className="hover:underline">
                      {unit.unitNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{unit.building}</TableCell>
                  <TableCell>{unit.area} sq ft</TableCell>
                  <TableCell>
                    {unit.bedrooms}BR/{unit.bathrooms}BA
                  </TableCell>
                  <TableCell>${unit.rent}</TableCell>
                  <TableCell>{getStatusBadge(unit.status)}</TableCell>
                  <TableCell>{unit.tenant || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/units/${unit.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Sửa căn hộ
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Tạo hợp đồng
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Wrench className="mr-2 h-4 w-4" />
                          Báo bảo trì
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
    </div>
  )
}
