<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('start_date')
                    ->orWhereDate('start_date', '<=', now()->toDateString());
            })
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', now()->toDateString());
            })
            ->latest()
            ->get();

        return response()->json([
            'offers' => $offers,
        ]);
    }

    public function adminIndex()
    {
        $offers = Offer::latest()->get();

        return response()->json([
            'offers' => $offers,
        ]);
    }

    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_percentage' => ['required', 'numeric', 'min:0.01', 'max:100'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'code' => ['nullable', 'string', 'max:100', 'unique:offers,code'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $offer = Offer::create([
            ...$validated,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Offer created successfully',
            'offer' => $offer,
        ], 201);
    }

    public function adminUpdate(Request $request, Offer $offer)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_percentage' => ['sometimes', 'numeric', 'min:0.01', 'max:100'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'code' => ['nullable', 'string', 'max:100', 'unique:offers,code,' . $offer->id],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $offer->update($validated);

        return response()->json([
            'message' => 'Offer updated successfully',
            'offer' => $offer->fresh(),
        ]);
    }

    public function adminDestroy(Offer $offer)
    {
        $offer->delete();

        return response()->json([
            'message' => 'Offer deleted successfully',
        ]);
    }
}