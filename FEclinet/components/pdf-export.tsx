"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Printer } from "lucide-react"

interface PDFExportProps {
  tenantData: any
  landlordData: any
  contractData: any
  landlordSignature: string
  tenantSignature: string
  onBack: () => void
}

export function PDFExport({
  tenantData,
  landlordData,
  contractData,
  landlordSignature,
  tenantSignature,
  onBack,
}: PDFExportProps) {
  const generatePDF = () => {
    try {
      // Create a new window with the contract content
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("Vui lòng cho phép popup để tạo PDF")
        return
      }

      const contractHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Hợp đồng thuê căn hộ ${contractData.contractNumber}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12px;
              line-height: 1.4;
              margin: 40px;
              color: #000;
            }
            .header {
              text-align: center;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .title {
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              margin: 20px 0 10px 0;
            }
            .section-header {
              font-weight: bold;
              margin: 15px 0 5px 0;
            }
            .party-header {
              font-weight: bold;
              margin: 10px 0 5px 0;
            }
            .article-header {
              font-weight: bold;
              margin: 15px 0 5px 0;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
            }
            .signature-box {
              width: 45%;
              text-align: center;
            }
            .signature-header {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .signature-subtext {
              font-style: italic;
              font-size: 10px;
              margin-bottom: 30px;
            }
            .signature-name {
              font-weight: bold;
              margin-top: 20px;
            }
            .signature-image {
              max-height: 60px;
              max-width: 200px;
              margin: 10px 0;
            }
            .signature-placeholder {
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-style: italic;
              color: #666;
              border: 1px dashed #ccc;
              margin: 10px 0;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div class="header" style="font-style: italic;">Độc lập – Tự do – Hạnh phúc</div>
          
          <div class="title">HỢP ĐỒNG THUÊ CĂN HỘ</div>
          <div style="text-align: center; margin-bottom: 10px;">Số: ${contractData.contractNumber}</div>
          <div style="text-align: center; margin-bottom: 20px;">
            Hôm nay, ngày ${contractData.date} tháng ${contractData.month} năm ${contractData.year}, tại ${contractData.location}.
          </div>

          <div class="section-header">Căn cứ:</div>
          <div style="margin: 5px 0;">Bộ luật Dân sự số 91/2015/QH13 đã được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thông qua ngày 24 tháng 11 năm 2015;</div>
          <div style="margin: 0 0 15px 0;">Nhu cầu của hai bên và khả năng đáp ứng.</div>

          <div class="section-header">Chúng tôi gồm:</div>
          
          <div class="party-header">BÊN CHO THUÊ (BÊN A):</div>
          <div>Ông/Bà: <strong>${landlordData.name}</strong></div>
          <div>Ngày sinh: ${landlordData.birthDate}</div>
          <div>Số CMND/CCCD: ${landlordData.idCard}</div>
          <div>Cấp ngày: ${landlordData.issueDate} tại: ${landlordData.issuePlace}</div>
          <div>Địa chỉ thường trú: ${landlordData.address}</div>
          <div style="margin-bottom: 10px;">Số điện thoại: ${landlordData.phone}</div>

          <div class="party-header">BÊN THUÊ (BÊN B):</div>
          <div>Ông/Bà: <strong>${tenantData.name}</strong></div>
          <div>Ngày sinh: ${tenantData.birthDate || "[Ngày/tháng/năm]"}</div>
          <div>Số CMND/CCCD: ${tenantData.idCard}</div>
          <div>Địa chỉ thường trú: ${tenantData.address || "[Địa chỉ thường trú]"}</div>
          <div style="margin-bottom: 15px;">Số điện thoại: ${tenantData.phone}</div>

          <div style="margin-bottom: 15px;">Hai bên thống nhất ký kết hợp đồng thuê căn hộ với các điều khoản sau:</div>

          <div class="article-header">Điều 1: ĐỐI TƯỢNG VÀ TÌNH TRẠNG CĂN HỘ</div>
          <div>Địa chỉ: ${contractData.apartmentAddress}</div>
          <div style="margin-bottom: 10px;">Cấu trúc: ${contractData.structure}</div>

          <div class="article-header">Điều 2: MỤC ĐÍCH, GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</div>
          <div>Giá thuê hàng tháng là: ${contractData.monthlyRent} đồng/tháng (Bằng chữ: ${contractData.monthlyRentText} đồng).</div>
          <div style="margin-bottom: 10px;">Tiền đặt cọc: ${contractData.deposit} đồng.</div>
          <div style="margin-bottom: 10px;">Bên B thanh toán tiền thuê vào ngày ${contractData.paymentDate} hàng tháng.</div>

          <div class="article-header">Điều 3: THỜI HẠN THUÊ VÀ GIA HẠN</div>
          <div>Thời hạn thuê là ${contractData.duration} tháng, kể từ ngày ${contractData.startDate} đến hết ngày ${contractData.endDate}.</div>
          <div style="margin: 5px 0 10px 0;">Khi hết hạn hợp đồng, nếu hai bên có nhu cầu tiếp tục thì lập hợp đồng mới.</div>

          <div class="article-header">Điều 4: QUYỀN VÀ NGHĨA VỤ CỦA BÊN CHO THUÊ</div>
          <div>- Giao căn hộ và trang thiết bị kèm theo (nếu có) cho Bên B đúng thời hạn đã thỏa thuận và trong tình trạng sẵn sàng sử dụng.</div>
          <div>- Thu tiền thuê đúng kỳ hạn đã thỏa thuận.</div>
          <div style="margin-bottom: 10px;">- Không được tăng giá thuê trong thời gian hợp đồng có hiệu lực trừ trường hợp hai bên có thỏa thuận khác.</div>

          <div class="article-header">Điều 5: QUYỀN VÀ NGHĨA VỤ CỦA BÊN THUÊ</div>
          <div>- Nhận căn hộ và trang thiết bị kèm theo (nếu có) theo đúng tình trạng như đã thỏa thuận.</div>
          <div>- Thanh toán đầy đủ tiền thuê đúng kỳ hạn đã thỏa thuận.</div>
          <div>- Sử dụng căn hộ đúng mục đích đã thỏa thuận.</div>
          <div>- Giữ gìn căn hộ và trang thiết bị kèm theo (nếu có). Nếu làm hư hỏng phải sửa chữa hoặc đền bù.</div>
          <div style="margin-bottom: 10px;">- Trả lại căn hộ cho Bên A khi hết hạn hợp đồng trong tình trạng ban đầu (trừ hao mòn tự nhiên).</div>

          <div class="article-header">Điều 6: CHẤM DỨT HỢP ĐỒNG</div>
          <div>Hợp đồng chấm dứt trong các trường hợp sau:</div>
          <div>- Hết thời hạn hợp đồng.</div>
          <div>- Hai bên thỏa thuận chấm dứt hợp đồng trước thời hạn.</div>
          <div style="margin-bottom: 20px;">- Các trường hợp khác theo quy định của pháp luật.</div>

          <div style="margin-bottom: 30px;">Hợp đồng này có hiệu lực kể từ ngày ký và được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-header">ĐẠI DIỆN BÊN CHO THUÊ (BÊN A)</div>
              <div class="signature-subtext">(Ký và ghi rõ họ tên)</div>
              ${landlordSignature
          ? `<img src="${landlordSignature}" alt="Chữ ký chủ nhà" class="signature-image" />`
          : `<div class="signature-placeholder">[Chưa ký]</div>`
        }
              <div class="signature-status">${landlordSignature ? "[Đã ký điện tử]" : ""}</div>
              <div class="signature-name">${landlordData.name}</div>
            </div>
            <div class="signature-box">
              <div class="signature-header">ĐẠI DIỆN BÊN THUÊ (BÊN B)</div>
              <div class="signature-subtext">(Ký và ghi rõ họ tên)</div>
              ${tenantSignature
          ? `<img src="${tenantSignature}" alt="Chữ ký người thuê" class="signature-image" />`
          : `<div class="signature-placeholder">[Chưa ký]</div>`
        }
              <div class="signature-status">${tenantSignature ? "[Đã ký điện tử]" : ""}</div>
              <div class="signature-name">${tenantData.name}</div>
            </div>
          </div>
        </body>
        </html>
      `

      printWindow.document.write(contractHTML)
      printWindow.document.close()

      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }

      console.log("[v0] PDF generation initiated via browser print")
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("Có lỗi xảy ra khi tạo file PDF. Vui lòng thử lại.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Hoàn tất hợp đồng
        </CardTitle>
        <CardDescription>Hợp đồng đã được ký thành công. Bạn có thể in hoặc lưu thành PDF để lưu trữ.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Hợp đồng đã được ký thành công!</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Số hợp đồng:</p>
              <p className="text-muted-foreground">{contractData.contractNumber}</p>
            </div>
            <div>
              <p className="font-medium">Ngày ký:</p>
              <p className="text-muted-foreground">
                {contractData.date}/{contractData.month}/{contractData.year}
              </p>
            </div>
            <div>
              <p className="font-medium">Bên cho thuê:</p>
              <p className="text-muted-foreground">{landlordData.name}</p>
            </div>
            <div>
              <p className="font-medium">Bên thuê:</p>
              <p className="text-muted-foreground">{tenantData.name}</p>
            </div>
            <div>
              <p className="font-medium">Thời hạn thuê:</p>
              <p className="text-muted-foreground">{contractData.duration} tháng</p>
            </div>
            <div>
              <p className="font-medium">Giá thuê:</p>
              <p className="text-muted-foreground">{contractData.monthlyRent} đồng/tháng</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={generatePDF} className="flex items-center gap-2 flex-1">
            <Printer className="w-4 h-4" />
            In hợp đồng / Lưu PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex-1"
          >
            Quay về trang chủ
          </Button>

        </div>


      </CardContent>
    </Card >
  )
}
