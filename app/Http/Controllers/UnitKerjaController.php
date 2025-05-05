<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UnitKerja;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class UnitKerjaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $unitKerjas = UnitKerja::all();
        return Inertia::render('MasterData/Index', [
            'unit_kerja_list' => $unitKerjas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $unitKerja = UnitKerja::create([
            'name' => $validated['name'],
        ]);

        return redirect()->back()->with('success', 'Unit Kerja berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $unitKerja = UnitKerja::findOrFail($id);
        $unitKerja->name = $validated['name'];
        $unitKerja->save();

        return redirect()->back()->with('success', 'Unit Kerja berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UnitKerja $unitKerja)
    {
        $unitKerja->delete();
        return redirect()->back()->with('success', 'Unit Kerja berhasil dihapus.');
    }
}
