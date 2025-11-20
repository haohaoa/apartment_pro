"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, CheckCircle, Clock, DollarSign, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data for maintenance details
const maintenanceData = {
  id: "BT001",
  unit: "A-101",
  building: "Chung cư Hoàng Hôn",
  tenant: {
    name: "Nguyễn Thị Lan",
    phone: "0901234567",
    email: "lan.nguyen@email.com",
  },
  issue: "Vòi nước nhà bếp bị rò rỉ",
  description:
    "Vòi nước nhà bếp đã rò rỉ liên tục trong 3 ngày. Nước chảy không ngừng gây lãng phí và có thể làm hỏng tủ bếp. Cần thay thế vòi nước mới.",
  priority: "medium",
  status: "resolved",
  reportedDate: "15/01/2024",
  assignedDate: "16/01/2024",
  resolvedDate: "17/01/2024",
  estimatedCost: 800000,
  actualCost: 650000,
  technician: "Nguyễn Văn Tú",
  technicianPhone: "0987654321",
  images: [
    "/placeholder.svg?height=300&width=400&text=Vòi nước bị rò rỉ",
    "/placeholder.svg?height=300&width=400&text=Tủ bếp bị ướt",
    "/placeholder.svg?height=300&width=400&text=Vòi nước sau sửa",
  ],
  workLog: [
    {
      date: "15/01/2024 09:30",
      action: "Yêu cầu bảo trì được tạo",
      user: "Nguyễn Thị Lan",
      note: "Khách thuê báo cáo vòi nước bị rò rỉ",
    },
    {
      date: "16/01/2024 08:00",
      action: "Phân công thợ sửa chữa",
      user: "Admin",
      note: "Đã phân công cho thợ Nguyễn Văn Tú",
    },
    {
      date: "16/01/2024 14:30",
      action: "Thợ đến kiểm tra",
      user: "Nguyễn Văn Tú",
      note: "Đã kiểm tra, cần thay vòi nước mới",
    },
    {
      date: "17/01/2024 10:00",
      action: "Hoàn thành sửa chữa",
      user: "Nguyễn Văn Tú",
      note: "Đã thay vòi nước mới, kiểm tra không còn rò rỉ",
    },
  ],
}

export default function MaintenanceDetailPage() {
  const params = useParams()

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/maintenance">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại Bảo trì
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">Bảo trì {maintenanceData.id}</h2>
          <p className="text-muted-foreground">
            {maintenanceData.unit} - {maintenanceData.building}
          </p>
        </div>
        <div className="flex gap-2">
          {maintenanceData.status !== "resolved" && (
            <Button variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Đánh dấu hoàn thành
            </Button>
          )}
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Cập nhật
          </Button>
        </div>
      </div>

      {/* Maintenance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ưu tiên</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPriorityBadge(maintenanceData.priority)}</div>
            <p className="text-xs text-muted-foreground">Mức độ ưu tiên</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusBadge(maintenanceData.status)}</div>
            <p className="text-xs text-muted-foreground">Tình trạng hiện tại</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi phí thực tế</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceData.actualCost.toLocaleString()}₫</div>
            <p className="text-xs text-muted-foreground">Dự tính: {maintenanceData.estimatedCost.toLocaleString()}₫</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian xử lý</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 ngày</div>
            <p className="text-xs text-muted-foreground">
              {maintenanceData.reportedDate} - {maintenanceData.resolvedDate}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Chi tiết</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="timeline">Tiến trình</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin yêu cầu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Vấn đề</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.issue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Mô tả chi tiết</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Ngày báo cáo</p>
                    <p className="text-sm text-muted-foreground">{maintenanceData.reportedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ngày phân công</p>
                    <p className="text-sm text-muted-foreground">{maintenanceData.assignedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Khách thuê</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.tenant.name}</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.tenant.phone}</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.tenant.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Thợ sửa chữa</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.technician}</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.technicianPhone}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chi phí</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Chi phí dự tính</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.estimatedCost.toLocaleString()}₫</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Chi phí thực tế</p>
                  <p className="text-sm text-muted-foreground">{maintenanceData.actualCost.toLocaleString()}₫</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Chênh lệch</p>
                  <p className="text-sm text-green-600">
                    -{(maintenanceData.estimatedCost - maintenanceData.actualCost).toLocaleString()}₫
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Trạng thái thanh toán</p>
                  <Badge variant="default">Đã thanh toán</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
              <CardDescription>Ảnh chụp trước, trong và sau quá trình sửa chữa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {maintenanceData.images.map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Bảo trì ${maintenanceData.id} - Ảnh ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tiến trình xử lý</CardTitle>
              <CardDescription>Lịch sử các hoạt động liên quan đến yêu cầu bảo trì</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceData.workLog.map((log, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.date}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Bởi: {log.user}</p>
                      <p className="text-sm">{log.note}</p>
                    </div>
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
