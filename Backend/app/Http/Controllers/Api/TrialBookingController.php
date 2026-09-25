<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgeGroup;
use App\Models\Player;
use App\Models\TrialBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TrialBookingController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'trial_bookings' => TrialBooking::with([
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name',
                'trainingSession:id,title,session_date,start_time,end_time',
            ])
                ->where('parent_id', $request->user()->id)
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academy_id' => ['required', 'exists:academies,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'training_session_id' => ['nullable', 'exists:training_sessions,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'phone' => ['nullable', 'string', 'max:50'],
            'position' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $age = Carbon::parse($validated['date_of_birth'])->age;

        $ageGroup = AgeGroup::where('academy_id', $validated['academy_id'])
            ->where('is_active', true)
            ->where('min_age', '<=', $age)
            ->where('max_age', '>=', $age)
            ->first();

        $trialBooking = TrialBooking::create([
            'parent_id' => $request->user()->id,
            'academy_id' => $validated['academy_id'],
            'branch_id' => $validated['branch_id'] ?? null,
            'age_group_id' => $ageGroup?->id,
            'training_session_id' => $validated['training_session_id'] ?? null,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'date_of_birth' => $validated['date_of_birth'],
            'phone' => $validated['phone'] ?? null,
            'position' => $validated['position'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Trial booking submitted successfully',
            'trial_booking' => $trialBooking->load([
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name',
                'trainingSession:id,title,session_date,start_time,end_time',
            ]),
        ], 201);
    }

    public function show(Request $request, TrialBooking $trialBooking)
    {
        abort_unless($trialBooking->parent_id === $request->user()->id, 403);

        return response()->json([
            'trial_booking' => $trialBooking->load([
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name',
                'trainingSession:id,title,session_date,start_time,end_time',
            ]),
        ]);
    }

    public function adminIndex()
    {
        return response()->json([
            'trial_bookings' => TrialBooking::with([
                'parent:id,name,email',
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name',
                'trainingSession:id,title,session_date,start_time,end_time',
            ])
                ->latest()
                ->get(),
        ]);
    }

    public function adminApprove(Request $request, TrialBooking $trialBooking)
    {
        if ($trialBooking->status !== 'pending') {
            return response()->json([
                'message' => 'This trial booking has already been reviewed.',
            ], 422);
        }

        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string'],
        ]);

        $trialBooking->update([
            'status' => 'approved',
            'admin_notes' => $validated['admin_notes'] ?? null,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Trial booking approved successfully',
            'trial_booking' => $trialBooking->fresh()->load([
                'parent:id,name,email',
                'academy:id,name',
                'branch:id,name',
                'ageGroup:id,name',
                'trainingSession:id,title,session_date,start_time,end_time',
            ]),
        ]);
    }

    public function adminReject(Request $request, TrialBooking $trialBooking)
    {
        if ($trialBooking->status !== 'pending') {
            return response()->json([
                'message' => 'This trial booking has already been reviewed.',
            ], 422);
        }

        $validated = $request->validate([
            'admin_notes' => ['required', 'string'],
        ]);

        $trialBooking->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Trial booking rejected successfully',
            'trial_booking' => $trialBooking->fresh(),
        ]);
    }

    public function adminRegisterPlayer(TrialBooking $trialBooking)
    {
        if ($trialBooking->status !== 'approved') {
            return response()->json([
                'message' => 'Only approved trial bookings can be registered.',
            ], 422);
        }

        $existingPlayer = Player::where('parent_id', $trialBooking->parent_id)
            ->where('first_name', $trialBooking->first_name)
            ->where('last_name', $trialBooking->last_name)
            ->whereDate('date_of_birth', $trialBooking->date_of_birth)
            ->first();

        if ($existingPlayer) {
            return response()->json([
                'message' => 'This player is already registered.',
                'player' => $existingPlayer,
            ], 422);
        }

        $player = Player::create([
            'parent_id' => $trialBooking->parent_id,
            'academy_id' => $trialBooking->academy_id,
            'branch_id' => $trialBooking->branch_id,
            'age_group_id' => $trialBooking->age_group_id,
            'coach_id' => null,
            'first_name' => $trialBooking->first_name,
            'last_name' => $trialBooking->last_name,
            'date_of_birth' => $trialBooking->date_of_birth,
            'position' => in_array($trialBooking->position, [
                'goalkeeper',
                'defender',
                'midfielder',
                'forward',
            ], true) ? $trialBooking->position : null,
            'level' => 'beginner',
            'phone' => $trialBooking->phone,
            'address' => null,
            'city' => null,
            'registration_status' => 'active',
        ]);

        $trialBooking->update([
            'status' => 'completed',
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Player registered successfully',
            'player' => $player,
            'trial_booking' => $trialBooking->fresh(),
        ], 201);
    }
}