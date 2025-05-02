<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use Illuminate\View\View;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class AgendaController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index(): Response
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        $query = Agenda::query();
        if ($user->hasRole('user')) {
            $query->where('user_id', $user->id);
        }
        $agendas = $query->latest()->get();
        return Inertia::render('Konten/Agenda/Index', [
            'agenda_list' => $agendas,
            'success_message' => session('success'),
            'error_message' => session('error'),
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }
    public function show(Agenda $agenda)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        if ($user->hasRole('user') && Auth::user()->id !== $agenda->user_id) {
            return redirect()->route('agenda')->with('error', 'Anda tidak memiliki akses ke agenda ini.');
        }
        return Inertia::render('Konten/Agenda/Show', [
            'agenda' => $agenda,
        ]);
    }

    public function edit(Agenda $agenda)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        if ($user->hasRole('user') && Auth::user()->id !== $agenda->user_id) {
            return redirect()->route('agenda')->with('error', 'Anda tidak memiliki akses ke agenda ini.');
        }
        return Inertia::render('Konten/Agenda/Edit', [
            'agenda' => $agenda,
        ]);
    }
    public function create()
    {
        return Inertia::render('Konten/Agenda/Create');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'organizer' => 'required|string|max:255',
            'pic' => 'required|string|max:255',
            'publish' => 'required|string|max:255',
            'status_agenda' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);
        Agenda::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'description' => $validated['description'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'location' => $validated['location'],
            'category' => $validated['category'],
            'organizer' => $validated['organizer'],
            'pic' => $validated['pic'],
            'publish' => $validated['publish'],
            'status_agenda' => $validated['status_agenda'],
            'notes' => $validated['notes'] ?? '',
            'status' => 'Diajukan',
        ]);
        return redirect()->route('agenda')->with('success', 'Agenda Berhasil disimpan.');
    }
    public function update(Request $request, Agenda $agenda)
    {
         /** @var \App\Models\User */
         $user = Auth::user();
         if ($user->hasRole('user') && Auth::user()->id !== $agenda->user_id) {
             return redirect()->route('agenda')->with('error', 'Anda tidak memiliki akses ke agenda ini.');
         }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'organizer' => 'required|string|max:255',
            'pic' => 'required|string|max:255',
            'publish' => 'required|string|max:255',
            'status_agenda' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $agenda->update($validated);

        return redirect()->route('agenda')->with('success', 'Agenda berhasil diperbarui.');
    }
    public function updateStatus(Agenda $agenda, Request $request)
    {
        if (!$agenda) {
            return redirect()->route('agenda')->with('error', 'Agenda not found');
        }

         /** @var \App\Models\User */
         $user = Auth::user();
        if (!$user->hasRole('admin') && !$user->hasRole('superadmin')) {
            return redirect()->route('agenda')->with('error', 'Anda tidak memiliki akses untuk mengubah status.');
        }
        // Validasi status
        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Update status
        $agenda->update($validated);

        // Kembalikan response menggunakan Inertia
        return redirect()->route('agenda')->with('message', 'Status updated successfully');
    }

    public function destroy(Agenda $agenda)
    {
         /** @var \App\Models\User */
         $user = Auth::user();
         if ($user->hasRole('user') && Auth::user()->id !== $agenda->user_id) {
             return redirect()->route('agenda')->with('error', 'Anda tidak memiliki akses ke agenda ini.');
         }
        $agenda->delete();

        return redirect()->route('agenda')->with('success', 'Agenda berhasil dihapus.');
    }
}
