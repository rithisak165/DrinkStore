import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Orders on Load
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    setLoading(true);
    axiosClient.get('/admin/orders')
      .then(({ data }) => {
        setLoading(false);
        setOrders(data);
      })
      .catch(() => setLoading(false));
  };

  // Handle Status Update (e.g., Pending -> Completed)
  const updateStatus = (orderId, newStatus) => {
    if (!window.confirm(`Mark this order as ${newStatus}?`)) return;

    axiosClient.put(`/admin/orders/${orderId}`, { status: newStatus })
      .then(() => {
        alert("Order Status Updated!");
        getOrders(); // Refresh list to show new status
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update status.");
      });
  };

  // Helper: Status Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Customer Orders</h1>

      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="min-w-full w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Customer</th>
              <th className="py-3 px-6 text-left">Items Details</th>
              <th className="py-3 px-6 text-center">Total</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {loading && <tr><td colSpan="6" className="text-center py-4">Loading Orders...</td></tr>}

            {!loading && orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                
                {/* ID & Date */}
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="font-bold">#{order.id}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </td>

                {/* Customer Info */}
                <td className="py-3 px-6 text-left">
                  <div className="font-medium">{order.user?.name || "Guest"}</div>
                  <div className="text-xs text-gray-400">{order.user?.email}</div>
                </td>

                {/* Items List */}
                <td className="py-3 px-6 text-left">
                  <div className="space-y-1">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex text-xs">
                        <span className="font-bold mr-1">{item.quantity || 1}x</span>
                        <span>{item.product?.name || "Unknown Item"}</span>
                        <span className="text-gray-400 ml-1">({item.size})</span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Total Price */}
                <td className="py-3 px-6 text-center font-bold text-green-600">
                  ${parseFloat(order.total_price).toFixed(2)}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-6 text-center">
                  <span className={`py-1 px-3 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="bg-green-500 text-white p-1 rounded hover:bg-green-600 text-xs px-2 shadow"
                        title="Mark Completed"
                      >
                        ✓ Done
                      </button>
                    )}
                    
                    {order.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'cancelled')}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 text-xs px-2 shadow"
                        title="Cancel Order"
                      >
                        ✕ Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!loading && orders.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                        No orders found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}