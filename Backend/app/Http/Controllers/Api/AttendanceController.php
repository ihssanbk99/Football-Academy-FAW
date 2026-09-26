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

    public function coachIndex(Request $request)
    {
        $coach = $request->user()->coach;

        if (!$coach) {
            return response()->json([
                'message' => 'Coach profile not found.',
            ], 404);
        }

        $attendances = Attendance::with([
            'player:id,first_name,last_name,age_group_id',
            'trainingSession:id,title,session_date,start_time,end_time,age_group_id,coach_id',
        ])
            ->whereHas('trainingSession', function ($query) use ($coach) {
                $query->where('coach_id', $coach->id)
                    ->where('academy_id', 1);
            })
            ->latest()
            ->get();

        return response()->json([
            'attendances' => $attendances,
        ]);
    }

    public function coachOptions(Request $request)
    {
        $coach = $request->user()->coach;

        if (!$coach) {
            return response()->json([
                'message' => 'Coach profile not found.',
            ], 404);
        }

        $players = Player::where('academy_id', 1)
            ->where('coach_id', $coach->id)
            ->where('registration_status', 'active')
            ->with('ageGroup:id,name')
            ->select([
                'id',
                'first_name',
                'last_name',
                'age_group_id',
            ])
            ->orderBy('first_name')
            ->get();

        $sessions = TrainingSession::where('academy_id', 1)
            ->where('coach_id', $coach->id)
            ->where('is_active', true)
            ->with('ageGroup:id,name')
            ->orderByDesc('session_date')
            ->orderBy('start_time')
            ->get([
                'id',
                'title',
                'session_date',
                'start_time',
                'end_time',
                'age_group_id',
                'coach_id',
            ]);

        return response()->json([
            'players' => $players,
            'training_sessions' => $sessions,
        ]);
    }

    public function coachStore(Request $request)
    {
        $coach = $request->user()->coach;

        if (!$coach) {
            return response()->json([
                'message' => 'Coach profile not found.',
            ], 404);
        }

        $validated = $request->validate([
            'training_session_id' => ['required', 'exists:training_sessions,id'],
            'player_id' => ['required', 'exists:players,id'],
            'status' => ['required', 'in:present,absent,late'],
            'notes' => ['nullable', 'string'],
        ]);

        $session = TrainingSession::where('id', $validated['training_session_id'])
            ->where('academy_id', 1)
            ->where('coach_id', $coach->id)
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'You are not authorized to manage attendance for this training session.',
            ], 403);
        }

        $player = Player::where('id', $validated['player_id'])
            ->where('academy_id', 1)
            ->where('coach_id', $coach->id)
            ->first();

        if (!$player) {
            return response()->json([
                'message' => 'You are not authorized to manage attendance for this player.',
            ], 403);
        }

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
            'message' => 'Attendance saved successfully.',
            'attendance' => $attendance->load([
                'player',
                'trainingSession.ageGroup',
            ]),
        ], 201);
    }

    public function coachUpdate(Request $request, Attendance $attendance)
    {
        $coach = $request->user()->coach;

        if (!$coach) {
            return response()->json([
                'message' => 'Coach profile not found.',
            ], 404);
        }

        $authorized = $attendance->trainingSession()
            ->where('academy_id', 1)
            ->where('coach_id', $coach->id)
            ->exists();

        if (!$authorized || $attendance->player->coach_id !== $coach->id) {
            return response()->json([
                'message' => 'You are not authorized to update this attendance record.',
            ], 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:present,absent,late'],
            'notes' => ['nullable', 'string'],
        ]);

        $attendance->update($validated);

        return response()->json([
            'message' => 'Attendance updated successfully.',
            'attendance' => $attendance->fresh()->load([
                'player',
                'trainingSession.ageGroup',
            ]),
        ]);
    }
}