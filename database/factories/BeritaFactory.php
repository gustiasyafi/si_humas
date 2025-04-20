<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Berita;
use App\Models\Agenda;
use App\Models\User;
use Faker\Factory as FakerFactory;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Berita>
 */
class BeritaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Berita::class;
    public function definition()
    {
        $faker = \Faker\Factory::create('id_ID');
        $newsNames = [
            'Festival MBKM 2024 di UNS',
            'Silaturahmi dan Halalbihalal FK UNS',
            'Mahasiswa UNS Demo Tolak Efisiensi Anggaran',
            'UNS Buka 9 Program Studi Baru di 2025',
            'Prof Hartono Dilantik Jadi Rektor UNS 2024-2029'
        ];

        return [
            'title' => $faker->randomElement($newsNames), // Generate a random sentence in Indonesian
            'description' => $faker->text(200), // Generate a random text in Indonesian
            'date' => $faker->date(),
            'category' => $faker->randomElement(['Mahasiswa UNS', 'Kerja Sama UNS', 'Pengabdian', 'Produk & Penelitian']),
            'link' => $faker->url(),
            'priority' => $faker->randomElement(['Tinggi', 'Sedang', 'Rendah']),
            'publish' => $faker->randomElement(['Website UNS Official', 'Facebook', 'Instagram', 'Twitter']),
            'notes' => $faker->randomElement(['Belum ada catatan', 'Masih ada kesalahan']), // Generate a random text in Indonesian
            'status' => $faker->randomElement(['Diajukan', 'Dipublikasikan', 'Ditolak', 'Perlu Revisi', 'Diproses']),
            'agenda_id' => Agenda::factory(),
        ];
    }
}
