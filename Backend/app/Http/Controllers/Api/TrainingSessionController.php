<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class TrainingSessionController extends Controller
{
    public function index(Request $request)
    {
        $playerQuery = $request->user()
            ->players()
            ->select('id', 'age_group_id', 'branch_id', 'academy_id');

        $players = $playerQuery->get();

        if ($players->isEmpty()) {
            return response()->json([
                'training_sessions' => [],
            ]);
        }

        $ageGroupIds = $players
            ->pluck('age_group_id')
            ->filter()
            ->unique()
            ->values();

        $branchIds = $players
            ->pluck('branch_id')
            ->filter()
            ->unique()
            ->values();

        $academyIds = $players
            ->pluck('academy_id')
            ->filter()
            ->unique()
            ->values();

        $sessions = TrainingSession::query()
            ->whereIn('academy_id', $academyIds)
            ->whereIn('age_group_id', $ageGroupIds)
            ->where('is_active', true)
            ->where(function ($query) use ($branchIds) {
                $query->whereNull('branch_id');

                if ($branchIds->isNotEmpty()) {
                    $query->orWhereIn('branch_id', $branchIds);
                }
            })
            ->with([
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name,min_age,max_age',
                'coach:id,full_name,specialization',
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
        $hasAccess = $request->user()
            ->players()
            ->where('academy_id', $trainingSession->academy_id)
            ->where('age_group_id', $trainingSession->age_group_id)
            ->where(function ($query) use ($trainingSession) {
                $query->whereNull('branch_id');

                if ($trainingSession->branch_id) {
                    $query->orWhere('branch_id', $trainingSession->branch_id);
                }
            })
            ->exists();

        abort_unless(
            $hasAccess,
            403,
            'You are not authorized to access this training session.'
        );

        return response()->json([
            'training_session' => $trainingSession->load([
                'academy',
                'branch',
                'ageGroup',
                'coach',
            ]),
        ]);
    }
}