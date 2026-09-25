<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
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

    private function authorizeUser(Request $request, Notification $notification): void
    {
        abort_unless(
            $notification->user_id === $request->user()->id,
            403,
            'You are not authorized to access this notification.'
        );
    }
}