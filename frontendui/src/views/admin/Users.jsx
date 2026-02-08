import { useEffect, useState } from "react";
import axiosClient from "../../axios-client"; // Make sure path matches your project structure
import { Search, Mail, Phone, Loader2, Trash2 } from "lucide-react";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // 1. Fetch Customers on page load
    useEffect(() => {
        getCustomers();
    }, []);

    const getCustomers = () => {
        setLoading(true);
        // ✅ UPDATED: Added '/admin' prefix to match your routes
        axiosClient.get('/admin/customers')
            .then(({ data }) => {
                setCustomers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching customers:", err);
                setLoading(false);
            });
    };

    // 2. Delete Customer Logic
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

        // ✅ UPDATED: Added '/admin' prefix here too
        axiosClient.delete(`/admin/customers/${id}`)
            .then(() => {
                // Update UI immediately without reloading
                setCustomers(customers.filter(c => c.id !== id));
            })
            .catch(() => alert("Failed to delete customer."));
    };

    // 3. Search Filter Logic
    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search))
    );

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Customers</h1>
                <p className="text-gray-500 mt-1">Manage your registered users.</p>
            </div>

            {/* --- SEARCH BAR --- */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Orders</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total Spent</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">
                                        <Loader2 className="animate-spin inline mr-2 text-amber-500" /> Loading data...
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-400">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((user) => (
                                    <tr key={user.id} className="hover:bg-amber-50/30 transition-colors group">
                                        
                                        {/* Name & Avatar */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-900">{user.name}</span>
                                            </div>
                                        </td>

                                        {/* Contact Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-400" /> {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-gray-400" /> {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Orders Count */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {user.orders_count} Orders
                                            </span>
                                        </td>

                                        {/* Total Spent */}
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-bold text-green-600">
                                                ${parseFloat(user.total_spent || 0).toFixed(2)}
                                            </div>
                                        </td>

                                        {/* Delete Button */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete Customer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}