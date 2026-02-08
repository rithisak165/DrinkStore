<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function settings()
    {
        // Get the first row from the settings table
        $settings = Setting::first();

        // If no settings exist yet, return default "Safety" data
        // This prevents your frontend from crashing if the DB is empty
        if (!$settings) {
            return response()->json([
                'open_at' => '08:00',
                'close_at' => '20:00',
                'shop_name' => 'My Coffee Shop'
            ]);
        }

        return response()->json($settings);
    }
}
