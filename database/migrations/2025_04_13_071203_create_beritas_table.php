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
        Schema::create('beritas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->foreignId('agenda_id')->nullable()->constrained('agendas');
            $table->string('title');
            $table->string('description');
            $table->date('date');
            $table->string('category')->index();
            $table->string('link')->nullable();
            $table->string('priority');
            $table->string('file_path')->nullable();
            $table->string('publish');
            $table->string('notes')->nullable();
            $table->string('status')->default('Diajukan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beritas');
    }
    
};
