import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { getOrderHistory } from '../services/orderApi';
import { FaShoppingBag, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft, FaBoxOpen, FaClock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { getCurrentUser } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const user = getCurrentUser();

  useEffect(() => {
    if (!user.id) {
      navigate('/auth'); // Redirect to login if no user
      return;
    }
    
    fetchOrderHistory();
  }, [user.id, navigate]);

  const fetchOrderHistory = async () => {
    setIsLoading(true);
    try {
      const result = await getOrderHistory(user.id);
      
      if (result.success) {
        setOrders(result.orders);
      } else {
        toast.error(result.error || 'Failed to fetch order history');
      }
    } catch (error) {
      toast.error('Failed to fetch order history');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'confirmed':
        return <FaBoxOpen className="text-blue-600" />;
      case 'shipped':
        return <FaShoppingBag className="text-purple-600" />;
      case 'delivered':
        return <FaBoxOpen className="text-green-600" />;
      case 'cancelled':
        return <FaBoxOpen className="text-red-600" />;
      default:
        return <FaBoxOpen className="text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.username ? `${user.username}'s Orders` : 'Your Orders'}
            </h1>
          </div>
          <div className="text-lg font-semibold text-gray-600">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </div>
        </div>

        {orders.length === 0 ? (
          // No orders state
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaShoppingBag className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link 
              to="/books" 
              className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          // Orders list
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderId || order.id}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-700">
                      ৳{parseFloat(order.totalAmount || order.total_amount || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {new Date(order.orderDate || order.ordered_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-gray-600 text-sm">Items:</span>
                      <div className="font-semibold">
                        {order.itemCount || order.item_count || 'N/A'} {(order.itemCount || order.item_count) === 1 ? 'book' : 'books'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Shipping:</span>
                      <div className="font-semibold">
                        ৳{parseFloat(order.shippingFee || order.shipping_fee || 0).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Shipping Address:</span>
                      <div className="font-semibold text-sm">
                        {order.shippingAddress || order.shipping_address || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Order Items:</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div className="flex items-center space-x-4">
                              {/* Book Cover Image */}
                              <div className="flex-shrink-0">
                                <img 
                                  src={item.cover_url || item.thumbnail || '/images/books/defaultbook.jpg'} 
                                  alt={item.title || item.book_title || 'Book cover'}
                                  className="w-12 h-16 object-cover rounded border"
                                  onError={(e) => {
                                    e.target.src = '/images/books/defaultbook.jpg';
                                  }}
                                />
                              </div>
                              {/* Book Details */}
                              <div>
                                <div className="font-medium">{item.title || item.book_title || 'Unknown Book'}</div>
                                <div className="text-gray-600 text-sm">Quantity: {item.quantity}</div>
                                <div className="text-gray-600 text-sm">৳{parseFloat(item.price || 0).toFixed(2)} each</div>
                              </div>
                            </div>
                            <div className="font-semibold">
                              ৳{parseFloat(item.subtotal || (item.price * item.quantity) || 0).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Actions */}
                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => navigate(`/order-details/${order.id}`)}
                    variant="outline"
                    size="sm"
                  >
                    View Details
                  </Button>
                  {order.status.toLowerCase() === 'delivered' && (
                    <Button
                      variant="success"
                      size="sm"
                    >
                      Rate & Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link 
            to="/books" 
            className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <FaShoppingBag className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
