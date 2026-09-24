<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AgeGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'academy_id',
        'name',
        'min_age',
        'max_age',
        'description',
        'is_active',
    ];

    protected $casts = [
        'min_age' => 'integer',
        'max_age' => 'integer',
        'is_active' => 'boolean',
    ];

    public function academy(): BelongsTo
    {
        return $this->belongsTo(Academy::class);
    }

    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    public function trainingSessions(): HasMany
    {
        return $this->hasMany(TrainingSession::class);
    }
}