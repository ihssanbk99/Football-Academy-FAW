<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tracking;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function adminIndex()
    {
        $trackings = Tracking::with([
            'bus',
            'busRoute',
        ])
            ->where('academy_id', 1)
            ->latest()
            ->get();

        return response()->json([
            'trackings' => $trackings,
        ]);
    }

    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'bus_id' => ['required', 'exists:buses,id'],
            'bus_route_id' => ['nullable', 'exists:bus_routes,id'],
            'status' => ['required', 'in:scheduled,on_the_way,near_stop,at_stop,player_picked_up,arrived_academy,in_training,return_trip,near_home_stop,player_dropped_off,completed'],
            'current_stop_id' => ['nullable', 'exists:bus_stops,id'],
            'current_player_id' => ['nullable', 'exists:players,id'],
            'notes' => ['nullable', 'string'],
        ]);

        $tracking = Tracking::create([
            'academy_id' => 1,
            'bus_id' => $validated['bus_id'],
            'bus_route_id' => $validated['bus_route_id'] ?? null,
            'status' => $validated['status'],
            'current_stop_id' => $validated['current_stop_id'] ?? null,
            'current_player_id' => $validated['current_player_id'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Tracking created successfully',
            'tracking' => $tracking->load([
                'bus',
                'busRoute',
            ]),
        ], 201);
    }

    public function adminUpdate(Request $request, Tracking $tracking)
    {
        abort_unless($tracking->academy_id === 1, 404);

        $validated = $request->validate([
            'status' => ['required', 'in:scheduled,on_the_way,near_stop,at_stop,player_picked_up,arrived_academy,in_training,return_trip,near_home_stop,player_dropped_off,completed'],
            'current_stop_id' => ['nullable', 'exists:bus_stops,id'],
            'current_player_id' => ['nullable', 'exists:players,id'],
            'notes' => ['nullable', 'string'],
        ]);

        $tracking->update($validated);

        return response()->json([
            'message' => 'Tracking updated successfully',
            'tracking' => $tracking->fresh()->load([
                'bus',
                'busRoute',
            ]),
        ]);
    }

    public function adminDestroy(Tracking $tracking)
    {
        abort_unless($tracking->academy_id === 1, 404);

        $tracking->delete();

        return response()->json([
            'message' => 'Tracking deleted successfully',
        ]);
    }

    public function parentIndex(Request $request)
    {
        $trackings = Tracking::with([
            'bus',
            'busRoute',
        ])
            ->where('academy_id', 1)
            ->latest()
            ->get();

        return response()->json([
            'trackings' => $trackings,
        ]);
    }
}