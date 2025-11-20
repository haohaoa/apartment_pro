<?php
namespace Database\Seeders;

use Database\Seeders\ApartmentImagesSeeder;
use Database\Seeders\ApartmentsSeeder;
use Database\Seeders\RentalOrdersSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            UsersSeeder::class,
            BuildingSeeder::class,
            ApartmentsSeeder::class,
            ApartmentImagesSeeder::class,
            RentalOrdersSeeder::class,

        ]);
    }
}
