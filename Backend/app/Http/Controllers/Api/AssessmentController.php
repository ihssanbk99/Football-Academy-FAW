<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function parentIndex(Request $request)
    {
        $assessments = Assessment::with([
            'player:id,first_name,last_name',
            'coach:id,full_name',
            'trainingSession:id,title',
        ])
            ->whereHas('player', function ($query) use ($request) {
                $query->where('parent_id', $request->user()->id);
            })
            ->latest('assessment_date')
            ->get();

        return response()->json([
            'assessments' => $assessments,
        ]);
    }

    public function adminIndex()
    {
        $assessments = Assessment::with([
            'player:id,first_name,last_name,parent_id',
            'coach:id,full_name',
            'trainingSession:id,title',
        ])
            ->latest('assessment_date')
            ->get();

        return response()->json([
            'assessments' => $assessments,
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

        $assessments = Assessment::with([
            'player:id,first_name,last_name',
            'trainingSession:id,title',
        ])
            ->where('coach_id', $coach->id)
            ->latest('assessment_date')
            ->get();

        return response()->json([
            'assessments' => $assessments,
        ]);
    }

    public function coachPlayers(Request $request)
    {
        $coach = $request->user()->coach;

        if (!$coach) {
            return response()->json([
                'message' => 'Coach profile not found.',
            ], 404);
        }

        $players = $coach->players()
            ->select([
                'id',
                'first_name',
                'last_name',
                'age_group_id',
            ])
            ->with('ageGroup:id,name')
            ->where('registration_status', 'active')
            ->orderBy('first_name')
            ->get();

        return response()->json([
            'players' => $players,
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
            'player_id' => ['required', 'exists:players,id'],
            'training_session_id' => ['nullable', 'exists:training_sessions,id'],
            'assessment_date' => ['required', 'date'],
            'technical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'tactical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'physical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'discipline_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'overall_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'strengths' => ['nullable', 'string'],
            'areas_to_improve' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $playerBelongsToCoach = $coach->players()
            ->where('players.id', $validated['player_id'])
            ->exists();

        if (!$playerBelongsToCoach) {
            return response()->json([
                'message' => 'You are not authorized to assess this player.',
            ], 403);
        }

        $assessment = Assessment::create([
            ...$validated,
            'coach_id' => $coach->id,
        ]);

        return response()->json([
            'message' => 'Assessment created successfully.',
            'assessment' => $assessment->load([
                'player',
                'trainingSession',
            ]),
        ], 201);
    }

    public function coachUpdate(Request $request, Assessment $assessment)
    {
        $coach = $request->user()->coach;

        if (!$coach) {
            return response()->json([
                'message' => 'Coach profile not found.',
            ], 404);
        }

        abort_unless($assessment->coach_id === $coach->id, 403);

        $validated = $request->validate([
            'player_id' => ['sometimes', 'exists:players,id'],
            'training_session_id' => ['nullable', 'exists:training_sessions,id'],
            'assessment_date' => ['sometimes', 'date'],
            'technical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'tactical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'physical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'discipline_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'overall_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'strengths' => ['nullable', 'string'],
            'areas_to_improve' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        if (array_key_exists('player_id', $validated)) {
            $playerBelongsToCoach = $coach->players()
                ->where('players.id', $validated['player_id'])
                ->exists();

            if (!$playerBelongsToCoach) {
                return response()->json([
                    'message' => 'You are not authorized to assess this player.',
                ], 403);
            }
        }

        $assessment->update($validated);

        return response()->json([
            'message' => 'Assessment updated successfully.',
            'assessment' => $assessment->fresh()->load([
                'player',
                'trainingSession',
            ]),
        ]);
    }

    public function coachDestroy(Request $request, Assessment $assessment)
    {
        $coach = $request->user()->coach;

        if (!$coach) {
            return response()->json([
                'message' => 'Coach profile not found.',
            ], 404);
        }

        abort_unless($assessment->coach_id === $coach->id, 403);

        $assessment->delete();

        return response()->json([
            'message' => 'Assessment deleted successfully.',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'player_id' => ['required', 'exists:players,id'],
            'coach_id' => ['nullable', 'exists:coaches,id'],
            'training_session_id' => ['nullable', 'exists:training_sessions,id'],
            'assessment_date' => ['required', 'date'],
            'technical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'tactical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'physical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'discipline_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'overall_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'strengths' => ['nullable', 'string'],
            'areas_to_improve' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $assessment = Assessment::create($validated);

        return response()->json([
            'message' => 'Assessment created successfully.',
            'assessment' => $assessment->load([
                'player',
                'coach',
                'trainingSession',
            ]),
        ], 201);
    }

    public function update(Request $request, Assessment $assessment)
    {
        $validated = $request->validate([
            'player_id' => ['sometimes', 'exists:players,id'],
            'coach_id' => ['nullable', 'exists:coaches,id'],
            'training_session_id' => ['nullable', 'exists:training_sessions,id'],
            'assessment_date' => ['sometimes', 'date'],
            'technical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'tactical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'physical_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'discipline_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'overall_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'strengths' => ['nullable', 'string'],
            'areas_to_improve' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $assessment->update($validated);

        return response()->json([
            'message' => 'Assessment updated successfully.',
            'assessment' => $assessment->fresh()->load([
                'player',
                'coach',
                'trainingSession',
            ]),
        ]);
    }

    public function destroy(Assessment $assessment)
    {
        $assessment->delete();

        return response()->json([
            'message' => 'Assessment deleted successfully.',
        ]);
    }
}