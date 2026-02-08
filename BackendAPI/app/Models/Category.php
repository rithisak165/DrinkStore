<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'image_url', 'is_active'];

    // Relationship: A category has many drinks
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
