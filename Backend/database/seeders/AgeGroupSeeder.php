<?php

namespace Database\Seeders;

use App\Models\AgeGroup;
use Illuminate\Database\Seeder;

class AgeGroupSeeder extends Seeder
{
    public function run(): void
    {
        $ageGroups = [
            [
                'academy_id' => 1,
                'name' => 'U6',
                'min_age' => 5,
                'max_age' => 6,
                'description' => 'Foundation football training for young players aged 5 to 6.',
                'is_active' => true,
            ],
            [
                'academy_id' => 1,
                'name' => 'U8',
                'min_age' => 7,
                'max_age' => 8,
                'description' => 'Development training for players aged 7 to 8.',
                'is_active' => true,
            ],
            [
                'academy_id' => 1,
                'name' => 'U10',
                'min_age' => 9,
                'max_age' => 10,
                'description' => 'Technical and tactical development for players aged 9 to 10.',
                'is_active' => true,
            ],
            [
                'academy_id' => 1,
                'name' => 'U12',
                'min_age' => 11,
                'max_age' => 12,
                'description' => 'Advanced youth development for players aged 11 to 12.',
                'is_active' => true,
            ],
            [
                'academy_id' => 1,
                'name' => 'U14',
                'min_age' => 13,
                'max_age' => 14,
                'description' => 'Competitive youth football training for players aged 13 to 14.',
                'is_active' => true,
            ],
            [
                'academy_id' => 1,
                'name' => 'U16',
                'min_age' => 15,
                'max_age' => 16,
                'description' => 'High-level development for players aged 15 to 16.',
                'is_active' => true,
            ],
            [
                'academy_id' => 1,
                'name' => 'U18',
                'min_age' => 17,
                'max_age' => 18,
                'description' => 'Elite youth preparation for players aged 17 to 18.',
                'is_active' => true,
            ],
        ];

        foreach ($ageGroups as $ageGroup) {
            AgeGroup::updateOrCreate(
                [
                    'academy_id' => $ageGroup['academy_id'],
                    'name' => $ageGroup['name'],
                ],
                $ageGroup
            );
        }
    }
}