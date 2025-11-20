<?php

namespace App\Services;

use App\Repositories\Interfaces\ApartmentRepositoryInterface;

class ApartmentService
{
    protected $apartmentRepository;

    public function __construct(ApartmentRepositoryInterface $apartmentRepository)
    {
        $this->apartmentRepository = $apartmentRepository;
    }

    public function listApartments()
    {
        return $this->apartmentRepository->all();
    }

    public function createApartment($data)
    {
        // Xử lý logic nếu có, rồi gọi repository
        return $this->apartmentRepository->create($data);
    }

    // Các hàm khác như update, delete...
}
