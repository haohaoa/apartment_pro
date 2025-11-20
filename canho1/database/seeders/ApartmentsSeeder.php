<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Building;

class ApartmentsSeeder extends Seeder
{
    public function run()
    {
        $descriptions = [
            "Căn hộ 60m², 1 phòng ngủ, phong cách hiện đại. Nội thất cơ bản, bếp ga, điều hòa, thang máy, gần siêu thị.",
            "Căn hộ 95m², 3 phòng ngủ, đầy đủ tiện nghi cao cấp. Nội thất nhập khẩu, bếp điện từ, hồ bơi, phòng gym.",
            "Căn hộ 55m², 1 phòng ngủ, phong cách tối giản. Nội thất đơn giản, bếp ga, gần chợ, khu giặt phơi chung.",
            "Căn hộ 80m², 2 phòng ngủ, tiện nghi đầy đủ. Nội thất hiện đại, hồ bơi, phòng gym, an ninh 24/7.",
            "Căn hộ 70m², 2 phòng ngủ, thiết kế mở. Nội thất cơ bản, bếp ga, sân chơi trẻ em, gần trường học.",
            "Căn hộ 100m², 3 phòng ngủ, sang trọng. Nội thất cao cấp, điều hòa trung tâm, bãi đỗ xe ô tô.",
            "Căn hộ 65m², 2 phòng ngủ, phong cách hiện đại. Bếp ga, thang máy, khu vui chơi trẻ em.",
            "Căn hộ 90m², 3 phòng ngủ, tiện ích đầy đủ. Nội thất cao cấp, ban công rộng, hồ bơi, phòng gym.",
            "Căn hộ 75m², 2 phòng ngủ, thiết kế hiện đại. Nội thất cơ bản, gần công viên và siêu thị.",
            "Căn hộ 85m², 3 phòng ngủ, tiện nghi cao cấp. Bếp điện từ, điều hòa trung tâm, an ninh 24/7.",
        ];

        // Lấy tất cả tòa nhà
        $buildings = Building::all();

        foreach ($buildings as $building) {
            for ($i = 1; $i <= 5; $i++) {
                // Random giá và cọc, làm tròn xuống bội số 500,000
                $price   = floor(rand(5_000_000, 20_000_000) / 500_000) * 500_000;
                $deposit = floor(rand(1_000_000, 5_000_000) / 500_000) * 500_000;

                DB::table('apartments')->insert([
                    'building_id' => $building->id,
                    'title'       => 'Căn hộ ' . $i . ' - Tòa ' . $building->name,
                    'description' => $descriptions[array_rand($descriptions)],
                    'price'       => $price,
                    'deposit'     => $deposit,
                    'status'      => 'available',
                    'address'     => 'Căn '.$i.' - Tòa '. $building->name .' - '. $building->address,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        }
    }
}
