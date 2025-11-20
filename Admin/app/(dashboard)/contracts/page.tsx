"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, MoreHorizontal, Eye, Edit, FileText, X } from "lucide-react";
import Link from "next/link";
import { useContract } from "@/context/contract-context"; // hook bạn đã viết

export default function ContractsPage() {
  const { Contractlist, getByIdContract } = useContract();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [buildingFilter, setBuildingFilter] = useState("all");

  // 🟢 Fetch data khi component mount
  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      await getByIdContract();
      setLoading(false);
    };
    fetchContracts();
  }, []);

  // Map trạng thái hợp đồng sang tiếng Việt
  const contractStatusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    approved: "Đã duyệt",
    rejected: "Bị từ chối",
    completed: "Hoàn thành",
    check_out: "Đã trả nhà",
  };

  // Filter
  const filteredContracts = Contractlist.filter((contract) => {
    const matchesSearch =
      contract.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.apartment.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    const matchesBuilding = buildingFilter === "all" || contract.apartment.id.toString() === buildingFilter;

    return matchesSearch && matchesStatus && matchesBuilding;
  });

  const getStatusBadge = (status: string) => {
    return <Badge variant="secondary">{contractStatusMap[status] || status}</Badge>;
  };

  if (loading) return <div className="text-center p-10 text-muted-foreground">Đang tải hợp đồng...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hợp đồng</h2>
          <p className="text-muted-foreground">Quản lý hợp đồng thuê và thỏa thuận</p>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tất cả hợp đồng</CardTitle>
          <CardDescription>Xem và quản lý tất cả hợp đồng thuê</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm hợp đồng, khách thuê..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Bị từ chối</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="check_out">Đã trả nhà</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hợp đồng</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Địa chỉ căn hộ</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">
                    <Link href={`/contracts/${contract.id}`} className="hover:underline">
                      {contract.id}
                    </Link>
                  </TableCell>
                  <TableCell>{contract.user.name}</TableCell>
                  <TableCell>{contract.apartment.address}</TableCell>
                  <TableCell>{new Date(contract.start_date).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{new Date(contract.end_date).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/contracts/${contract.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
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
  );
}
