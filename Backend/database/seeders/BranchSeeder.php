<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Main Branch',
                'address' => 'University Street',
                'city' => 'Irbid',
                'phone' => '0790000000',
                'opening_time' => '09:00',
                'closing_time' => '22:00',
                'is_active' => true,
            ],
            [
                'name' => 'North Branch',
                'address' => 'Al-Hassan Industrial Estate',
                'city' => 'Irbid',
                'phone' => '0790000001',
                'opening_time' => '10:00',
                'closing_time' => '22:00',
                'is_active' => true,
            ],
            [
                'name' => 'University Branch',
                'address' => 'Yarmouk University Area',
                'city' => 'Irbid',
                'phone' => '0790000002',
                'opening_time' => '09:00',
                'closing_time' => '21:00',
                'is_active' => true,
            ],
        ];

        foreach ($branches as $branchData) {
            Branch::updateOrCreate(
                [
                    'academy_id' => 1,
                    'name' => $branchData['name'],
                ],
                $branchData + [
                    'academy_id' => 1,
                ]
            );
        }
    }
}