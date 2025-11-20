"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { FileText, PenTool, Download, CheckCircle } from "lucide-react"
import { TenantForm } from "@/components/tenant-form"
import { ContractPreview } from "@/components/contract-preview"
import { SignatureCanvas } from "@/components/signature-canvas"
import { PDFExport } from "@/components/pdf-export"
import { usebooking } from "@/context/booking-context"

export default function ContractSigningApp() {
  const [currentStep, setCurrentStep] = useState(1)
  const [tenantData, setTenantData] = useState({
    name: "",
    phone: "",
    idCard: "",
    birthDate: "",
    address: "",
    duration: "",
  })
  const [landlordSignature, setLandlordSignature] = useState("")
  const [tenantSignature, setTenantSignature] = useState("")
  const { bookingDetail, getBookingById, store } = usebooking()
  const rawPrice = bookingDetail?.data?.apartment?.price || 0;
  const roundedPrice = Math.floor(rawPrice / 100) * 100;
  const deposit = bookingDetail?.data?.apartment?.deposit || 0;
  const roundedDeposit = Math.floor(deposit / 100) * 100;
  const steps = [
    { id: 1, title: "Thông tin người thuê", icon: FileText },
    { id: 2, title: "Xem trước hợp đồng", icon: FileText },
    { id: 3, title: "Ký hợp đồng", icon: PenTool },
    { id: 4, title: "Xuất PDF", icon: Download },
  ]

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const apartmentId = urlParams.get("apartmentId")
    if (apartmentId && getBookingById) {
      getBookingById(parseInt(apartmentId))
    }
  }, [])
  useEffect(() => {
    if (currentStep === 4) {
      rentApartment()
    }
  }, [currentStep])


  //ngày hiện tại
  function getTodayDateStr(): string {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
  }
  //tính ngày kết thúc
  function calculateEndDate(startDateStr: string, rentalMonths: number): string {
    const [day, month, year] = startDateStr.split("/").map(Number)
    const startDate = new Date(year, month - 1, day)

    // Tạo ngày kết thúc bằng cách cộng thêm số tháng
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + rentalMonths)

    // Trừ đi 1 ngày để kết thúc vào ngày cuối cùng của tháng thuê
    endDate.setDate(endDate.getDate() - 1)

    // Format lại thành dd/mm/yyyy
    const formatted = `${String(endDate.getDate()).padStart(2, "0")}/${String(endDate.getMonth() + 1).padStart(2, "0")}/${endDate.getFullYear()}`
    return formatted
  }
  // ngày thanh toán 

  function generateContractNumber() {
    return new Date().toISOString().replace(/[-:.TZ]/g, '');
  }
  // Dữ liệu chủ nhà (Bên A) - giả sử lấy từ bookingDetail
  const landlordData = {
    name: bookingDetail?.data?.apartment?.building?.owner?.name || "Nguyễn Văn A",
    phone: bookingDetail?.data?.apartment?.building?.owner?.phone || "sdt",
    idCard: bookingDetail?.data?.apartment?.building?.owner?.idCard || "cmnd",
    birthDate: bookingDetail?.data?.apartment?.building?.owner?.birthDate || "01/01/1990",
    address: bookingDetail?.data?.apartment?.address || "địa chỉ",
    owner_id: bookingDetail?.data?.apartment?.building?.owner?.id || 0,
    issueDate: "20/06/2020",
    issuePlace: "Công an TP.ĐN",
  }


  const startDateStr = getTodayDateStr()
  const endDateStr = calculateEndDate(startDateStr, parseInt(tenantData.duration || "12"))

  const contractData = {
    contractNumber: generateContractNumber() + "/HĐ-TH",
    date: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    location: "TP. Đà Nẵng",
    apartmentAddress: bookingDetail?.data?.apartment?.address || "địa chỉ căn hộ",
    structure: bookingDetail?.data?.apartment?.description || "chi tiết phòng",
    monthlyRent: roundedPrice.toLocaleString("vi-VN"),
    deposit: roundedDeposit.toLocaleString("vi-VN"),
    depositMonths: "1",
    duration: tenantData.duration,
    startDate: startDateStr,
    endDate: endDateStr,
    paymentDate: new Date().getDate(),
    apartment_id: bookingDetail?.data?.apartment?.id || 0,

  }

  async function rentApartment() {
    const res = await store?.({
      ...contractData,
      monthlyRent: Number(contractData.monthlyRent.toString().replace(/\./g, '')),
      deposit: Number(contractData.deposit.toString().replace(/\./g, '')),
      landlordData: { ...landlordData },
      tenantData: { ...tenantData },
      landlordSignature,
      tenantSignature,
    });

    if (res) {
      console.log("Lưu hợp đồng thành công");
    } else {
      setCurrentStep(3);
    }
  }



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hệ thống ký hợp đồng thuê căn hộ</h1>
              <p className="text-muted-foreground mt-2">
                Ký hợp đồng thuê căn hộ trực tuyến một cách nhanh chóng và an toàn
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Bước {currentStep}/4
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
                  }`}
              >
                {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <TenantForm tenantData={tenantData} setTenantData={setTenantData} onNext={() => setCurrentStep(2)} />
          )}

          {currentStep === 2 && (
            <ContractPreview
              tenantData={tenantData}
              landlordData={landlordData}
              contractData={contractData}
              landlordSignature={landlordSignature}
              tenantSignature={tenantSignature}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <SignatureCanvas
              tenantSignature={tenantSignature}
              setTenantSignature={setTenantSignature}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <PDFExport
              tenantData={tenantData}
              landlordData={landlordData}
              contractData={contractData}
              landlordSignature={landlordSignature}
              tenantSignature={tenantSignature}
              onBack={() => setCurrentStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
