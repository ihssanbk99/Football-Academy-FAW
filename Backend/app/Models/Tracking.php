<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tracking extends Model
{
    use HasFactory;

    protected $fillable = [
        'academy_id',
        'bus_id',
        'bus_route_id',
        'status',
        'current_stop_id',
        'current_player_id',
        'notes',
    ];

    public function academy(): BelongsTo
    {
        return $this->belongsTo(Academy::class);
    }

    public function bus(): BelongsTo
    {
        return $this->belongsTo(Bus::class);
    }

    public function busRoute(): BelongsTo
    {
        return $this->belongsTo(BusRoute::class);
    }

    public function currentStop(): BelongsTo
    {
        return $this->belongsTo(BusStop::class, 'current_stop_id');
    }

    public function currentPlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'current_player_id');
    }
}