<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'status',
        'url',
    ];

    /**
     * 🔗 Người nhận thông báo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * 🧠 Scope: Lấy danh sách thông báo chưa đọc
     */
    public function scopeUnread($query)
    {
        return $query->where('status', 'unread');
    }

    /**
     * 🧠 Scope: Lấy danh sách mới nhất cho 1 user
     */
    public function scopeLatestForUser($query, $userId)
    {
        return $query->where('user_id', $userId)->orderBy('created_at', 'desc');
    }
}
