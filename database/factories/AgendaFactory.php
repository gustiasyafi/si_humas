<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Agenda;
use App\Models\User;
use Faker\Factory as FakerFactory;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agenda>
 */
class AgendaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Agenda::class;
    public function definition()
    {
        $faker = \Faker\Factory::create('id_ID');
        $eventNames = [
            'Konferensi Teknologi',
            'Seminar Pendidikan',
            'Pameran Seni',
            'Workshop Kewirausahaan',
            'Pelatihan Kepemimpinan',
            'Pertemuan Bisnis',
            'Festival Budaya',
            'Acara Amal',
            'Diskusi Panel',
            'Webinar Kesehatan',
        ];

        return [
            'user_id' => \App\Models\User::factory(), // Create a user for the agenda
            'name' => $faker->randomElement($eventNames), // Generate a random sentence in Indonesian
            'description' => $faker->text(200), // Generate a random text in Indonesian
            'date' => $faker->date(),
            'time' => $faker->time(),
            'location' => $faker->address(),
            'category' => $faker->randomElement(['Mahasiswa UNS', 'Kerja Sama UNS', 'Pengabdian', 'Produk & Penelitian']),
            'organizer' => $faker->company(),
            'pic' => $faker->name(),
            'publish' => $faker->randomElement(['Website UNS Official', 'Facebook', 'Instagram', 'Twitter']),
            'status_agenda' => $faker->randomElement(['Sudah Terlaksana', 'Belum Terlaksana']),
            'notes' => $faker->randomElement(['Belum ada catatan', 'Masih ada kesalahan']), // Generate a random text in Indonesian
            'status' => $faker->randomElement(['Diajukan', 'Dipublikasikan', 'Ditolak', 'Perlu Revisi', 'Diproses']),
        ];
    }
}
