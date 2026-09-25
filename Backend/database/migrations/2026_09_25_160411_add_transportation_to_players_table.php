<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->boolean('needs_transportation')->default(false)->after('city');
            $table->foreignId('transportation_route_id')
                ->nullable()
                ->constrained('bus_routes')
                ->nullOnDelete()
                ->after('needs_transportation');
        });
    }

    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->dropForeign(['transportation_route_id']);
            $table->dropColumn([
                'needs_transportation',
                'transportation_route_id',
            ]);
        });
    }
};