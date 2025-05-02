<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BeritaExport implements FromQuery, WithHeadings, WithMapping
{
    protected $query;

    public function __construct($query)
    {
        $this->query = $query;
    }

    public function query()
    {
        return $this->query->with('user', 'agenda'); // tambahkan relasi jika perlu
    }

    public function headings(): array
    {
        return [
            'Judul',
            'Deskripsi',
            'Tanggal Agenda',
            'Kategori',
            'Link',
            'Prioritas',
            'Status',
            'Agenda',
            'Dibuat Oleh',
        ];
    }

    public function map($berita): array
    {
        return [
            $berita->title,
            $berita->description,
            $berita->date,
            $berita->category,
            $berita->link,
            $berita->priority,
            $berita->status,
            optional($berita->agenda)->name,
            optional($berita->user)->name,
        ];
    }

}
