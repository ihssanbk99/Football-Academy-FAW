<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgeGroup;

class AgeGroupController extends Controller
{
    public function adminIndex()
    {
        $ageGroups = AgeGroup::withCount('players')
            ->with('academy:id,name')
            ->orderBy('min_age')
            ->get();

        return response()->json([
            'age_groups' => $ageGroups,
        ]);
    }
}