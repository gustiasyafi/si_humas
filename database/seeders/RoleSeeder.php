<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Buat Roles
        $superadminRole = Role::firstOrCreate(['name' => 'superadmin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Buat Permissions (opsional, jika mau granular access)
        // Permission::firstOrCreate(['name' => 'manage users']);
        // Permission::firstOrCreate(['name' => 'edit articles']);
        // Permission::firstOrCreate(['name' => 'delete articles']);

        // Assign permission ke role
        // $adminRole->givePermissionTo(['manage users', 'edit articles', 'delete articles']);
        // $userRole->givePermissionTo(['edit articles']);

        // Assign role ke user tertentu (misal user ID 1)
        $superadmin = User::where('email', 'superadmin@mail.com')->first();
        if ($superadmin) {
            $superadmin->syncRoles('superadmin');
        }
        $admin = User::where('email', 'admin@mail.com')->first();
        if ($admin) {
            $admin->syncRoles('admin');
        }
        $user = User::where('email', 'user@mail.com')->first();
        if ($user) {
            $user->syncRoles('user');
        }

        // Bisa juga assign role default ke semua user yang belum punya
        User::whereDoesntHave('roles')->get()->each(function ($user) {
            $user->syncRoles('user');
        });
    }
}
