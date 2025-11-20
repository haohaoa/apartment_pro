<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ViewingSchedule;

class ViewingSchedulePolicy
{
    /**
     * User có quyền hủy lịch không
     */
    public function cancel(User $user, ViewingSchedule $schedule): bool
    {
        // Chủ sở hữu hoặc admin mới được hủy
        return $schedule->user_id === $user->id || $user->role === 'admin';
    }

    /**
     * User có quyền xem lịch không
     */
    public function view(User $user, ViewingSchedule $schedule): bool
    {
        return $schedule->user_id === $user->id || $user->role === 'admin';
    }

    /**
     * User có quyền cập nhật lịch không
     */
    public function update(User $user, ViewingSchedule $schedule): bool
    {
        return $schedule->user_id === $user->id;
    }

    /**
     * User có quyền xóa lịch không
     */
    public function delete(User $user, ViewingSchedule $schedule): bool
    {
        return $user->role === 'admin';
    }

    public function viewOwner(User $user, ViewingSchedule $schedule): bool
    {
        return $schedule->apartment->building->owner_id === $user->id || $user->role === 'admin';
    }
    public function updateOwner(User $user, ViewingSchedule $schedule): bool
    {
        return $schedule->apartment->building->owner_id  === $user->id || $user->role === 'admin';
    }
}
