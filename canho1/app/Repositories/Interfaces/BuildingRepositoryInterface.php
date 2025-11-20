<?php

namespace App\Repositories\Interfaces;

interface BuildingRepositoryInterface
{
    public function all(); // Lấy tất cả building
    public function find($id); // Tìm theo ID
    public function create(array $data); // Tạo mới
    public function update($id, array $data); // Cập nhật
    public function delete($id); // Xóa
    public function getallbuilding($id);
    // Hàm tìm building gần tọa độ
    public function searchNearby(array $filters, $TaDo,$perPage = 10);
    public function searchName(array $name, $perPage);
}
