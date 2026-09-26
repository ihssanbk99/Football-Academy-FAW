<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Player;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $players = Player::where('academy_id', 1)
            ->where('registration_status', 'active')
            ->orderBy('id')
            ->get();

        $statuses = [
            'paid',
            'pending',
            'failed',
            'refunded',
        ];

        $methods = [
            'cash',
            'card',
            'bank_transfer',
        ];

        $amounts = [
            35,
            45,
            50,
            60,
            75,
        ];

        for ($i = 1; $i <= 60; $i++) {
            $player = $players[($i - 1) % $players->count()];
            $status = $statuses[($i - 1) % count($statuses)];

            $dueDate = Carbon::today()
                ->subDays(($i % 6) * 5);

            $paidAt = $status === 'paid'
                ? $dueDate->copy()->addDays($i % 3)
                : null;

            Payment::updateOrCreate(
                [
                    'player_id' => $player->id,
                    'reference' => 'FAW-PAY-' . str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                ],
                [
                    'parent_id' => $player->parent_id,
                    'player_id' => $player->id,
                    'amount' => $amounts[($i - 1) % count($amounts)],
                    'currency' => 'JOD',
                    'status' => $status,
                    'payment_method' => $status === 'paid'
                        ? $methods[($i - 1) % count($methods)]
                        : null,
                    'reference' => 'FAW-PAY-' . str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                    'due_date' => $dueDate,
                    'paid_at' => $paidAt,
                    'notes' => match ($status) {
                        'paid' => 'Payment completed successfully.',
                        'pending' => 'Payment awaiting completion.',
                        'failed' => 'Payment attempt failed.',
                        'refunded' => 'Payment was refunded.',
                    },
                ]
            );
        }
    }
}