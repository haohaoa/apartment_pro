<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $userName;
    /**
     * Tạo instance mới, truyền OTP vào
     */
    public function __construct($otp,$userName)
    {
        $this->otp = $otp;
        $this->userName = $userName;
    }

    /**
     * Xây dựng nội dung email
     */
    public function build()
    {
        return $this->subject('Mã OTP xác thực - StayTalk')
            ->view('emailverify')
            ->with([
                'otp' => $this->otp,
                'user_name' => $this->userName,
                'expiry_minutes' => 5,
                'support_email' => 'support@staytalk.com',
                'year' => date('Y'),
            ]);
    }

}
