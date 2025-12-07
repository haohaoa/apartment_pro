"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, Users, Wrench, TrendingUp, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RevenueChart } from "@/components/revenue-chart";
import Link from "next/link";
import { useBuilding } from "@/context/building-context";
import { useEffect } from "react";

// Mock data
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
];

export default function DashboardPage() {
  const { getDashboard, dashboard } = useBuilding();

  useEffect(() => {
    const fetchData = async () => {
      const success = await getDashboard();
      if (success) {
        console.log("Dashboard data loaded:", dashboard);
      } else {
        console.log("Load dashboard failed");
      }
    };

    fetchData();
  }, []);

  // Tính toán Dashboard
  const occupied = dashboard?.rentedApartments?.[0]?.occupiedUnits ?? 0;
  const vacant = dashboard?.rentedApartments?.[0]?.vacantUnits ?? 0;
  const totalUnits = occupied + vacant;

  const occupancyRate =
    totalUnits > 0 ? ((occupied / totalUnits) * 100).toFixed(1) : 0;

  const stats = [
    {
      title: "Tổng số Tòa nhà",
      value: dashboard?.totalBuildings ?? 0,
      icon: Building2,
      description: "Tổng số tòa nhà đang được quản lý",
    },
    {
      title: "Tổng số Người dùng",
      value: dashboard?.totalUsers ?? 0,
      icon: Users,
      description: "Tổng số Chủ nhà & Khách thuê",
    },
    {
      title: "Tổng số Căn hộ",
      value: dashboard?.totalApartments ?? 0,
      icon: Home,
      description: `Tỷ lệ lấp đầy: ${occupancyRate}%`,
    },
    {
      title: "Tăng trưởng Doanh thu",
      value: `${dashboard?.current_month_growth ?? 0}%`,
      icon: TrendingUp,
      description: "So với tháng trước (Toàn hệ thống)",
    },
  ];

  if (!dashboard) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan Quản trị viên</h2>
        <p className="text-muted-foreground">Tổng quan toàn hệ thống và các chỉ số hoạt động chính</p>
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
            <CardTitle>Tổng quan Doanh thu Hệ thống</CardTitle>
            <CardDescription>Doanh thu hàng tháng trong 12 tháng qua</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart monthlyRevenue={dashboard.monthly_revenue} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hiệu suất Tháng này</CardTitle>
            <CardDescription>Các chỉ số tài chính chính</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Tổng doanh thu</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("vi-VN").format(
                      Number(
                        dashboard?.monthly_revenue?.[
                          new Date().getMonth() + 1
                        ] ?? 0
                      )
                    )}{" "}
                    VND
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <TrendingUp
                  className={`h-4 w-4 ${
                    dashboard?.current_month_growth >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
                <div className="ml-2">
                  <p className="text-sm font-medium">Tăng trưởng</p>
                  <p
                    className={`text-lg font-semibold ${
                      dashboard?.current_month_growth >= 0
                        ? "text-green-600"
                        : "text-red-600"
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
        {/* Recent Contracts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hợp đồng gần đây</CardTitle>

            {/* Chỉ 1 child khi dùng asChild */}
            <Button variant="outline" size="sm" asChild>
              <Link href="/contracts">Xem tất cả</Link>
            </Button>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID HĐ</TableHead>
                  <TableHead>ID Căn hộ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời hạn</TableHead>
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

        {/* Recent Maintenance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Yêu cầu bảo trì (Gần đây)</CardTitle>

            {/* Không comment bên trong */}
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
  );
}
