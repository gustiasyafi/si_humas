<?php

use App\Http\Controllers\AgendaController;
use Illuminate\Support\Facades\Route;


Route::get('/api/agenda', [AgendaController::class, 'getAllAgenda'])
    ->middleware(['auth', 'verified'])->name('api.agenda.get');
