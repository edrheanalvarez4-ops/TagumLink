<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
        $table->id();
        $table->foreignId('opportunity_id')->constrained()->cascadeOnDelete();
        $table->foreignId('applicant_id')->constrained('users')->cascadeOnDelete();
        $table->string('resume_path')->nullable();
        $table->text('cover_letter')->nullable();
        $table->enum('status', ['pending', 'reviewing', 'shortlisted', 'accepted', 'rejected'])->default('pending');
        $table->text('employer_remarks')->nullable();
        $table->timestamp('applied_at')->useCurrent();
        $table->timestamps();

        $table->unique(['opportunity_id', 'applicant_id']);
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
