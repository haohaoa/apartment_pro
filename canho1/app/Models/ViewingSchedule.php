<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ViewingSchedule extends Model
{
    use HasFactory;

    // Cho phép gán hàng loạt các trường này
    protected $fillable = [
        'apartment_id',
        'user_id',
        'scheduled_at',
        'status',
        'note',
        'deadline'
    ];

    /**
     * Mối quan hệ: Lịch xem phòng thuộc về một căn hộ
     */
    public function apartment()
    {
        return $this->belongsTo(Apartment::class);
    }

    /**
     * Mối quan hệ: Lịch xem phòng được tạo bởi một người dùng
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}