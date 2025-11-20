<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentalContract extends Model
{
    protected $fillable = [
        'rental_order_id',
        'contract_number',
        'contract_date',
        'location',
        'apartment_address',
        'structure',
        'monthly_rent',
        'deposit',
        'deposit_months',
        'payment_date',
        'duration',
        'start_date',
        'end_date',
        'landlord_data',
        'tenant_data',
        'landlord_signature',
        'tenant_signature',
        'pdf_path',
    ];

    protected $casts = [
        'landlord_data' => 'array',
        'tenant_data' => 'array',
        'contract_date' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function order()
    {
        return $this->belongsTo(RentalOrder::class, 'rental_order_id');
    }
    public function payment()
    {
        return $this->hasMany(Payment::class, 'rental_order_id');
    }

}
