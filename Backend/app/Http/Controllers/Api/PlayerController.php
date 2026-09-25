<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\JerseyNumber;
use App\Models\UniformSize;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        $players = Player::where('parent_id', $request->user()->id)
            ->with([
                'academy',
                'branch',
                'ageGroup',
                'coach',
                'uniformSize',
                'jerseyNumber',
                'transportationRoute',
            ])
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
            'uniformSize:id,name',
            'jerseyNumber:id,number,age_group_id',
            'transportationRoute:id,name',
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
            'uniform_size_id' => ['nullable', 'exists:uniform_sizes,id'],
            'jersey_number_id' => ['nullable', 'exists:jersey_numbers,id'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'needs_transportation' => ['required', 'boolean'],
            'transportation_route_id' => ['nullable', 'exists:bus_routes,id'],
        ]);

        if (!empty($validated['uniform_size_id'])) {
            $validSize = UniformSize::where('id', $validated['uniform_size_id'])
                ->where('academy_id', $validated['academy_id'])
                ->where('is_active', true)
                ->exists();

            if (!$validSize) {
                return response()->json([
                    'message' => 'Invalid uniform size.',
                ], 422);
            }
        }

        if (!empty($validated['jersey_number_id'])) {
            $number = JerseyNumber::where('id', $validated['jersey_number_id'])
                ->where('academy_id', $validated['academy_id'])
                ->where('age_group_id', $validated['age_group_id'])
                ->where('is_active', true)
                ->first();

            if (!$number) {
                return response()->json([
                    'message' => 'Invalid jersey number.',
                ], 422);
            }

            $alreadyUsed = Player::where('academy_id', $validated['academy_id'])
                ->where('age_group_id', $validated['age_group_id'])
                ->where('jersey_number_id', $number->id)
                ->exists();

            if ($alreadyUsed) {
                return response()->json([
                    'message' => 'This jersey number is already assigned.',
                ], 422);
            }
        }

        if ($validated['needs_transportation'] && empty($validated['transportation_route_id'])) {
            return response()->json([
                'message' => 'Please select a transportation route.',
            ], 422);
        }

        if (!$validated['needs_transportation']) {
            $validated['transportation_route_id'] = null;
        }

        $player = Player::create([
            ...$validated,
            'parent_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Player created successfully',
            'player' => $player->load([
                'academy',
                'branch',
                'ageGroup',
                'coach',
                'uniformSize',
                'jerseyNumber',
                'transportationRoute',
            ]),
        ], 201);
    }

    public function show(Request $request, Player $player)
    {
        $this->authorizeParent($request, $player);

        return response()->json([
            'player' => $player->load([
                'academy',
                'branch',
                'ageGroup',
                'coach',
                'uniformSize',
                'jerseyNumber',
                'transportationRoute',
            ]),
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
            'uniform_size_id' => ['nullable', 'exists:uniform_sizes,id'],
            'jersey_number_id' => ['nullable', 'exists:jersey_numbers,id'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'needs_transportation' => ['sometimes', 'boolean'],
            'transportation_route_id' => ['nullable', 'exists:bus_routes,id'],
        ]);

        if (
            array_key_exists('needs_transportation', $validated) &&
            !$validated['needs_transportation']
        ) {
            $validated['transportation_route_id'] = null;
        }

        $player->update($validated);

        return response()->json([
            'message' => 'Player updated successfully',
            'player' => $player->fresh()->load([
                'academy',
                'branch',
                'ageGroup',
                'coach',
                'uniformSize',
                'jerseyNumber',
                'transportationRoute',
            ]),
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