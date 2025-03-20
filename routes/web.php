<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/agenda', function () {
    return Inertia::render('Konten/Agenda');
})->middleware(['auth', 'verified'])->name('agenda');

Route::get('/agenda/tambah', function () {
    return Inertia::render('Konten/Agenda/Create');
})->middleware(['auth', 'verified'])->name('form-agenda');

Route::get('/berita', function () {
    return Inertia::render('Konten/Berita');
})->middleware(['auth', 'verified'])->name('berita');

Route::get('/berita/tambah', function () {
    return Inertia::render('Konten/Berita/Create');
})->middleware(['auth', 'verified'])->name('form-berita');

Route::get('/user-management', function () {
    return Inertia::render('UserManagement');
})->middleware(['auth', 'verified'])->name('user-management');

require __DIR__ . '/auth.php';
