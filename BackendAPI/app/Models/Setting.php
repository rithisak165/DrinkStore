<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    // Use specific table name if your migration named it 'settings'
    protected $table = 'settings';

    // Allow these fields to be updated
    protected $fillable = [
        'shop_name',
        'address',
        'phone',
        'open_at',
        'close_at'
    ];
}
