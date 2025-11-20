"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Home, Users, Wrench, TrendingUp, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RevenueChart } from "@/components/revenue-chart"
import Link from "next/link"
import { useBuilding } from "@/context/building-context"
import { useEffect } from "react"



const maintenanceRequests = [
  {
    id: "BT001",
    unit: "A-101",
    building: "Chung cư Hoàng Hôn",
    issue: "Vòi nước bị rò rỉ",
    priority: "medium",
    date: "15/01/2024",
  },
  {
    id: "BT002",
    unit: "B-205",
    building: "Tòa Hướng Biển",
    issue: "Điều hòa hỏng",
    priority: "high",
    date: "14/01/2024",
  },
  {
    id: "BT003",
    unit: "C-301",
    building: "Trung tâm Thành phố",
    issue: "Khóa cửa bị kẹt",
    priority: "low",
    date: "13/01/2024",
  },
]

export default function DashboardPage() {
  const { getDashboard, dashboard } = useBuilding();
  useEffect(() => {
    const fetchData = async () => {
      const success = await getDashboard();
      if (success) {
        console.log("Dashboard data đã load:", dashboard);
      } else {
        console.log("Lấy dashboard thất bại");
      }
    };

    fetchData();
  }, []);
  const stats = [
    {
      title: "Tổng số tòa",
      value: dashboard?.userWithBuildings,
      icon: Building2,
      description: "Tòa nhà đang hoạt động",
    },
    {
      title: "Căn đã thuê",
      value: dashboard?.rentedApartments.reduce((sum, a) => sum + (a.occupiedUnits ?? 0), 0),
      icon: Users,
      description: "Đang được thuê",
    },
    {
      title: "Căn trống",
      value: dashboard?.rentedApartments.reduce((sum, a) => sum + (a.vacantUnits ?? 0), 0),
      icon: Home,
      description: "Sẵn sàng cho thuê",
    },
    {
      title: "Tăng trưởng tháng trước",
      value: `${dashboard?.current_month_growth}%`,
      icon: TrendingUp,
      description: "So với tháng trước",
    },
  ]

  if (!dashboard) {
    return <div>Đang tải dữ liệu...</div>;
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground">Tổng quan hệ thống quản lý căn hộ của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tổng quan doanh thu</CardTitle>
            <CardDescription>Doanh thu hàng tháng trong 12 tháng qua</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Truyền dữ liệu từ dashboard */}
            <RevenueChart monthlyRevenue={dashboard.monthly_revenue} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tháng này</CardTitle>
            <CardDescription>Hiệu suất tháng hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Tổng doanh thu</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("vi-VN").format(
                      Number(dashboard?.monthly_revenue?.[new Date().getMonth() + 1] ?? 0)
                    )} VND
                  </p>

                </div>
              </div>
              <div className="flex items-center">
                <TrendingUp
                  className={`h-4 w-4 ${dashboard?.current_month_growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                />
                <div className="ml-2">
                  <p className="text-sm font-medium">Tăng trưởng</p>
                  <p
                    className={`text-lg font-semibold ${dashboard?.current_month_growth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {dashboard?.current_month_growth >= 0 ? "+" : ""}
                    {dashboard?.current_month_growth ?? 0}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hợp đồng gần đây</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/contracts">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách thuê</TableHead>
                  <TableHead>Căn hộ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.recentContracts?.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.apartment_id}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "completed" ? "default" : "secondary"}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{`${c.start_date} → ${c.end_date}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Yêu cầu bảo trì</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/maintenance">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Căn hộ</TableHead>
                  <TableHead>Vấn đề</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Ngày</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.unit}</TableCell>
                    <TableCell>{request.issue}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.priority === "high"
                            ? "destructive"
                            : request.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {request.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
