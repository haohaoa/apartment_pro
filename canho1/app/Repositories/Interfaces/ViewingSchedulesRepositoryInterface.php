<?php

namespace App\Repositories\Interfaces;

interface ViewingSchedulesRepositoryInterface
{
    public function all($id);
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function allOwner($id);
    public function allAdmin();
    // public function search(array $filters, $perPage = 10); 
}
