import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider'; 
import axiosClient from '../axios-client'; // <--- Import Axios for API calls
import { useState } from 'react'; 
import { Coffee, ShoppingCart, LayoutDashboard, LogIn, LogOut, Menu as MenuIcon, X, User } from 'lucide-react'; 

export default function DefaultLayout() {
    const { token, cart, user, setUser, setToken } = useStateContext(); 
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
    
    // Redirect to login if no token (Optional, protects the layout)
    // if (!token) { return <Navigate to="/login" /> }

    const isHome = location.pathname === '/';
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const isActive = (path) => location.pathname === path;
    const closeMenu = () => setIsMobileMenuOpen(false);

    // --- LOGOUT FUNCTION ---
    const onLogout = (ev) => {
        ev.preventDefault();
        
        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
                closeMenu(); // Close mobile menu if open
            })
            .catch(err => {
                console.error(err);
                // Even if API fails, clear local state to "force" logout on frontend
                setUser({});
                setToken(null);
            });
    };

    return (
        <div className={`relative min-h-screen font-sans text-gray-800 selection:bg-amber-500 selection:text-white overflow-x-hidden 
            ${isHome ? 'bg-amber-50' : 'bg-white'}`}>
            
            <nav className="fixed top-0 left-0 right-0 z-50 shadow-md transition-all duration-300 bg-amber-500 border-b border-amber-600">
                
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group z-50 relative">
                        <div className="bg-white p-2 rounded-xl shadow-md group-hover:scale-105 transition transform duration-300">
                            <Coffee className="w-6 h-6 text-amber-400" />
                        </div>
                        <span className="text-xl font-extrabold text-white tracking-wide transition">
                            DrinkShop
                        </span>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink to="/" label="Home" active={isActive('/')} />
                        <NavLink to="/menu" label="Menu" active={isActive('/menu')} />
                        <NavLink to="/about" label="About" active={isActive('/about')} />
                        <NavLink to="/contact" label="Contact" active={isActive('/contact')}/>
                    </div>

                    {/* Right Side Icons & Toggle */}
                    <div className="flex items-center gap-4 md:gap-6 z-50 relative">
                        <Link to="/cart" className="relative group">
                            <div className={`p-2 rounded-full transition-all duration-300 text-white hover:bg-amber-400 hover:shadow-inner`}>
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-amber-600 shadow ring-2 ring-amber-500 transform transition group-hover:scale-110">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Auth Section */}
                        <div className="hidden md:flex items-center gap-3">
                            {token ? (
                                <>
                                    {/* 1. Show Dashboard OR Name */}
                                    {user.role === 'admin' ? (
                                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-100 text-amber-600 shadow-lg transition-all">
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span className="text-sm font-bold">Dashboard</span>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600 border border-white/40 text-white shadow-sm cursor-default">
                                            <User className="w-4 h-4" />
                                            <span className="text-sm font-bold">{user.name}</span>
                                        </div>
                                    )}

                                    {/* 2. Logout Button */}
                                    <button 
                                        onClick={onLogout} 
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-all"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/40 bg-amber-600 hover:bg-white hover:text-amber-600 text-white transition-all shadow-sm">
                                    <LogIn className="w-4 h-4" />
                                    <span className="text-sm font-bold">Login</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-white focus:outline-none p-1"
                        >
                            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DRAWER */}
                <div 
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden
                    ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                    onClick={closeMenu}
                ></div>

                <div 
                    className={`fixed top-0 right-0 h-full w-64 bg-amber-500 z-40 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden pt-24 px-6
                    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex flex-col gap-6">
                        {/* Mobile Links */}
                        <div className="flex flex-col gap-4 border-b border-amber-400 pb-6">
                            <MobileNavLink to="/" label="Home" active={isActive('/')} onClick={closeMenu} />
                            <MobileNavLink to="/menu" label="Menu" active={isActive('/menu')} onClick={closeMenu} />
                            <MobileNavLink to="/about" label="About" active={isActive('/about')} onClick={closeMenu} />
                            <MobileNavLink to="/contact" label="Contact" active={isActive('/contact')} onClick={closeMenu} />
                        </div>

                        {/* Mobile Auth Buttons */}
                        <div className="flex flex-col gap-3">
                            {token ? (
                                <>
                                    {user.role === 'admin' ? (
                                        <Link to="/admin/dashboard" onClick={closeMenu} className="flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-white text-amber-600 shadow-md font-bold">
                                            <LayoutDashboard className="w-5 h-5" />
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <div className="flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 border border-white text-white shadow-md font-bold">
                                            <User className="w-5 h-5" />
                                            {user.name}
                                        </div>
                                    )}
                                    
                                    {/* Mobile Logout Button */}
                                    <button 
                                        onClick={onLogout} 
                                        className="flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white shadow-md font-bold hover:bg-red-600 transition"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={closeMenu} className="flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 border border-white text-white shadow-md font-bold">
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className={`relative z-0 pt-28 min-h-screen 
                ${isHome ? 'w-full pb-0' : 'container mx-auto px-4 pb-10'}`}>
                <Outlet />
            </main>
        </div>
    );
}

// Helper for Desktop Links
function NavLink({ to, label, active }) {
    return (
        <Link to={to} className="relative group px-1 py-1">
            <span className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 
                ${active ? 'text-white' : 'text-amber-100 group-hover:text-white'}`}>
                {label}
            </span>
            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-white transform transition-transform duration-300 origin-left 
                ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} 
            />
        </Link>
    );
}

// Helper for Mobile Links
function MobileNavLink({ to, label, active, onClick }) {
    return (
        <Link 
            to={to} 
            onClick={onClick}
            className={`text-lg font-bold uppercase tracking-wide transition-colors duration-200 
            ${active ? 'text-white pl-2 border-l-4 border-white' : 'text-amber-100 hover:text-white'}`}
        >
            {label}
        </Link>
    );
}