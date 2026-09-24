<?php

use App\Http\Controllers\Api\AuthController;
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

    Route::middleware('role:parent')->get('/parent-test', function (Request $request) {
        return response()->json([
            'message' => 'Parent access granted',
            'user' => $request->user(),
        ]);
    });

    Route::middleware('role:admin')->get('/admin-test', function (Request $request) {
        return response()->json([
            'message' => 'Admin access granted',
            'user' => $request->user(),
        ]);
    });
});