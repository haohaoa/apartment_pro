<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'address',
        'lat',
        'lng',
        'floors',
        'description',
        'status',
    ];

    /**
     * Một tòa nhà có nhiều căn hộ
     */
    public function apartments()
    {
        return $this->hasMany(Apartment::class , 'building_id');
    }
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
