"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApartment } from "@/context/apartment-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft,
    AlertTriangle,
    FileText,
    CreditCard,
    Download,
    PlusCircle,
} from "lucide-react";
import Image from "next/image"
export default function ApartmentDetail({
    apartmentId,
}: {
    apartmentId: string;
}) {
    const router = useRouter();
    const { contracts } = useApartment();
    console.log(apartmentId);

    // 🔍 Lấy đơn thuê (rental order) theo ID
    const order = contracts.find((item) => item.id === Number(apartmentId));

    if (!order) {
        return (
            <div className="p-8 text-center text-gray-500">
                Không tìm thấy dữ liệu căn hộ.
            </div>
        );
    }

    const { apartment, payment = [], contract } = order;
    console.log(contract);

    // 🧱 Dữ liệu sự cố giả
    const [issues, setIssues] = useState([
        {
            id: 1,
            title: "Máy lạnh bị rò nước",
            status: "Đang xử lý",
            created_at: "2025-10-12",
        },
        {
            id: 2,
            title: "Đèn phòng khách bị cháy",
            status: "Hoàn thành",
            created_at: "2025-09-29",
        },
    ]);
    const [newIssue, setNewIssue] = useState("");

    const handleAddIssue = () => {
        if (!newIssue.trim()) return;
        const newItem = {
            id: Date.now(),
            title: newIssue,
            status: "Chờ xử lý",
            created_at: new Date().toISOString().split("T")[0],
        };
        setIssues([...issues, newItem]);
        setNewIssue("");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            {/* Nút quay lại */}
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
            </Button>

            {/* Thông tin căn hộ */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">{apartment?.title}</h1>
                <p className="text-gray-600 mb-3">{apartment?.address}</p>
                {apartment?.images?.length > 0 && (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_URL_IMG}${apartment.images?.[0]?.image_url || "/placeholder.svg"}`}
                        width={400}
                        height={600}
                        alt="Apartment"
                        className="w-full h-60 object-cover rounded-xl shadow"
                    />
                )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="issues">
                <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border rounded-lg p-1 mb-6">
                    <TabsTrigger value="issues" className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Sự cố
                    </TabsTrigger>
                    <TabsTrigger value="contracts" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Hợp đồng
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Thanh toán
                    </TabsTrigger>
                </TabsList>

                {/* ---------------- SỰ CỐ ---------------- */}
                <TabsContent value="issues">
                    <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" /> Danh sách sự cố
                        </h2>

                        {issues.length === 0 ? (
                            <p className="text-gray-500">Chưa có sự cố nào.</p>
                        ) : (
                            <ul className="space-y-3">
                                {issues.map((issue) => (
                                    <li
                                        key={issue.id}
                                        className="border rounded-lg p-3 flex justify-between items-center bg-gray-50"
                                    >
                                        <div>
                                            <p className="font-medium">{issue.title}</p>
                                            <p className="text-sm text-gray-500">
                                                Ngày tạo: {issue.created_at}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${issue.status === "Hoàn thành"
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                                }`}
                                        >
                                            {issue.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Form thêm sự cố */}
                        <div className="mt-5 flex gap-2">
                            <Input
                                value={newIssue}
                                onChange={(e) => setNewIssue(e.target.value)}
                                placeholder="Mô tả sự cố mới..."
                            />
                            <Button onClick={handleAddIssue} className="flex gap-1">
                                <PlusCircle className="w-4 h-4" />
                                Thêm
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* ---------------- HỢP ĐỒNG ---------------- */}
                <TabsContent value="contracts">
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        {contract ? (
                            <div className="space-y-3">
                                <p>
                                    <strong>Mã hợp đồng:</strong> {contract.contract_number}
                                </p>
                                <p>
                                    <strong>Thời gian thuê:</strong>{" "}
                                    {new Date(contract.start_date).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    {" "}→{" "}
                                    {new Date(contract.end_date).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}

                                </p>

                                <div className="flex gap-2 mt-4">
                                    {/* <Button
                                        variant="outline"
                                        className="flex gap-1 border-blue-600 text-blue-600"
                                        onClick={() => alert("Tải xuống hợp đồng...")}
                                    >
                                        <Download className="w-4 h-4" /> Tải về
                                    </Button> */}
                                    <Button
                                        className="bg-blue-600 text-white"
                                        onClick={() =>
                                            window.open(`http://localhost:8000/${contract.pdf_path}`, "_blank")
                                        }
                                    >
                                        Xem chi tiết
                                    </Button>

                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Chưa có hợp đồng nào.</p>
                        )}
                    </div>
                </TabsContent>

                {/* ---------------- THANH TOÁN ---------------- */}
                <TabsContent value="payments">
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        {payment.length > 0 ? (
                            <ul className="space-y-4">
                                {payment.map((p: any) => (
                                    <li
                                        key={p.id}
                                        className="border rounded-xl p-4 bg-gray-50 shadow-sm hover:shadow transition"
                                    >
                                        <p>
                                            <strong>Tháng:</strong> {p.month}/{p.year}
                                        </p>
                                        <p>
                                            <strong>Số tiền:</strong>{" "}
                                            {Number(p.amount).toLocaleString("vi-VN")}₫
                                        </p>
                                        <p>
                                            <strong>Chu kỳ:</strong>{" "}
                                            {new Date(p.period_start).toLocaleDateString("vi-VN")} →{" "}
                                            {new Date(p.period_end).toLocaleDateString("vi-VN")}
                                        </p>
                                        <p>
                                            <strong>Trạng thái:</strong>{" "}
                                            <span
                                                className={`font-medium ${p.status === "paid"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                {p.status === "paid"
                                                    ? "Đã thanh toán"
                                                    : "Chưa thanh toán"}
                                            </span>
                                        </p>

                                        {p.status !== "paid" ? (
                                            <Button
                                                className="bg-blue-600 hover:bg-blue-700 text-white mt-3 w-full"
                                                onClick={() =>
                                                    router.push(`/dashboard/payment/${p.id}`)
                                                }
                                            >
                                                Thanh toán ngay
                                            </Button>
                                        ) : (
                                            <Button
                                                disabled
                                                variant="outline"
                                                className="mt-3 w-full border-green-600 text-green-600"
                                            >
                                                Đã thanh toán
                                            </Button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Chưa có thông tin thanh toán.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
