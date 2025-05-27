<?php

use App\Exports\BeritaExport as ExportsBeritaExport;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UnitKerjaController;
use App\Http\Controllers\BeritaExport;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return redirect()->route('login');
    });
});

// Rute untuk pengguna yang sudah login
Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return redirect()->route('dashboard');
    });
});


Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/unit-kerja', [UnitKerjaController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('unit-kerja.index');
Route::post('/unit-kerja/store', [UnitKerjaController::class, 'store'])
    ->middleware(['auth', 'verified'])->name('unit-kerja.store');
Route::get('/unit-kerja/edit/{unitKerja}', [UnitKerjaController::class, 'edit'])
    ->middleware(['auth', 'verified'])->name('unit-kerja.edit');
Route::put('/unit-kerja/update/{unitKerja}', [UnitKerjaController::class, 'update'])
    ->middleware(['auth', 'verified'])->name('unit-kerja.update');
Route::delete('/unit-kerja/delete/{unitKerja}', [UnitKerjaController::class, 'destroy'])
    ->middleware(['auth', 'verified'])->name('unit-kerja.destroy');
Route::put('/unit-kerja/{unitKerjaId}/update', [UnitKerjaController::class, 'updateUnitKerja'])
    ->middleware(['auth', 'verified'])->name('users.updateUnitKerja');

Route::get('/agenda', [AgendaController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('agenda');

Route::get('/agenda/tambah', function () {
    return Inertia::render('Konten/Agenda/Create');
})->middleware(['auth', 'verified'])->name('form-agenda');

Route::get('/agenda/detail/{agenda}', [AgendaController::class, 'show'])
    ->middleware(['auth', 'verified'])->name('agenda.show');

Route::post('/agenda/store', [AgendaController::class, 'store'])
    ->middleware(['auth', 'verified'])->name('agenda.store');

Route::get('/agenda/edit/{agenda}', [AgendaController::class, 'edit'])
    ->middleware(['auth', 'verified'])->name('agenda.edit');
Route::put('/agenda/update/{agenda}', [AgendaController::class, 'update'])
    ->middleware(['auth', 'verified'])->name('agenda.update');
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
Route::post('/berita/update/{berita}', [BeritaController::class, 'update'])
    ->middleware(['auth', 'verified'])->name('berita.update');

Route::post('/berita/store', [BeritaController::class, 'store'])
    ->middleware(['auth', 'verified'])->name('berita.store');
Route::put('/berita/cancel/{berita}', [BeritaController::class, 'cancel'])
    ->middleware(['auth', 'verified'])->name('berita.cancel');
Route::delete('/berita/delete/{berita}', [BeritaController::class, 'destroy'])
    ->middleware(['auth', 'verified'])->name('berita.destroy');
Route::put('/berita/update-status/{berita}', [BeritaController::class, 'updateStatus'])
    ->middleware(['auth', 'verified'])->name('berita.update-status');

Route::post('/berita/export', [BeritaController::class, 'export'])
    ->middleware(['auth', 'verified'])->name('berita.export');

Route::get('/user-management', [UserController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('user-management');
Route::post('/user-management/store', [UserController::class, 'store'])
    ->middleware(['auth', 'verified'])->name('user-management.store');
Route::get('/user-management/edit/{user}', [UserController::class, 'edit'])
    ->middleware(['auth', 'verified'])->name('user-management.edit');
Route::put('/user-management/update/{user}', [UserController::class, 'update'])
    ->middleware(['auth', 'verified'])->name('user-management.update');
Route::delete('/user-management/delete/{user}', [UserController::class, 'destroy'])
    ->middleware(['auth', 'verified'])->name('user-management.destroy');
Route::put('/user-management/reset-password/{user}', [UserController::class, 'resetPassword'])
    ->middleware(['auth', 'verified'])->name('user-management.reset-password');



require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
