<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
use App\Models\Category;

Route::get('/force-fix', function () {
    try {
        // This attempts to find ID 1, or creates it if missing
        $cat = Category::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Coffee',
                'slug' => 'coffee',
                'image_url' => 'https://placehold.co/100',
                'is_active' => true
            ]
        );
        return "✅ FIXED! Category ID 1 now exists. Go back to Postman and hit Send.";
    } catch (\Exception $e) {
        return "❌ ERROR: " . $e->getMessage();
    }
});
