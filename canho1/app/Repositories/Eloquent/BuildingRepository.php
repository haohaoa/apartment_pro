<?php

namespace App\Repositories\Eloquent;

use App\Models\Apartment;
use App\Models\Building;
use App\Models\RentalOrder;
use App\Repositories\Interfaces\BuildingRepositoryInterface;
use Illuminate\Support\Facades\DB;

class BuildingRepository implements BuildingRepositoryInterface
{
    public function all()
    {
         $buildings = Building::withCount([
                'apartments as totalUnits',
                'apartments as occupiedUnits' => function ($query) {
                    $query->whereHas('rentalOrders', function ($q) {
                        $q->where('status', 'completed');
                    });
                },
                'apartments as vacantUnits' => function ($query) {
                    $query->whereDoesntHave('rentalOrders', function ($q) {
                        $q->where('status', 'completed');
                    });
                },
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Tính tổng tiền trực tiếp bằng SQL
        foreach ($buildings as $building) {
            $totalRents = DB::table('payments')
                ->join('rental_orders', 'payments.rental_order_id', '=', 'rental_orders.id')
                ->join('apartments', 'rental_orders.apartment_id', '=', 'apartments.id')
                ->where('apartments.building_id', $building->id)
                ->where('payments.status', 'paid') // nếu cần chỉ tính các payment đã thanh toán
                ->sum('payments.amount');

            $building->totalRents = $totalRents;
        }

        return $buildings;
    }

    public function find($id)
    {
        $building = Building::with('apartments.rentalOrders.user')
            ->findOrFail($id);

        // Duyệt qua từng căn hộ để xác định trạng thái thuê
        foreach ($building->apartments as $apartment) {
            $tenantName = null;

            $isRented = $apartment->rentalOrders->contains(function ($order) use (&$tenantName) {
                // Kiểm tra hợp đồng còn hiệu lực hoặc đang thuê
                $isActive = $order->status === 'completed' && $order->end_date >= now();

                if ($isActive) {
                    $tenantName = $order->user->name ?? null; // Lấy tên người thuê
                }

                return $isActive;
            });

            // Thêm trường phụ vào kết quả trả về
            $apartment->is_rented = $isRented;
            $apartment->status_text = $isRented ? 'Đang được thuê' : 'Còn trống';
            $apartment->tenant_name = $tenantName; // Tên người thuê (hoặc null nếu trống)
        }

        return $building;
    }

    public function create(array $data)
    {
        return Building::create($data);
    }

    public function update($id, array $data)
    {
        $building = $this->find($id);
        $building->update($data);
        return $building;
    }

    public function delete($id)
    {
        $building = $this->find($id);
        return $building->delete();
    }

    

    public function getAllBuilding($ownerId)
    {
        $buildings = Building::where('owner_id', $ownerId)
            ->withCount([
                'apartments as totalUnits',
                'apartments as occupiedUnits' => function ($query) {
                    $query->whereHas('rentalOrders', function ($q) {
                        $q->where('status', 'completed');
                    });
                },
                'apartments as vacantUnits' => function ($query) {
                    $query->whereDoesntHave('rentalOrders', function ($q) {
                        $q->where('status', 'completed');
                    });
                },
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Tính tổng tiền trực tiếp bằng SQL
        foreach ($buildings as $building) {
            $totalRents = DB::table('payments')
                ->join('rental_orders', 'payments.rental_order_id', '=', 'rental_orders.id')
                ->join('apartments', 'rental_orders.apartment_id', '=', 'apartments.id')
                ->where('apartments.building_id', $building->id)
                ->where('payments.status', 'paid') // nếu cần chỉ tính các payment đã thanh toán
                ->sum('payments.amount');

            $building->totalRents = $totalRents;
        }

        return $buildings;
    }




    /**
     * Tìm tòa nhà gần tọa độ và lọc căn hộ bên trong
     */
    public function searchNearby(array $filters, $TaDo, $perPage = 10000)
    {
        $lat = $TaDo['lat'] ?? null;
        $lng = $TaDo['lon'] ?? null;
        $radius = $filters['radius'] ?? 5;

        $query = Building::with(['apartments', 'apartments.images']);

        // 🔎 Lọc theo tọa độ nếu có
        if (!is_null($lat) && !is_null($lng)) {
            $query->selectRaw('*, (6371 * acos(
                cos(radians(?)) * cos(radians(lat)) *
                cos(radians(lng) - radians(?)) +
                sin(radians(?)) * sin(radians(lat))
            )) AS distance', [$lat, $lng, $lat])
                ->having('distance', '<=', $radius)
                ->orderBy('distance', 'asc');
        }

        // 🔎 Lọc căn hộ bên trong tòa nhà
        if (
            !empty($filters['price_min']) || !empty($filters['price_max']) ||
            !empty($filters['bedrooms']) || !empty($filters['amenities'])
        ) {
            $query->whereHas('apartments', function ($q) use ($filters) {
                // Lọc theo giá
                if (!empty($filters['price_min'])) {
                    $q->where('price', '>=', (float) $filters['price_min'] * 1_000_000);
                }
                if (!empty($filters['price_max'])) {
                    $q->where('price', '<=', (float) $filters['price_max'] * 1_000_000);
                }

                // Lọc số phòng
                if (!empty($filters['bedrooms'])) {
                    $q->where('bedrooms', (int) $filters['bedrooms']);
                }

                // Lọc tiện ích
                if (!empty($filters['amenities']) && is_array($filters['amenities'])) {
                    foreach ($filters['amenities'] as $item) {
                        $q->where('description', 'LIKE', '%' . $item . '%');
                    }
                }

                // Lọc trạng thái căn hộ
                $q->where('status', 'available');
            });
        }

        return $query->paginate($perPage);
    }
    public function searchName(array $filters, $perPage = 10000)
    {
        $name = $filters['apartment_name'] ?? null;

        // 🧱 Lấy danh sách căn hộ đã được đặt (trừ khi Check_out)
        $bookedIds = RentalOrder::where('status', '!=', 'Check_out')
            ->pluck('apartment_id')
            ->toArray();

        // 🔍 Tạo query
        $query = Apartment::with(['images'])
            ->where('status', 'available')
            ->whereNotIn('id', $bookedIds);

        // 🔎 Lọc theo tên tòa nhà (nếu có)
        if (!empty($name)) {
            $query->whereHas('building', function ($q) use ($name) {
                $q->where('name', 'LIKE', "%{$name}%");
            });
        }

        // ✅ Trả về kết quả có phân trang
        return $query->paginate($perPage);
    }

}
