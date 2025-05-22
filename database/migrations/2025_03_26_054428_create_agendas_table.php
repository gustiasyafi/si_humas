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
        Schema::create('agendas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('name');
            $table->string('description');
            $table->date('date');
            $table->time('time');
            $table->string('location');
            $table->string('category')->index();
            $table->string('organizer');
            $table->string('pic');
            $table->string('status_agenda');
            $table->text('notes')->nullable();
            $table->string('status')->default('Diajukan');
            $table->string('status_changed_by')->nullable()->constrained('users');
            $table->date('status_changed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
    
};
