<?php

namespace App\Repositories\Eloquent;

use App\Models\Notifications;
use App\Repositories\Interfaces\NotificationRepositoryInterface;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function all()
    {
        return Notifications::all();
    }

    public function find($id)
    {
        return Notifications::findOrFail($id);
    }

    public function create(array $data)
    {
        return Notifications::create($data);
    }

    public function update($id, array $data)
    {
        $contract = Notifications::findOrFail($id);
        $contract->update($data);
        return $contract;
    }

    public function delete($id)
    {
        return Notifications::destroy($id);
    }

    public function getByIdOrder($id)
    {
        return Notifications::where('rental_order_id', $id)
            ->with('order')
            ->first();
    }

    public function fetchByUserId($user_id)
    {
        return Notifications::where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();
    }
    public function markAllAsReadByUserId($userId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('status', 'unread')
            ->update(['status' => 'read']);
    }


}
