<?php

namespace Database\Seeders;

use App\Models\AgeGroup;
use Illuminate\Database\Seeder;

class AgeGroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            [
                'name' => 'U6',
                'min_age' => 5,
                'max_age' => 6,
                'description' => 'Foundation football training.',
            ],
            [
                'name' => 'U8',
                'min_age' => 7,
                'max_age' => 8,
                'description' => 'Early technical football development.',
            ],
            [
                'name' => 'U10',
                'min_age' => 8,
                'max_age' => 10,
                'description' => 'Technical football development.',
            ],
            [
                'name' => 'U12',
                'min_age' => 11,
                'max_age' => 12,
                'description' => 'Technical and tactical development.',
            ],
            [
                'name' => 'U14',
                'min_age' => 13,
                'max_age' => 14,
                'description' => 'Competitive youth training.',
            ],
            [
                'name' => 'U16',
                'min_age' => 15,
                'max_age' => 16,
                'description' => 'Advanced youth development.',
            ],
            [
                'name' => 'U18',
                'min_age' => 17,
                'max_age' => 18,
                'description' => 'Elite youth development.',
            ],
        ];

        foreach ($groups as $groupData) {
            AgeGroup::updateOrCreate(
                [
                    'academy_id' => 1,
                    'name' => $groupData['name'],
                ],
                $groupData + [
                    'academy_id' => 1,
                    'is_active' => true,
                ]
            );
        }
    }
}