<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusStop extends Model
{
    protected $fillable = [
        'bus_route_id',
        'name',
        'address',
        'pickup_time',
        'stop_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function route(): BelongsTo
    {
        return $this->belongsTo(BusRoute::class, 'bus_route_id');
    }

    public function playerAssignments(): HasMany
    {
        return $this->hasMany(PlayerBusAssignment::class, 'bus_stop_id');
    }
}