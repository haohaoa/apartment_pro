<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận ký hợp đồng thuê căn hộ - StayTalk</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f6fa;
      padding: 20px 0;
    }

    .email-container {
      max-width: 650px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.1);
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 50px 30px 30px;
      position: relative;
    }

    .brand-name {
      font-size: 34px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .header h1 {
      font-size: 22px;
      margin-bottom: 10px;
      font-weight: 500;
    }

    .header p {
      font-size: 16px;
      opacity: 0.95;
    }

    /* Banner */
    .banner {
      width: 100%;
      height: 160px;
      background: url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
    }

    /* Content */
    .content {
      padding: 40px 30px;
    }

    .greeting {
      font-size: 18px;
      margin-bottom: 25px;
      color: #2c3e50;
    }

    .contract-info {
      background: #f8f9fc;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
      border-left: 5px solid #667eea;
    }

    .contract-info h3 {
      margin-bottom: 20px;
      font-size: 20px;
      color: #2c3e50;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 15px;
    }

    .info-label {
      font-weight: 500;
      color: #495057;
    }

    .info-value {
      font-weight: 600;
      color: #2c3e50;
    }

    /* Notice Section */
    .notice {
      background: #fff8e1;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
      border-left: 5px solid #ff9800;
    }

    .notice h3 {
      margin-bottom: 15px;
      font-size: 18px;
      color: #e65100;
    }

    .notice ul {
      list-style: none;
      padding-left: 0;
    }

    .notice li {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #5d4037;
    }

    .notice li::before {
      content: "✅";
      margin-right: 10px;
    }

    /* CTA Button */
    .cta {
      text-align: center;
      margin-top: 25px;
    }

    .cta a {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 28px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      transition: 0.3s;
    }

    .cta a:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    /* Footer */
    .footer {
      background: #2c3e50;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }

    .footer p {
      margin-bottom: 10px;
      font-size: 14px;
      opacity: 0.85;
    }

    .brand-footer {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .social-links a {
      color: white;
      margin: 0 12px;
      text-decoration: none;
      font-weight: 500;
      opacity: 0.85;
      transition: 0.3s;
    }

    .social-links a:hover {
      opacity: 1;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="brand-name">StayTalk</div>
      <h1>Xác nhận hợp đồng thuê căn hộ</h1>
      <p>Chúc mừng! Hợp đồng của bạn đã được ký thành công 🎉</p>
    </div>

    <!-- Banner -->
    <div class="banner"></div>

    <!-- Content -->
    <div class="content">
      <div class="contract-info">
        <h3>📋 Thông tin hợp đồng</h3>
        <div class="info-row">
          <span class="info-label">Mã hợp đồng:</span>
          <span class="info-value">{{ $data['contract']->contract_number }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Địa chỉ căn hộ:</span>
          <span class="info-value">{{ $data['contract']->apartment_address }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Thời gian thuê:</span>
          <span class="info-value">{{ $data['contract']->duration }} tháng</span>
        </div>
        <div class="info-row">
          <span class="info-label">Ngày bắt đầu:</span>
          <span class="info-value">{{ \Carbon\Carbon::parse($data['contract']->start_date)->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Ngày kết thúc:</span>
          <span class="info-value">{{ \Carbon\Carbon::parse($data['contract']->end_date)->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Giá thuê hàng tháng:</span>
          <span class="info-value">{{ number_format($data['contract']->monthly_rent) }} VNĐ</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tiền đặt cọc:</span>
          <span class="info-value">{{ number_format($data['contract']->deposit) }} VNĐ</span>
        </div>
      </div>

      <!-- Notice -->
      <div class="notice">
        <h3>📌 Lưu ý khi thuê căn hộ</h3>
        <ul>
          <li>Đọc kỹ toàn bộ nội dung hợp đồng trước khi lưu giữ.</li>
          <li>Giữ lại bản hợp đồng PDF để đối chiếu khi cần.</li>
          <li>Thanh toán đúng hạn theo lịch quy định.</li>
          <li>Không tự ý cho thuê lại căn hộ khi chưa có sự đồng ý của chủ nhà.</li>
          <li>Thông báo ngay cho chủ nhà khi có sự cố hỏng hóc trong căn hộ.</li>
        </ul>
      </div>
      <div>Nếu Anh/Chị có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua thông tin trên. Chúng tôi luôn sẵn sàng hỗ trợ Anh/Chị.</div>
      <!-- CTA -->
      <div class="cta">
        <a href="{{ $data['contract']->pdf_url }}">📄 Xem hợp đồng PDF</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="brand-footer">StayTalk</p>
      <p>&copy; {{ now()->year }} StayTalk. Tất cả quyền được bảo lưu.</p>
      <p>Email này được gửi tự động, vui lòng không trả lời trực tiếp.</p>
      <div class="social-links">
        <a href="#">Facebook</a>
        <a href="#">Website</a>
        <a href="#">Hotline</a>
      </div>
    </div>
  </div>
</body>

</html>
