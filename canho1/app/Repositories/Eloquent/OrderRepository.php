<?php

namespace App\Repositories\Eloquent;

use App\Models\RentalOrder;
use App\Repositories\Interfaces\OrderRepositoryInterface;

class OrderRepository implements OrderRepositoryInterface
{
    public function all()
    {
        return RentalOrder::with([
            'user:id,name',         // chỉ lấy id và name của user
            'apartment:id,address',
        ])
            ->latest()
            ->get();
    }

    public function find($id)
    {
        // return RentalOrder::with([])->findOrFail($id);
        return RentalOrder::with(['Contract', 'User'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return RentalOrder::create($data);
    }

    public function update($id, array $data)
    {
        $schedule = RentalOrder::findOrFail($id);
        $schedule->update($data);
        return $schedule;
    }

    public function delete($id)
    {
        // return ViewingSchedule::destroy($id);
    }
    public function getOwnerID($ownerId)
    {
        return RentalOrder::with([
            'user:id,name',         // chỉ lấy id và name của user
            'apartment:id,address',
        ])
            ->where('owner_id', $ownerId)
            ->latest()
            ->get();
    }

}