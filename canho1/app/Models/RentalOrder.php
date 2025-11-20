<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalOrder extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'apartment_id', 'start_date', 'end_date', 'status', 'owner_id'];

    public function tenant()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function apartment()
    {
        return $this->belongsTo(Apartment::class , 'apartment_id');
    }

    public function payment()
    {
        return $this->hasMany(Payment::class, 'rental_order_id');
    }
    public function Contract()
    {
        return $this->hasOne(RentalContract::class, 'rental_order_id');
    }
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function User (){
        return $this->belongsTo(User::class,'user_id');
    }
    
}
