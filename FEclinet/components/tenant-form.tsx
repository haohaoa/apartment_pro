"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Phone, CreditCard, Calendar, MapPin } from "lucide-react"

interface TenantFormProps {
  tenantData: {
    name: string
    phone: string
    idCard: string
    birthDate: string
    address: string
    duration: string
  }
  setTenantData: (data: any) => void
  onNext: () => void
}

export function TenantForm({ tenantData, setTenantData, onNext }: TenantFormProps) {
  const handleInputChange = (field: string, value: string) => {
    setTenantData((prev: any) => ({ ...prev, [field]: value }))
  }

  const isFormValid =
    tenantData.name &&
    tenantData.phone &&
    tenantData.idCard &&
    tenantData.duration

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Thông tin người thuê (Bên B)
        </CardTitle>
        <CardDescription>
          Vui lòng nhập thông tin cơ bản của người thuê. Thông tin chủ nhà đã được thiết lập sẵn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Họ và tên *
            </Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn B"
              value={tenantData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Số điện thoại *
            </Label>
            <Input
              id="phone"
              placeholder="0901234567"
              value={tenantData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idCard" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Số CMND/CCCD *
            </Label>
            <Input
              id="idCard"
              placeholder="123456789012"
              value={tenantData.idCard}
              onChange={(e) => handleInputChange("idCard", e.target.value)}
              className="bg-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ngày sinh
            </Label>
            <Input
              id="birthDate"
              placeholder="01/01/1990"
              value={tenantData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              className="bg-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Địa chỉ thường trú
          </Label>
          <Input
            id="address"
            placeholder="789 Đường DEF, Quận 2, TP.HCM"
            value={tenantData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="bg-input"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Thời hạn thuê *
          </Label>
          <RadioGroup
            value={tenantData.duration}
            onValueChange={(value) => handleInputChange("duration", value)}
            className="grid grid-cols-4 gap-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="rental-3" />
              <Label htmlFor="rental-3">3 tháng</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6" id="rental-6" />
              <Label htmlFor="rental-6">6 tháng</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12" id="rental-12" />
              <Label htmlFor="rental-12">12 tháng</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24" id="rental-24" />
              <Label htmlFor="rental-24">2 năm</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onNext} disabled={!isFormValid} className="px-8">
            Tiếp tục xem hợp đồng
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}