<?php

namespace Database\Seeders;

use App\Models\Coach;
use App\Models\User;
use Illuminate\Database\Seeder;

class CoachSeeder extends Seeder
{
    public function run(): void
    {
        $coaches = [
            [
                'name' => 'Ahmad Coach',
                'email' => 'ahmad.coach@faw.com',
                'phone' => '0791000001',
                'specialization' => 'Youth Development',
                'experience_years' => 5,
                'bio' => 'Youth football coach focused on technical development.',
            ],
            [
                'name' => 'Mohammad Coach',
                'email' => 'mohammad.coach@faw.com',
                'phone' => '0791000002',
                'specialization' => 'Technical Training',
                'experience_years' => 7,
                'bio' => 'Coach specialized in technical football development.',
            ],
            [
                'name' => 'hassan bk',
                'email' => 'coach@admin.com',
                'phone' => '0791000003',
                'specialization' => 'Handball',
                'experience_years' => 8,
                'bio' => 'Experienced academy coach.',
            ],
            [
                'name' => 'Khaled Coach',
                'email' => 'khaled.coach@faw.com',
                'phone' => '0791000004',
                'specialization' => 'Tactical Training',
                'experience_years' => 6,
                'bio' => 'Coach focused on tactical development and match preparation.',
            ],
            [
                'name' => 'Omar Coach',
                'email' => 'omar.coach@faw.com',
                'phone' => '0791000005',
                'specialization' => 'Fitness Training',
                'experience_years' => 4,
                'bio' => 'Coach focused on physical preparation and fitness.',
            ],
        ];

        foreach ($coaches as $coachData) {
            $user = User::where('email', $coachData['email'])->first();

            $coach = Coach::updateOrCreate(
                [
                    'academy_id' => 1,
                    'full_name' => $coachData['name'],
                ],
                [
                    'user_id' => $user?->id,
                    'academy_id' => 1,
                    'full_name' => $coachData['name'],
                    'phone' => $coachData['phone'],
                    'specialization' => $coachData['specialization'],
                    'experience_years' => $coachData['experience_years'],
                    'photo' => null,
                    'bio' => $coachData['bio'],
                    'is_active' => true,
                ]
            );

            if ($user && $coach->user_id !== $user->id) {
                $coach->update([
                    'user_id' => $user->id,
                ]);
            }
        }
    }
}