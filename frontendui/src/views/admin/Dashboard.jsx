import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
    DollarSign, ShoppingBag, Users, Clock, ArrowRight, TrendingUp, Package 
} from "lucide-react";

export default function Dashboard() {
    // 🟢 1. STATE & LOGIC (Kept from your original code)
    const [stats, setStats] = useState({
        total_sales: 0,
        total_orders: 0,
        pending_orders: 0,
        total_customers: 0,
        recent_orders: [],
        top_products: [],
        sales_chart: [] 
    });
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30_days');

    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/admin/dashboard?period=${period}`)
            .then(({ data }) => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [period]);

    // 🟢 2. LOADING STATE (Styled)
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                <p className="font-medium animate-pulse">Loading Analytics...</p>
            </div>
        );
    }

    // 🟢 3. RENDER UI
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
            
            {/* HEADER */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your store performance.</p>
                </div>
                
                {/* Period Filter */}
                <select 
                    value={period} 
                    onChange={(e) => setPeriod(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm transition-all cursor-pointer"
                >
                    <option value="7_days">Last 7 Days</option>
                    <option value="30_days">Last 30 Days</option>
                    <option value="12_months">Last 12 Months</option>
                </select>
            </div>

            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+Revenue</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                        <h3 className="text-2xl font-black text-gray-900">
                            ${parseFloat(stats.total_sales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                        <h3 className="text-2xl font-black text-gray-900">{stats.total_orders}</h3>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        {stats.pending_orders > 0 && (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">Action Needed</span>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
                        <h3 className="text-2xl font-black text-gray-900">{stats.pending_orders}</h3>
                    </div>
                </div>

                {/* Total Customers */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Customers</p>
                        <h3 className="text-2xl font-black text-gray-900">{stats.total_customers}</h3>
                    </div>
                </div>
            </div>

            {/* CHARTS & TABLES GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. SALES CHART (Recharts) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Sales Analytics</h2>
                    </div>

                    <div className="h-[300px] w-full">
                        {stats.sales_chart && stats.sales_chart.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.sales_chart}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#9ca3af', fontSize: 12}} 
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                                        }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#9ca3af', fontSize: 12}} 
                                        tickFormatter={(number) => `$${number}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#f59e0b" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorSales)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                No sales data for this period
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. TOP PRODUCTS LIST */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <Package size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Top Selling</h2>
                    </div>

                    <div className="space-y-4">
                        {stats.top_products.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No sales yet.</p>
                        ) : (
                            stats.top_products.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                            i === 0 ? 'bg-amber-100 text-amber-700' : 
                                            i === 1 ? 'bg-gray-200 text-gray-700' :
                                            i === 2 ? 'bg-orange-100 text-orange-800' :
                                            'bg-white border border-gray-100 text-gray-500'
                                        }`}>
                                            {i + 1}
                                        </div>
                                        <span className="font-bold text-gray-700 text-sm">{p.product_name}</span>
                                    </div>
                                    <span className="text-xs font-bold bg-white border border-gray-100 text-gray-600 px-2 py-1 rounded-lg shadow-sm">
                                        {p.total_sold} Sold
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 3. RECENT ORDERS TABLE (Full Width Bottom) */}
                <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-amber-600 hover:text-amber-700 text-sm font-bold flex items-center">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recent_orders.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">No orders found.</td></tr>
                                ) : (
                                    stats.recent_orders.map(order => (
                                        <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm text-gray-500 font-bold">#{order.id}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                {order.user ? order.user.name : 'Guest'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-green-600">
                                                ${parseFloat(order.total_amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}