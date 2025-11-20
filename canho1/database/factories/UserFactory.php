<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{

    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'), // mặc định
            'phone' => $this->faker->phoneNumber(),
            'role' => $this->faker->randomElement(['tenant', 'owner', 'admin']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
