<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_bus_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bus_route_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bus_stop_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['player_id', 'bus_route_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_bus_assignments');
    }
};