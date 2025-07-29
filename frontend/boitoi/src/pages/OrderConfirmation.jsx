import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome, FaEye } from 'react-icons/fa';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order details from navigation state
  const { orderId, orderDetails, total } = location.state || {};

  // Redirect if no order data
  if (!orderId) {
    navigate('/');
    return null;
  }

  const formatPrice = (price) => {
    return `৳${parseFloat(price || 0).toFixed(2)}`;
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
              <FaCheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              🎉 Order Placed Successfully!
            </h1>
            <p className="text-slate-600 text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
            <div className="border-b border-slate-200 pb-6 mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Order ID</p>
                  <p className="text-lg font-semibold text-slate-800">#{orderId}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Order Date</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Payment Method</p>
                  <p className="text-lg font-semibold text-slate-800 capitalize">
                    {orderDetails?.payment_method?.replace('_', ' ') || 'Cash on Delivery'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatPrice(total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {orderDetails?.shipping_address && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Shipping Address</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700">{orderDetails.shipping_address}</p>
                </div>
              </div>
            )}

            {/* bKash Transaction Info */}
            {orderDetails?.payment_method === 'bkash' && orderDetails?.transaction_id && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Payment Information</h3>
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <p className="text-sm text-slate-600 mb-1">bKash Transaction ID</p>
                  <p className="text-lg font-semibold text-pink-700 font-mono">
                    {orderDetails.transaction_id}
                  </p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  You'll receive an email confirmation shortly
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Your order will be processed within 1-2 business days
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  You can track your order status in "My Orders"
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Estimated delivery: 3-5 business days
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/orders')}
              variant="primary"
              size="lg"
              className="px-8"
            >
              <FaEye className="mr-2" />
              View My Orders
            </Button>
            
            <Button
              onClick={() => navigate('/books')}
              variant="outline"
              size="lg"
              className="px-8"
            >
              <FaShoppingBag className="mr-2" />
              Continue Shopping
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="lg"
              className="px-8"
            >
              <FaHome className="mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-8">
            <p className="text-slate-600 text-sm">
              Need help with your order?{' '}
              <Link to="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderConfirmation;
