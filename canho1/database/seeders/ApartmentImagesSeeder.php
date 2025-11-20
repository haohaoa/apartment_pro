<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApartmentImagesSeeder extends Seeder
{
    public function run()
    {
        $apartments = DB::table('apartments')->pluck('id'); // Lấy tất cả ID căn hộ
        $totalImages = 244; // Tổng số ảnh có sẵn

        foreach ($apartments as $apartmentId) {
            $usedImages = [];

            for ($i = 0; $i < 3; $i++) { // Mỗi căn hộ 4 ảnh
                do {
                    $imageNumber = rand(1, $totalImages);
                } while (in_array($imageNumber, $usedImages));

                $usedImages[] = $imageNumber;

                DB::table('apartment_images')->insert([
                    'apartment_id' => $apartmentId,
                    'image_url'    => "/img/canho ({$imageNumber}).jpg",
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }
        }
    }
}
