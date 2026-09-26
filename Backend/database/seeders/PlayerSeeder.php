<?php

namespace Database\Seeders;

use App\Models\AgeGroup;
use App\Models\Branch;
use App\Models\Coach;
use App\Models\JerseyNumber;
use App\Models\Player;
use App\Models\UniformSize;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PlayerSeeder extends Seeder
{
    public function run(): void
    {
        $parents = User::where('role', 'parent')
            ->orderBy('id')
            ->get();

        $branches = Branch::where('academy_id', 1)
            ->orderBy('id')
            ->get();

        $coaches = Coach::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $ageGroups = AgeGroup::where('academy_id', 1)
            ->where('is_active', true)
            ->get()
            ->keyBy('name');

        $uniformSizes = UniformSize::orderBy('id')->get();
        $jerseyNumbers = JerseyNumber::whereNull('player_id')
            ->orderBy('number')
            ->take(50)
            ->get();

        $positions = [
            'goalkeeper',
            'defender',
            'midfielder',
            'forward',
        ];

        $levels = [
            'beginner',
            'intermediate',
            'advanced',
        ];

        $ageGroupNames = [
            'U6',
            'U8',
            'U10',
            'U12',
            'U14',
            'U16',
            'U18',
        ];

        for ($i = 1; $i <= 50; $i++) {
            $groupName = $ageGroupNames[($i - 1) % count($ageGroupNames)];
            $ageGroup = $ageGroups->get($groupName);

            if (!$ageGroup) {
                continue;
            }

            $age = $ageGroup->min_age;

            $birthYear = now()->year - $age;

            $birthDate = Carbon::create(
                $birthYear,
                (($i - 1) % 12) + 1,
                (($i - 1) % 25) + 1
            );

            $parent = $parents[($i - 1) % $parents->count()];
            $branch = $branches[($i - 1) % $branches->count()];
            $coach = $coaches[($i - 1) % $coaches->count()];

            $player = Player::updateOrCreate(
                [
                    'academy_id' => 1,
                    'first_name' => 'Player',
                    'last_name' => str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                ],
                [
                    'parent_id' => $parent->id,
                    'academy_id' => 1,
                    'branch_id' => $branch->id,
                    'age_group_id' => $ageGroup->id,
                    'coach_id' => $coach->id,
                    'first_name' => 'Player',
                    'last_name' => str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                    'date_of_birth' => $birthDate,
                    'photo' => null,
                    'position' => $positions[($i - 1) % count($positions)],
                    'level' => $levels[($i - 1) % count($levels)],
                    'phone' => '079' . str_pad((string) (1000000 + $i), 7, '0', STR_PAD_LEFT),
                    'address' => 'Irbid',
                    'city' => 'Irbid',
                    'registration_status' => $i % 5 === 0 ? 'pending' : 'active',
                    'needs_transportation' => $i % 3 === 0,
                ]
            );

            if ($uniformSizes->count() > 0 && !$player->uniform_size_id) {
                $uniformSize = $uniformSizes[($i - 1) % $uniformSizes->count()];

                $player->update([
                    'uniform_size_id' => $uniformSize->id,
                ]);
            }

            if ($jerseyNumbers->count() > 0 && !$player->jersey_number_id) {
                $jerseyNumber = $jerseyNumbers[($i - 1) % $jerseyNumbers->count()];

                $player->update([
                    'jersey_number_id' => $jerseyNumber->id,
                ]);
            }
        }
    }
}