<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    // GET /api/admin/settings
    public function index()
    {
        // Get the first settings row
        $settings = Setting::first();

        // If it doesn't exist (safety check), create a default one
        if (!$settings) {
            $settings = Setting::create([
                'open_at' => '08:00',
                'close_at' => '20:00',
            ]);
        }

        return response()->json($settings);
    }

    // POST /api/admin/settings
    public function update(Request $request)
    {
        // 1. Validate the incoming data
        // We use 'nullable' because you might not want to fill in everything right now
        $validated = $request->validate([
            'store_name' => 'nullable|string',
            'phone'      => 'nullable|string',
            'address'    => 'nullable|string',
            'open_at'    => 'required|string', // These two are required
            'close_at'   => 'required|string',
            'delivery_fee' => 'nullable|numeric',
            'min_order_value' => 'nullable|numeric',
        ]);

        // 2. Find the settings or create if missing
        $settings = Setting::first();

        if (!$settings) {
            $settings = new Setting();
        }

        // 3. Update the values
        // We use fill() to automatically update fields that are in the $fillable array in your Model
        $settings->fill($validated);
        $settings->save();

        return response()->json([
            'message' => 'Settings updated successfully!',
            'settings' => $settings
        ]);
    }
}
