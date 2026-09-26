<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\Player;
use App\Models\TrainingSession;
use Illuminate\Database\Seeder;

class AssessmentSeeder extends Seeder
{
    public function run(): void
    {
        $players = Player::where('academy_id', 1)
            ->where('registration_status', 'active')
            ->whereNotNull('coach_id')
            ->orderBy('id')
            ->get();

        $sessions = TrainingSession::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $count = 0;

        foreach ($players as $player) {
            $playerSessions = $sessions
                ->where('age_group_id', $player->age_group_id)
                ->where('coach_id', $player->coach_id)
                ->values();

            if ($playerSessions->isEmpty()) {
                continue;
            }

            foreach ($playerSessions->take(2) as $session) {
                if ($count >= 75) {
                    break 2;
                }

                $base = 5 + (($player->id + $session->id) % 6);

                Assessment::updateOrCreate(
                    [
                        'player_id' => $player->id,
                        'training_session_id' => $session->id,
                        'assessment_date' => $session->session_date,
                    ],
                    [
                        'coach_id' => $player->coach_id,
                        'technical_score' => min(10, $base),
                        'tactical_score' => min(10, $base + 1),
                        'physical_score' => min(10, max(1, $base - 1)),
                        'discipline_score' => min(10, $base),
                        'overall_score' => min(10, $base),
                        'strengths' => 'Good effort, teamwork, and commitment during training.',
                        'areas_to_improve' => 'Continue improving decision making and technical consistency.',
                        'notes' => 'Regular development assessment.',
                    ]
                );

                $count++;
            }
        }
    }
}