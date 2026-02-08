import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Clock, CheckCircle, Package, Calendar, Coffee, ChevronDown, ChevronUp } from "lucide-react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        axiosClient.get('/client/orders')
            .then(({ data }) => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const toggleOrder = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-stone-100 text-stone-800 border-stone-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Package className="text-amber-600" size={32} />
                    <h1 className="text-3xl font-bold text-stone-900">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-100">
                        <div className="bg-stone-100 p-4 rounded-full inline-block mb-4">
                            <Coffee size={48} className="text-stone-400" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-700">No orders yet</h3>
                        <p className="text-stone-500 mt-2">Looks like you haven't had your coffee fix yet!</p>
                        <a href="/menu" className="mt-6 inline-block bg-amber-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-amber-700 transition">
                            Order Now
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden transition hover:shadow-md">
                                {/* Order Header */}
                                <div 
                                    className="p-6 cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white"
                                    onClick={() => toggleOrder(order.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-amber-50 p-3 rounded-lg">
                                            <Coffee className="text-amber-600" size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-stone-800 text-lg">Order #{order.id}</p>
                                            <div className="flex items-center gap-2 text-stone-500 text-sm mt-1">
                                                <Calendar size={14} />
                                                {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:gap-6 w-full sm:w-auto">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wide`}>
                                            {order.status}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-xl text-stone-800">${parseFloat(order.total_amount).toFixed(2)}</span>
                                            {expandedOrderId === order.id ? <ChevronUp className="text-stone-400" /> : <ChevronDown className="text-stone-400" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details (Collapsible) */}
                                {expandedOrderId === order.id && (
                                    <div className="border-t border-stone-100 bg-stone-50 p-6 animate-fadeIn">
                                        <h4 className="font-semibold text-stone-700 mb-4">Items Ordered</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border border-stone-100">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">
                                                            {item.quantity}x
                                                        </span>
                                                        <div>
                                                            <p className="font-medium text-stone-800">{item.product_name}</p>
                                                            {item.size && <p className="text-xs text-stone-500">Size: {item.size}</p>}
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-stone-600">
                                                        ${parseFloat(item.price).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-6 flex justify-between items-center pt-4 border-t border-stone-200">
                                            <p className="text-stone-500 text-sm">Payment Method: <span className="font-medium capitalize">{order.payment_method}</span></p>
                                            <p className="text-stone-500 text-sm">Address: <span className="font-medium">{order.delivery_address || 'Pickup'}</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}