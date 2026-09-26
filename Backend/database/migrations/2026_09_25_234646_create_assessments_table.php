<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->foreignId('coach_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('training_session_id')->nullable()->constrained()->nullOnDelete();
            $table->date('assessment_date');
            $table->unsignedTinyInteger('technical_score')->nullable();
            $table->unsignedTinyInteger('tactical_score')->nullable();
            $table->unsignedTinyInteger('physical_score')->nullable();
            $table->unsignedTinyInteger('discipline_score')->nullable();
            $table->unsignedTinyInteger('overall_score')->nullable();
            $table->text('strengths')->nullable();
            $table->text('areas_to_improve')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['player_id', 'assessment_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};