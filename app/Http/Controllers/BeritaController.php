<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Berita;
use App\Models\Agenda;
use Inertia\Inertia;
// use App\Http\Controllers\Agenda;

class BeritaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $beritas = Berita::orderBy('created_at', 'desc')->get(); // Fetch data from the database
        return Inertia::render('Konten/Berita/Index', [
            'berita_list' => $beritas, // Pass the data to the Inertia response
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $agendaList = Agenda::select('id', 'name')->get();
        return Inertia::render('Konten/Berita/Create', [
            'agendaList' => $agendaList,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'agenda_id' => 'nullable|exists:agendas,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'date' => 'required|date',
            'category' => 'required|string|max:255',
            'link' => 'nullable|url|max:255',
            'priority' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'publish' => 'required|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        Berita::create([
            'agenda_id' => $validated['agenda_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'date' => $validated['date'],
            'category' => $validated['category'],
            'link' => $validated['link'] ?? null,
            'priority' => $validated['priority'],
            'file_path' => $request->file('image') ? $request->file('image')->store('images') : null,
            'publish' => $validated['publish'],
            'notes' => $validated['notes'],
            'status' => 'Diajukan',

        ]);
        return redirect()->route('berita')->with('success', 'Berita berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Berita $berita)
    {
        $berita->load('agenda');
        // dd($berita->agenda);
        return Inertia::render('Konten/Berita/Show', [
            'berita' => $berita,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Berita $berita)
    {
        $berita->load('agenda');
        $agendaList = Agenda::select('id', 'name')->get();
        return Inertia::render('Konten/Berita/Edit', [
            'agendaList' => $agendaList,
            'berita' => $berita,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Berita $berita)
    {
        $validated = $request->validate([
            'agenda_id' => 'nullable|exists:agendas,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'date' => 'required|date',
            'category' => 'required|string|max:255',
            'link' => 'nullable|url|max:255',
            'priority' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'publish' => 'required|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        $berita->update($validated);

        return redirect()->route('berita')->with('success', 'Berita berhasil diperbarui.');
    }
    public function updateStatus(Berita $berita, Request $request)
    {
        if(!$berita) {
            return redirect()->route('berita')->with ('error', 'Berita not found');
        }
        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'required|string'
        ]);
        $berita->update($validated);
        return redirect()->route('berita')->with('message', 'Status updated successfully');    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(Berita $berita)
    {
        $berita->delete();
        return redirect()->route('berita')->with('success', 'Berita berhasil dihapus.');
    }
}
