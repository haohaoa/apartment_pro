<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'refresh_token',
        'signature',
        'idCard',
        'birthDate',
        'role',
        'status',
        'bank_name',
        'bank_account_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function building()
    {
        return $this->hasMany(Apartment::class, 'owner_id');
    }

    public function rentalOrdersUser()
    {
        return $this->hasMany(RentalOrder::class, 'user_id');
    }
    public function rentalOrdersOwner()
    {
        return $this->hasMany(RentalOrder::class, 'owner_id');
    }
    public function chatHistories()
    {
        return $this->hasMany(ChatHistory::class);
    }
    /**
     * Lấy định danh để đưa vào JWT (ví dụ: id)
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Thêm các claims tuỳ chỉnh nếu cần (thường để trống)
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
    public function viewingSchedules()
    {
        return $this->hasMany(ViewingSchedule::class);
    }

    public function Order()
    {
        return $this->hasMany(RentalOrder::class, 'user_id');
    }

}
