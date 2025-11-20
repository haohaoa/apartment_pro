<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailViewingSchedule extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Xác nhận lich xem căn hộ')
            ->to($this->data['email_user']) // gửi cho khách thuê
            ->cc($this->data['email_owner']) // gửi kèm cho chủ nhà
            // ->bcc('admin@staytalk.com') // nếu muốn gửi ẩn cho admin
            ->view('emailViewingSchedule')
            ->with(['data' => $this->data]);
    }

}
