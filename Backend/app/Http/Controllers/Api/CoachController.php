<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coach;
use App\Models\TrainingSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class CoachController extends Controller
{
    public function adminIndex()
    {
        $coaches = Coach::with([
            'academy:id,name',
            'user:id,name,email,role',
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
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:100'],
            'photo' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $coach = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['full_name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => 'coach',
            ]);

            return Coach::create([
                'user_id' => $user->id,
                'academy_id' => $validated['academy_id'],
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'] ?? null,
                'specialization' => $validated['specialization'] ?? null,
                'experience_years' => $validated['experience_years'] ?? 0,
                'photo' => $validated['photo'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);
        });

        return response()->json([
            'message' => 'Coach account created successfully',
            'coach' => $coach->load([
                'academy:id,name',
                'user:id,name,email,role',
            ]),
        ], 201);
    }

    public function adminUpdate(Request $request, Coach $coach)
    {
        $validated = $request->validate([
            'academy_id' => ['sometimes', 'exists:academies,id'],
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($coach->user_id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:100'],
            'photo' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        DB::transaction(function () use ($validated, $coach) {
            $coachData = collect($validated)
                ->except(['email', 'password'])
                ->toArray();

            if (array_key_exists('full_name', $validated)) {
                $coachData['full_name'] = $validated['full_name'];
            }

            $coach->update($coachData);

            if ($coach->user) {
                $userData = [];

                if (array_key_exists('full_name', $validated)) {
                    $userData['name'] = $validated['full_name'];
                }

                if (array_key_exists('email', $validated)) {
                    $userData['email'] = $validated['email'];
                }

                if (!empty($validated['password'])) {
                    $userData['password'] = $validated['password'];
                }

                if (!empty($userData)) {
                    $coach->user->update($userData);
                }
            }
        });

        return response()->json([
            'message' => 'Coach updated successfully',
            'coach' => $coach->fresh()->load([
                'academy:id,name',
                'user:id,name,email,role',
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

        DB::transaction(function () use ($coach) {
            $user = $coach->user;

            $coach->delete();

            if ($user) {
                $user->delete();
            }
        });

        return response()->json([
            'message' => 'Coach and coach account deleted successfully',
        ]);
    }
}