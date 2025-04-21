<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AgendaController;  
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/agenda', [AgendaController::class, 'index']) 
  ->middleware(['auth', 'verified'])->name('agenda');

Route::get('/agenda/tambah', function () {
    return Inertia::render('Konten/Agenda/Create');
})->middleware(['auth', 'verified'])->name('form-agenda');

Route::get('/agenda/detail/{agenda}', [AgendaController::class, 'show'])
  ->middleware(['auth', 'verified'])->name('agenda.show');

Route::post('/agenda/store', [AgendaController::class, 'store'])
    ->middleware(['auth', 'verified'])->name('agenda.store');
Route::put('/agenda/cancel/{agenda}', [AgendaController::class, 'cancel'])
    ->middleware(['auth', 'verified'])->name('agenda.cancel');

Route::get('/agenda/edit/{agenda}', [AgendaController::class, 'edit'])
    ->middleware(['auth', 'verified'])->name('agenda.edit');
Route::put('/agenda/update/{agenda}', [AgendaController::class, 'update'])
    ->middleware(['auth', 'verified'])->name('sagenda.update');
Route::delete('/agenda/delete/{agenda}', [AgendaController::class, 'destroy'])
    ->middleware(['auth', 'verified'])->name('agenda.destroy');
Route::put('agenda/update-status/{agenda}', [AgendaController::class, 'updateStatus'])
    ->middleware(['auth', 'verified'])->name('agenda.update-status');

Route::get('/berita', [BeritaController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('berita');
Route::get('/berita/tambah', [BeritaController::class, 'create'])
    ->middleware(['auth', 'verified'])->name('form-berita');
Route::get('/berita/detail/{berita}', [BeritaController::class, 'show'])
    ->middleware(['auth', 'verified'])->name('berita.show');
Route::get('/berita/edit/{berita}', [BeritaController::class, 'edit'])
    ->middleware(['auth', 'verified'])->name('berita.edit');
    Route::put('/berita/update/{berita}', [BeritaController::class, 'update'])
    ->middleware(['auth', 'verified'])->name('berita.update');

Route::post('/berita/store', [BeritaController::class, 'store'])
    ->middleware(['auth', 'verified'])->name('berita.store');
Route::put ('/berita/cancel/{berita}', [BeritaController::class, 'cancel'])
    ->middleware(['auth', 'verified'])->name('berita.cancel');
Route::delete('/berita/delete/{berita}', [BeritaController::class, 'destroy'])
    ->middleware(['auth', 'verified'])->name('berita.destroy');
Route::put('/berita/update-status/{berita}', [BeritaController::class, 'updateStatus'])
    ->middleware(['auth', 'verified'])->name('berita.update-status');

Route::get('/user-management', [UserController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('user-management');
Route::post('/user-management/store', [UserController::class, 'store'])
    ->middleware(['auth', 'verified'])->name('user-management.store');
Route::delete('/user-management/delete/{user}', [UserController::class, 'destroy'])
    ->middleware(['auth', 'verified'])->name('user-management.destroy');

require __DIR__ . '/auth.php';
