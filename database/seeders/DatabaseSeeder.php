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
            ['name' => 'superadmin',
            'password' => bcrypt('superadmin'),
        ]);

        User::firstOrCreate([
            'email' => 'admin@mail.com'],
            ['name' => 'admin',
            'password' => bcrypt('admin'),
        ]);
        User::firstOrCreate([
            
            'email' => 'user@mail.com'],
            ['name' => 'user',
            'password' => bcrypt('user'),
        ]);
        $this->call([
            RoleSeeder::class,
        ]);
    }
}
