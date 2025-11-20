<?php

namespace App\Repositories\Interfaces;

interface NotificationRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    // public function search(array $filters, $perPage = 10); 
    public function getByIdOrder($id);
    public function fetchByUserId($user_id);
    public function markAllAsReadByUserId($userId);
}
