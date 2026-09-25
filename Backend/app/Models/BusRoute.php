<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusRoute extends Model
{
    protected $fillable = [
        'academy_id',
        'bus_id',
        'name',
        'area',
        'departure_time',
        'return_time',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function academy(): BelongsTo
    {
        return $this->belongsTo(Academy::class);
    }

    public function bus(): BelongsTo
    {
        return $this->belongsTo(Bus::class);
    }

    public function stops(): HasMany
    {
        return $this->hasMany(BusStop::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(PlayerBusAssignment::class, 'bus_route_id');
    }
}