import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaPhone, FaEdit, FaPlus, FaTimes, FaCheck, FaMoneyBillWave, FaMobileAlt, FaUser, FaEnvelope, FaShippingFast, FaExclamationTriangle, FaArrowLeft, FaTag, FaPercentage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import AddressCard from '../components/Profile/AddressCard';
import AddressManagement from '../components/Profile/AddressManagement';
import { API_BASE_URL } from '../config';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // User and authentication
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  // Address management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    type: 'home',
    address: '',
    city: '',
    state: '',
    country: 'Bangladesh',
    zipCode: '',
    isDefault: false
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  
  // Contact information
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Payment information
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [transactionId, setTransactionId] = useState('');
  
  // Discount information
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  
  // Order summary
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shippingFee: 40.00,
    discount: 0,
    total: 0
  });

  // Fetch user data and addresses on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user from sessionStorage
        const userId = sessionStorage.getItem('id');
        if (!userId) {
          toast.error('Please login to proceed with checkout');
          navigate('/auth');
          return;
        }

        // Get user details
        const userResponse = await fetch(`http://localhost:3001/api/user/${userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('User data fetched:', userData);
          
          // Create user object with concatenated full name
          const userWithFullName = {
            ...userData.user,
            fullName: `${userData.user.firstName || ''} ${userData.user.lastName || ''}`.trim()
          };
          
          setUser(userWithFullName);
          setPhoneNumber(userData.user.phone || '');
          
          // Set addresses from user data
          setAddresses(userData.user.addresses || []);
          
          // Set default address as selected
          const defaultAddress = userData.user.addresses?.find(addr => addr.isDefault === 1);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        } else {
          throw new Error('Failed to fetch user data');
        }

        // Get cart items from location state or localStorage
        let items = location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (items.length === 0) {
          toast.error('Your cart is empty');
          navigate('/cart');
          return;
        }

        // Fetch complete book details including cover_url for each item
        const itemsWithBookDetails = await Promise.all(
          items.map(async (item) => {
            try {
              const bookResponse = await fetch(`http://localhost:3001/api/books/${item.id || item.book_id}`);
              if (bookResponse.ok) {
                const bookData = await bookResponse.json();
                return {
                  ...item,
                  id: item.id || item.book_id,
                  book_id: item.id || item.book_id,
                  title: bookData.book?.title || item.title,
                  cover_url: bookData.book?.cover_url || item.cover_url,
                  price: item.price || bookData.book?.price,
                  author: bookData.book?.author || item.author
                };
              }
              return item; // Return original item if book fetch fails
            } catch (error) {
              console.error('Error fetching book details:', error);
              return item; // Return original item if error
            }
          })
        );

        setCartItems(itemsWithBookDetails);

        // Calculate order summary
        const subtotal = itemsWithBookDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setOrderSummary({
          subtotal,
          shippingFee: 40.00,
          discount: 0,
          total: subtotal + 40.00
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load checkout data');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.state]);

  // Function to recalculate order total
  const recalculateOrderTotal = (discount = appliedDiscount) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    
    if (discount) {
      if (discount.discountType === 'percentage') {
        discountAmount = subtotal * discount.percentage;
      } else if (discount.discountType === 'fixed') {
        discountAmount = Math.min(discount.value, subtotal); // Don't exceed subtotal
      }
    }
    
    const total = subtotal + orderSummary.shippingFee - discountAmount;
    
    setOrderSummary(prev => ({
      ...prev,
      subtotal,
      discount: discountAmount,
      total: Math.max(total, orderSummary.shippingFee) // Ensure total is not negative
    }));
  };

  // Apply discount code
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setDiscountLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/discounts/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode.trim(),
          orderAmount: orderSummary.subtotal
        })
      });

      const data = await response.json();

      if (data.success) {
        const discount = data.data.discount;
        setAppliedDiscount(discount);
        toast.success(`Discount "${discount.code}" applied successfully!`);
        
        // Recalculate order total with discount
        recalculateOrderTotal(discount);
      } else {
        toast.error(data.message || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      toast.error('Failed to apply discount code');
    } finally {
      setDiscountLoading(false);
    }
  };

  // Remove applied discount
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    recalculateOrderTotal(null);
    toast.success('Discount removed');
  };

  // Update order total when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      recalculateOrderTotal();
    }
  }, [cartItems, appliedDiscount]);

  // Format address for display and storage
  const formatAddress = (address) => {
    const parts = [
      address.address,
      address.city,
      address.state,
      address.country,
      address.zip_code
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  };

  // Address management functions
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const startAddingAddress = () => {
    setIsAddingAddress(true);
    setEditingAddressId(null);
    setAddressFormData({
      type: 'home',
      address: '',
      city: '',
      state: '',
      country: 'Bangladesh',
      zipCode: '',
      isDefault: false
    });
  };

  const startEditingAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressFormData({
      type: address.address_type,
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zip_code,
      isDefault: address.is_default === 1
    });
  };

  const cancelAddressEdit = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setAddressFormData({
      type: 'home',
      address: '',
      city: '',
      state: '',
      country: 'Bangladesh',
      zipCode: '',
      isDefault: false
    });
  };

  const saveAddress = async () => {
    try {
      setIsSavingAddress(true);
      
      const addressData = {
        address_type: addressFormData.type,
        address: addressFormData.address,
        city: addressFormData.city,
        state: addressFormData.state,
        country: addressFormData.country,
        zip_code: addressFormData.zipCode,
        is_default: addressFormData.isDefault ? 1 : 0
      };

      const url = editingAddressId 
        ? `http://localhost:3001/api/user/${user.id}/address/${editingAddressId}`
        : `http://localhost:3001/api/user/${user.id}/address`;
      
      const method = editingAddressId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(editingAddressId ? 'Address updated successfully!' : 'Address added successfully!');
        
        // Refresh addresses
        const addressResponse = await fetch(`http://localhost:3001/api/user/${user.id}`);
        if (addressResponse.ok) {
          const addressData = await addressResponse.json();
          setAddresses(addressData.user.addresses || []);
          
          // If this was set as default or is the first address, select it
          if (addressFormData.isDefault || !selectedAddress) {
            const newAddress = addressData.user.addresses?.find(addr => 
              editingAddressId ? addr.id === editingAddressId : addr.id === result.addressId
            );
            if (newAddress) setSelectedAddress(newAddress);
          }
        }
        
        cancelAddressEdit();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/address/${addressId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Address deleted successfully!');
        
        // Refresh addresses
        const addressResponse = await fetch(`http://localhost:3001/api/user/${user.id}`);
        if (addressResponse.ok) {
          const addressData = await addressResponse.json();
          setAddresses(addressData.user.addresses || []);
          
          // If deleted address was selected, clear selection
          if (selectedAddress?.id === addressId) {
            const defaultAddress = addressData.user.addresses?.find(addr => addr.is_default === 1);
            setSelectedAddress(defaultAddress || null);
          }
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const getAddressTypeIcon = (type) => {
    return type === 'home' ? <FaMapMarkerAlt className="text-emerald-600" /> : <FaMobileAlt className="text-blue-600" />;
  };

  // Place order function
  const handlePlaceOrder = async () => {
    try {
      // Validation
      if (!selectedAddress) {
        toast.error('Please select a delivery address');
        return;
      }

      if (!phoneNumber.trim()) {
        toast.error('Please provide a phone number');
        return;
      }

      if (paymentMethod === 'bkash' && !transactionId.trim()) {
        toast.error('Please provide the bKash transaction ID');
        return;
      }

      setPlacingOrder(true);

      // Prepare order data
      const orderData = {
        user_id: user.id,
        shipping_address: formatAddress(selectedAddress),
        phone_number: phoneNumber,
        payment_method: paymentMethod,
        transaction_id: paymentMethod === 'bkash' ? transactionId : null,
        total_amount: orderSummary.total,
        shipping_fee: orderSummary.shippingFee,
        discount_amount: orderSummary.discount,
        discount_id: appliedDiscount?.id || null,
        items: cartItems.map(item => ({
          book_id: item.book_id || item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch('http://localhost:3001/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Order placed successfully! Order ID: ${result.orderId}`);
        
        // Clear cart and navigate to order confirmation
        localStorage.removeItem('cartItems');
        navigate('/order-confirmation', { 
          state: { 
            orderId: result.orderId,
            orderDetails: orderData,
            total: orderSummary.total
          }
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading checkout...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6 flex items-center">
            <Button
              onClick={() => navigate('/cart')}
              variant="ghost"
            >
              <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Cart</span>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Checkout</h1>
            <p className="text-slate-600">Review your order and complete your purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                  <FaUser className="mr-3 text-emerald-600" />
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FaUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FaPhone className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
                    <FaMapMarkerAlt className="mr-3 text-emerald-600" />
                    Delivery Address
                  </h2>
                  <Button
                    onClick={() => setShowAddressModal(true)}
                    variant="outline"
                    size="sm"
                  >
                    <FaEdit className="mr-2 group-hover:scale-110 transition-transform" />
                    Manage Addresses
                  </Button>
                </div>

                {selectedAddress ? (
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {getAddressTypeIcon(selectedAddress.address_type)}
                          <span className="ml-2 font-medium text-slate-800 capitalize">
                            {selectedAddress.address_type} Address
                          </span>
                          {selectedAddress.is_default === 1 && (
                            <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600">{formatAddress(selectedAddress)}</p>
                      </div>
                      <Button
                        onClick={() => setShowAddressModal(true)}
                        variant="ghost"
                        size="sm"
                      >
                        <FaEdit className="group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                    <FaMapMarkerAlt className="text-4xl text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No address selected</p>
                    <Button
                      onClick={() => setShowAddressModal(true)}
                      variant="primary"
                      size="md"
                    >
                      <FaPlus className="mr-2 group-hover:scale-110 transition-transform" />
                      Select Address
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                  <FaCreditCard className="mr-3 text-emerald-600" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_delivery' 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-emerald-600"
                      />
                      <FaMoneyBillWave className="mr-3 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-slate-800">Cash on Delivery</h3>
                        <p className="text-sm text-slate-600">Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>

                  {/* bKash */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'bkash' 
                        ? 'border-pink-500 bg-pink-50' 
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    onClick={() => setPaymentMethod('bkash')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="bkash"
                        checked={paymentMethod === 'bkash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-pink-600"
                      />
                      <FaMobileAlt className="mr-3 text-pink-600" />
                      <div>
                        <h3 className="font-semibold text-slate-800">bKash</h3>
                        <p className="text-sm text-slate-600">Mobile payment solution</p>
                      </div>
                    </div>

                    {paymentMethod === 'bkash' && (
                      <div className="mt-4 pt-4 border-t border-pink-200">
                        <div className="bg-pink-100 border border-pink-300 rounded-lg p-4 mb-4">
                          <div className="flex items-start">
                            <FaExclamationTriangle className="text-pink-600 mt-1 mr-3 flex-shrink-0" />
                            <div className="text-left">
                              <h4 className="font-semibold text-pink-800 mb-2">Payment Instructions</h4>
                              <ol className="text-sm text-pink-700 space-y-1 text-left">
                                <li>1. Open your bKash app</li>
                                <li>2. Select "Send Money"</li>
                                <li>3. Send <strong>৳{orderSummary.total.toFixed(2)}</strong> to: <strong>01234-567890</strong></li>
                                <li>4. Enter the transaction ID below</li>
                              </ol>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Transaction ID *
                          </label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Enter bKash transaction ID"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required={paymentMethod === 'bkash'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-4">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                  <FaShoppingCart className="mr-3 text-emerald-600" />
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 py-2 border-b border-slate-100 last:border-b-0">
                      <img
                        src={item.thumbnail || item.cover_url || '/placeholder-book.jpg'}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>৳{orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center">
                      <FaShippingFast className="mr-1" />
                      Shipping
                    </span>
                    <span>৳{orderSummary.shippingFee.toFixed(2)}</span>
                  </div>
                  
                  {/* Discount Section */}
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        <FaTag className="mr-1" />
                        Discount ({appliedDiscount.code})
                      </span>
                      <span>-৳{orderSummary.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-lg font-semibold text-slate-800">
                    <span>Total</span>
                    <span>৳{orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Discount Code Section */}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                    <FaTag className="mr-2 text-emerald-600" />
                    Discount Code
                  </h3>
                  
                  {!appliedDiscount ? (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          placeholder="Enter discount code"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                        <Button
                          onClick={handleApplyDiscount}
                          disabled={discountLoading || !discountCode.trim()}
                          variant="primary"
                          size="sm"
                        >
                          {discountLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <FaCheck className="mr-1" />
                              Apply
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Enter a valid discount code to get savings on your order
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <FaPercentage className="text-green-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            {appliedDiscount.code} Applied
                          </p>
                          <p className="text-xs text-green-600">
                            {appliedDiscount.discountType === 'percentage' 
                              ? `${(appliedDiscount.percentage * 100).toFixed(0)}% off`
                              : `৳${appliedDiscount.value} off`
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleRemoveDiscount}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={placingOrder || !selectedAddress || !phoneNumber.trim() || (paymentMethod === 'bkash' && !transactionId.trim())}
                >
                  {placingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2 group-hover:scale-110 transition-transform" />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center mt-3">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Management Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Manage Addresses</h3>
                <Button
                  onClick={() => setShowAddressModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <FaTimes className="group-hover:scale-110 transition-transform" />
                </Button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <AddressManagement
                  addresses={addresses}
                  isAddingAddress={isAddingAddress}
                  editingAddressId={editingAddressId}
                  addressFormData={addressFormData}
                  isSavingAddress={isSavingAddress}
                  handleAddressChange={handleAddressChange}
                  startAddingAddress={startAddingAddress}
                  startEditingAddress={startEditingAddress}
                  cancelAddressEdit={cancelAddressEdit}
                  saveAddress={saveAddress}
                  deleteAddress={deleteAddress}
                  getAddressTypeIcon={getAddressTypeIcon}
                />
                
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">Select Address for Delivery</h4>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          selectedAddress?.id === address.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                        onClick={() => {
                          setSelectedAddress(address);
                          setShowAddressModal(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddress?.id === address.id}
                              onChange={() => setSelectedAddress(address)}
                              className="mr-3 text-emerald-600"
                            />
                            {getAddressTypeIcon(address.address_type)}
                            <span className="ml-2 font-medium capitalize">{address.address_type}</span>
                            {address.is_default === 1 && (
                              <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 ml-8">
                          {formatAddress(address)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CheckoutPage;
