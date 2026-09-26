<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $parents = User::where('role', 'parent')
            ->orderBy('id')
            ->get();

        $notifications = [
            [
                'title' => 'Training Reminder',
                'message' => 'Your child has a training session scheduled soon.',
                'type' => 'training',
            ],
            [
                'title' => 'Attendance Update',
                'message' => 'Your child attendance record has been updated.',
                'type' => 'attendance',
            ],
            [
                'title' => 'Payment Reminder',
                'message' => 'A payment is due for your child.',
                'type' => 'payment',
            ],
            [
                'title' => 'New Assessment',
                'message' => 'A new player development assessment is available.',
                'type' => 'assessment',
            ],
            [
                'title' => 'Academy Announcement',
                'message' => 'The academy has published a new announcement.',
                'type' => 'general',
            ],
        ];

        $id = 1;

        foreach ($parents as $parent) {
            foreach ($notifications as $notification) {
                if ($id > 40) {
                    break 2;
                }

                $isRead = $id % 3 === 0;

                Notification::updateOrCreate(
                    [
                        'user_id' => $parent->id,
                        'title' => $notification['title'],
                        'message' => $notification['message'],
                    ],
                    [
                        'user_id' => $parent->id,
                        'title' => $notification['title'],
                        'message' => $notification['message'],
                        'type' => $notification['type'],
                        'is_read' => $isRead,
                        'read_at' => $isRead ? now()->subDays($id % 7) : null,
                    ]
                );

                $id++;
            }
        }
    }
}