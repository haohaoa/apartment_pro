<?php

namespace App\Repositories\Interfaces;

interface OrderRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getOwnerId($id);
    // public function search(array $filters, $perPage = 10); 
}
