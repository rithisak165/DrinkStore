import { Navigate, Outlet, Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    ShoppingCart,
    Coffee,
    FolderTree,
    Users,
    LogOut,
    Store
} from 'lucide-react';

export default function AdminLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0);

    if (!token) {
        return <Navigate to="/" />;
    }

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
                navigate('/');
            });
    }

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => setUser(data))
            .catch(() => setToken(null));
    }, []);

    useEffect(() => {
        const fetchStats = () => {
            axiosClient.get('/admin/orders/stats')
                .then(({ data }) => {
                    setPendingCount(data.pending_count);
                })
                .catch(err => console.error("Stats Error:", err));
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    // 🟢 UPDATED: Styles for the Amber Sidebar
    const linkClasses = (path) => {
        const isActive = location.pathname.startsWith(path);
        return `flex items-center p-3 rounded-xl transition-all duration-200 mb-1 font-medium ${
            isActive
                ? 'bg-white text-amber-600 shadow-sm' // Active state: White bg, Amber text
                : 'text-amber-900 hover:bg-amber-400/50' // Inactive: Dark Amber text, light hover
        }`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* 🟢 UPDATED: Sidebar is now bg-amber-500 */}
            <aside className="w-72 bg-amber-500 text-amber-900 flex flex-col shadow-xl z-20 font-sans">
                <div className="p-8 text-center border-b border-amber-700">
                    <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-3">
                        <Coffee className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">IT-Ice Tea
Drink</h2>
                    <p className="text-sm text-amber-100 mt-1 font-medium">Manage your empire</p>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto py-6 px-4">
                    <p className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-4 px-3">Main</p>

                    <Link to="/admin/dashboard" className={linkClasses('/admin/dashboard')}>
                        <LayoutDashboard className="mr-3 w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <p className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-4 mt-8 px-3">Store Management</p>

                    <Link to="/admin/orders" className={linkClasses('/admin/orders')}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <ShoppingCart className="mr-3 w-5 h-5" />
                                <span>Orders</span>
                            </div>
                            {pendingCount > 0 && (
                                <span className="bg-white text-amber-600 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                                    {pendingCount}
                                </span>
                            )}
                        </div>
                    </Link>

                    <Link to="/admin/products" className={linkClasses('/admin/products')}>
                        <Coffee className="mr-3 w-5 h-5" />
                        <span>Products</span>
                    </Link>
                    <p className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-4 mt-8 px-3">People</p>

                    <Link to="/admin/users" className={linkClasses('/admin/users')}>
                        <Users className="mr-3 w-5 h-5" />
                        <span>Users</span>
                    </Link>
                    <Link to="/admin/setting" className={linkClasses('/admin/setting')}>
                        <Store className="mr-3 w-5 h-5" />
                        <span>Store Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-amber-400/30">
                    <button onClick={onLogout} className="w-full flex items-center p-3 text-amber-50 hover:bg-amber-600/50 rounded-xl transition duration-200 font-medium">
                        <LogOut className="mr-3 w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white shadow-sm h-20 flex justify-between items-center px-8 z-10 border-b border-gray-100">
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                        {location.pathname.replace('/admin/', '').replace('/', ' / ').toUpperCase()}
                    </h1>

                    <div className="flex items-center gap-6">
                        <NavLink to={'/'} className="flex items-center gap-2 bg-amber-50 text-amber-600 rounded-xl py-2.5 px-5 hover:bg-amber-100 transition font-bold shadow-sm border border-amber-100">
                            <Store className="w-5 h-5" />
                            Go to shop
                        </NavLink>
                        <div className="text-right hidden sm:block">
                            <div className="font-bold text-gray-800 text-base">{user.name || 'Admin'}</div>
                            <div className="text-xs text-green-500 font-bold flex items-center justify-end gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                Online
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 border-2 border-white shadow-md">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}