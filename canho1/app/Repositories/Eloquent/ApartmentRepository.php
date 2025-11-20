<?php
namespace App\Repositories\Eloquent;

use App\Models\Apartment;
use App\Models\RentalOrder;
use App\Models\Building;
use App\Repositories\Interfaces\ApartmentRepositoryInterface;

class ApartmentRepository implements ApartmentRepositoryInterface
{
    public function all()
    {
        return Apartment::all();
    }

    public function find($id)
    {
        return Apartment::with('images', 'building')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Apartment::create($data);
    }

    public function update($id, array $data)
    {
        $apartment = Apartment::findOrFail($id);
        $apartment->update($data);
        return $apartment;
    }

    public function delete($id)
    {
        return Apartment::destroy($id);
    }

    public function search(array $filters, $perPage = 1000)
    {
        // 🧱 Lấy danh sách căn hộ đã được đặt (trừ khi Check_out)
        $bookedIds = RentalOrder::where('status', '!=', 'Check_out')
            ->pluck('apartment_id')
            ->toArray();

        // 🔍 Khởi tạo query
        $query = Apartment::with(['images', 'building'])
            ->where('status', 'available')
            ->whereNotIn('id', $bookedIds);

        // 📍 Lọc theo địa chỉ (dựa trên address của tòa nhà)
        if (!empty($filters['location'])) {
            $query->whereHas('building', function ($q) use ($filters) {
                $q->where('address', 'LIKE', "%{$filters['location']}%");
            });
        }

        // 💰 Lọc theo khoảng giá
        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', (float) $filters['price_min'] * 1_000_000);
        }
        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', (float) $filters['price_max'] * 1_000_000);
        }

        // 🛏️ Lọc theo số phòng ngủ (tìm trong mô tả)
        if (!empty($filters['bedrooms'])) {
            $query->where('description', 'LIKE', '%' . $filters['bedrooms'] . ' phòng ngủ' . '%');
        }

        // 🧩 Lọc theo tiện ích
        if (!empty($filters['amenities']) && is_array($filters['amenities'])) {
            foreach ($filters['amenities'] as $item) {
                $query->where('description', 'LIKE', '%' . $item . '%');
            }
        }

        // ✅ Trả về kết quả có phân trang
        return $query->paginate($perPage);
    }

    public function viewApartment($id)
    {
        $apartment = Apartment::with('images', 'rentalOrders.user', 'maintenanceRequests')->findOrFail($id);
        foreach ($apartment->rentalOrders as $rentalOrder) {
            $dem = $rentalOrder->status === 'completed';
            $apartment->status_text = $dem ? 'đang thuê' : 'còn trống';
        }
        return $apartment;

    }
    public function fetchUserApartments($user_id)
    {
        return RentalOrder::select('id', 'user_id', 'apartment_id', 'status')
            ->with([
                'apartment' => function ($q) {
                    $q->select('id', 'title', 'address','price');
                },
                'apartment.images' => function ($q) {
                    $q->select('id', 'apartment_id', 'image_url' );
                },
                'payment' => function ($q) {
                    $q->select('*');
                },
                'Contract' => function ($q) {
                    $q->select('id','rental_order_id', 'pdf_path','contract_number', 'start_date', 'end_date');
                },
            ])
            ->where('status', '!=', 'pending')
            ->where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();

    }




}
