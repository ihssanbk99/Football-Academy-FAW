<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class TrainingSessionController extends Controller
{
    public function index(Request $request)
    {
        $sessions = TrainingSession::with([
            'academy:id,name',
            'branch:id,name',
            'ageGroup:id,name',
            'coach:id,full_name',
        ])
            ->whereHas('ageGroup')
            ->orderBy('session_date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'training_sessions' => $sessions,
        ]);
    }

    public function adminIndex()
    {
        $sessions = TrainingSession::with([
            'academy:id,name',
            'branch:id,name',
            'ageGroup:id,name',
            'coach:id,full_name',
        ])
            ->orderBy('session_date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'training_sessions' => $sessions,
        ]);
    }

    public function show(Request $request, TrainingSession $trainingSession)
    {
        return response()->json([
            'training_session' => $trainingSession->load([
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name',
                'coach:id,full_name',
            ]),
        ]);
    }
}