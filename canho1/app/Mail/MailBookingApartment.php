<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailBookingApartment extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Xác nhận hợp đồng thuê căn hộ')
            ->to($this->data['tenant_email']) // gửi cho khách thuê
            ->cc($this->data['landlord_email']) // gửi kèm cho chủ nhà
            // ->bcc('admin@staytalk.com') // nếu muốn gửi ẩn cho admin
            ->view('emailbookingclinet')
            ->with(['data' => $this->data])
            ->attach(storage_path('app/' . $this->data['file_path']), [
                'as' => 'HopDong.pdf',
                'mime' => 'application/pdf',
            ]);
    }

}
