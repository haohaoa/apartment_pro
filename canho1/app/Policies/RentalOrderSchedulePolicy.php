<?php

namespace App\Policies;

use App\Models\User;
use App\Models\RentalOrder;

class RentalOrderSchedulePolicy
{
    /**
     * User có quyền hủy lịch không
     */
    public function cancel(User $user, RentalOrder $order): bool
    {
        // Chủ sở hữu hoặc admin mới được hủy
        return $order->user_id === $user->id || $user->role === 'admin';
    }

    /**
     * User có quyền xem lịch không
     */
    public function view(User $user, RentalOrder $order): bool
    {
        return $order->user_id === $user->id || $user->role === 'admin';
    }

    /**
     * User có quyền cập nhật lịch không
     */
    public function update(User $user, RentalOrder $order): bool
    {
        return $order->owner_id === $user->id;
    }

    /**
     * User có quyền xóa lịch không
     */
    public function delete(User $user, RentalOrder $order): bool
    {
        return $user->role === 'admin';
    }

    public function updatePayment(User $user, RentalOrder $order): bool
    {
        return $order->user_id === $user->id; 
    }

    public function updatePaymentOwner(User $user, RentalOrder $order): bool
    {
        return $order->apartment->building->owner_id === $user->id; 
    }
}
