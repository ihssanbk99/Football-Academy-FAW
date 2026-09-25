<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->get();

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    public function show(Request $request, Notification $notification)
    {
        $this->authorizeUser($request, $notification);

        return response()->json([
            'notification' => $notification,
        ]);
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        $this->authorizeUser($request, $notification);

        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification->fresh(),
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()
            ->notifications()
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    public function adminIndex()
    {
        $notifications = Notification::with([
            'user:id,name,email,role',
        ])
            ->latest()
            ->get();

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    public function adminParents()
    {
        $parents = User::where('role', 'parent')
            ->withCount('players')
            ->with([
                'players:id,parent_id,first_name,last_name,registration_status',
            ])
            ->select('id', 'name', 'email', 'created_at')
            ->orderBy('name')
            ->get();

        return response()->json([
            'parents' => $parents,
        ]);
    }

    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'type' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::findOrFail($validated['user_id']);

        abort_unless(
            $user->role === 'parent',
            422,
            'Notifications can only be sent to parents.'
        );

        $notification = Notification::create([
            'user_id' => $validated['user_id'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'] ?? 'general',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Notification sent successfully',
            'notification' => $notification->load([
                'user:id,name,email,role',
            ]),
        ], 201);
    }

    public function adminDestroy(Notification $notification)
    {
        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully',
        ]);
    }

    private function authorizeUser(Request $request, Notification $notification): void
    {
        abort_unless(
            $notification->user_id === $request->user()->id,
            403,
            'You are not authorized to access this notification.'
        );
    }
}