<?php

namespace App\Repositories\Interfaces;

interface ApartmentRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function search(array $filters , $perPage); 
    public function viewApartment($id);
    public function fetchUserApartments($user_id);
}
