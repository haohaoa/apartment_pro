"use client";

import { useAuth } from "@/context/auth-context";
import { useApartment } from "@/context/apartment-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { contracts, getAllApartment } = useApartment();
  const router = useRouter();

  useEffect(() => {
    getAllApartment();
  }, []);

  if (!user) return null;

  const userApartments = contracts.map((item) => ({
    id: item.id,
    apartmentId: item.id,
    apartmentName: item.apartment.title,
    location: item.apartment.address,
    monthlyRent: item.apartment.price, // ⚠️ chỗ này bị sai
    endDate: item.end_date,
    status: item.status === "completed" ? "active" : "expired",
  }));


  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Dashboard</h1>
          <p className="text-lg text-muted-foreground">Quản lý và theo dõi thông tin các căn hộ</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userApartments.map((apartment) => (
            <Card
              key={apartment.id}
              onClick={() => router.push(`/dashboard/${apartment.apartmentId}`)}
              className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-lg bg-primary/10">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{apartment.apartmentName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        {apartment.location}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={apartment.status === "active" ? "default" : "secondary"}
                    className={apartment.status === "active" ? "bg-green-600" : ""}
                  >
                    {apartment.status === "active" ? "Đang thuê" : "Hết hạn"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tiền thuê/tháng</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(apartment.monthlyRent)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
