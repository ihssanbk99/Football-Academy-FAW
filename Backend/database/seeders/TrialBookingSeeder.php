<?php

namespace Database\Seeders;

use App\Models\AgeGroup;
use App\Models\Branch;
use App\Models\TrainingSession;
use App\Models\TrialBooking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TrialBookingSeeder extends Seeder
{
    public function run(): void
    {
        $parents = User::where('role', 'parent')
            ->orderBy('id')
            ->get();

        $branches = Branch::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $ageGroups = AgeGroup::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $sessions = TrainingSession::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $positions = [
            'goalkeeper',
            'defender',
            'midfielder',
            'forward',
        ];

        $statuses = [
            'pending',
            'approved',
            'completed',
            'rejected',
        ];

        for ($i = 1; $i <= 20; $i++) {
            $parent = $parents[($i - 1) % $parents->count()];
            $branch = $branches[($i - 1) % $branches->count()];
            $ageGroup = $ageGroups[($i - 1) % $ageGroups->count()];
            $session = $sessions[($i - 1) % $sessions->count()];

            $age = $ageGroup->min_age;

            $birthDate = Carbon::today()
                ->subYears($age)
                ->subMonths(($i - 1) % 6)
                ->subDays(($i - 1) % 20);

            TrialBooking::updateOrCreate(
                [
                    'parent_id' => $parent->id,
                    'first_name' => 'Trial',
                    'last_name' => str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                ],
                [
                    'parent_id' => $parent->id,
                    'academy_id' => 1,
                    'branch_id' => $branch->id,
                    'age_group_id' => $ageGroup->id,
                    'training_session_id' => $session->id,
                    'first_name' => 'Trial',
                    'last_name' => str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                    'date_of_birth' => $birthDate,
                    'phone' => '079' . str_pad((string) (3000000 + $i), 7, '0', STR_PAD_LEFT),
                    'position' => $positions[($i - 1) % count($positions)],
                    'notes' => 'Trial booking for ' . $ageGroup->name . '.',
                    'status' => $statuses[($i - 1) % count($statuses)],
                    'admin_notes' => $i % 3 === 0
                        ? 'Reviewed by academy administration.'
                        : null,
                    'reviewed_at' => $i % 3 === 0
                        ? Carbon::now()->subDays($i % 10)
                        : null,
                ]
            );
        }
    }
}