<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Agenda;

class AgendaSeeder extends Seeder
{
    public function run()
    {
        // Menghasilkan 10 agenda
        Agenda::factory()->count(10)->create();
    }
}
