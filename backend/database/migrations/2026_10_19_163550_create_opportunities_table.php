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
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->enum('opportunity_type', ['job', 'internship']);
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->text('required_skills')->nullable();
            $table->string('academic_program')->nullable();
            $table->string('location');
            $table->unsignedInteger('slots')->default(1);
            $table->date('deadline')->nullable();
            $table->enum('status', ['open', 'closed', 'draft'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
