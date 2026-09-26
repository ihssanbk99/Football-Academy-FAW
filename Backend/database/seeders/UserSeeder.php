<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'FAW Admin',
                'email' => 'admin@faw.com',
                'role' => 'admin',
            ],
            [
                'name' => 'Test Parent',
                'email' => 'parent@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Second Parent',
                'email' => 'parent2@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'ihssanbk',
                'email' => 'ihssanbk99@gmail.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Five',
                'email' => 'parent5@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Six',
                'email' => 'parent6@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Seven',
                'email' => 'parent7@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Eight',
                'email' => 'parent8@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Nine',
                'email' => 'parent9@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Ten',
                'email' => 'parent10@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Eleven',
                'email' => 'parent11@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Twelve',
                'email' => 'parent12@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Thirteen',
                'email' => 'parent13@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Fourteen',
                'email' => 'parent14@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'Parent Fifteen',
                'email' => 'parent15@test.com',
                'role' => 'parent',
            ],
            [
                'name' => 'hassan bk',
                'email' => 'coach@admin.com',
                'role' => 'coach',
            ],
            [
                'name' => 'Ahmad Coach',
                'email' => 'ahmad.coach@faw.com',
                'role' => 'coach',
            ],
            [
                'name' => 'Mohammad Coach',
                'email' => 'mohammad.coach@faw.com',
                'role' => 'coach',
            ],
            [
                'name' => 'Khaled Coach',
                'email' => 'khaled.coach@faw.com',
                'role' => 'coach',
            ],
            [
                'name' => 'Omar Coach',
                'email' => 'omar.coach@faw.com',
                'role' => 'coach',
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('Password123!'),
                    'role' => $userData['role'],
                ]
            );
        }
    }
}