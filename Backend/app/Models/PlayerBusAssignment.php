<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerBusAssignment extends Model
{
    protected $fillable = [
        'player_id',
        'bus_route_id',
        'bus_stop_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function route(): BelongsTo
    {
        return $this->belongsTo(BusRoute::class, 'bus_route_id');
    }

    public function stop(): BelongsTo
    {
        return $this->belongsTo(BusStop::class, 'bus_stop_id');
    }
}