<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coach;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class CoachController extends Controller
{
    public function adminIndex()
    {
        $coaches = Coach::with([
            'academy:id,name',
            'user:id,name,email',
        ])
            ->latest()
            ->get();

        return response()->json([
            'coaches' => $coaches,
        ]);
    }

    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'academy_id' => ['required', 'exists:academies,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:100'],
            'photo' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $coach = Coach::create([
            ...$validated,
            'experience_years' => $validated['experience_years'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Coach created successfully',
            'coach' => $coach->load([
                'academy:id,name',
                'user:id,name,email',
            ]),
        ], 201);
    }

    public function adminUpdate(Request $request, Coach $coach)
    {
        $validated = $request->validate([
            'academy_id' => ['sometimes', 'exists:academies,id'],
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:100'],
            'photo' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $coach->update($validated);

        return response()->json([
            'message' => 'Coach updated successfully',
            'coach' => $coach->fresh()->load([
                'academy:id,name',
                'user:id,name,email',
            ]),
        ]);
    }

    public function adminDestroy(Coach $coach)
    {
        $hasTrainingSessions = TrainingSession::where(
            'coach_id',
            $coach->id
        )->exists();

        if ($hasTrainingSessions) {
            return response()->json([
                'message' => 'This coach cannot be deleted because training sessions are assigned to this coach.',
            ], 422);
        }

        $coach->delete();

        return response()->json([
            'message' => 'Coach deleted successfully',
        ]);
    }
}