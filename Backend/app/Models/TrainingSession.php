<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'academy_id',
        'branch_id',
        'age_group_id',
        'coach_id',
        'title',
        'session_date',
        'start_time',
        'end_time',
        'field_name',
        'training_type',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'session_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function academy(): BelongsTo
    {
        return $this->belongsTo(Academy::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function ageGroup(): BelongsTo
    {
        return $this->belongsTo(AgeGroup::class);
    }

    public function coach(): BelongsTo
    {
        return $this->belongsTo(Coach::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}