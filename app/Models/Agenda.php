<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Berita;

class Agenda extends Model
{
    // protected $primaryKey = 'agenda_id';
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    use HasFactory;
    protected $fillable = [
        'user_id',
        'agenda_id',
        'name',
        'description', 
        'date',
        'time',
        'location',
        'category',
        'organizer',
        'pic',
        'status_agenda',
        'notes',
        'status'
    ];
    public function berita()
    {
        return $this->hasMany(Berita::class);
    }
}
