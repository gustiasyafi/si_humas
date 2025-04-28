<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->latest()->get()->map(function ($user) {
            $user->role = $user->roles->first()?->name ?? '-';
            unset($user->roles); // optional
            return $user;
        });
        return Inertia::render('UserManagement/Index', [
            'user_list' => $users,
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
            'email' => 'required|email|unique:users,email',
            'unit_kerja' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'unit_kerja' => $validated['unit_kerja'],
            'role' => $validated['role'],
            'password' => bcrypt($validated['password']),
        ]);

        $user->syncRoles($validated['role']);

        return redirect()->back()->with('success', 'User berhasil ditambahkan.');
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
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'unit_kerja' => 'required|string|max:255',
            'role' => 'required|string|max:255',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->unit_kerja = $validated['unit_kerja'];
        $user->role($validated['role']);

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->syncRoles([$validated['role']]);

        $user->save();

        return redirect()->back()->with('success', 'User berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */

    public function resetPassword(Request $request, User $user)
    {
        $request ->validate([
            'password' => 'required|string|min:8|confirmed',
            
        ]);

        // dd($request->all()); 
        
        $user->password = Hash::make($request->password);
        $user->save();

        return redirect()->route('user-management')->with('success', 'Password berhasil direset.');
    }
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
