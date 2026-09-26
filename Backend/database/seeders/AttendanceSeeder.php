<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Player;
use App\Models\TrainingSession;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $sessions = TrainingSession::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        foreach ($sessions as $session) {
            $players = Player::where('academy_id', 1)
                ->where('age_group_id', $session->age_group_id)
                ->where('registration_status', 'active')
                ->orderBy('id')
                ->get();

            foreach ($players as $index => $player) {
                $statusNumber = ($index + $session->id) % 10;

                if ($statusNumber <= 6) {
                    $status = 'present';
                } elseif ($statusNumber <= 8) {
                    $status = 'late';
                } else {
                    $status = 'absent';
                }

                Attendance::updateOrCreate(
                    [
                        'training_session_id' => $session->id,
                        'player_id' => $player->id,
                    ],
                    [
                        'status' => $status,
                        'notes' => match ($status) {
                            'present' => null,
                            'late' => 'Arrived late to the training session.',
                            'absent' => 'Player was absent from this session.',
                        },
                    ]
                );
            }
        }
    }
}