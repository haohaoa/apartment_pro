"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, CheckCircle, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import React from 'react';
import { useMaintenance } from "@/context/maintenance-context";

// ====================================================================
// 🚨 ĐIỀU CHỈNH 1: Định nghĩa Interface PHÙ HỢP VỚI DỮ LIỆU API
// ====================================================================

// Interface cho cấu trúc phẳng mà component hiển thị cần
interface MaintenanceRequest {
    id: number; // API dùng number
    unit: string; // Lấy từ apartment.title
    building: string; // Lấy từ apartment.building.name
    buildingId: number; // Lấy từ apartment.building_id
    issue: string; // Lấy từ description (Tên sự cố)
    // API không có 'priority', nên ta giữ nguyên default hoặc xoá nếu không cần
    priority: 'high' | 'medium' | 'low'; 
    status: 'pending' | 'in-progress' | 'resolved'; // Lấy từ status
    reportedDate: string; // Lấy từ created_at
    tenant: string; // Lấy từ user_id (giả định, có thể cần JOIN thêm bảng users)
    description: string; // Lấy từ apartment.description (Mô tả căn hộ)
    // resolvedDate không có trong API, có thể bỏ qua hoặc giữ lại là optional
    resolvedDate?: string; 
    // Thêm trường raw data để dễ truy cập
    rawData: any; 
}

// Định nghĩa Interface cho Props của IssueContainer
interface IssueContainerProps {
  issue: string;
  description: string;
}
// ====================================================================

// XÓA dữ liệu mẫu cũ (maintenanceRequests) vì ta sẽ dùng dữ liệu API

const buildings = [
  { id: "1", name: "Chung cư Hoàng Hôn" },
  { id: "2", name: "Tòa Hướng Biển" },
  { id: "3", name: "Trung tâm Thành phố" },
  { id: "4", name: "Garden Heights" },
]

// Component IssueContainer
const IssueContainer: React.FC<IssueContainerProps> = ({ issue, description }) => (
    <div className="group overflow-hidden"> 
        <div className="max-h-12 group-hover:max-h-96 transition-all duration-500 ease-in-out">
            <CardTitle className="text-lg font-bold">
                {issue}
            </CardTitle>
            {/* LƯU Ý: Description ở đây đang hiển thị mô tả CĂN HỘ, không phải mô tả sự cố */}
            <p className="text-sm text-muted-foreground pt-1"> 
                {description}
            </p>
        </div>
    </div>
);


