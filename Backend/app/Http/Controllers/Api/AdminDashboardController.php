<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgeGroup;
use App\Models\Coach;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Player;
use App\Models\TrainingSession;
use App\Models\User;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $players = Player::with([
            'parent:id,name',
            'ageGroup:id,name',
        ])
            ->latest()
            ->take(5)
            ->get();

        $upcomingSessions = TrainingSession::with([
            'ageGroup:id,name',
            'coach:id,full_name',
        ])
            ->where('session_date', '>=', now()->toDateString())
            ->orderBy('session_date')
            ->orderBy('start_time')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'players' => Player::count(),
                'active_players' => Player::where('registration_status', 'active')->count(),
                'parents' => User::where('role', 'parent')->count(),
                'coaches' => Coach::count(),
                'age_groups' => AgeGroup::where('is_active', true)->count(),
                'training_sessions' => TrainingSession::where('is_active', true)->count(),
                'pending_payments' => Payment::where('status', 'pending')->count(),
                'paid_amount' => Payment::where('status', 'paid')->sum('amount'),
                'unread_notifications' => Notification::where('is_read', false)->count(),
            ],
            'recent_players' => $players,
            'upcoming_sessions' => $upcomingSessions,
        ]);
    }
}