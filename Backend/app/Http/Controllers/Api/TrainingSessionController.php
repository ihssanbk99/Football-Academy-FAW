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

    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'academy_id' => ['required', 'exists:academies,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'age_group_id' => ['required', 'exists:age_groups,id'],
            'coach_id' => ['required', 'exists:coaches,id'],
            'title' => ['required', 'string', 'max:255'],
            'session_date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'field_name' => ['nullable', 'string', 'max:255'],
            'training_type' => ['required', 'in:regular,fitness,technical,tactical,match'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $session = TrainingSession::create([
            ...$validated,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Training session created successfully',
            'training_session' => $session->load([
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name',
                'coach:id,full_name',
            ]),
        ], 201);
    }

    public function adminUpdate(Request $request, TrainingSession $trainingSession)
    {
        $validated = $request->validate([
            'academy_id' => ['sometimes', 'required', 'exists:academies,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'age_group_id' => ['sometimes', 'required', 'exists:age_groups,id'],
            'coach_id' => ['sometimes', 'required', 'exists:coaches,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'session_date' => ['sometimes', 'required', 'date'],
            'start_time' => ['sometimes', 'required', 'date_format:H:i'],
            'end_time' => ['sometimes', 'required', 'date_format:H:i', 'after:start_time'],
            'field_name' => ['nullable', 'string', 'max:255'],
            'training_type' => ['sometimes', 'required', 'in:regular,fitness,technical,tactical,match'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $trainingSession->update($validated);

        return response()->json([
            'message' => 'Training session updated successfully',
            'training_session' => $trainingSession->fresh()->load([
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name',
                'coach:id,full_name',
            ]),
        ]);
    }

    public function adminDestroy(TrainingSession $trainingSession)
    {
        $trainingSession->delete();

        return response()->json([
            'message' => 'Training session deleted successfully',
        ]);
    }
}