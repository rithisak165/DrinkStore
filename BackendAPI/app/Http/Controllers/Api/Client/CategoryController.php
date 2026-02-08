<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        // Fetch categories that are active
        // SELECT * FROM categories WHERE is_active = 1
        $categories = Category::where('is_active', true)
            ->get(['id', 'name', 'slug', 'image_url']); // Only select what we need

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ], 200);
    }
}
