<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Player;
use App\Models\TrainingSession;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AttendanceController extends Controller
{
    public function adminIndex()
    {
        $attendances = Attendance::with([
            'player',
            'trainingSession.ageGroup',
            'trainingSession.coach',
        ])
            ->whereHas('trainingSession', function ($query) {
                $query->where('academy_id', 1);
            })
            ->latest()
            ->get();

        return response()->json([
            'attendances' => $attendances,
        ]);
    }

    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'training_session_id' => ['required', 'exists:training_sessions,id'],
            'player_id' => ['required', 'exists:players,id'],
            'status' => ['required', 'in:present,absent,late'],
            'notes' => ['nullable', 'string'],
        ]);

        $session = TrainingSession::where('id', $validated['training_session_id'])
            ->where('academy_id', 1)
            ->firstOrFail();

        $player = Player::where('id', $validated['player_id'])
            ->where('academy_id', 1)
            ->firstOrFail();

        if ($session->age_group_id !== $player->age_group_id) {
            throw ValidationException::withMessages([
                'player_id' => ['The selected player does not belong to this training session age group.'],
            ]);
        }

        $attendance = Attendance::updateOrCreate(
            [
                'training_session_id' => $session->id,
                'player_id' => $player->id,
            ],
            [
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Attendance saved successfully',
            'attendance' => $attendance->load([
                'player',
                'trainingSession.ageGroup',
                'trainingSession.coach',
            ]),
        ], 201);
    }

    public function adminUpdate(Request $request, Attendance $attendance)
    {
        abort_unless(
            $attendance->trainingSession()->where('academy_id', 1)->exists(),
            404
        );

        $validated = $request->validate([
            'status' => ['required', 'in:present,absent,late'],
            'notes' => ['nullable', 'string'],
        ]);

        $attendance->update($validated);

        return response()->json([
            'message' => 'Attendance updated successfully',
            'attendance' => $attendance->fresh()->load([
                'player',
                'trainingSession.ageGroup',
                'trainingSession.coach',
            ]),
        ]);
    }

    public function adminDestroy(Attendance $attendance)
    {
        abort_unless(
            $attendance->trainingSession()->where('academy_id', 1)->exists(),
            404
        );

        $attendance->delete();

        return response()->json([
            'message' => 'Attendance deleted successfully',
        ]);
    }

    public function parentIndex(Request $request)
    {
        $attendances = Attendance::with([
            'player',
            'trainingSession.ageGroup',
            'trainingSession.coach',
        ])
            ->whereHas('player', function ($query) use ($request) {
                $query->where('parent_id', $request->user()->id);
            })
            ->latest()
            ->get();

        return response()->json([
            'attendances' => $attendances,
        ]);
    }
}