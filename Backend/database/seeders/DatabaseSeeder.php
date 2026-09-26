<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AcademySeeder::class,
            UserSeeder::class,
            BranchSeeder::class,
            AgeGroupSeeder::class,
            CoachSeeder::class,
            PlayerSeeder::class,
            TrainingSessionSeeder::class,
            TransportationSeeder::class,
            AttendanceSeeder::class,
            AssessmentSeeder::class,
            TrialBookingSeeder::class,
            PaymentSeeder::class,
            NotificationSeeder::class,
            OfferSeeder::class,
        ]);
    }
}