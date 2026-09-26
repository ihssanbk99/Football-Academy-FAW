<?php

namespace Database\Seeders;

use App\Models\Offer;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        $offers = [
            [
                'title' => 'New Player Offer',
                'subtitle' => 'Welcome to FAW Academy',
                'description' => 'Special discount for newly registered academy players.',
                'discount_percentage' => 15,
                'code' => 'FAW15',
                'start_date' => Carbon::today()->subDays(10),
                'end_date' => Carbon::today()->addDays(30),
                'is_active' => true,
            ],
            [
                'title' => 'Sibling Discount',
                'subtitle' => 'Train Together',
                'description' => 'Special discount for families with more than one registered player.',
                'discount_percentage' => 20,
                'code' => 'SIBLING20',
                'start_date' => Carbon::today()->subDays(5),
                'end_date' => Carbon::today()->addDays(45),
                'is_active' => true,
            ],
            [
                'title' => 'Early Registration',
                'subtitle' => 'Register Early',
                'description' => 'Discount for early registration during the academy season.',
                'discount_percentage' => 10,
                'code' => 'EARLY10',
                'start_date' => Carbon::today()->subDays(20),
                'end_date' => Carbon::today()->addDays(15),
                'is_active' => true,
            ],
            [
                'title' => 'Summer Football Camp',
                'subtitle' => 'Special Camp Offer',
                'description' => 'Limited discount for academy summer camp registration.',
                'discount_percentage' => 25,
                'code' => 'CAMP25',
                'start_date' => Carbon::today()->subDays(30),
                'end_date' => Carbon::today()->subDays(5),
                'is_active' => false,
            ],
            [
                'title' => 'Academy Membership',
                'subtitle' => 'Season Special',
                'description' => 'Special membership discount for selected academy programs.',
                'discount_percentage' => 12.5,
                'code' => 'FAW12',
                'start_date' => Carbon::today(),
                'end_date' => Carbon::today()->addDays(60),
                'is_active' => true,
            ],
            [
                'title' => 'Training Package',
                'subtitle' => 'Extra Training',
                'description' => 'Discount on selected additional training packages.',
                'discount_percentage' => 18,
                'code' => 'TRAIN18',
                'start_date' => Carbon::today()->subDays(5),
                'end_date' => Carbon::today()->addDays(20),
                'is_active' => true,
            ],
            [
                'title' => 'Goalkeeper Program',
                'subtitle' => 'Specialized Training',
                'description' => 'Special offer for goalkeeper development sessions.',
                'discount_percentage' => 15,
                'code' => 'KEEP15',
                'start_date' => Carbon::today()->addDays(5),
                'end_date' => Carbon::today()->addDays(50),
                'is_active' => true,
            ],
            [
                'title' => 'Weekend Program',
                'subtitle' => 'Weekend Sessions',
                'description' => 'Discount for selected weekend training programs.',
                'discount_percentage' => 8,
                'code' => 'WEEKEND8',
                'start_date' => Carbon::today()->subDays(2),
                'end_date' => Carbon::today()->addDays(25),
                'is_active' => true,
            ],
            [
                'title' => 'Youth Development',
                'subtitle' => 'Develop Your Game',
                'description' => 'Special offer for youth development programs.',
                'discount_percentage' => 10,
                'code' => 'YOUTH10',
                'start_date' => Carbon::today(),
                'end_date' => Carbon::today()->addDays(35),
                'is_active' => true,
            ],
            [
                'title' => 'Trial Conversion',
                'subtitle' => 'Join FAW Academy',
                'description' => 'Special offer for players moving from trial to registration.',
                'discount_percentage' => 20,
                'code' => 'TRIAL20',
                'start_date' => Carbon::today(),
                'end_date' => Carbon::today()->addDays(14),
                'is_active' => true,
            ],
        ];

        foreach ($offers as $offer) {
            Offer::updateOrCreate(
                [
                    'code' => $offer['code'],
                ],
                $offer
            );
        }
    }
}