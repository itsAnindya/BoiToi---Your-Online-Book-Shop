import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { saveCart, placeOrder } from '../services/cartApi';
import { FaPlus, FaMinus, FaTrash, FaSave, FaShoppingBag, FaArrowLeft, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Button, { BackToHomeButton } from '../components/ui/Button';
import { FaShoppingCart } from 'react-icons/fa';
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
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [localCart, setLocalCart] = useState([]);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
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
        // Store order details for confirmation dialog
        setOrderDetails({
          orderId: result.orderId,
          total: calculateTotal(),
          itemCount: localCart.length,
          items: [...localCart]
        });
        
        toast.success(`Order placed successfully! Order ID: ${result.orderId}`);
        setLocalCart([]);
        setShowOrderConfirmation(true); // Show confirmation dialog instead of navigating
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const closeOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setOrderDetails(null);
  };

  // Calculate total from local cart
  const calculateTotal = () => {
    return localCart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
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
            <BackToHomeButton />
            {/* <Link 
              to="/" 
              className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link> */}
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
            <Button
              onClick={() => navigate('/books')}
              variant="primary"
              size="lg"
            >
              Browse Books
            </Button>
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
                      <Button
                        onClick={() => handleQuantityChange(item.book_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        variant="neutral"
                        size="sm"
                      >
                        <FaMinus className="text-sm" />
                      </Button>
                      
                      <span className="font-semibold text-lg min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        onClick={() => handleQuantityChange(item.book_id, item.quantity + 1)}
                        variant="neutral"
                        size="sm"
                      >
                        <FaPlus className="text-sm" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      onClick={() => handleRemoveItem(item.book_id)}
                      variant="danger"
                      size="sm"
                      title="Remove item"
                    >
                      <FaTrash />
                    </Button>
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
                  <Button
                    onClick={handleSaveCart}
                    disabled={isSaving}
                    variant="outline"
                    className="w-full"
                  >
                    <FaSave className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Cart'}
                  </Button>
                  
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || localCart.length === 0}
                    variant="success"
                    className="w-full"
                  >
                    <FaShoppingBag className="mr-2" />
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                  </Button>
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

      {/* Order Confirmation Dialog */}
      {showOrderConfirmation && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-lg mx-4 transform animate-scale-in shadow-2xl">
            {/* Close button */}
            <Button
              onClick={closeOrderConfirmation}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 rounded-full"
            >
              <FaTimes className="w-6 h-6" />
            </Button>

            {/* Success content */}
            <div className="text-center">
              {/* Animated checkmark */}
              <div className="mx-auto mb-6 w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <FaCheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
              </div>

              {/* Success message */}
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                🎉 Order Placed Successfully!
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-gray-700 mb-2">
                  <strong>Order ID: #{orderDetails.orderId}</strong>
                </p>
                <p className="text-gray-600 mb-2">
                  {orderDetails.itemCount} {orderDetails.itemCount === 1 ? 'book' : 'books'} ordered
                </p>
                <p className="text-2xl font-bold text-green-600">
                  Total: ৳{orderDetails.total.toFixed(2)}
                </p>
              </div>

              <p className="text-gray-600 mb-8">
                Your order has been confirmed and will be processed shortly. 
                You'll receive an email confirmation with tracking details.
              </p>

              {/* Action buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    closeOrderConfirmation();
                    navigate('/books');
                  }}
                  className="px-8 py-3 border-2 border-slate-600 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    closeOrderConfirmation();
                    navigate('/orders');
                  }}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <FaShoppingBag className="w-5 h-5" />
                  Your Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
