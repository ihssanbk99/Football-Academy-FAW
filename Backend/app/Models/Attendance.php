<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'training_session_id',
        'player_id',
        'status',
        'notes',
    ];

    public function trainingSession(): BelongsTo
    {
        return $this->belongsTo(TrainingSession::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }
}