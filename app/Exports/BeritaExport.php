<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BeritaExport implements FromQuery, WithHeadings, WithMapping
{
    protected $query;
    protected $rowNumber = 0;

    public function __construct($query)
    {
        $this->query = $query;
    }

    public function query()
    {
        return $this->query;
    }

    public function headings(): array
    {
        return [
            'No',
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
        $this->rowNumber++;
        $description = $berita->description;
        $description = str_replace(['<br>', '<br/>', '<br />', '</p><p>'], "\n", $description);
        $description = strip_tags($description);
        return [
            $this->rowNumber,
            $berita->title,
            $description,
            $berita->date,
            $berita->category,
            $berita->link,
            $berita->priority,
            $berita->status,
            optional($berita->agenda)->name,
            optional($berita->user->unitKerja)->name,
        ];
    }

}
