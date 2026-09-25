<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Payment::where('parent_id', $request->user()->id)
            ->with([
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
        $this->authorizeParent($request, $payment);

        return response()->json([
            'payment' => $payment->load([
                'player:id,first_name,last_name',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'player_id' => ['required', 'exists:players,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'payment_method' => ['nullable', 'string', 'max:255'],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $player = $request->user()
            ->players()
            ->where('id', $validated['player_id'])
            ->first();

        abort_unless(
            $player,
            403,
            'You are not authorized to create a payment for this player.'
        );

        $payment = Payment::create([
            ...$validated,
            'parent_id' => $request->user()->id,
            'currency' => $validated['currency'] ?? 'JOD',
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment->load([
                'player:id,first_name,last_name',
            ]),
        ], 201);
    }

    private function authorizeParent(Request $request, Payment $payment): void
    {
        abort_unless(
            $payment->parent_id === $request->user()->id,
            403,
            'You are not authorized to access this payment.'
        );
    }
}