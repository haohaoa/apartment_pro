<!doctype html>
<html lang="vi">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>StayTalk — Mã xác thực</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%);
            min-height: 100vh;
        }

        a {
            color: inherit;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .logo-container {
            position: relative;
        }

        .logo-container::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            background: linear-gradient(135deg, #0ea5a4, #06b6d4, #0284c7);
            border-radius: 14px;
            opacity: 0.2;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.05); }
        }

        .card-shadow {
            box-shadow: 
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04),
                0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .otp-container {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 2px solid transparent;
            background-clip: padding-box;
            position: relative;
            overflow: hidden;
        }

        .otp-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #0ea5a4, #06b6d4);
            margin: -2px;
            border-radius: inherit;
            z-index: -1;
        }

        .otp-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .button-primary {
            background: linear-gradient(135deg, #0ea5a4, #06b6d4);
            position: relative;
            overflow: hidden;
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(14, 165, 164, 0.3);
        }

        .button-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .button-primary:hover::before {
            left: 100%;
        }

        .button-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(14, 165, 164, 0.4);
        }

        .button-secondary {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(14, 165, 164, 0.2);
            transition: all 0.3s ease;
        }

        .button-secondary:hover {
            background: rgba(14, 165, 164, 0.05);
            border-color: rgba(14, 165, 164, 0.3);
            transform: translateY(-1px);
        }

        .gradient-text {
            background: linear-gradient(135deg, #0ea5a4, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .floating-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        }

        .floating-elements::before,
        .floating-elements::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(14, 165, 164, 0.1), rgba(6, 182, 212, 0.1));
            animation: float 6s ease-in-out infinite;
        }

        .floating-elements::before {
            width: 100px;
            height: 100px;
            top: 10%;
            right: 10%;
            animation-delay: 0s;
        }

        .floating-elements::after {
            width: 60px;
            height: 60px;
            bottom: 20%;
            left: 15%;
            animation-delay: 3s;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }

        @media only screen and (max-width:600px) {
            .container {
                width: 100% !important;
                padding: 16px !important;
            }

            .card {
                padding: 24px !important;
            }

            .otp {
                font-size: 28px !important;
                letter-spacing: 4px !important;
            }

            .button-container {
                flex-direction: column !important;
            }

            .button-container a {
                width: 100% !important;
                text-align: center !important;
            }
        }
    </style>
</head>

<body style="margin:0;padding:0;background:linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%);font-family:'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;min-height:100vh;">
    <div class="floating-elements"></div>
    
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:transparent;position:relative;z-index:1;">
        <tr>
            <td align="center" style="padding:32px 24px;">
                <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation"
                    style="width:600px;max-width:600px;background:transparent;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="text-align:left;padding:16px 0 24px 0;">
                            <div style="display:flex;align-items:center;gap:16px;">
                                
                                <div style="font-size:24px;color:#0f172a;font-weight:700;letter-spacing:-0.5px;">StayTalk</div>
                            </div>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td>
                            <table class="card card-shadow" width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                style="background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-radius:20px;overflow:hidden;padding:40px;position:relative;">
                                
                                <tr>
                                    <td style="padding-bottom:12px;">
                                        <h1 style="margin:0;font-size:28px;color:#0f172a;font-weight:700;line-height:1.2;">
                                            Xin chào, <span class="gradient-text" style="font-weight:700;">{{ $user_name }}</span> 👋
                                        </h1>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding:12px 0 32px 0;color:#475569;font-size:16px;line-height:1.6;">
                                        Bạn vừa yêu cầu mã xác thực cho tài khoản StayTalk. Vui lòng sử dụng mã bên dưới trong vòng
                                        <strong style="color:#0ea5a4;font-weight:600;">{{ $expiry_minutes }} phút</strong>.
                                    </td>
                                </tr>

                                <!-- Enhanced OTP block -->
                                <tr>
                                    <td align="center" style="padding:16px 0 32px 0;">
                                        <div class="otp-container" style="display:inline-block;padding:32px 40px;border-radius:20px;position:relative;">
                                            <div style="font-size:16px;color:#64748b;margin-bottom:12px;font-weight:500;text-transform:uppercase;letter-spacing:1px;">
                                                Mã xác thực của bạn
                                            </div>
                                            <div class="otp gradient-text"
                                                style="font-size:42px;font-weight:800;letter-spacing:8px;text-align:center;font-family:'Courier New', Courier, monospace;margin:8px 0;">
                                                {{ $otp }}
                                            </div>
                                            <div style="font-size:14px;color:#94a3b8;margin-top:8px;font-weight:500;">
                                                🔒 Bảo mật cao
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:8px 0 24px 0;color:#475569;font-size:14px;line-height:1.6;">
                                        <div style="background:rgba(14,165,164,0.05);border-left:4px solid #0ea5a4;padding:16px 20px;border-radius:8px;margin:16px 0;">
                                            <div style="font-weight:600;color:#0f172a;margin-bottom:8px;">⚠️ Lưu ý quan trọng:</div>
                                            <ul style="margin:0;padding:0 0 0 20px;color:#64748b;">
                                                <li style="margin-bottom:4px;">Không chia sẻ mã này với bất kỳ ai</li>
                                                <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email hoặc liên hệ hỗ trợ</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding-top:8px;">
                                        <div class="button-container" style="display:flex;gap:12px;flex-wrap:wrap;">
                                            <a href="#" class="button-primary"
                                                style="background:linear-gradient(135deg,#0ea5a4,#06b6d4);color:#fff;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;position:relative;overflow:hidden;display:inline-block;">
                                                🚀 Quay về ứng dụng
                                            </a>
                                            <a href="mailto:{{ $support_email }}" class="button-secondary"
                                                style="background:rgba(255,255,255,0.8);backdrop-filter:blur(10px);border:1px solid rgba(14,165,164,0.2);color:#0f172a;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;display:inline-block;">
                                                💬 Liên hệ hỗ trợ
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Enhanced Footer -->
                    <tr>
                        <td style="padding-top:24px;">
                            <table width="100%" role="presentation"
                                style="font-size:14px;color:#64748b;text-align:left;background:rgba(255,255,255,0.6);backdrop-filter:blur(10px);border-radius:16px;padding:24px;">
                                <tr>
                                    <td>
                                        <div style="font-weight:600;color:#0f172a;margin-bottom:8px;">
                                            🏠 StayTalk • Ứng dụng kết nối cho thuê — Bảo mật & nhanh chóng
                                        </div>
                                        <div style="margin-bottom:12px;line-height:1.5;">
                                            Nếu bạn gặp vấn đề, gửi email tới
                                            <a href="mailto:{{ $support_email }}" style="color:#0ea5a4;font-weight:600;">{{ $support_email }}</a>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top:12px;color:#94a3b8;font-size:13px;border-top:1px solid rgba(148,163,184,0.2);">
                                        © {{ $year }} StayTalk. All rights reserved. Made with ❤️ in Vietnam
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>