<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Agenda;

class Berita extends Model
{
    // protected $primaryKey = 'berita_id';
    use HasFactory;
    protected $fillable =  [
        'user_id',
        'agenda_id',
        'title',
        'description',
        'date',
        'category',
        'link',
        'priority',
        'file_path',
        'publish',
        'notes',
        'status'
    
    ];
    public function agenda()
    {
        return $this->belongsTo(Agenda::class, 'agenda_id');
    }
    

}
