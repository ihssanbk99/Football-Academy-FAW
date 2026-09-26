<?php

namespace Database\Seeders;

use App\Models\AgeGroup;
use App\Models\Branch;
use App\Models\Coach;
use App\Models\TrainingSession;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TrainingSessionSeeder extends Seeder
{
    public function run(): void
    {
        $ageGroups = AgeGroup::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $coaches = Coach::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $branches = Branch::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $trainingTypes = [
            'regular',
            'fitness',
            'technical',
            'tactical',
            'match',
        ];

        $fields = [
            'Main Field',
            'North Field',
            'Training Field 1',
            'Training Field 2',
            'Mini Field',
        ];

        for ($i = 1; $i <= 25; $i++) {
            $ageGroup = $ageGroups[($i - 1) % $ageGroups->count()];
            $coach = $coaches[($i - 1) % $coaches->count()];
            $branch = $branches[($i - 1) % $branches->count()];

            $date = Carbon::today()->addDays($i);

            $startHour = 16 + (($i - 1) % 5);

            $startTime = sprintf('%02d:00', $startHour);
            $endTime = sprintf('%02d:30', $startHour + 1);

            TrainingSession::updateOrCreate(
                [
                    'academy_id' => 1,
                    'title' => $ageGroup->name . ' Training Session ' . $i,
                    'session_date' => $date->toDateString(),
                ],
                [
                    'academy_id' => 1,
                    'branch_id' => $branch->id,
                    'age_group_id' => $ageGroup->id,
                    'coach_id' => $coach->id,
                    'title' => $ageGroup->name . ' Training Session ' . $i,
                    'session_date' => $date->toDateString(),
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'field_name' => $fields[($i - 1) % count($fields)],
                    'training_type' => $trainingTypes[($i - 1) % count($trainingTypes)],
                    'notes' => 'Academy training session for ' . $ageGroup->name . '.',
                    'is_active' => true,
                ]
            );
        }
    }
}