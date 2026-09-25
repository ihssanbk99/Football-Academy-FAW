<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bus;
use App\Models\BusRoute;
use App\Models\BusStop;
use App\Models\Player;
use App\Models\PlayerBusAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransportationController extends Controller
{
    public function adminBuses()
    {
        return response()->json([
            'buses' => Bus::withCount('routes')
                ->where('academy_id', 1)
                ->latest()
                ->get(),
        ]);
    }

    public function adminStoreBus(Request $request)
    {
        $validated = $request->validate([
            'bus_number' => ['required', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'driver_name' => ['nullable', 'string', 'max:255'],
            'driver_phone' => ['nullable', 'string', 'max:50'],
            'departure_time' => ['nullable', 'date_format:H:i'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $bus = Bus::create([
            ...$validated,
            'academy_id' => 1,
        ]);

        return response()->json([
            'message' => 'Bus created successfully',
            'bus' => $bus,
        ], 201);
    }

    public function adminUpdateBus(Request $request, Bus $bus)
    {
        abort_unless($bus->academy_id === 1, 404);

        $validated = $request->validate([
            'bus_number' => ['required', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'driver_name' => ['nullable', 'string', 'max:255'],
            'driver_phone' => ['nullable', 'string', 'max:50'],
            'departure_time' => ['nullable', 'date_format:H:i'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $assignedPlayers = PlayerBusAssignment::whereHas('route', function ($query) use ($bus) {
            $query->where('bus_id', $bus->id);
        })->where('is_active', true)->count();

        if ($validated['capacity'] < $assignedPlayers) {
            throw ValidationException::withMessages([
                'capacity' => ["Bus capacity cannot be less than {$assignedPlayers} assigned players."],
            ]);
        }

        $bus->update($validated);

        return response()->json([
            'message' => 'Bus updated successfully',
            'bus' => $bus->fresh(),
        ]);
    }

    public function adminDestroyBus(Bus $bus)
    {
        abort_unless($bus->academy_id === 1, 404);

        if ($bus->routes()->exists()) {
            throw ValidationException::withMessages([
                'bus' => ['Cannot delete a bus that has routes.'],
            ]);
        }

        $bus->delete();

        return response()->json([
            'message' => 'Bus deleted successfully',
        ]);
    }

    public function adminRoutes()
    {
        return response()->json([
            'routes' => BusRoute::with([
                'bus',
                'stops' => function ($query) {
                    $query->orderBy('stop_order');
                },
            ])
                ->where('academy_id', 1)
                ->latest()
                ->get(),
        ]);
    }

    public function adminStoreRoute(Request $request)
    {
        $validated = $request->validate([
            'bus_id' => ['required', 'exists:buses,id'],
            'name' => ['required', 'string', 'max:255'],
            'area' => ['nullable', 'string', 'max:255'],
            'departure_time' => ['nullable', 'date_format:H:i'],
            'return_time' => ['nullable', 'date_format:H:i'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $bus = Bus::where('id', $validated['bus_id'])
            ->where('academy_id', 1)
            ->firstOrFail();

        $route = BusRoute::create([
            ...$validated,
            'academy_id' => 1,
            'bus_id' => $bus->id,
        ]);

        return response()->json([
            'message' => 'Bus route created successfully',
            'route' => $route->load('bus'),
        ], 201);
    }

    public function adminUpdateRoute(Request $request, BusRoute $busRoute)
    {
        abort_unless($busRoute->academy_id === 1, 404);

        $validated = $request->validate([
            'bus_id' => ['required', 'exists:buses,id'],
            'name' => ['required', 'string', 'max:255'],
            'area' => ['nullable', 'string', 'max:255'],
            'departure_time' => ['nullable', 'date_format:H:i'],
            'return_time' => ['nullable', 'date_format:H:i'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $bus = Bus::where('id', $validated['bus_id'])
            ->where('academy_id', 1)
            ->firstOrFail();

        $busRoute->update([
            ...$validated,
            'bus_id' => $bus->id,
        ]);

        return response()->json([
            'message' => 'Bus route updated successfully',
            'route' => $busRoute->fresh()->load('bus'),
        ]);
    }

    public function adminDestroyRoute(BusRoute $busRoute)
    {
        abort_unless($busRoute->academy_id === 1, 404);

        if ($busRoute->assignments()->where('is_active', true)->exists()) {
            throw ValidationException::withMessages([
                'route' => ['Cannot delete a route with assigned players.'],
            ]);
        }

        $busRoute->delete();

        return response()->json([
            'message' => 'Bus route deleted successfully',
        ]);
    }

    public function adminStoreStop(Request $request, BusRoute $busRoute)
    {
        abort_unless($busRoute->academy_id === 1, 404);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'pickup_time' => ['nullable', 'date_format:H:i'],
            'stop_order' => ['required', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $stop = $busRoute->stops()->create($validated);

        return response()->json([
            'message' => 'Bus stop created successfully',
            'stop' => $stop,
        ], 201);
    }

    public function adminUpdateStop(Request $request, BusStop $busStop)
    {
        abort_unless($busStop->route()->where('academy_id', 1)->exists(), 404);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'pickup_time' => ['nullable', 'date_format:H:i'],
            'stop_order' => ['required', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $busStop->update($validated);

        return response()->json([
            'message' => 'Bus stop updated successfully',
            'stop' => $busStop->fresh(),
        ]);
    }

    public function adminDestroyStop(BusStop $busStop)
    {
        abort_unless($busStop->route()->where('academy_id', 1)->exists(), 404);

        if ($busStop->playerAssignments()->where('is_active', true)->exists()) {
            throw ValidationException::withMessages([
                'stop' => ['Cannot delete a stop with assigned players.'],
            ]);
        }

        $busStop->delete();

        return response()->json([
            'message' => 'Bus stop deleted successfully',
        ]);
    }

    public function adminAssignments()
    {
        return response()->json([
            'assignments' => PlayerBusAssignment::with([
                'player',
                'route.bus',
                'stop',
            ])
                ->whereHas('route', function ($query) {
                    $query->where('academy_id', 1);
                })
                ->latest()
                ->get(),
        ]);
    }

    public function adminAssignPlayer(Request $request)
    {
        $validated = $request->validate([
            'player_id' => ['required', 'exists:players,id'],
            'bus_route_id' => ['required', 'exists:bus_routes,id'],
            'bus_stop_id' => ['required', 'exists:bus_stops,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $player = Player::where('id', $validated['player_id'])
            ->where('academy_id', 1)
            ->firstOrFail();

        $route = BusRoute::with('bus')
            ->where('id', $validated['bus_route_id'])
            ->where('academy_id', 1)
            ->firstOrFail();

        $stop = BusStop::where('id', $validated['bus_stop_id'])
            ->where('bus_route_id', $route->id)
            ->where('is_active', true)
            ->firstOrFail();

        $existing = PlayerBusAssignment::where('player_id', $player->id)
            ->where('bus_route_id', $route->id)
            ->first();

        $activeAssignments = PlayerBusAssignment::where('bus_route_id', $route->id)
            ->where('is_active', true)
            ->when($existing, function ($query) use ($existing) {
                $query->where('id', '!=', $existing->id);
            })
            ->count();

        if ($activeAssignments >= $route->bus->capacity) {
            throw ValidationException::withMessages([
                'player_id' => ['This bus is already at full capacity.'],
            ]);
        }

        $assignment = PlayerBusAssignment::updateOrCreate(
            [
                'player_id' => $player->id,
                'bus_route_id' => $route->id,
            ],
            [
                'bus_stop_id' => $stop->id,
                'is_active' => $validated['is_active'] ?? true,
            ]
        );

        return response()->json([
            'message' => 'Player assigned to bus successfully',
            'assignment' => $assignment->load([
                'player',
                'route.bus',
                'stop',
            ]),
        ], 201);
    }

    public function adminRemoveAssignment(PlayerBusAssignment $assignment)
    {
        abort_unless(
            $assignment->route()->where('academy_id', 1)->exists(),
            404
        );

        $assignment->delete();

        return response()->json([
            'message' => 'Player removed from bus successfully',
        ]);
    }

    public function parentTransportation(Request $request)
    {
        $players = Player::where('parent_id', $request->user()->id)
            ->with([
                'busAssignments.route.bus',
                'busAssignments.stop',
            ])
            ->get();

        return response()->json([
            'players' => $players,
        ]);
    }
}