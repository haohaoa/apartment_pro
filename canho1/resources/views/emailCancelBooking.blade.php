<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thông báo hủy hợp đồng thuê căn hộ - StayTalk</title>
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

    /* Header - Changed gradient to more neutral/serious colors for cancellation */
    .header {
      background: linear-gradient(135deg, #5a6c7d 0%, #3d4f5d 100%);
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
      border-left: 5px solid #5a6c7d;
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

    /* Notice Section - Changed to red/warning colors for cancellation notice */
    .notice {
      background: #ffebee;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
      border-left: 5px solid #d32f2f;
    }

    .notice h3 {
      margin-bottom: 15px;
      font-size: 18px;
      color: #c62828;
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
      content: "⚠️";
      margin-right: 10px;
    }

    /* Support Message */
    .support-message {
      background: #e3f2fd;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 25px;
      border-left: 5px solid #1976d2;
      font-size: 15px;
      color: #1565c0;
    }

    /* CTA Button - Changed button color to match new theme */
    .cta {
      text-align: center;
      margin-top: 25px;
    }

    .cta a {
      display: inline-block;
      background: linear-gradient(135deg, #5a6c7d 0%, #3d4f5d 100%);
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

    /* Added styling for rights notice */
    .rights-notice {
      font-weight: 600;
      font-size: 15px;
      opacity: 1;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
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
    <div class="header">
      <div class="brand-name">StayTalk</div>
      <h1>Thông báo hủy hợp đồng thuê căn hộ</h1>
      <p>Hợp đồng của bạn đã được hủy thành công</p>
    </div>

    <div class="banner"></div>

    <div class="content">
      <div class="greeting">
        Kính gửi Quý khách,<br>
        Chúng tôi xác nhận rằng hợp đồng thuê căn hộ của bạn đã được hủy theo yêu cầu.
      </div>

      <div class="contract-info">
        <h3>📋 Thông tin hợp đồng đã hủy</h3>
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
          <span class="info-label">Ngày kết thúc dự kiến:</span>
          <span class="info-value">{{ \Carbon\Carbon::parse($data['contract']->end_date)->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Ngày hủy hợp đồng:</span>
          <span class="info-value">{{ \Carbon\Carbon::now()->format('d/m/Y') }}</span>
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

      <div class="notice">
        <h3>⚠️ Lưu ý về việc hủy hợp đồng</h3>
        <ul>
          <li>Vui lòng hoàn tất thủ tục bàn giao căn hộ trong vòng 7 ngày.</li>
          <li>Kiểm tra tình trạng căn hộ và các trang thiết bị trước khi bàn giao.</li>
          <li>Thanh toán đầy đủ các khoản phí còn thiếu (nếu có).</li>
          <li>Tiền đặt cọc sẽ được hoàn trả theo quy định trong hợp đồng.</li>
          <li>Giữ lại bản hợp đồng và biên bản hủy để đối chiếu khi cần.</li>
        </ul>
      </div>
      <div class="support-message">
        Nếu Anh/Chị có bất kỳ câu hỏi nào về việc hủy hợp đồng hoặc hoàn trả tiền cọc, vui lòng liên hệ với chúng tôi qua thông tin bên dưới. Chúng tôi luôn sẵn sàng hỗ trợ Anh/Chị.
      </div>

      <div class="cta">
        <a href="{{ $data['contract']->pdf_url }}">📄 Xem biên bản hủy hợp đồng</a>
      </div>
    </div>

    <div class="footer">
      <p class="brand-footer">StayTalk</p>
      <p>&copy; {{ now()->year }} StayTalk. Tất cả quyền được bảo lưu.</p>
      <p>Email này được gửi tự động, vui lòng không trả lời trực tiếp.</p>
   
      <p class="rights-notice">Mọi quyền lợi được xử lý theo hợp đồng.</p>
      <div class="social-links">
        <a href="#">Facebook</a>
        <a href="#">Website</a>
        <a href="#">Hotline</a>
      </div>
    </div>
  </div>
</body>

</html>
