<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/admin/categories
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Category::all()
        ]);
    }

    // POST /api/admin/categories
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug',
            'image_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Category created',
            'data' => $category
        ], 201);
    }

    // PUT /api/admin/categories/{id}
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Category updated',
            'data' => $category
        ]);
    }

    // DELETE /api/admin/categories/{id}
    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['status' => 'success', 'message' => 'Category deleted']);
    }
}
