<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = $request->user()
            ->payments()
            ->with('player:id,first_name,last_name')
            ->latest()
            ->get();

        return response()->json([
            'payments' => $payments,
        ]);
    }

    public function adminIndex()
    {
        $payments = Payment::with([
            'parent:id,name,email',
            'player:id,first_name,last_name',
        ])
            ->latest()
            ->get();

        return response()->json([
            'payments' => $payments,
        ]);
    }

    public function show(Request $request, Payment $payment)
    {
        abort_unless(
            $payment->parent_id === $request->user()->id,
            403,
            'You are not authorized to access this payment.'
        );

        return response()->json([
            'payment' => $payment->load('player:id,first_name,last_name'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'player_id' => ['required', 'exists:players,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', 'in:pending,paid,failed,refunded'],
            'payment_method' => ['nullable', 'string', 'max:255'],
            'reference' => ['nullable', 'string', 'max:255', 'unique:payments,reference'],
            'due_date' => ['nullable', 'date'],
            'paid_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $player = $request->user()
            ->players()
            ->findOrFail($validated['player_id']);

        $payment = Payment::create([
            ...$validated,
            'parent_id' => $request->user()->id,
            'currency' => $validated['currency'] ?? 'JOD',
            'status' => $validated['status'] ?? 'pending',
        ]);

        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment->load('player:id,first_name,last_name'),
        ], 201);
    }
}