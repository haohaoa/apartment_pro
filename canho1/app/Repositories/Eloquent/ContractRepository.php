<?php

namespace App\Repositories\Eloquent;

use App\Models\RentalContract;
use App\Repositories\Interfaces\ContractRepositoryInterface;

class ContractRepository implements ContractRepositoryInterface
{
    public function all()
    {
        return RentalContract::all();
    }

    public function find($id)
    {
        return RentalContract::findOrFail($id);
    }

    public function create(array $data)
    {
        return RentalContract::create($data);
    }


    public function update($id, array $data)
    {
        $contract = RentalContract::findOrFail($id);
        $contract->update($data);
        return $contract;
    }

    public function delete($id)
    {
        return RentalContract::destroy($id);
    }

    public function getByIdOrder($id)
    {
        return RentalContract::where('rental_order_id', $id)
            ->with([
                'order.payment' => function ($query) {
                    $query->orderBy('period_start', 'desc');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->first();
    }

}
