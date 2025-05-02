<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Berita;
use App\Models\Agenda;
use App\Models\FileBerita;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\BeritaExport;

// use App\Http\Controllers\Agenda;

class BeritaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        $query = Berita::query();
        if ($user->hasRole('user')) {
            $query->where('user_id', $user->id);
        }
        $beritas = $query->latest()->get();
        $beritas->load('user');
        return Inertia::render('Konten/Berita/Index', [
            'berita_list' => $beritas,
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
            'agenda_id' => 'sometimes|nullable|exists:agendas,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'date' => 'required|date',
            'category' => 'required|string|max:255',
            'link' => 'nullable|string|max:255',
            'priority' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'publish' => 'required|string|max:255',
            'notes' => 'nullable|string|max:500',
            'files.*' => 'file',
        ]);

        $berita = Berita::create([
            'user_id' => Auth::user()->id,
            'agenda_id' => $validated['agenda_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'date' => $validated['date'],
            'category' => $validated['category'],
            'link' => $validated['link'] ?? null,
            'priority' => $validated['priority'],
            'publish' => $validated['publish'],
            'notes' => $validated['notes'],
            'status' => 'Diajukan',
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $originalName = $file->getClientOriginalName();
                $path = $file->store('uploads/berita', 'public');
                print($originalName);
                FileBerita::create([
                    'berita_id' => $berita->id,
                    'file_path' => $path,
                    'file_name' => $originalName,
                ]);
            }
        }
        return redirect()->route('berita')->with('success', 'Berita berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Berita $berita)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        if ($user->hasRole('user') && Auth::user()->id !== $berita->user_id) {
            return redirect()->route('berita')->with('error', 'Anda tidak memiliki akses ke berita ini.');
        }
        $berita->load('agenda');
        $berita->load('files');
        // dd($berita->agenda);
        return Inertia::render('Konten/Berita/Show', [
            'berita' => $berita
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Berita $berita)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        if ($user->hasRole('user') && Auth::user()->id !== $berita->user_id) {
            return redirect()->route('berita')->with('error', 'Anda tidak memiliki akses ke berita ini.');
        }
        $berita->load('agenda');
        $berita->load('files');
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
        /** @var \App\Models\User */
        $user = Auth::user();
        if ($user->hasRole('user') && Auth::user()->id !== $berita->user_id) {
            return redirect()->route('berita')->with('error', 'Anda tidak memiliki akses ke berita ini.');
        }

        // dd($request->all());

        $validated = $request->validate([
            'agenda_id' => 'sometimes|nullable|exists:agendas,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'date' => 'required|date',
            'category' => 'required|string|max:255',
            'link' => 'nullable|string|max:255',
            'priority' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'publish' => 'required|string|max:255',
            'notes' => 'nullable|string|max:500',
            'files.*' => 'sometimes|file',
        ]);

        $berita->update($validated);

        $existingFileIds = $request->input('existing_files', []);

        // Hapus file lama yang tidak dipertahankan
        $filesToDelete = FileBerita::where('berita_id', $berita->id)
            ->whereNotIn('id', $existingFileIds)
            ->get();

        foreach ($filesToDelete as $file) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        }

        // Simpan file baru jika ada
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $originalName = $file->getClientOriginalName();
                $path = $file->store('uploads/berita', 'public');

                FileBerita::create([
                    'berita_id' => $berita->id,
                    'file_path' => $path,
                    'file_name' => $originalName,
                ]);
            }
        }

        return redirect()->route('berita')->with('success', 'Berita berhasil diperbarui.');
    }
    public function updateStatus(Berita $berita, Request $request)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        if ($user->hasRole('user') && Auth::user()->id !== $berita->user_id) {
            return redirect()->route('berita')->with('error', 'Anda tidak memiliki akses ke berita ini.');
        }
        if (!$berita) {
            return redirect()->route('berita')->with('error', 'Berita not found');
        }
        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'required|string'
        ]);
        $berita->update($validated);
        return redirect()->route('berita')->with('message', 'Status updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(Berita $berita)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        if ($user->hasRole('user') && Auth::user()->id !== $berita->user_id) {
            return redirect()->route('berita')->with('error', 'Anda tidak memiliki akses ke berita ini.');
        }
        $berita->delete();
        return redirect()->route('berita')->with('success', 'Berita berhasil dihapus.');
    }
    public function export(Request $request)
    {
        $request->validate([
            'unit_kerja' => 'nullable|string',
            'bulan' => 'nullable|integer|between:1,12',
            'tahun' => 'nullable|integer',
            'format' => 'required|in:xlsx,csv', // Format yang diizinkan
        ]);

        $query = Berita::with('user', 'agenda');

        if ($request->unit_kerja) {
            $query->where('unit_kerja', $request->unit_kerja);
        }
            
        if ($request->bulan) {
            $query->whereMonth('created_at', $request->bulan);  // Kolom 'date' adalah tanggal penulisan berita
        }
    
        if ($request->tahun) {
            $query->whereYear('created_at', $request->tahun);  // Kolom 'date' adalah tanggal penulisan berita
        }
        
        return Excel::download(new BeritaExport($query), 'berita_export.' . $request->format);
    }
    
}
