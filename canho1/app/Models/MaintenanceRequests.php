<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRequests extends Model
{
    use HasFactory;

    protected $table = 'maintenance_requests';

    protected $fillable = [
        'apartment_id',
        'user_id',
        'description',
        'attachment',
        'status',
        'note',
    ];

    /**
     * 🔗 Căn hộ gặp sự cố
     */
    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apartment_id');
    }

    /**
     * 🔗 Người gửi yêu cầu (khách thuê)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * 📬 Có thể tạo notification khi có yêu cầu bảo trì mới
     */
    public function notifications()
    {
        return $this->hasMany(Notifications::class, 'user_id', 'user_id');
    }

    /**
     * 🧠 Scope: Lấy yêu cầu bảo trì mới nhất của 1 chủ nhà (qua apartment -> building -> owner)
     */
    public function scopeForOwner($query, $ownerId)
    {
        return $query->whereHas('apartment.building', function ($q) use ($ownerId) {
            $q->where('owner_id', $ownerId);
        })->latest();
    }
}
