<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Thông báo lịch xem phòng - StayTalk</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: 'Inter', Arial, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper {
        width: 100%;
        background: linear-gradient(135deg, #38bdf8, #6366f1);
        padding: 40px 0;
      }
      .container {
        max-width: 680px;
        margin: 0 auto;
        background: #fff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      }
      .header {
        background: linear-gradient(90deg, #2563eb, #38bdf8);
        padding: 20px;
        text-align: center;
      }
      .header img {
        width: 140px;
      }
      .content {
        padding: 26px 28px;
        color: #0f172a;
      }
      h1 {
        font-size: 22px;
        text-align: center;
        color: #0f172a;
        margin-bottom: 16px;
      }
      p {
        font-size: 15px;
        color: #475569;
        line-height: 1.6;
        margin: 0 0 14px;
      }
      .apartment-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 18px;
      }
      .apartment-img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        display: block;
      }
      .apartment-details {
        padding: 12px 16px;
      }
      .apartment-details div {
        margin-bottom: 6px;
        font-size: 14px;
      }
      .apartment-details .title {
        font-weight: 700;
        color: #0f172a;
        font-size: 16px;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 18px;
      }
      .meta .item {
        flex: 1 1 180px;
        background: #f1f5f9;
        border-radius: 8px;
        padding: 10px;
        text-align: center;
      }
      .meta .label {
        font-size: 12px;
        color: #64748b;
        margin-bottom: 4px;
      }
      .meta .value {
        font-weight: 600;
        color: #0f172a;
      }
      .map-button {
        display: inline-block;
        background: linear-gradient(90deg, #3b82f6, #06b6d4);
        color: #fff;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        padding: 10px 18px;
        border-radius: 8px;
        text-align: center;
        margin-top: 20px;
      }
      .map-button:hover {
        opacity: 0.9;
      }
      .footer {
        background: #f9fafb;
        border-top: 1px solid #e2e8f0;
        padding: 18px 26px;
        font-size: 13px;
        color: #334155;
      }
      .contact {
        margin-bottom: 8px;
      }
      @media (max-width: 520px) {
        h1 { font-size: 20px; }
        .meta { flex-direction: column; }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
        </div>
        <div class="content">
          <h1>Thông báo lịch xem phòng</h1>
          <p>Kính gửi <strong>{{ $data['owner_name'] }}</strong> và <strong>{{ $data['name_user'] }}</strong>,</p>
          <p>Hệ thống <strong>StayTalk</strong> xin thông báo đã có lịch xem phòng được sắp xếp như sau:</p>

          <div class="apartment-card">
            <div class="apartment-details">
              <div class="title">Căn hộ: {{ $data['building'] }}</div>
              <div>Địa chỉ: {{ $data['address'] }}</div>
              <div>Giá thuê: {{ $data['price'] }}</div>
            </div>
          </div>

          <div class="meta">
            <div class="item"><div class="label">Ngày xem</div><div class="value">{{ $data['date'] }}</div></div>
            <div class="item"><div class="label">Giờ</div><div class="value">{{ $data['time'] ?? '—' }}</div></div>
            <div class="item"><div class="label">Người liên hệ</div><div class="value">{{ $data['owner_name'] }}</div></div>
          </div>

          <p style="margin-top:16px;">Ghi chú: <span style="color:#0f172a">{{ $data['note'] }}</span></p>

          <center>
            <a href="{{ $data['map_link'] ?? '#' }}" class="map-button" target="_blank">📍 Xem vị trí trên bản đồ</a>
          </center>

          <p style="margin-top:24px;color:#0f172a;font-weight:600;text-align:center;">
            Vui lòng có mặt đúng giờ tại địa chỉ trên để buổi xem phòng diễn ra thuận lợi.<br>
            Xin cảm ơn sự hợp tác của quý khách!
          </p>
        </div>
        <div class="footer">
          <div class="contact">
            <strong>Người phụ trách:</strong> {{ $data['owner_name'] }}<br>
            <strong>Điện thoại:</strong> <a href="tel:{{ $data['phone_owner'] }}" style="color:#0f172a;text-decoration:none">{{ $data['phone_owner'] }}</a>
          </div>
          <div style="font-size:12px;color:#94a3b8;">
            © {{ date('Y') }} StayTalk — Hệ thống đặt lịch xem phòng.<br>
            Đây là email tự động, vui lòng không phản hồi.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
