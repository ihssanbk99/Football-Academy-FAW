<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academy_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bus_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bus_route_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', [
                'scheduled',
                'on_the_way',
                'near_stop',
                'at_stop',
                'player_picked_up',
                'arrived_academy',
                'in_training',
                'return_trip',
                'near_home_stop',
                'player_dropped_off',
                'completed',
            ])->default('scheduled');
            $table->foreignId('current_stop_id')->nullable()->constrained('bus_stops')->nullOnDelete();
            $table->foreignId('current_player_id')->nullable()->constrained('players')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trackings');
    }
};