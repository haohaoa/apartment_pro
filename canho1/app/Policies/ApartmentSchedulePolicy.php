<?php
namespace App\Policies;
use App\Models\Apartment;
use App\Models\User;

class ApartmentSchedulePolicy
{
    /**
     * Hủy lịch (chủ tòa nhà hoặc admin)
     */
    public function cancel(User $user, Apartment $apartment): bool
    {
        return $apartment->building->owner_id === $user->id || $user->role === 'admin';
    }

    /**
     * Xem lịch (chủ tòa nhà hoặc admin)
     */
    public function view(User $user, Apartment $apartment): bool
    {
        return $apartment->building->owner_id === $user->id || $user->role === 'admin';
    }

    /**
     * Cập nhật lịch (chỉ chủ tòa nhà)
     */
    public function update(User $user, Apartment $apartment): bool
    {
        return $apartment->building->owner_id === $user->id;
    }

    /**
     * Xóa lịch (chủ tòa nhà hoặc admin)
     */
    public function delete(User $user, Apartment $apartment): bool
    {
        return $apartment->building->owner_id === $user->id || $user->role === 'admin';
    }
}
