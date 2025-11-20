"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  FileText,
  Download,
  Calendar,
  DollarSign,
  User,
  Home,
  PenLine,
  File,
} from "lucide-react";
import { useContract } from "@/context/contract-context";
import { toast } from "sonner";


export default function ContractDetailPage() {
  const params = useParams();
  const { ContractDetail, confirmPaymentByLandlord, getByIdContractDetail, handleContract, CancelContract } = useContract();
  const [isSigning, setIsSigning] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [openSignDialog, setOpenSignDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  useEffect(() => {
    if (params?.id) {
      getByIdContractDetail(Number(params.id));
    }
  }, [params]);

  const contract = ContractDetail;
  if (!contract)
    return (
      <div className="flex h-[70vh] items-center justify-center text-muted-foreground">
        Đang tải thông tin hợp đồng...
      </div>
    );
  const sampleTerms = [
    "Bên thuê có trách nhiệm thanh toán tiền thuê căn hộ đúng hạn theo thỏa thuận trong hợp đồng.",
    "Bên thuê không được tự ý sửa chữa, thay đổi cấu trúc căn hộ nếu không có sự đồng ý bằng văn bản của bên cho thuê.",
    "Mọi hư hỏng, mất mát tài sản trong căn hộ do lỗi của bên thuê sẽ do bên thuê chịu trách nhiệm bồi thường.",
    "Bên thuê phải giữ gìn vệ sinh, không gây tiếng ồn hoặc làm ảnh hưởng đến cư dân xung quanh.",
    "Khi chấm dứt hợp đồng, bên thuê phải bàn giao lại căn hộ trong tình trạng như khi nhận, trừ hao mòn tự nhiên."
  ];
  const handleConfirmPayment = async () => {
    if (!selectedPaymentId) return;

    setLoadingConfirm(true);
    const success = await confirmPaymentByLandlord(selectedPaymentId);
    setLoadingConfirm(false);
    setOpenConfirmDialog(false);
    setSelectedPaymentId(null);

    return success;
  };

  const handleOpenConfirmDialog = (id: string) => {
    setSelectedPaymentId(id);
    setOpenConfirmDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Chờ xử lý</Badge>;
      case "approved":
        return <Badge variant="default">Đã phê duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Bị từ chối</Badge>;
      case "completed":
        return <Badge variant="outline">Đã hoàn thành</Badge>;
      case "check_out":
        return <Badge variant="outline">Đã trả nhà</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canSign = contract.order?.status === "pending";
  const canSign2 = contract.order?.status != "check_out" && contract.order?.status != "rejected";
  const handleAutoSign = async () => {
    setIsSigning(true);
    toast.promise(
      handleContract(contract.rental_order_id),
      {
        loading: "Đang ký hợp đồng...",
        error: "Có lỗi xảy ra khi ký hợp đồng.",
      }
    );
    setIsSigning(false);
  };
  const handleCancelContract = async () => {
    setIsCancelling(true);
    const promise = Promise.resolve(CancelContract(contract.rental_order_id));
    toast.promise(promise, {
      loading: "Đang hủy hợp đồng...",
      success: "Đã hủy hợp đồng thành công!",
      error: "Có lỗi xảy ra khi hủy hợp đồng.",
    });
    promise.finally(() => setIsCancelling(false));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/contracts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>

        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">
            Hợp đồng {contract.contract_number || ""}
          </h2>
          <p className="text-muted-foreground">
            {contract.tenant_data?.name || "Chưa có tên người thuê"} -{" "}
            {contract.apartment_address || ""}
          </p>
        </div>

        <div className="flex gap-2">
          {canSign && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  disabled={isSigning}
                  onClick={() => setOpenCancelDialog(false)} // đảm bảo chỉ mở 1 dialog
                >
                  {isSigning ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                      Đang ký...
                    </>
                  ) : (
                    <>
                      <PenLine className="mr-2 h-4 w-4" />
                      Ký hợp đồng tự động
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận ký hợp đồng</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn ký hợp đồng{" "}
                    <b>{contract.contract_number}</b> không? Hành động này sẽ được lưu
                    lại và không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAutoSign} disabled={isSigning}>
                    {isSigning ? "Đang ký..." : "Xác nhận ký"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* ===== Nút hủy hợp đồng ===== */}
          {canSign2 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isCancelling}
                  onClick={() => setOpenSignDialog(false)} // đảm bảo chỉ mở 1 dialog
                >
                  {isCancelling ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                      Đang hủy...
                    </>
                  ) : (
                    <>
                      <PenLine className="mr-2 h-4 w-4" />
                      Hủy hợp đồng
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tiền thuê tháng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contract.monthly_rent
                ? Number(contract.monthly_rent).toLocaleString() + "₫"
                : "Chưa có"}
            </div>
            <p className="text-xs text-muted-foreground">
              Thanh toán ngày {contract.payment_date || "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tiền cọc</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contract.deposit
                ? Number(contract.deposit).toLocaleString() + "₫"
                : "Chưa có"}
            </div>
            <p className="text-xs text-muted-foreground">
              {contract.deposit_months || 0} tháng tiền thuê
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Thời hạn thuê</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contract.duration ? `${contract.duration} tháng` : "Chưa có"}
            </div>
            <p className="text-xs text-muted-foreground">
              {contract.start_date
                ? new Date(contract.start_date).toLocaleDateString()
                : "?"}{" "}
              -{" "}
              {contract.end_date
                ? new Date(contract.end_date).toLocaleDateString()
                : "?"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getStatusBadge(contract.order?.status)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ngày ký{" "}
              {contract.contract_date
                ? new Date(contract.contract_date).toLocaleDateString()
                : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Chi tiết</TabsTrigger>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          <TabsTrigger value="documents">Hợp đồng</TabsTrigger>
          <TabsTrigger value="terms">Điều khoản</TabsTrigger>
        </TabsList>

        {/* Chi tiết */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Người thuê
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><b>Tên:</b> {contract.tenant_data?.name || "Chưa có"}</p>
                <p><b>SĐT:</b> {contract.tenant_data?.phone || "Chưa có"}</p>
                <p><b>CMND:</b> {contract.tenant_data?.idCard || "Chưa có"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" /> Chủ nhà
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><b>Tên:</b> {contract.landlord_data?.name || "Chưa có"}</p>
                <p><b>Địa chỉ:</b> {contract.landlord_data?.address || "Chưa có"}</p>
                <p><b>SĐT:</b> {contract.landlord_data?.phone || "Chưa có"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Thanh toán */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              {contract.order.payment?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kỳ</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Ngày thanh toán</TableHead>
                      <TableHead>Phương thức</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.order.payment.map((p: any, i: number) => (
                      <TableRow key={i}>
                        {/* 🗓️ Kỳ */}
                        <TableCell>
                          {p.period_start && p.period_end ? (
                            <div className="flex flex-col text-sm">
                              <span>
                                <strong>Từ:</strong>{" "}
                                {new Date(p.period_start).toLocaleDateString("vi-VN")}
                              </span>
                              <span>
                                <strong>Đến:</strong>{" "}
                                {new Date(p.period_end).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Không xác định</span>
                          )}
                        </TableCell>

                        {/* 💰 Số tiền */}
                        <TableCell>{Number(p.amount).toLocaleString()}₫</TableCell>

                        {/* 📅 Ngày thanh toán */}
                        <TableCell>
                          {p.payment_date
                            ? new Date(p.payment_date).toLocaleDateString("vi-VN")
                            : "-"}
                        </TableCell>

                        {/* 💳 Phương thức */}
                        <TableCell>
                          {p.method === "bank"
                            ? "Chuyển khoản"
                            : p.method === "cash"
                              ? "Tiền mặt"
                              : p.method === "e-wallet"
                                ? "Ví điện tử"
                                : "-"}
                        </TableCell>

                        {/* 🏷️ Trạng thái */}
                        <TableCell>
                          {p.status === "unpaid" && (
                            <Badge variant="secondary">Chưa trả</Badge>
                          )}
                          {p.status === "pending_confirmation" && (
                            <Badge
                              variant="outline"
                              className="text-yellow-600 border-yellow-400 bg-yellow-50"
                            >
                              Chờ xác nhận
                            </Badge>
                          )}
                          {p.status === "paid" && (
                            <Badge variant="default">Đã xác nhận</Badge>
                          )}
                          {p.status === "failed" && (
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-600"
                            >
                              Thất bại
                            </Badge>
                          )}
                        </TableCell>

                        {/* ⚙️ Nút hành động */}
                        <TableCell className="text-center">
                          {p.status === "pending_confirmation" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenConfirmDialog(p.id)}
                              className="text-green-600 border-green-500 hover:bg-green-50"
                            >
                              Xác nhận thanh toán
                            </Button>

                          ) : (
                            <span className="text-muted-foreground text-xs italic">
                              {p.status === "paid"
                                ? "Đã xác nhận"
                                : p.status === "unpaid"
                                  ? "-"
                                  : ""}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Chưa có dữ liệu thanh toán.
                </p>
              )}
            </CardContent>
          </Card>

        </TabsContent>
        <AlertDialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn xác nhận rằng khách hàng đã thanh toán 
                <br />
                Hãy kiểm tra tài khoản hoặc biên lai thanh toán trước khi xác nhận.
                <br />
                Sau khi xác nhận, trạng thái thanh toán sẽ được cập nhật thành <b>Đã xác nhận</b> và không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmPayment}
                disabled={loadingConfirm}
              >
                {loadingConfirm ? "Đang xác nhận..." : "Xác nhận"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


        {/* Tài liệu */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu hợp đồng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contract.pdf_path?.length ? (

                <div
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span>Hợp đồng thuê căn hộ</span>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`${process.env.NEXT_PUBLIC_BDF}/${contract.pdf_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem / Tải
                    </a>
                  </Button>

                </div>

              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Chưa có tài liệu nào được đính kèm.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Điều khoản */}
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Điều khoản hợp đồng</CardTitle>
            </CardHeader>
            <CardContent>
              {sampleTerms?.length ? (
                <ul className="list-disc pl-5 space-y-2">
                  {sampleTerms.map((t, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Chưa có điều khoản nào được thêm.
                </p>
              )}
            </CardContent>

          </Card>
        </TabsContent>
      </Tabs>
    </div >
  );
}
