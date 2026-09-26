<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_id',
        'coach_id',
        'training_session_id',
        'assessment_date',
        'technical_score',
        'tactical_score',
        'physical_score',
        'discipline_score',
        'overall_score',
        'strengths',
        'areas_to_improve',
        'notes',
    ];

    protected $casts = [
        'assessment_date' => 'date',
    ];

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function coach(): BelongsTo
    {
        return $this->belongsTo(Coach::class);
    }

    public function trainingSession(): BelongsTo
    {
        return $this->belongsTo(TrainingSession::class);
    }
}