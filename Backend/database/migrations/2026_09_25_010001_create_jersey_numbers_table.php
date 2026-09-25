<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jersey_numbers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academy_id')->constrained()->cascadeOnDelete();
            $table->foreignId('age_group_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('number');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['academy_id', 'age_group_id', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jersey_numbers');
    }
};