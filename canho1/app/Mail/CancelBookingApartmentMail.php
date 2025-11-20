<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CancelBookingApartmentMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Xác nhận hủy hợp đồng thuê căn hộ')
            ->view('emailCancelBooking') // => resources/views/emails/booking-client.blade.php
            ->with([
                'data' => $this->data,
            ]);
    }
}
