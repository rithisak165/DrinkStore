<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Date Filter
        $period = $request->query('period', '30_days');
        $queryDate = Carbon::now()->subDays(30);
        if($period === '7_days') $queryDate = Carbon::now()->subDays(7);
        if($period === '12_months') $queryDate = Carbon::now()->subMonths(12);

        // 2. KPI Cards
        // Note: We use PHP strtolower for safety, but usually strict string matching is fine
        $totalSales = Order::where('status', 'completed')->sum('total_amount');
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalCustomers = User::where('role', '!=', 'admin')->count();

        // 3. CHART DATA (The Fix: Grouping in PHP instead of SQL)
        $rawOrders = Order::where('status', 'completed')
            ->where('created_at', '>=', $queryDate)
            ->orderBy('created_at', 'asc')
            ->get();

        // Group by Date using Laravel Collections
        $salesChart = $rawOrders->groupBy(function($date) {
            return Carbon::parse($date->created_at)->format('Y-m-d'); // Universal date format
        })->map(function ($row, $date) {
            return [
                'date' => $date,
                'total' => $row->sum('total_amount')
            ];
        })->values(); // Reset keys to array

        // 4. Recent & Top Products
        $recentOrders = Order::with('user')->orderBy('created_at', 'desc')->take(5)->get();

        // Use PHP to process top products to avoid complex SQL joins that might fail on SQLite
        $allOrderItems = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed') // Simple where clause
            ->select('order_items.product_name', 'order_items.quantity')
            ->get();

        $topProducts = $allOrderItems->groupBy('product_name')
            ->map(function ($row, $name) {
                return [
                    'product_name' => $name,
                    'total_sold' => $row->sum('quantity')
                ];
            })
            ->sortByDesc('total_sold')
            ->take(5)
            ->values();

        return response()->json([
            'total_sales' => $totalSales,
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'total_customers' => $totalCustomers,
            'sales_chart' => $salesChart,
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts
        ]);
    }
    public function customers()
    {
        // Get users who are customers, count their orders, and sum their total spend
        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders as total_spent', 'total_amount')
            ->latest()
            ->get();

        return response()->json($customers);
    }

    // ADD THIS TO DELETE CUSTOMERS 👇
    public function deleteCustomer($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->noContent();
    }
}
