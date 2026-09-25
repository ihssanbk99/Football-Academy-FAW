<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Offer;
use App\Models\Payment;
use App\Models\Player;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class ParentDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $players = Player::with([
            'academy:id,name',
            'branch:id,name',
            'ageGroup:id,name',
            'coach:id,full_name',
        ])
            ->where('parent_id', $user->id)
            ->latest()
            ->get();

        $playerIds = $players->pluck('id');

        $trainingSessions = TrainingSession::with([
            'academy:id,name',
            'branch:id,name',
            'ageGroup:id,name',
            'coach:id,full_name',
        ])
            ->whereIn('age_group_id', $players->pluck('age_group_id')->filter())
            ->where('is_active', true)
            ->whereDate('session_date', '>=', now()->toDateString())
            ->orderBy('session_date')
            ->orderBy('start_time')
            ->take(6)
            ->get();

        $payments = Payment::whereIn('player_id', $playerIds)
            ->latest()
            ->take(6)
            ->get();

        $notifications = Notification::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $offers = Offer::where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('start_date')
                    ->orWhereDate('start_date', '<=', now()->toDateString());
            })
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', now()->toDateString());
            })
            ->latest()
            ->take(4)
            ->get();

        return response()->json([
            'user' => $user,
            'players' => $players,
            'training_sessions' => $trainingSessions,
            'payments' => $payments,
            'notifications' => $notifications,
            'offers' => $offers,
            'stats' => [
                'players' => $players->count(),
                'active_players' => $players->where('registration_status', 'active')->count(),
                'pending_players' => $players->where('registration_status', 'pending')->count(),
                'unread_notifications' => $notifications->where('is_read', false)->count(),
                'pending_payments' => $payments->where('status', 'pending')->count(),
            ],
        ]);
    }
}