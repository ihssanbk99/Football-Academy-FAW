<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JerseyNumber;
use App\Models\UniformSize;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UniformController extends Controller
{
    public function sizes()
    {
        return response()->json([
            'uniform_sizes' => UniformSize::where('academy_id', 1)
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function availableNumbers(Request $request)
    {
        $validated = $request->validate([
            'age_group_id' => ['required', 'exists:age_groups,id'],
        ]);

        $usedNumberIds = Player::where('academy_id', 1)
            ->where('age_group_id', $validated['age_group_id'])
            ->whereNotNull('jersey_number_id')
            ->pluck('jersey_number_id');

        return response()->json([
            'jersey_numbers' => JerseyNumber::where('academy_id', 1)
                ->where('age_group_id', $validated['age_group_id'])
                ->where('is_active', true)
                ->whereNotIn('id', $usedNumberIds)
                ->orderBy('number')
                ->get(),
        ]);
    }

    public function assign(Request $request, Player $player)
    {
        abort_unless($player->parent_id === $request->user()->id, 403);

        $validated = $request->validate([
            'uniform_size_id' => [
                'nullable',
                'exists:uniform_sizes,id',
            ],
            'jersey_number_id' => [
                'nullable',
                'exists:jersey_numbers,id',
            ],
        ]);

        if (!empty($validated['uniform_size_id'])) {
            $sizeExists = UniformSize::where('id', $validated['uniform_size_id'])
                ->where('academy_id', $player->academy_id)
                ->where('is_active', true)
                ->exists();

            if (!$sizeExists) {
                return response()->json([
                    'message' => 'Invalid uniform size.',
                ], 422);
            }
        }

        if (!empty($validated['jersey_number_id'])) {
            $number = JerseyNumber::where('id', $validated['jersey_number_id'])
                ->where('academy_id', $player->academy_id)
                ->where('age_group_id', $player->age_group_id)
                ->where('is_active', true)
                ->first();

            if (!$number) {
                return response()->json([
                    'message' => 'Invalid jersey number.',
                ], 422);
            }

            $alreadyUsed = Player::where('academy_id', $player->academy_id)
                ->where('age_group_id', $player->age_group_id)
                ->where('jersey_number_id', $number->id)
                ->where('id', '!=', $player->id)
                ->exists();

            if ($alreadyUsed) {
                return response()->json([
                    'message' => 'This jersey number is already assigned.',
                ], 422);
            }
        }

        $player->update([
            'uniform_size_id' => $validated['uniform_size_id'] ?? null,
            'jersey_number_id' => $validated['jersey_number_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Uniform details updated successfully.',
            'player' => $player->fresh()->load([
                'uniformSize',
                'jerseyNumber',
            ]),
        ]);
    }

    public function adminSizes()
    {
        return response()->json([
            'uniform_sizes' => UniformSize::withCount('players')
                ->where('academy_id', 1)
                ->latest()
                ->get(),
        ]);
    }

    public function adminStoreSize(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('uniform_sizes', 'name')
                    ->where('academy_id', 1),
            ],
        ]);

        $size = UniformSize::create([
            'academy_id' => 1,
            'name' => $validated['name'],
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Uniform size created successfully.',
            'uniform_size' => $size,
        ], 201);
    }

    public function adminUpdateSize(Request $request, UniformSize $uniformSize)
    {
        abort_unless($uniformSize->academy_id === 1, 404);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('uniform_sizes', 'name')
                    ->where('academy_id', 1)
                    ->ignore($uniformSize->id),
            ],
            'is_active' => ['required', 'boolean'],
        ]);

        $uniformSize->update($validated);

        return response()->json([
            'message' => 'Uniform size updated successfully.',
            'uniform_size' => $uniformSize->fresh(),
        ]);
    }

    public function adminDeleteSize(UniformSize $uniformSize)
    {
        abort_unless($uniformSize->academy_id === 1, 404);

        if ($uniformSize->players()->exists()) {
            return response()->json([
                'message' => 'This size is assigned to players and cannot be deleted.',
            ], 422);
        }

        $uniformSize->delete();

        return response()->json([
            'message' => 'Uniform size deleted successfully.',
        ]);
    }

    public function adminNumbers()
    {
        return response()->json([
            'jersey_numbers' => JerseyNumber::with('ageGroup:id,name')
                ->where('academy_id', 1)
                ->withCount('player')
                ->orderBy('number')
                ->get(),
        ]);
    }

    public function adminStoreNumber(Request $request)
    {
        $validated = $request->validate([
            'age_group_id' => ['nullable', 'exists:age_groups,id'],
            'number' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $exists = JerseyNumber::where('academy_id', 1)
            ->where('age_group_id', $validated['age_group_id'] ?? null)
            ->where('number', $validated['number'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This jersey number already exists.',
            ], 422);
        }

        $jerseyNumber = JerseyNumber::create([
            'academy_id' => 1,
            'age_group_id' => $validated['age_group_id'] ?? null,
            'number' => $validated['number'],
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Jersey number created successfully.',
            'jersey_number' => $jerseyNumber->load('ageGroup:id,name'),
        ], 201);
    }

    public function adminUpdateNumber(Request $request, JerseyNumber $jerseyNumber)
    {
        abort_unless($jerseyNumber->academy_id === 1, 404);

        $validated = $request->validate([
            'age_group_id' => ['nullable', 'exists:age_groups,id'],
            'number' => ['required', 'integer', 'min:1', 'max:99'],
            'is_active' => ['required', 'boolean'],
        ]);

        $exists = JerseyNumber::where('academy_id', 1)
            ->where('age_group_id', $validated['age_group_id'] ?? null)
            ->where('number', $validated['number'])
            ->where('id', '!=', $jerseyNumber->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This jersey number already exists.',
            ], 422);
        }

        $jerseyNumber->update([
            'age_group_id' => $validated['age_group_id'] ?? null,
            'number' => $validated['number'],
            'is_active' => $validated['is_active'],
        ]);

        return response()->json([
            'message' => 'Jersey number updated successfully.',
            'jersey_number' => $jerseyNumber->fresh()->load('ageGroup:id,name'),
        ]);
    }

    public function adminDeleteNumber(JerseyNumber $jerseyNumber)
    {
        abort_unless($jerseyNumber->academy_id === 1, 404);

        if ($jerseyNumber->player()->exists()) {
            return response()->json([
                'message' => 'This jersey number is assigned to a player and cannot be deleted.',
            ], 422);
        }

        $jerseyNumber->delete();

        return response()->json([
            'message' => 'Jersey number deleted successfully.',
        ]);
    }
}