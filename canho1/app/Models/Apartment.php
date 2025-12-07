<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apartment extends Model
{
    use HasFactory;

    protected $fillable = [ 'building_id', 'title', 'description', 'address','deposit', 'price', 'status'];

    // public function owner()
    // {
    //     return $this->belongsTo(User::class, 'owner_id');
    // }

    public function images()
    {
        return $this->hasMany(ApartmentImage::class ,'apartment_id');
    }

    public function rentalOrders()
    {
        return $this->hasMany(RentalOrder::class,'apartment_id');
    }
    public function viewingSchedules()
    {
        return $this->hasMany(ViewingSchedule::class);
    }
    public function building()
    {
        return $this->belongsTo(Building::class ,'building_id');
    } 

    public function rentalContracts()
    {
        return $this->hasMany(RentalContract::class);
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequests::class, 'apartment_id');
    }
}
