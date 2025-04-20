<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use Illuminate\View\View;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class AgendaController extends Controller
{
    /**
    * index
    *
    * @return void
    */
    public function index()
    {
        // $agendas = Agenda::all();
        $agendas = Agenda::orderBy('created_at', 'desc')->get();
        // $agendas = Agenda::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Konten/Agenda/Index', [
            'agenda_list' => $agendas,
            'success_message' => session('success'),
            'error_message' => session('error'),
        ]);
    }
    public function show(Agenda $agenda)
    {
        return Inertia::render('Konten/Agenda/Show', [
            'agenda' => $agenda,
        ]);
    }
    
    public function edit(Agenda $agenda)
    {
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
            'name' => $validated ['name'],
            'description' => $validated ['description'],
            'date' => $validated ['date'],
            'time' => $validated ['time'],
            'location' => $validated ['location'],
            'category' => $validated ['category'],
            'organizer' => $validated ['organizer'],
            'pic' => $validated ['pic'],
            'publish' => $validated ['publish'],
            'status_agenda' => $validated ['status_agenda'],
            'notes' => $validated['notes'] ?? '',
            'status' => 'Diajukan',
        ]);
        return redirect()->route('agenda')->with('success', 'Agenda Berhasil disimpan.');
    }
    public function update(Request $request, Agenda $agenda)
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
    
        $agenda->update($validated);
    
        return redirect()->route('agenda')->with('success', 'Agenda berhasil diperbarui.');
    }
    public function updateStatus(Agenda $agenda, Request $request)
    {

        if (!$agenda) {
            return redirect()->route('agenda')->with('error', 'Agenda not found');
        }

        // Validasi status
        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'required|string',
        ]);

        // Update status
        $agenda->update($validated);

        // Kembalikan response menggunakan Inertia
        return redirect()->route('agenda')->with('message', 'Status updated successfully');
    }

    public function destroy(Agenda $agenda)
    {
        $agenda->delete();

        return redirect()->route('agenda')->with('success', 'Agenda berhasil dihapus.');
    }

}

