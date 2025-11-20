"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft, ArrowRight } from "lucide-react"

interface ContractPreviewProps {
  tenantData: any
  landlordData: any
  contractData: any
  landlordSignature?: string
  tenantSignature?: string
  onNext: () => void
  onBack: () => void
}

export function ContractPreview({
  tenantData,
  landlordData,
  contractData,
  landlordSignature,
  tenantSignature,
  onNext,
  onBack,
}: ContractPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Xem trước hợp đồng thuê căn hộ
        </CardTitle>
        <CardDescription>
          Kiểm tra kỹ thông tin hợp đồng trước khi ký. Tất cả thông tin đã được điền tự động.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-card border rounded-lg p-6 max-h-96 overflow-y-auto text-sm leading-relaxed">
          <div className="text-center mb-6">
            <h2 className="font-bold text-lg">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
            <p className="font-medium">Độc lập – Tự do – Hạnh phúc</p>
            <div className="mt-4">
              <h3 className="font-bold text-xl">HỢP ĐỒNG THUÊ CĂN HỘ</h3>
              <p className="mt-2">*Số: {contractData.contractNumber}</p>
              <p>
                *Hôm nay, ngày {contractData.date} tháng {contractData.month} năm {contractData.year}, tại{" "}
                {contractData.location}.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Căn cứ:</h4>
              <p>
                Bộ luật Dân sự số 91/2015/QH13 đã được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thông qua ngày
                24 tháng 11 năm 2015;
              </p>
              <p>Nhu cầu của hai bên và khả năng đáp ứng.</p>
            </div>

            <div>
              <p className="font-semibold">Chúng tôi gồm:</p>
            </div>

            <div>
              <h4 className="font-semibold text-primary">BÊN CHO THUÊ (BÊN A):</h4>
              <p>
                Ông/Bà: <span className="font-medium text-primary">{landlordData.name}</span>
              </p>
              <p>
                Ngày sinh: <span className="font-medium">{landlordData.birthDate}</span>
              </p>
              <p>
                Số CMND/CCCD/Hộ chiếu: <span className="font-medium">{landlordData.idCard}</span>
              </p>
              <p>
                Cấp ngày: <span className="font-medium">{landlordData.issueDate}</span> tại:{" "}
                <span className="font-medium">{landlordData.issuePlace}</span>
              </p>
              <p>
                Địa chỉ thường trú: <span className="font-medium">{landlordData.address}</span>
              </p>
              <p>
                Số điện thoại: <span className="font-medium">{landlordData.phone}</span>
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-black">BÊN THUÊ (BÊN B):</h4>
              <p>
                Ông/Bà: <span className="font-medium text-black">{tenantData.name || "[Họ và tên]"}</span>
              </p>
              <p>
                Ngày sinh: <span className="font-medium">{tenantData.birthDate || "[Ngày/tháng/năm]"}</span>
              </p>
              <p>
                Số CMND/CCCD/Hộ chiếu: <span className="font-medium">{tenantData.idCard || "[Số CMND/CCCD]"}</span>
              </p>
              <p>
                Địa chỉ thường trú: <span className="font-medium">{tenantData.address || "[Địa chỉ thường trú]"}</span>
              </p>
              <p>
                Số điện thoại: <span className="font-medium">{tenantData.phone || "[Số điện thoại]"}</span>
              </p>
            </div>

            <div>
              <p>Hai bên thống nhất ký kết hợp đồng thuê căn hộ với các điều khoản sau:</p>
            </div>

            <div>
              <h4 className="font-semibold">Điều 1: ĐỐI TƯỢNG VÀ TÌNH TRẠNG CĂN HỘ</h4>
              <p>Bên A đồng ý cho Bên B thuê và Bên B đồng ý thuê căn hộ với các thông tin sau:</p>
              <p>
                Địa chỉ: <span className="font-medium">{contractData.apartmentAddress}</span>
              </p>
              <p>
                Diện tích sử dụng: <span className="font-medium">{contractData.area} m2</span>
              </p>
              <p>
                Cấu trúc: <span className="font-medium">{contractData.structure}</span>
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Điều 2: MỤC ĐÍCH, GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</h4>
              <p>
                Mục đích thuê: Bên B sử dụng căn hộ với mục đích duy nhất là để ở, không được sử dụng vào mục đích
                thương mại hoặc bất hợp pháp.
              </p>
              <p>
                Giá thuê hàng tháng là:{" "}
                <span className="font-medium text-primary">{contractData.monthlyRent} đồng/tháng</span>.
              </p>
              <p>
                Tiền đặt cọc: <span className="font-medium text-primary">{contractData.deposit} đồng</span>.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Điều 3: THỜI HẠN THUÊ VÀ GIA HẠN</h4>
              <p>
                Thời hạn thuê là <span className="font-medium">{contractData.duration} tháng</span>, kể từ ngày{" "}
                <span className="font-medium">{contractData.startDate}</span> đến hết ngày{" "}
                <span className="font-medium">{contractData.endDate}</span>.
              </p>
            </div>

            <div className="text-center mt-8 pt-4 border-t">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-semibold">ĐẠI DIỆN BÊN CHO THUÊ (BÊN A)</p>
                  <p className="text-sm text-muted-foreground">(Ký và ghi rõ họ tên)</p>
                  <div className="mt-4 h-20 flex items-center justify-center">
                    {landlordSignature ? (
                      <img
                        src={landlordSignature || "/placeholder.svg"}
                        alt="Chữ ký chủ nhà"
                        className="max-h-16 max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground italic">[Chữ ký chủ nhà]</div>
                    )}
                  </div>
                  <p className="text-sm font-medium mt-2">{landlordData.name}</p>
                </div>
                <div>
                  <p className="font-semibold">ĐẠI DIỆN BÊN THUÊ (BÊN B)</p>
                  <p className="text-sm text-muted-foreground">(Ký và ghi rõ họ tên)</p>
                  <div className="mt-4 h-20 flex items-center justify-center">
                    {tenantSignature ? (
                      <img
                        src={tenantSignature || "/placeholder.svg"}
                        alt="Chữ ký người thuê"
                        className="max-h-16 max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground italic">[Chữ ký người thuê]</div>
                    )}
                  </div>
                  <p className="text-sm font-medium mt-2">{tenantData.name || "[Họ và tên]"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <Button onClick={onNext} className="flex items-center gap-2">
            Tiếp tục ký hợp đồng
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
