<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'rental_order_id',
        'amount',
        'total_price',
        'month',
        'year',
        'period_start',
        'period_end',
        'payment_date',
        'method',
        'status',
    ];

    protected $casts = [
        'period_start' => 'datetime',
        'period_end' => 'datetime',
        'payment_date' => 'datetime',
    ];
    public function rentalOrder()
    {
        return $this->belongsTo(RentalOrder::class, 'rental_order_id');
    }

    public function rentalContract()
    {
        return $this->belongsTo(RentalContract::class, 'rental_order_id');
    }

}

