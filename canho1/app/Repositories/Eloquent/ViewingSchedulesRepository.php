<?php

namespace App\Repositories\Eloquent;

use App\Models\Apartment;
use App\Models\ViewingSchedule;
use App\Repositories\Interfaces\ViewingSchedulesRepositoryInterface;

class ViewingSchedulesRepository implements ViewingSchedulesRepositoryInterface
{
    public function all($id)
    {
        // return ViewingSchedule::with(['apartment', 'user'])->get();
        return ViewingSchedule::where('user_id', $id)
            ->where('status', '!=', 'cancelled')
            ->with(
                'Apartment.images',
                'Apartment.building.owner'
            )
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function find($id)
    {
        return ViewingSchedule::with(['Apartment.building.owner' ,'apartment.images', 'user'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return ViewingSchedule::create($data);
    }

    public function update($id, array $data)
    {
        $schedule = ViewingSchedule::findOrFail($id);
        $schedule->update($data);
        return $schedule;
    }

    public function delete($id)
    {
        return ViewingSchedule::destroy($id);
    }
    public function allOwner($id)
    {
        return ViewingSchedule::with(['apartment.images'])
            ->whereHas('apartment', function ($query) use ($id) {
                $query->whereHas('building', function ($q) use ($id) {
                    $q->where('owner_id', $id);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();    
    }
    public function allAdmin()
    {
        return ViewingSchedule::with(['apartment.images'])
            ->orderBy('created_at', 'desc')
            ->get();    
    }
}