import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaClipboardList, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaShippingFast, 
  FaEye,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaArrowLeft
} from 'react-icons/fa';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const user = getCurrentUser();

  // Redirect if not logged in
  useEffect(() => {
    if (!user?.id) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/orders/history/${user.id}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again.');
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  // Fetch detailed order information
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/details/${orderId}?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedOrder(data.order);
        setShowOrderDetails(true);
      } else {
        toast.error(data.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { icon: FaClock, color: 'text-yellow-600 bg-yellow-100', label: 'Pending' };
      case 'confirmed':
        return { icon: FaCheckCircle, color: 'text-blue-600 bg-blue-100', label: 'Confirmed' };
      case 'processing':
        return { icon: FaSpinner, color: 'text-orange-600 bg-orange-100', label: 'Processing' };
      case 'shipped':
        return { icon: FaTruck, color: 'text-purple-600 bg-purple-100', label: 'Shipped' };
      case 'delivered':
        return { icon: FaCheckCircle, color: 'text-green-600 bg-green-100', label: 'Delivered' };
      case 'cancelled':
        return { icon: FaExclamationCircle, color: 'text-red-600 bg-red-100', label: 'Cancelled' };
      default:
        return { icon: FaClock, color: 'text-gray-600 bg-gray-100', label: status || 'Unknown' };
    }
  };

  if (!user?.id) {
    return null;
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaClipboardList className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600">Track and manage your order history</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-blue-600 text-2xl mr-3" />
              <span className="text-gray-600">Loading your orders...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <FaExclamationCircle className="text-red-600 text-3xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="danger"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FaClipboardList className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <Button
                onClick={() => navigate('/books')}
                variant="primary"
              >
                Start Shopping
              </Button>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={order.order_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order.order_id}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.color}`}>
                          <StatusIcon className="text-xs" />
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                      <Button
                        onClick={() => fetchOrderDetails(order.order_id)}
                        variant="primary"
                        size="sm"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>Ordered: {formatDate(order.ordered_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClipboardList className="text-gray-400" />
                        <span>{order.item_count} {order.item_count === 1 ? 'item' : 'items'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCreditCard className="text-gray-400" />
                        <span className="font-semibold text-gray-800">৳{order.total_amount}</span>
                      </div>
                    </div>

                    {order.shipping_address && (
                      <div className="mt-3 flex items-start space-x-2 text-sm text-gray-600">
                        <FaShippingFast className="text-gray-400 mt-0.5" />
                        <span>Shipping to: {order.shipping_address}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details #{selectedOrder.order_id}
                </h2>
                <Button
                  onClick={() => setShowOrderDetails(false)}
                  variant="ghost"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDate(selectedOrder.ordered_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).color}`}>
                        {getStatusInfo(selectedOrder.status).label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Fee:</span>
                      <span className="font-medium">৳{selectedOrder.shipping_fee}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">৳{selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {selectedOrder.shipping_address || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = '/images/books/defaultbook.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-600">by {item.author}</p>
                        <p className="text-xs text-gray-500">ISBN: {item.isbn}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ৳{item.price}</p>
                        <p className="font-semibold text-gray-800">৳{item.subtotal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowOrderDetails(false)}
                  variant="ghost"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default MyOrders;
