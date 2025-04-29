<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileBerita extends Model
{
    protected $table = 'file_berita';
    use HasFactory;
    protected $fillable = [
        'berita_id',
        'file_path',
        'file_name',
    ];
    public function berita()
    {
        return $this->belongsTo(Berita::class);
    }
}
