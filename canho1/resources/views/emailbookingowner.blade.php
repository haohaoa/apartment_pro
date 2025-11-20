<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận hợp đồng thuê căn hộ</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
            color: white;
            padding: 25px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
        }
        .content {
            padding: 25px 20px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 15px;
        }
        .contract-info {
            background: #f9fafb;
            border-left: 4px solid #43cea2;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            border-bottom: 1px solid #eee;
            padding-bottom: 6px;
        }
        .info-label {
            font-weight: bold;
            color: #555;
        }
        .info-value {
            color: #111;
        }
        .highlight {
            background: #fff3cd;
            border-left: 4px solid #ffb703;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>📑 Hợp đồng thuê căn hộ đã được ký</h1>
            <p>Khách thuê đã hoàn tất việc ký hợp đồng</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Kính gửi <strong>{{ $data['landlord']['name'] ?? 'Quý chủ nhà' }}</strong>,
            </div>

            <p>Chúng tôi xin thông báo: hợp đồng thuê căn hộ của quý vị đã được ký bởi khách thuê <strong>{{ $data['tenant']['name'] ?? 'Khách hàng' }}</strong>. Thông tin chi tiết như sau:</p>

            <div class="contract-info">
                <div class="info-row">
                    <span class="info-label">Mã hợp đồng:</span>
                    <span class="info-value">{{ $data['contract']->contract_number }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Căn hộ:</span>
                    <span class="info-value">{{ $data['contract']->apartment_address }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Khách thuê:</span>
                    <span class="info-value">{{ $data['tenant']['name'] ?? '' }} ({{ $data['tenant']['phone'] ?? '' }})</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Thời hạn thuê:</span>
                    <span class="info-value">{{ $data['contract']->duration }} tháng</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ngày bắt đầu:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($data['contract']->start_date)->format('d/m/Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Giá thuê:</span>
                    <span class="info-value"><strong>{{ number_format($data['contract']->monthly_rent) }} VNĐ</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tiền đặt cọc:</span>
                    <span class="info-value"><strong>{{ number_format($data['contract']->deposit) }} VNĐ</strong></span>
                </div>
            </div>

            <div class="highlight">
                📎 File hợp đồng đã được ký được đính kèm trong email này.  
                Vui lòng lưu giữ để đối chiếu sau này.
            </div>

            <p>Xin cảm ơn sự hợp tác của Quý chủ nhà.<br>Trân trọng,</p>
            <p><strong>Hệ thống Quản lý Cho thuê</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; {{ date('Y') }} Hệ thống Cho Thuê Căn Hộ. Mọi quyền được bảo lưu.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>
