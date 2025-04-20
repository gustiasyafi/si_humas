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
            'name' => 'Superadmin',
            'email' => 'superadmin@mail.com',
            'password' => bcrypt('superadmin'),
        ]);

        User::firstOrCreate([
            'name' => 'Admin',
            'email' => 'admin@mail.com',
            'password' => bcrypt('admin'),
        ]);
        User::firstOrCreate([
            'name' => 'User',
            'email' => 'user@mail.com',
            'password' => bcrypt('user'),
        ]);
        $this->call([
            RoleSeeder::class,
        ]);
    }
}
