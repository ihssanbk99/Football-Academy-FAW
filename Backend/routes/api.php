<?php

use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AgeGroupController;
use App\Http\Controllers\Api\CoachController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\ParentDashboardController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\TrainingSessionController;
use App\Http\Controllers\Api\TrialBookingController;
use App\Http\Controllers\Api\UniformController;
use App\Http\Controllers\Api\TransportationController;
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
        Route::get('/parent/dashboard', [ParentDashboardController::class, 'index']);
        Route::get('/age-groups', [AgeGroupController::class, 'index']);
        Route::apiResource('players', PlayerController::class);
        Route::get('/players/{player}/uniform', [UniformController::class, 'playerUniform']);
        Route::patch('/players/{player}/uniform', [UniformController::class, 'assign']);
        Route::get('/uniform/sizes', [UniformController::class, 'sizes']);
        Route::get('/jersey-numbers/available', [UniformController::class, 'availableNumbers']);
        Route::get('/transportation/routes', [TransportationController::class, 'parentRoutes']);
        Route::get('/transportation', [TransportationController::class, 'parentTransportation']);
        Route::get('/training-sessions', [TrainingSessionController::class, 'index']);
        Route::get('/training-sessions/{trainingSession}', [TrainingSessionController::class, 'show']);
        Route::get('/trial-bookings', [TrialBookingController::class, 'index']);
        Route::post('/trial-bookings', [TrialBookingController::class, 'store']);
        Route::get('/trial-bookings/{trialBooking}', [TrialBookingController::class, 'show']);
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::get('/payments/{payment}', [PaymentController::class, 'show']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::get('/offers', [OfferController::class, 'index']);
        Route::get('/attendance', [AttendanceController::class, 'parentIndex']);
        Route::get('/tracking', [TrackingController::class, 'parentIndex']);
        Route::get('/assessments', [AssessmentController::class, 'parentIndex']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/admin/players', [PlayerController::class, 'adminIndex']);
        Route::get('/admin/parents', [NotificationController::class, 'adminParents']);
        Route::get('/admin/coaches', [CoachController::class, 'adminIndex']);
        Route::post('/admin/coaches', [CoachController::class, 'adminStore']);
        Route::patch('/admin/coaches/{coach}', [CoachController::class, 'adminUpdate']);
        Route::delete('/admin/coaches/{coach}', [CoachController::class, 'adminDestroy']);
        Route::get('/admin/age-groups', [AgeGroupController::class, 'adminIndex']);
        Route::get('/admin/training', [TrainingSessionController::class, 'adminIndex']);
        Route::post('/admin/training', [TrainingSessionController::class, 'adminStore']);
        Route::patch('/admin/training/{trainingSession}', [TrainingSessionController::class, 'adminUpdate']);
        Route::delete('/admin/training/{trainingSession}', [TrainingSessionController::class, 'adminDestroy']);
        Route::get('/admin/trial-bookings', [TrialBookingController::class, 'adminIndex']);
        Route::patch('/admin/trial-bookings/{trialBooking}/approve', [TrialBookingController::class, 'adminApprove']);
        Route::patch('/admin/trial-bookings/{trialBooking}/reject', [TrialBookingController::class, 'adminReject']);
        Route::post('/admin/trial-bookings/{trialBooking}/register-player', [TrialBookingController::class, 'adminRegisterPlayer']);
        Route::get('/admin/payments', [PaymentController::class, 'adminIndex']);
        Route::get('/admin/offers', [OfferController::class, 'adminIndex']);
        Route::post('/admin/offers', [OfferController::class, 'adminStore']);
        Route::patch('/admin/offers/{offer}', [OfferController::class, 'adminUpdate']);
        Route::delete('/admin/offers/{offer}', [OfferController::class, 'adminDestroy']);
        Route::get('/admin/notifications', [NotificationController::class, 'adminIndex']);
        Route::post('/admin/notifications', [NotificationController::class, 'adminStore']);
        Route::delete('/admin/notifications/{notification}', [NotificationController::class, 'adminDestroy']);
        Route::get('/admin/uniform/sizes', [UniformController::class, 'adminSizes']);
        Route::post('/admin/uniform/sizes', [UniformController::class, 'adminStoreSize']);
        Route::patch('/admin/uniform/sizes/{uniformSize}', [UniformController::class, 'adminUpdateSize']);
        Route::delete('/admin/uniform/sizes/{uniformSize}', [UniformController::class, 'adminDeleteSize']);
        Route::get('/admin/uniform/numbers', [UniformController::class, 'adminNumbers']);
        Route::post('/admin/uniform/numbers', [UniformController::class, 'adminStoreNumber']);
        Route::patch('/admin/uniform/numbers/{jerseyNumber}', [UniformController::class, 'adminUpdateNumber']);
        Route::delete('/admin/uniform/numbers/{jerseyNumber}', [UniformController::class, 'adminDeleteNumber']);
        Route::get('/admin/transportation/buses', [TransportationController::class, 'adminBuses']);
        Route::post('/admin/transportation/buses', [TransportationController::class, 'adminStoreBus']);
        Route::patch('/admin/transportation/buses/{bus}', [TransportationController::class, 'adminUpdateBus']);
        Route::delete('/admin/transportation/buses/{bus}', [TransportationController::class, 'adminDestroyBus']);
        Route::get('/admin/transportation/routes', [TransportationController::class, 'adminRoutes']);
        Route::post('/admin/transportation/routes', [TransportationController::class, 'adminStoreRoute']);
        Route::patch('/admin/transportation/routes/{busRoute}', [TransportationController::class, 'adminUpdateRoute']);
        Route::delete('/admin/transportation/routes/{busRoute}', [TransportationController::class, 'adminDestroyRoute']);
        Route::post('/admin/transportation/routes/{busRoute}/stops', [TransportationController::class, 'adminStoreStop']);
        Route::patch('/admin/transportation/stops/{busStop}', [TransportationController::class, 'adminUpdateStop']);
        Route::delete('/admin/transportation/stops/{busStop}', [TransportationController::class, 'adminDestroyStop']);
        Route::get('/admin/transportation/assignments', [TransportationController::class, 'adminAssignments']);
        Route::post('/admin/transportation/assignments', [TransportationController::class, 'adminAssignPlayer']);
        Route::delete('/admin/transportation/assignments/{assignment}', [TransportationController::class, 'adminRemoveAssignment']);
        Route::get('/admin/attendance', [AttendanceController::class, 'adminIndex']);
        Route::post('/admin/attendance', [AttendanceController::class, 'adminStore']);
        Route::patch('/admin/attendance/{attendance}', [AttendanceController::class, 'adminUpdate']);
        Route::delete('/admin/attendance/{attendance}', [AttendanceController::class, 'adminDestroy']);
        Route::get('/admin/tracking', [TrackingController::class, 'adminIndex']);
        Route::post('/admin/tracking', [TrackingController::class, 'adminStore']);
        Route::patch('/admin/tracking/{tracking}', [TrackingController::class, 'adminUpdate']);
        Route::delete('/admin/tracking/{tracking}', [TrackingController::class, 'adminDestroy']);
        Route::get('/admin/assessments', [AssessmentController::class, 'adminIndex']);
        Route::post('/admin/assessments', [AssessmentController::class, 'store']);
        Route::patch('/admin/assessments/{assessment}', [AssessmentController::class, 'update']);
        Route::delete('/admin/assessments/{assessment}', [AssessmentController::class, 'destroy']);
        Route::get('/admin-test', function (Request $request) {
            return response()->json([
                'message' => 'Admin access granted',
                'user' => $request->user(),
            ]);
        });
    });

    Route::middleware('role:coach')->group(function () {
        Route::get('/coach/attendance', [AttendanceController::class, 'coachIndex']);
        Route::get('/coach/attendance/options', [AttendanceController::class, 'coachOptions']);
        Route::post('/coach/attendance', [AttendanceController::class, 'coachStore']);
        Route::patch('/coach/attendance/{attendance}', [AttendanceController::class, 'coachUpdate']);

        Route::get('/coach/players', [AssessmentController::class, 'coachPlayers']);
        Route::get('/coach/assessments', [AssessmentController::class, 'coachIndex']);
        Route::post('/coach/assessments', [AssessmentController::class, 'coachStore']);
        Route::patch('/coach/assessments/{assessment}', [AssessmentController::class, 'coachUpdate']);
        Route::delete('/coach/assessments/{assessment}', [AssessmentController::class, 'coachDestroy']);
    });
});