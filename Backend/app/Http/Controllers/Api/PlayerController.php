<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        $players = Player::where('parent_id', $request->user()->id)
            ->with(['academy', 'branch', 'ageGroup', 'coach'])
            ->latest()
            ->get();

        return response()->json([
            'players' => $players,
        ]);
    }

    public function adminIndex()
    {
        $players = Player::with([
            'parent:id,name,email',
            'academy:id,name',
            'branch:id,name',
            'ageGroup:id,name',
            'coach:id,full_name',
        ])
            ->latest()
            ->get();

        return response()->json([
            'players' => $players,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academy_id' => ['required', 'exists:academies,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'age_group_id' => ['nullable', 'exists:age_groups,id'],
            'coach_id' => ['nullable', 'exists:coaches,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'photo' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'in:goalkeeper,defender,midfielder,forward'],
            'level' => ['nullable', 'in:beginner,intermediate,advanced'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
        ]);

        $player = Player::create([
            ...$validated,
            'parent_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Player created successfully',
            'player' => $player,
        ], 201);
    }

    public function show(Request $request, Player $player)
    {
        $this->authorizeParent($request, $player);

        return response()->json([
            'player' => $player->load(['academy', 'branch', 'ageGroup', 'coach']),
        ]);
    }

    public function update(Request $request, Player $player)
    {
        $this->authorizeParent($request, $player);

        $validated = $request->validate([
            'academy_id' => ['sometimes', 'exists:academies,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'age_group_id' => ['nullable', 'exists:age_groups,id'],
            'coach_id' => ['nullable', 'exists:coaches,id'],
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'date_of_birth' => ['sometimes', 'date', 'before:today'],
            'photo' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'in:goalkeeper,defender,midfielder,forward'],
            'level' => ['nullable', 'in:beginner,intermediate,advanced'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $player->update($validated);

        return response()->json([
            'message' => 'Player updated successfully',
            'player' => $player->fresh(),
        ]);
    }

    public function destroy(Request $request, Player $player)
    {
        $this->authorizeParent($request, $player);

        $player->delete();

        return response()->json([
            'message' => 'Player deleted successfully',
        ]);
    }

    private function authorizeParent(Request $request, Player $player): void
    {
        abort_unless(
            $player->parent_id === $request->user()->id,
            403,
            'You are not authorized to access this player.'
        );
    }
}