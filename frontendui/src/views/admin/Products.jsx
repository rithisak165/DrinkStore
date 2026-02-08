import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import ProductForm from "./ProductForm"; 
import { Plus, Pencil, Trash2, Image as ImageIcon, Search } from 'lucide-react';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        setLoading(true);
        axiosClient.get('/admin/products')
            .then(({ data }) => {
                setLoading(false);
                // Handle different API response structures (data.data or just data)
                setProducts(data.data ? data.data : data);
            })
            .catch(() => setLoading(false));
    };

    const onDeleteClick = (product) => {
        if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
        axiosClient.delete(`/admin/products/${product.id}`)
            .then(() => {
                getProducts();
            })
            .catch(err => {
                console.error(err);
                alert("Failed to delete product.");
            });
    };

    const onEditClick = (product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const onAddClick = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    }

    const handleSuccess = () => {
        setIsModalOpen(false);
        setProductToEdit(null);
        getProducts();
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Products</h1>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none shadow-sm"
                        />
                    </div>
                    <button
                        onClick={onAddClick}
                        className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-6 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Add New Coffee
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <table className="min-w-full w-full table-auto">
                    <thead>
                        <tr className="bg-gray-50 text-gray-700 uppercase text-xs font-extrabold tracking-wider leading-normal border-b border-gray-200">
                            <th className="py-4 px-6 text-left">Image</th>
                            <th className="py-4 px-6 text-left">Product Info</th>
                            <th className="py-4 px-6 text-left">Price Range</th>
                            <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-medium divide-y divide-gray-100">
                        {loading && <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading products...</td></tr>}

                        {!loading && filteredProducts.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-8 text-gray-500">No products found.</td></tr>
                        )}

                        {!loading && filteredProducts.map((p) => {
                            // Calculate price range
                            const prices = p.sizes?.map(s => parseFloat(s.price)) || [];
                            const priceDisplay = prices.length > 0
                                ? `$${Math.min(...prices).toFixed(2)} - $${Math.max(...prices).toFixed(2)}`
                                : <span className="text-red-400 font-normal">No Prices Set</span>;

                            return (
                                <tr key={p.id} className="hover:bg-amber-50/50 transition-colors">
                                    {/* IMAGE COLUMN */}
                                    <td className="py-4 px-6 text-left">
                                        <div className="h-16 w-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shadow-sm">
                                            {p.image_url ? (
                                                <img 
                                                    // FIX: If URL is the broken one, swap it immediately
                                                    src={p.image_url.includes('via.placeholder.com') ? "https://placehold.co/400" : p.image_url} 
                                                    // FIX: If image fails to load for ANY reason, swap it
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400"; }}
                                                    alt={p.name} 
                                                    className="h-full w-full object-cover" 
                                                />
                                            ) : (
                                                <ImageIcon className="text-gray-300 w-8 h-8" />
                                            )}
                                        </div>
                                    </td>

                                    {/* INFO COLUMN */}
                                    <td className="py-4 px-6 text-left">
                                        <div>
                                            <div className="font-bold text-gray-900 text-lg mb-1">{p.name}</div>
                                            <div className="text-sm text-gray-500 line-clamp-2 max-w-md leading-snug">
                                                {p.description || "No description provided."}
                                            </div>
                                        </div>
                                    </td>

                                    {/* PRICE COLUMN */}
                                    <td className="py-4 px-6 text-left">
                                        <span className="bg-amber-100 text-amber-700 py-1 px-3 rounded-lg font-bold text-xs border border-amber-200">
                                            {priceDisplay}
                                        </span>
                                    </td>

                                    {/* ACTIONS COLUMN */}
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex item-center justify-center gap-3">
                                            <button
                                                onClick={() => onEditClick(p)}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition border border-blue-100 shadow-sm active:scale-95"
                                                title="Edit"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(p)}
                                                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition border border-red-100 shadow-sm active:scale-95"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-gray-900/40 transition-opacity">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative scale-100 transition-transform">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition z-10"
                        >
                            ✕
                        </button>
                        <div className="p-8">
                            <ProductForm onSuccess={handleSuccess} productToEdit={productToEdit} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}