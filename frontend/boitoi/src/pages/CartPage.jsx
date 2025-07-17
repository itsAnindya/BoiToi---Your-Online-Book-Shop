import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { saveCart, placeOrder } from '../services/cartApi';
import { FaPlus, FaMinus, FaTrash, FaSave, FaShoppingBag, FaArrowLeft, FaCheckCircle, FaTimes, FaGift } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { 
    cart, 
    isLoading, 
    updateItemQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCurrentUser,
    refreshCart,
    loadCart
  } = useCart();
  
  // Add custom CSS for animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce-in {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.3);
        }
        50% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.05);
        }
        70% {
          transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
      .animate-bounce-in {
        animation: bounce-in 0.6s ease-out forwards;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [localCart, setLocalCart] = useState([]);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  
  const user = getCurrentUser();

  // Refresh cart data when component mounts or user changes
  useEffect(() => {
    if (user.id) {
      refreshCart(); // This will fetch fresh data from backend
    } else {
      navigate('/auth'); // Redirect to login if no user
    }
  }, [user.id, navigate]); // Removed refreshCart from dependencies to prevent infinite loops

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  // Handle quantity change in local state
  const handleQuantityChange = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLocalCart(prevCart =>
      prevCart.map(item =>
        item.book_id === bookId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Handle item removal
  const handleRemoveItem = (bookId) => {
    removeFromCart(bookId);
  };

  // Save cart to backend
  const handleSaveCart = async () => {
    if (!user.id) {
      toast.error('Please login to save cart');
      return;
    }

    setIsSaving(true);
    try {
      const cartItems = localCart.map(item => ({
        book_id: item.book_id,
        quantity: item.quantity
      }));

      const result = await saveCart(user.id, cartItems);
      
      if (result.success) {
        // Update context with local changes
        localCart.forEach(item => {
          updateItemQuantity(item.book_id, item.quantity);
        });
        toast.success('Cart saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save cart');
      }
    } catch (error) {
      toast.error('Failed to save cart');
    } finally {
      setIsSaving(false);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!user.id) {
      toast.error('Please login to place order');
      return;
    }

    if (localCart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);
    try {
      // First save the current cart state
      await handleSaveCart();
      
      const result = await placeOrder(user.id);
      
      if (result.success) {
        setOrderDetails({
          orderId: result.orderId,
          totalAmount: result.orderDetails.totalAmount,
          itemCount: result.orderDetails.itemCount,
          totalItems: result.orderDetails.totalItems,
          items: result.orderDetails.items,
          orderDate: result.orderDetails.orderDate,
          status: result.orderDetails.status
        });
        setShowOrderSuccessModal(true);
        setLocalCart([]);
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Calculate total from local cart
  const calculateTotal = () => {
    return localCart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Order Success Modal Component
  const OrderSuccessModal = () => {
    if (!showOrderSuccessModal || !orderDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 animate-bounce-in">
          {/* Header with close button */}
          <div className="relative p-6 pb-4">
            <button
              onClick={() => setShowOrderSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Success Icon and Animation */}
          <div className="text-center px-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FaCheckCircle className="text-4xl text-emerald-600 animate-bounce" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-emerald-200 rounded-full mx-auto animate-ping opacity-25"></div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono font-semibold text-emerald-600">
                  #{orderDetails.orderId}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Items:</span>
                <span className="font-semibold">
                  {orderDetails.itemCount} {orderDetails.itemCount === 1 ? 'book' : 'books'}
                  {orderDetails.totalItems && orderDetails.totalItems !== orderDetails.itemCount && 
                    ` (${orderDetails.totalItems} total)`
                  }
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold">
                  {orderDetails.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg text-emerald-600">
                  ৳{orderDetails.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Gift Icon */}
            <div className="flex justify-center mb-6">
              <FaGift className="text-3xl text-yellow-500 animate-bounce" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6">
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowOrderSuccessModal(false);
                  navigate('/orders');
                }}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors transform hover:scale-105"
              >
                View My Orders
              </button>
              <button
                onClick={() => {
                  setShowOrderSuccessModal(false);
                  navigate('/books');
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
      {/* Order Success Modal */}
      <OrderSuccessModal />
      
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
              {user.username ? `${user.username}'s Cart` : 'Your Cart'}
            </h1>
          </div>
          <div className="text-lg font-semibold text-gray-600">
            {localCart.length} {localCart.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {localCart.length === 0 ? (
          // Empty cart state
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaShoppingBag className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any books to your cart yet.</p>
            <Link 
              to="/books" 
              className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {localCart.map((item) => (
                <div key={item.book_id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-6">
                    {/* Book Thumbnail */}
                    <div className="flex-shrink-0">
                      <img 
                        src={item.thumbnail || '/images/books/defaultbook.jpg'} 
                        alt={item.title}
                        className="w-20 h-28 object-cover rounded-md border"
                        onError={(e) => {
                          e.target.src = '/images/books/defaultbook.jpg';
                        }}
                      />
                    </div>

                    {/* Book Details */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        by {item.author}
                      </p>
                      <p className="text-lg font-bold text-slate-700">
                        ৳{item.price?.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.book_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      
                      <span className="font-semibold text-lg min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.book_id, item.quantity + 1)}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.book_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-lg">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>৳{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-slate-700">৳{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleSaveCart}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center px-4 py-3 border border-slate-600 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <FaSave className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Cart'}
                  </button>
                  
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || localCart.length === 0}
                    className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <FaShoppingBag className="mr-2" />
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link 
                    to="/books" 
                    className="text-indigo-600 hover:text-indigo-800 text-sm transition-colors font-medium"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
