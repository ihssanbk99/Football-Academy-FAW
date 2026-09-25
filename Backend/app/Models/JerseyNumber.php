<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JerseyNumber extends Model
{
    protected $fillable = [
        'academy_id',
        'age_group_id',
        'number',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function academy(): BelongsTo
    {
        return $this->belongsTo(Academy::class);
    }

    public function ageGroup(): BelongsTo
    {
        return $this->belongsTo(AgeGroup::class);
    }

    public function player(): HasOne
    {
        return $this->hasOne(Player::class);
    }
}