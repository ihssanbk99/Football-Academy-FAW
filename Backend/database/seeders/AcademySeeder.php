<?php

namespace Database\Seeders;

use App\Models\Academy;
use Illuminate\Database\Seeder;

class AcademySeeder extends Seeder
{
    public function run(): void
    {
        Academy::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'FAW Football Academy',
                'logo' => null,
                'email' => 'info@fawacademy.com',
                'phone' => '0790000000',
                'address' => 'University Street',
                'city' => 'Irbid',
                'country' => 'Jordan',
                'description' => 'Professional football academy focused on player development and youth training.',
                'is_active' => true,
            ]
        );
    }
}