<?php

use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AgeGroupController;
use App\Http\Controllers\Api\CoachController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\TrainingSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
        ]);
    });

    Route::middleware('role:parent')->group(function () {
        Route::apiResource('players', PlayerController::class);

        Route::get('/training-sessions', [TrainingSessionController::class, 'index']);
        Route::get('/training-sessions/{trainingSession}', [TrainingSessionController::class, 'show']);

        Route::get('/payments', [PaymentController::class, 'index']);
        Route::get('/payments/{payment}', [PaymentController::class, 'show']);
        Route::post('/payments', [PaymentController::class, 'store']);

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

        Route::get('/offers', [OfferController::class, 'index']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);

        Route::get('/admin/players', [PlayerController::class, 'adminIndex']);
        Route::get('/admin/parents', [NotificationController::class, 'adminParents']);
        Route::get('/admin/coaches', [CoachController::class, 'adminIndex']);
        Route::get('/admin/age-groups', [AgeGroupController::class, 'adminIndex']);
        Route::get('/admin/training', [TrainingSessionController::class, 'adminIndex']);
        Route::get('/admin/payments', [PaymentController::class, 'adminIndex']);

        Route::get('/admin/offers', [OfferController::class, 'adminIndex']);
        Route::post('/admin/offers', [OfferController::class, 'adminStore']);
        Route::patch('/admin/offers/{offer}', [OfferController::class, 'adminUpdate']);
        Route::delete('/admin/offers/{offer}', [OfferController::class, 'adminDestroy']);

        Route::get('/admin/notifications', [NotificationController::class, 'adminIndex']);
        Route::post('/admin/notifications', [NotificationController::class, 'adminStore']);
        Route::delete('/admin/notifications/{notification}', [NotificationController::class, 'adminDestroy']);

        Route::get('/admin-test', function (Request $request) {
            return response()->json([
                'message' => 'Admin access granted',
                'user' => $request->user(),
            ]);
        });
    });
});