export default function MaintenancePage() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all") 
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [buildingFilter, setBuildingFilter] = useState<string>("all")
  // 🚨 Cập nhật state ban đầu là mảng rỗng
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]) 
  const { maintenance, getmaintenance , markAsReadMaintenance} = useMaintenance();

  // ====================================================================
  // 🚨 BƯỚC 2: HÀM XỬ LÝ VÀ CHUYỂN ĐỔI DỮ LIỆU API
  // ====================================================================
  const mapApiDataToRequests = (apiData: any[]): MaintenanceRequest[] => {
      // Dữ liệu API có apartment, building, owner lồng nhau.
      // Dữ liệu mẫu (mock data) của bạn có cấu trúc phẳng hơn.
      return apiData.map((item) => ({
          id: item.id,
          // unit: API dùng apartment.title (ví dụ: "gần sông" hoặc "Căn hộ 1 - Tòa Diamond Plaza")
          unit: item.apartment?.title || 'N/A', 
          // building: API dùng apartment.building.name (ví dụ: "VINHHT" hoặc "Diamond Plaza")
          building: item.apartment?.building?.name || 'N/A', 
          buildingId: item.apartment?.building_id || '0', // Sử dụng building_id để lọc
          // issue: Lấy từ trường description trong maintenance request
          issue: item.description || 'Không có mô tả sự cố', 
          // API không có Priority, ta gán tạm "medium"
          priority: "medium", 
          // status: Lấy từ status của maintenance request
          status: item.status as MaintenanceRequest['status'] || 'pending', 
          // reportedDate: Lấy từ created_at và chuyển định dạng (tạm thời)
          reportedDate: new Date(item.created_at).toLocaleDateString('vi-VN') || '', 
          // tenant: API có user_id, ta dùng tạm ID, cần JOIN để lấy tên.
          // Trong ví dụ này, ta dùng ID người dùng hoặc ID căn hộ làm tham chiếu người thuê.
          tenant: `User ID: ${item.user_id}` || 'N/A', 
          // description: Lấy từ mô tả căn hộ (apartment.description)
          // LƯU Ý: Nếu bạn muốn mô tả sự cố dài, hãy dùng item.description
          description: item.apartment?.description || 'N/A', 
          // resolvedDate không có
          rawData: item, // Giữ lại raw data nếu cần
      }));
  }

  // 🚨 BƯỚC 3: SỬ DỤNG useEffect để tải và cập nhật dữ liệu
  useEffect(() => {
    // Giả định getmaintenance() là async và trả về dữ liệu API
    getmaintenance(); 
  }, [])

  useEffect(() => {
      // Sau khi maintenance context được cập nhật (ví dụ từ API)
      if (maintenance && maintenance.length > 0) {
          const mappedRequests = mapApiDataToRequests(maintenance);
          setRequests(mappedRequests);

          // Cập nhật danh sách Tòa nhà (cho bộ lọc) từ dữ liệu thực tế
          // Lưu ý: Phần này cần được xử lý cẩn thận để không trùng lặp
          // (ví dụ: dùng Set hoặc logic riêng biệt)
      }
      // console.log("Maintenance Context Data:", maintenance); // Có thể bỏ log này
  }, [maintenance])
  
  // Hàm hiển thị Badge Trạng thái và các hàm khác giữ nguyên...
  // (Phần còn lại của component không cần thay đổi)

  const filteredRequests = requests.filter((request) => { 
    const matchesSearch =
      request.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenant.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    
    // Đảm bảo buildingId cũng là string để so sánh
    const matchesBuilding = buildingFilter === "all" || String(request.buildingId) === buildingFilter

    return matchesSearch && matchesPriority && matchesStatus && matchesBuilding
  })

  // Hàm hiển thị Badge Trạng thái
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-500 border-orange-500 bg-orange-50">
            <Clock className="mr-1 h-3 w-3" /> Chờ xử lý
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            <Clock className="mr-1 h-3 w-3" /> Đang xử lý
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
            <CheckCircle className="mr-1 h-3 w-3" /> Đã xác nhận
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Xử lý xác nhận/chuyển trạng thái
  const handleAction = (requestId: number, currentStatus: string) => {
    console.log("Processing action for maintenance request:", requestId, "Current Status:", currentStatus)
    
    let newStatus = currentStatus;
    if (currentStatus === "pending") {
        newStatus = "in-progress"; 
    } else if (currentStatus === "in-progress") {
        newStatus = "resolved"; 
    }

    if (newStatus !== currentStatus) {
        setRequests(prevRequests => 
            prevRequests.map(req => 
                req.id === requestId ? { ...req, status: newStatus as MaintenanceRequest['status'] } : req // Ép kiểu cho status mới
            )
        );
    }
    markAsReadMaintenance(requestId);
  }

  // Lấy text cho nút hành động
  const getActionButtonText = (status: string) => {
    switch (status) {
        case "pending":
            return "Xác nhận & Bắt đầu";
        case "in-progress":
            return "Đánh dấu đã hoàn thành";
        case "resolved":
            return "Xem chi tiết";
        default:
            return "Hành động";
    }
  }

  return (
    <div className="space-y-6">
      {/* ... Phần header ... */}
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
      {/* --- */}

      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu bảo trì đang chờ</CardTitle>
          <CardDescription>Theo dõi và xử lý các vấn đề cần bảo trì</CardDescription>
        </CardHeader>
        <CardContent>
          {/* ... Phần bộ lọc ... */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm căn hộ, sự cố, hoặc người thuê..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {/* Các bộ lọc (Giữ nguyên dùng dữ liệu mock cho tòa nhà tạm thời) */}
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tòa nhà" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả Tòa nhà</SelectItem>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in-progress">Đang xử lý</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* --- */}

          {/* Giao diện lưới hiển thị thông tin bảo trì */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {requests.length === 0 && maintenance.length > 0 && (
                <p className="text-center text-muted-foreground py-10 col-span-full">Đang tải dữ liệu...</p>
            )}

            {filteredRequests.map((request) => (
              <Card 
                key={request.id} 
                className="
                    hover:shadow-xl 
                    transition-all 
                    duration-300 
                    hover:scale-[1.01] 
                    flex flex-col justify-between
                "
              >
                <CardHeader className="pb-2">
                    {/* ID & Trạng thái */}
                    <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-sm font-semibold">{request.unit}</Badge>
                        {getStatusBadge(request.status)}
                    </div>
                  
                    {/* Tên tòa nhà & Ngày báo cáo */}
                    <CardDescription className="pt-1 text-xs">
                        {request.building} | Báo cáo: {request.reportedDate}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                    
                    {/* Hiển thị Tên sự cố (issue) và Mô tả chi tiết (description) */}
                    <IssueContainer 
                        issue={request.issue} 
                        description={request.description} 
                    />
                    
                    {/* Tên người thuê căn hộ */}
                    <div className="flex items-center text-sm pt-2">
                        <span className="font-medium text-gray-700">Người thuê:</span>
                        <span className="ml-2 text-gray-500 truncate">{request.tenant}</span>
                    </div>
                </CardContent>
                <div className="p-4 pt-0 border-t">
                    {/* Button xác nhận */}
                    {request.status === 'resolved' ? (
                        <Button variant="outline" size="sm" asChild className="w-full">
                            <Link href={`/maintenance/${request.id}`}>
                                Xem chi tiết <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (
                        <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleAction(request.id, request.status)}
                        >
                            {getActionButtonText(request.status)}
                        </Button>
                    )}
                </div>
              </Card>
            ))}
          </div>
          {filteredRequests.length === 0 && requests.length > 0 && (
            <p className="text-center text-muted-foreground py-10">Không tìm thấy yêu cầu bảo trì nào phù hợp với bộ lọc.</p>
          )}
           {requests.length === 0 && !maintenance && (
            <p className="text-center text-muted-foreground py-10">Không có dữ liệu yêu cầu bảo trì nào được tải.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}