<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'academy_id',
        'branch_id',
        'age_group_id',
        'coach_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'photo',
        'position',
        'level',
        'uniform_size_id',
        'jersey_number_id',
        'phone',
        'address',
        'city',
        'needs_transportation',
        'transportation_route_id',
        'registration_status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'needs_transportation' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

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

    public function uniformSize(): BelongsTo
    {
        return $this->belongsTo(UniformSize::class);
    }

    public function jerseyNumber(): BelongsTo
    {
        return $this->belongsTo(JerseyNumber::class);
    }

    public function transportationRoute(): BelongsTo
    {
        return $this->belongsTo(BusRoute::class, 'transportation_route_id');
    }

    public function busAssignments(): HasMany
    {
        return $this->hasMany(PlayerBusAssignment::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class);
    }
}