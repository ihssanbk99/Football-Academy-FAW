<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coach;

class CoachController extends Controller
{
    public function adminIndex()
    {
        $coaches = Coach::with([
            'academy:id,name',
            'user:id,name,email',
        ])
            ->latest()
            ->get();

        return response()->json([
            'coaches' => $coaches,
        ]);
    }
}