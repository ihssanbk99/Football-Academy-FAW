<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->foreignId('uniform_size_id')
                ->nullable()
                ->after('level')
                ->constrained('uniform_sizes')
                ->nullOnDelete();

            $table->foreignId('jersey_number_id')
                ->nullable()
                ->after('uniform_size_id')
                ->constrained('jersey_numbers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->dropForeign(['uniform_size_id']);
            $table->dropForeign(['jersey_number_id']);
            $table->dropColumn(['uniform_size_id', 'jersey_number_id']);
        });
    }
};