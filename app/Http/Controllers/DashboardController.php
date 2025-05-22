<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\Berita;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        return Inertia::render('Dashboard', [
            'berita' => $this->getBeritaData(),
            'agenda' => $this->getAgendaData(),
            'user' => $this->getUserData(),
            'pending' => $this->getPendingData(),
            'recentlyAdded' => $this->recentlyAdded(),
            'monthlyStats' => $this->getMonthlyChartData(), // <- ini tambahan
            'pieChartData' => [
                ['name' => 'Agenda', 'value' => Agenda::count()],
                ['name' => 'Berita', 'value' => Berita::count()],
                ['name' => 'User', 'value' => User::count()],
            ],

        ]);
    }
    public function getBeritaData()
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        // Total semua berita sampai sekarang
        $totalBerita = Berita::count();
        if ($user->hasRole('user')) {
            $totalBerita = Berita::where('user_id', $user->id)->count();
        }

        // Batas akhir minggu lalu
        $endOfLastWeek = Carbon::now()->subWeek()->endOfWeek();

        // Total berita hingga akhir minggu lalu
        $totalSampaiMingguLalu = Berita::where('created_at', '<=', $endOfLastWeek)->count();
        if ($user->hasRole('user')) {
            $totalSampaiMingguLalu = Berita::where('user_id', $user->id)->where('created_at', '<=', $endOfLastWeek)->count();
        }

        // Hitung penambahan minggu ini
        $penambahanMingguIni = $totalBerita - $totalSampaiMingguLalu;
        $perubahan = '+' . $penambahanMingguIni;

        return [
            'total' => $totalBerita,
            'perubahan_mingguan' => $perubahan,
        ];
    }


    public function getAgendaData()
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        // Jumlah total semua data agenda
        $totalAgenda = Agenda::count();
        if ($user->hasRole('user')) {
            $totalAgenda = Agenda::where('user_id', $user->id)->count();
        }

        // Batas akhir minggu lalu
        $endOfLastWeek = Carbon::now()->subWeek()->endOfWeek();

        // Total berita hingga akhir minggu lalu
        $totalSampaiMingguLalu = Agenda::where('created_at', '<=', $endOfLastWeek)->count();
        if ($user->hasRole('user')) {
            $totalSampaiMingguLalu = Agenda::where('user_id', $user->id)->where('created_at', '<=', $endOfLastWeek)->count();
        }
        // Hitung penambahan minggu ini
        $penambahanMingguIni = $totalAgenda - $totalSampaiMingguLalu;
        $perubahan = '+' . $penambahanMingguIni;

        return [
            'total' => $totalAgenda,
            'perubahan_mingguan' => $perubahan,
        ];
    }

    public function getUserData()
    {
        // Jumlah total semua data user
        $totalUser = User::count();

        // Batas akhir minggu lalu
        $endOfLastWeek = Carbon::now()->subWeek()->endOfWeek();

        // Total berita hingga akhir minggu lalu
        $totalSampaiMingguLalu = User::where('created_at', '<=', $endOfLastWeek)->count();

        // Hitung penambahan minggu ini
        $penambahanMingguIni = $totalUser - $totalSampaiMingguLalu;
        $perubahan = '+' . $penambahanMingguIni;

        return [
            'total' => $totalUser,
            'perubahan_mingguan' => $perubahan,
        ];
    }
    public function getPendingData()
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        // Jumlah total semua data user
        $totalBeritaPending = Berita::where('status', 'Diajukan')->count();
        $totalAgendaPending = Agenda::where('status', 'Diajukan')->count();
        if ($user->hasRole('user')) {
            $totalBeritaPending = Berita::where('user_id', $user->id)->where('status', 'Diajukan')->count();
            $totalAgendaPending = Agenda::where('user_id', $user->id)->where('status', 'Diajukan')->count();
        }

        return [
            'agenda' => $totalAgendaPending,
            'berita' => $totalBeritaPending,
            'total' => $totalAgendaPending + $totalBeritaPending,
        ];
    }

    public function getMonthlyChartData()
    {
        $monthlyData = [];

        // Loop 6 bulan ke belakang
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->format('M Y'); // Jan, Feb, dst

            $agendaCount = Agenda::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $beritaCount = Berita::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $monthlyData[] = [
                'name' => $monthName,
                'Agenda' => $agendaCount,
                'Berita' => $beritaCount,
            ];
        }

        return $monthlyData;
    }

    public function recentlyAdded()
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        if ($user->hasRole('user')) {
            $agendaQuery = Agenda::where('user_id', $user->id);
            $beritaQuery = Berita::where('user_id', $user->id);
        } else {
            $agendaQuery = Agenda::query();
            $beritaQuery = Berita::query();
        }

        $agenda = $agendaQuery->select('id', 'name', 'created_at')
            ->latest()
            ->get()
            ->map(function ($item) {
                $item->type = 'Agenda';
                $item->title = $item->name;
                unset($item->name);
                return $item;
            });

        $berita = $beritaQuery->select('id', 'title', 'created_at')
            ->latest()
            ->get()
            ->map(function ($item) {
                $item->type = 'Berita';
                return $item;
            });

            // dd($berita);

        // Gabungkan dan urutkan berdasarkan created_at
        $recentlyAdded = $berita
            ->merge($agenda)
            ->sortByDesc('created_at')
            ->take(5)
            ->values(); // untuk reset index

        return $recentlyAdded;
    }
}
