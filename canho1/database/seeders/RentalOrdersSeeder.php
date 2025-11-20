<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class RentalOrdersSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('vi_VN');

        // Lấy danh sách user và apartment sẵn có để gán FK
        $tenantIds = DB::table('users')->pluck('id')->toArray();
        $apartments = DB::table('apartments')
            ->join('buildings', 'apartments.building_id', '=', 'buildings.id')
            ->select('apartments.id as apartment_id', 'buildings.owner_id')
            ->get();

        for ($i = 0; $i < 20; $i++) {
            $startDate = $faker->dateTimeBetween('-1 month', '+1 month');
            $endDate = (clone $startDate)->modify('+' . rand(1, 12) . ' month');

            $randomApartment = $faker->randomElement($apartments->toArray());

            DB::table('rental_orders')->insert([
                'user_id' => $faker->randomElement($tenantIds),
                'apartment_id' => $randomApartment->apartment_id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $faker->randomElement(['pending', 'approved', 'rejected', 'completed']),
                'owner_id' => $randomApartment->owner_id, // lấy từ building
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
