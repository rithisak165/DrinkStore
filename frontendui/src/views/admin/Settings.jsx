import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios-client'; // Adjust path if needed
import { useStateContext } from '../../contexts/ContextProvider'; // Adjust if you use a context

export default function Settings() {
    const { setNotification } = useStateContext(); // Optional: if you have a notification system
    const [loading, setLoading] = useState(false);
    
    // 1. Initialize State with Empty Strings (prevents "controlled vs uncontrolled" errors)
    const [formData, setFormData] = useState({
        store_name: '',
        phone: '',
        address: '',
        currency_symbol: '$',
        tax_rate: 0,
        delivery_fee: 0,
        min_order_value: 0,
        open_at: '08:00',
        close_at: '20:00',
        email_notifications: false,
        sms_alerts: false,
    });

    // 2. Fetch Settings on Load
    useEffect(() => {
        setLoading(true);
        axiosClient.get('/admin/settings')
            .then(({ data }) => {
                // THE FIX: Use "|| ''" to ensure we never set a value to null
                setFormData({
                    store_name: data.store_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    currency_symbol: data.currency_symbol || '$',
                    tax_rate: data.tax_rate || 0,
                    delivery_fee: data.delivery_fee || 0,
                    min_order_value: data.min_order_value || 0,
                    open_at: data.open_at || '08:00',
                    close_at: data.close_at || '20:00',
                    email_notifications: data.email_notifications === 1 || data.email_notifications === true,
                    sms_alerts: data.sms_alerts === 1 || data.sms_alerts === true,
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading settings:", err);
                setLoading(false);
            });
    }, []);

    // 3. Handle Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // 4. Save Changes
    const handleSubmit = (e) => {
        e.preventDefault();
        axiosClient.post('/admin/settings', formData)
            .then(() => {
                // Show success message (using alert for simplicity, or your custom notification)
                alert('Settings updated successfully!');
            })
            .catch((err) => {
                console.error("Error saving settings:", err);
                alert('Failed to save settings.');
            });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                    <p className="text-gray-500">Manage your store configuration.</p>
                </div>
                <button 
                    onClick={handleSubmit}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                    <i className="fa-solid fa-floppy-disk"></i> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Store Profile */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg text-gray-700 mb-4 flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-600 p-2 rounded-lg"><i className="fa-solid fa-store"></i></span>
                        Store Profile
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Store Name</label>
                            <input 
                                name="store_name"
                                value={formData.store_name} 
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500" 
                                placeholder="e.g. My Coffee Shop" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                                <input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    type="text" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500" 
                                    placeholder="+1 234..." 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Currency Symbol</label>
                                <input 
                                    name="currency_symbol"
                                    value={formData.currency_symbol}
                                    onChange={handleChange}
                                    type="text" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                            <textarea 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500" 
                                rows="3" 
                                placeholder="Store address..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* 2. Payment & Delivery */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg text-gray-700 mb-4 flex items-center gap-2">
                        <span className="bg-green-100 text-green-600 p-2 rounded-lg"><i className="fa-solid fa-wallet"></i></span>
                        Payment & Delivery
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tax Rate (%)</label>
                            <input 
                                name="tax_rate"
                                value={formData.tax_rate}
                                onChange={handleChange}
                                type="number" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-green-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Fee ($)</label>
                            <input 
                                name="delivery_fee"
                                value={formData.delivery_fee}
                                onChange={handleChange}
                                type="number" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-green-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Minimum Order Value ($)</label>
                        <input 
                            name="min_order_value"
                            value={formData.min_order_value}
                            onChange={handleChange}
                            type="number" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-green-500" 
                        />
                        <p className="text-xs text-gray-400 mt-1">Customers must order at least this amount.</p>
                    </div>
                </div>

                {/* 3. Operating Hours */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg text-gray-700 mb-4 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><i className="fa-regular fa-clock"></i></span>
                        Operating Hours
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Set the time your store opens and closes.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Open At</label>
                            <input 
                                name="open_at"
                                value={formData.open_at}
                                onChange={handleChange}
                                type="time" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Close At</label>
                            <input 
                                name="close_at"
                                value={formData.close_at}
                                onChange={handleChange}
                                type="time" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" 
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Notifications */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg text-gray-700 mb-4 flex items-center gap-2">
                        <span className="bg-red-100 text-red-600 p-2 rounded-lg"><i className="fa-regular fa-bell"></i></span>
                        Notifications
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                            <input 
                                name="email_notifications"
                                checked={formData.email_notifications}
                                onChange={handleChange}
                                type="checkbox" 
                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500" 
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
                            <input 
                                name="sms_alerts"
                                checked={formData.sms_alerts}
                                onChange={handleChange}
                                type="checkbox" 
                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500" 
                            />
                        </div>
                        
                        <button className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mt-2">
                            <i className="fa-solid fa-lock mr-2"></i> Change Admin Password
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}