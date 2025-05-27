<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Agenda;
use App\Models\Berita;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate([
            'email' => 'superadmin@mail.com'],
            ['name' => 'Superadmin',
            'password' => bcrypt('superadmin'),
        ]);

        User::firstOrCreate([
            'email' => 'admin@mail.com'],
            ['name' => 'Admin',
            'password' => bcrypt('admin'),
        ]);
        User::firstOrCreate([
            
            'email' => 'user@mail.com'],
            ['name' => 'User',
            'password' => bcrypt('user'),
        ]);
        $this->call([
            RoleSeeder::class,
        ]);
    }
}
