<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // 1. List ALL orders with User AND Items
    public function index()
    {
        return Order::with(['user', 'items.product']) // 👈 Load items & products!
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // 2. Stats Badge (For Sidebar)
    public function stats()
    {
        $count = Order::where('status', 'pending')->count();
        return response()->json(['pending_count' => $count]);
    }

    // 3. Update Status
    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,completed,cancelled' // 👈 Validate allowed statuses
        ]);

        $order->update(['status' => $data['status']]);

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }
}
