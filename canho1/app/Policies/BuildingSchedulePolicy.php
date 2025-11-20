<?php

namespace App\Policies;

use App\Models\Building;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BuildingSchedulePolicy
{
    /**
     * Determine whether the user can view any models.
     */
      public function cancel(User $user, Building $Building): bool
    {
        // Chủ sở hữu hoặc admin mới được hủy
        return $Building->owner_id === $user->id || $user->role === 'admin';
    }

    /**
     * User có quyền xem lịch không
     */
    public function view(User $user, Building $Building): bool
    {
        return $Building->owner_id === $user->id || $user->role === 'admin';
    }

    /**
     * User có quyền cập nhật lịch không
     */
    public function update(User $user, Building $Building): bool
    {
        return $Building->owner_id === $user->id;
    }

    /**
     * User có quyền xóa lịch không
     */
    public function delete(User $user, Building $Building): bool
    {
        return $user->role === 'admin' || $Building->owner_id === $user->id;
    }
}
