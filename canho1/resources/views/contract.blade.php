<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Hợp đồng thuê căn hộ {{ $contractData['contractNumber'] ?? '' }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
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

        .section-header,
        .party-header,
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

        .signature-status {
            font-size: 10px;
            color: green;
        }
    </style>
</head>

<body>
    <div class="header">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
    <div class="header" style="font-style: italic;">Độc lập – Tự do – Hạnh phúc</div>

    <div class="title">HỢP ĐỒNG THUÊ CĂN HỘ</div>
    <div style="text-align: center; margin-bottom: 10px;">Số: {{ $contractData['contractNumber'] ?? '' }}</div>
    <div style="text-align: center; margin-bottom: 20px;">
        Hôm nay, ngày {{ $contractData['date'] ?? '' }} tháng {{ $contractData['month'] ?? '' }} năm
        {{ $contractData['year'] ?? '' }}, tại {{ $contractData['location'] ?? '' }}.
    </div>

    <div class="section-header">Căn cứ:</div>
    <div>Bộ luật Dân sự số 91/2015/QH13 đã được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thông qua ngày
        24/11/2015;</div>
    <div>Nhu cầu của hai bên và khả năng đáp ứng.</div>

    <div class="section-header">Chúng tôi gồm:</div>

    {{-- BÊN A --}}
    <div class="party-header">BÊN CHO THUÊ (BÊN A):</div>
    <div>Ông/Bà: <strong>{{ $landlordData['name'] ?? '' }}</strong></div>
    <div>Ngày sinh: {{ $landlordData['birthDate'] ?? '' }}</div>
    <div>Số CMND/CCCD: {{ $landlordData['idCard'] ?? '' }}</div>
    <div>Cấp ngày: {{ $landlordData['issueDate'] ?? '' }} tại: {{ $landlordData['issuePlace'] ?? '' }}</div>
    <div>Địa chỉ thường trú: {{ $landlordData['address'] ?? '' }}</div>
    <div>Số điện thoại: {{ $landlordData['phone'] ?? '' }}</div>

    {{-- BÊN B --}}
    <div class="party-header">BÊN THUÊ (BÊN B):</div>
    <div>Ông/Bà: <strong>{{ $tenantData['name'] ?? '' }}</strong></div>
    <div>Ngày sinh: {{ $tenantData['birthDate'] ?? '' }}</div>
    <div>Số CMND/CCCD: {{ $tenantData['idCard'] ?? '' }}</div>
    <div>Địa chỉ thường trú: {{ $tenantData['address'] ?? '' }}</div>
    <div>Số điện thoại: {{ $tenantData['phone'] ?? '' }}</div>

    <p>Hai bên thống nhất ký kết hợp đồng thuê căn hộ với các điều khoản sau:</p>

    {{-- Điều 1 --}}
    <div class="article-header">Điều 1: ĐỐI TƯỢNG VÀ TÌNH TRẠNG CĂN HỘ</div>
    <div>Địa chỉ: {{ $contractData['apartmentAddress'] ?? '' }}</div>
    <div>Cấu trúc: {{ $contractData['structure'] ?? '' }}</div>

    {{-- Điều 2 --}}
    <div class="article-header">Điều 2: MỤC ĐÍCH, GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</div>
    <div>Giá thuê hàng tháng: {{ $contractData['monthlyRent'] ?? '' }} đồng/tháng.</div>
    <div>Tiền đặt cọc: {{ $contractData['deposit'] ?? '' }} đồng.</div>
    <div>Bên B thanh toán tiền thuê vào ngày {{ $contractData['paymentDate'] ?? '' }} hàng tháng.</div>

    {{-- Điều 3 --}}
    <div class="article-header">Điều 3: THỜI HẠN THUÊ VÀ GIA HẠN</div>
    <div>Thời hạn thuê: {{ $contractData['duration'] ?? '' }} tháng, từ {{ $contractData['startDate'] ?? '' }} đến
        {{ $contractData['endDate'] ?? '' }}.
    </div>

    {{-- Điều 4 --}}
    <div class="article-header">Điều 4: QUYỀN VÀ NGHĨA VỤ BÊN CHO THUÊ</div>
    <div>- Giao căn hộ đúng thỏa thuận.</div>
    <div>- Thu tiền thuê đúng kỳ hạn.</div>
    <div>- Không được tăng giá thuê nếu không có thỏa thuận khác.</div>

    {{-- Điều 5 --}}
    <div class="article-header">Điều 5: QUYỀN VÀ NGHĨA VỤ BÊN THUÊ</div>
    <div>- Nhận và sử dụng căn hộ đúng mục đích.</div>
    <div>- Thanh toán tiền thuê đúng hạn.</div>
    <div>- Giữ gìn căn hộ và trang thiết bị.</div>
    <div>- Trả lại căn hộ khi hết hạn.</div>

    {{-- Điều 6 --}}
    <div class="article-header">Điều 6: CHẤM DỨT HỢP ĐỒNG</div>
    <div>- Hết thời hạn hợp đồng.</div>
    <div>- Hai bên thỏa thuận chấm dứt trước hạn.</div>
    <div>- Các trường hợp khác theo luật định.</div>
    {{-- Điều 7 --}}
    <div class="article-header">Điều 7: RỦI RO VÀ GIẢI QUYẾT TRANH CHẤP</div>
    <div>- Khách hàng thanh toán tiền thuê và tiền cọc trực tiếp cho bên cho thuê, hệ thống chỉ lưu trữ hợp đồng điện
        tử. Bên cho thuê chịu trách nhiệm quản lý khoản tiền này.</div>
    <div>- Hợp đồng chỉ có hiệu lực pháp lý và được chia sẻ cho hai bên khi bên cho thuê xác nhận duyệt hợp đồng trên hệ
        thống.</div>
    <div>- Trường hợp bên cho thuê từ chối sau khi khách đã thanh toán, việc hoàn trả tiền cọc và tiền thuê sẽ được thực
        hiện theo thỏa thuận hai bên hoặc theo pháp luật hiện hành.</div>
    <div>- Trường hợp khách hàng hủy hợp đồng sau khi ký nhưng chưa được duyệt, việc hoàn tiền cọc sẽ được thực hiện
        theo thỏa thuận hoặc quy định hệ thống.</div>
    <div>- Mọi lý do khác phát sinh ngoài hợp đồng này sẽ được hai bên thương lượng trực tiếp và ghi nhận bằng văn bản.
    </div>

    <p>Hợp đồng có hiệu lực từ ngày ký, lập thành 02 bản, mỗi bên giữ 01 bản.</p>

    <div class="signature-section">
        <table style="width: 100%; margin-top:40px; text-align: center;">
            <tr>
                <td style="width: 50%;">
                    <div class="signature-header">ĐẠI DIỆN BÊN CHO THUÊ (BÊN A)</div>
                    <div class="signature-subtext">(Ký và ghi rõ họ tên)</div>
                    @if(!empty($landlordSignature))
                        <img src="{{ $landlordSignature }}" alt="Chữ ký chủ nhà" class="signature-image">
                        <div class="signature-status">[Đã ký điện tử]</div>
                    @else
                        <div class="signature-placeholder">[Chưa ký]</div>
                    @endif
                    <div class="signature-name">{{ $landlordData['name'] ?? '' }}</div>
                </td>
                <td style="width: 50%;">
                    <div class="signature-header">ĐẠI DIỆN BÊN THUÊ (BÊN B)</div>
                    <div class="signature-subtext">(Ký và ghi rõ họ tên)</div>
                    @if(!empty($tenantSignature))
                        <img src="{{ $tenantSignature }}" alt="Chữ ký người thuê" class="signature-image">
                        <div class="signature-status">[Đã ký điện tử]</div>
                    @else
                        <div class="signature-placeholder">[Chưa ký]</div>
                    @endif
                    <div class="signature-name">{{ $tenantData['name'] ?? '' }}</div>
                </td>
            </tr>
        </table>
    </div>

</body>

</html>