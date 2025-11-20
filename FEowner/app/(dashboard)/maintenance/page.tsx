"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, MoreHorizontal, Eye, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

const maintenanceRequests = [
  {
    id: "BT001",
    unit: "A-101",
    building: "Chung cư Hoàng Hôn",
    buildingId: "1",
    issue: "Vòi nước nhà bếp bị rò rỉ",
    priority: "medium",
    status: "pending",
    reportedDate: "15/01/2024",
    tenant: "Nguyễn Thị Lan",
    description: "Vòi nước nhà bếp đã rò rỉ liên tục trong 3 ngày",
  },
  {
    id: "BT002",
    unit: "B-205",
    building: "Tòa Hướng Biển",
    buildingId: "2",
    issue: "Điều hòa không hoạt động",
    priority: "high",
    status: "in-progress",
    reportedDate: "14/01/2024",
    tenant: "Trần Văn Nam",
    description: "Máy điều hòa hoàn toàn ngừng hoạt động, không có gió lạnh",
  },
  {
    id: "BT003",
    unit: "C-301",
    building: "Trung tâm Thành phố",
    buildingId: "3",
    issue: "Cơ chế khóa cửa bị kẹt",
    priority: "low",
    status: "pending",
    reportedDate: "13/01/2024",
    tenant: "Lê Thị Hoa",
    description: "Khóa cửa chính khó xoay, chìa khóa bị kẹt",
  },
  {
    id: "BT004",
    unit: "A-205",
    building: "Chung cư Hoàng Hôn",
    buildingId: "1",
    issue: "Cửa sổ phòng ngủ bị vỡ",
    priority: "high",
    status: "resolved",
    reportedDate: "10/01/2024",
    tenant: "Phạm Văn Đức",
    description: "Cửa sổ phòng ngủ bị nứt, cần thay thế",
    resolvedDate: "12/01/2024",
  },
]

const buildings = [
  { id: "1", name: "Sunset Towers" },
  { id: "2", name: "Ocean View" },
  { id: "3", name: "City Center" },
  { id: "4", name: "Garden Heights" },
]

export default function MaintenancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [buildingFilter, setBuildingFilter] = useState("all")

  const filteredRequests = maintenanceRequests.filter((request) => {
    const matchesSearch =
      request.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenant.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesBuilding = buildingFilter === "all" || request.buildingId === buildingFilter

    return matchesSearch && matchesPriority && matchesStatus && matchesBuilding
  })

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>
      case "medium":
        return <Badge variant="default">Trung bình</Badge>
      case "low":
        return <Badge variant="secondary">Thấp</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Chờ xử lý</Badge>
      case "in-progress":
        return <Badge variant="default">Đang xử lý</Badge>
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600">
            Đã giải quyết
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleResolve = (requestId: string) => {
    console.log("Resolving maintenance request:", requestId)
    // Here you would typically make an API call to update the status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bảo trì</h2>
          <p className="text-muted-foreground">Quản lý yêu cầu bảo trì và sửa chữa</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yêu cầu mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu bảo trì</CardTitle>
          <CardDescription>Theo dõi và quản lý tất cả yêu cầu bảo trì trong các bất động sản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm yêu cầu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in-progress">Đang xử lý</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <Link href={`/maintenance/${request.id}`} className="hover:underline">
                      {request.unit}
                    </Link>
                  </TableCell>
                  <TableCell>{request.building}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{request.issue}</TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>Báo cáo</TableCell>
                  <TableCell>{request.tenant}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/maintenance/${request.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {request.status !== "resolved" && (
                          <DropdownMenuItem onClick={() => handleResolve(request.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Đánh dấu đã giải quyết
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" />
                          Cập nhật trạng thái
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
