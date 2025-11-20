<?php

namespace App\Policies;

use App\Models\User;

class UserSchedulePolicy
{
    /**
     * User có quyền hủy lịch không
     */
    public function cancel(User $user, User $U): bool
    {
        // Chủ sở hữu hoặc admin mới được hủy
        return $U->user_id === $user->id || $U->role === 'admin';
    }

    /**
     * User có quyền xem lịch không
     */
    public function view(User $user, User $U): bool
    {

        return $U->user_id === $user->id || $U->role === 'admin';
    }

    /**
     * User có quyền cập nhật lịch không
     */
    public function update(User $user, User $U): bool
    {
        return $U->owner_id === $user->id || $U->role === 'admin';
    }

    /**
     * User có quyền xóa lịch không
     */
    public function delete(User $user, User $U): bool
    {
        return $U->role === 'admin';
    }

    public function updatePayment(User $user, User $U): bool
    {
        return $U->user_id === $user->id;
    }

    public function updatePaymentOwner(User $user, User $U): bool
    {
        return $U->apartment->building->owner_id === $user->id;
    }
}
