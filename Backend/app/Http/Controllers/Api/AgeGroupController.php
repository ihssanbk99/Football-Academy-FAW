<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgeGroup;
use Illuminate\Http\Request;

class AgeGroupController extends Controller
{
    public function index()
    {
        $ageGroups = AgeGroup::where('academy_id', 1)
            ->where('is_active', true)
            ->orderBy('min_age')
            ->get();

        return response()->json([
            'age_groups' => $ageGroups,
        ]);
    }

    public function adminIndex()
    {
        $ageGroups = AgeGroup::where('academy_id', 1)
            ->orderBy('min_age')
            ->get();

        return response()->json([
            'age_groups' => $ageGroups,
        ]);
    }
}