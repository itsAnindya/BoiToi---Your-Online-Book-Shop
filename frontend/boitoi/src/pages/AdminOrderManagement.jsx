import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Calendar, 
  DollarSign, 
  User, 
  MapPin, 
  Package, 
  CreditCard, 
  Eye, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  ArrowUpDown,
  Filter,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Home,
  BookOpen,
  Hash,
  FileText
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import Button, { BackToAdminButton } from '../components/ui/Button';
import DefaultLayout from '../layouts/DefaultLayout';
import toast from 'react-hot-toast';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [paymentFilterStatus, setPaymentFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [updating, setUpdating] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Order status options based on database enum
  const orderStatusOptions = [
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 
    'cancelled', 'returned', 'refunded', 'on_hold'
  ];

  // Payment status options based on database enum
  const paymentStatusOptions = [
    'unpaid', 'pending', 'processing', 'paid', 'refunded', 
    'partially_refunded', 'failed', 'cancelled', 'chargeback'
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/orders`);
      
      if (!response.ok) {
        // If API is not ready, show sample data
        if (response.status === 404) {
          console.warn('Orders API not implemented yet, showing sample data');
          // Sample data with comprehensive order information
          const sampleOrders = [
            {
              id: 1001,
              user_id: 1,
              customer: {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+1234567890'
              },
              ordered_at: '2025-07-29T10:30:00Z',
              shipping_address: '123 Main Street, Apartment 4B, New York, NY 10001, United States',
              order_status: 'processing',
              shipping_fee: 40.00,
              total_amount: 285.97,
              status_updated_by: null,
              status_updated_at: null,
              payment: {
                id: 2001,
                payment_date: '2025-07-29T10:35:00Z',
                payment_method: 'Credit Card',
                amount: 285.97,
                payment_status: 'paid',
                transaction_id: 'TXN_1001_CC_789456'
              },
              books: [
                {
                  book_id: 101,
                  title: 'The Great Gatsby',
                  author: 'F. Scott Fitzgerald',
                  price: 15.99,
                  quantity: 2,
                  isbn: '978-0-7432-7356-5'
                },
                {
                  book_id: 102,
                  title: 'To Kill a Mockingbird',
                  author: 'Harper Lee',
                  price: 12.99,
                  quantity: 1,
                  isbn: '978-0-06-112008-4'
                },
                {
                  book_id: 103,
                  title: '1984',
                  author: 'George Orwell',
                  price: 13.99,
                  quantity: 3,
                  isbn: '978-0-452-28423-4'
                }
              ]
            },
            {
              id: 1002,
              user_id: 2,
              customer: {
                id: 2,
                name: 'Jane Smith',
                email: 'jane.smith@email.com',
                phone: '+1234567891'
              },
              ordered_at: '2025-07-28T15:45:00Z',
              shipping_address: '456 Oak Avenue, Suite 2A, Los Angeles, CA 90210, United States',
              order_status: 'shipped',
              shipping_fee: 40.00,
              total_amount: 167.96,
              status_updated_by: 1,
              status_updated_at: '2025-07-29T09:15:00Z',
              payment: {
                id: 2002,
                payment_date: '2025-07-28T15:50:00Z',
                payment_method: 'PayPal',
                amount: 167.96,
                payment_status: 'paid',
                transaction_id: 'TXN_1002_PP_123789'
              },
              books: [
                {
                  book_id: 104,
                  title: 'Pride and Prejudice',
                  author: 'Jane Austen',
                  price: 11.99,
                  quantity: 1,
                  isbn: '978-0-14-143951-8'
                },
                {
                  book_id: 105,
                  title: 'The Catcher in the Rye',
                  author: 'J.D. Salinger',
                  price: 14.99,
                  quantity: 2,
                  isbn: '978-0-316-76948-0'
                }
              ]
            },
            {
              id: 1003,
              user_id: 3,
              customer: {
                id: 3,
                name: 'Bob Johnson',
                email: 'bob.johnson@email.com',
                phone: '+1234567892'
              },
              ordered_at: '2025-07-27T12:20:00Z',
              shipping_address: '789 Pine Street, Unit 5, Chicago, IL 60601, United States',
              order_status: 'pending',
              shipping_fee: 40.00,
              total_amount: 92.97,
              status_updated_by: null,
              status_updated_at: null,
              payment: {
                id: 2003,
                payment_date: null,
                payment_method: 'Bank Transfer',
                amount: 92.97,
                payment_status: 'pending',
                transaction_id: null
              },
              books: [
                {
                  book_id: 106,
                  title: 'Lord of the Flies',
                  author: 'William Golding',
                  price: 12.99,
                  quantity: 1,
                  isbn: '978-0-571-05686-2'
                },
                {
                  book_id: 107,
                  title: 'Brave New World',
                  author: 'Aldous Huxley',
                  price: 13.99,
                  quantity: 3,
                  isbn: '978-0-06-085052-4'
                }
              ]
            },
            {
              id: 1004,
              user_id: 4,
              customer: {
                id: 4,
                name: 'Alice Brown',
                email: 'alice.brown@email.com',
                phone: '+1234567893'
              },
              ordered_at: '2025-07-26T18:30:00Z',
              shipping_address: '321 Elm Drive, Building B, Miami, FL 33101, United States',
              order_status: 'delivered',
              shipping_fee: 40.00,
              total_amount: 125.96,
              status_updated_by: 1,
              status_updated_at: '2025-07-28T14:20:00Z',
              payment: {
                id: 2004,
                payment_date: '2025-07-26T18:35:00Z',
                payment_method: 'Credit Card',
                amount: 125.96,
                payment_status: 'paid',
                transaction_id: 'TXN_1004_CC_456123'
              },
              books: [
                {
                  book_id: 108,
                  title: 'The Hobbit',
                  author: 'J.R.R. Tolkien',
                  price: 16.99,
                  quantity: 2,
                  isbn: '978-0-547-92822-7'
                },
                {
                  book_id: 109,
                  title: 'Fahrenheit 451',
                  author: 'Ray Bradbury',
                  price: 13.99,
                  quantity: 1,
                  isbn: '978-1-4516-7331-9'
                }
              ]
            },
            {
              id: 1005,
              user_id: 5,
              customer: {
                id: 5,
                name: 'Charlie Wilson',
                email: 'charlie.wilson@email.com',
                phone: '+1234567894'
              },
              ordered_at: '2025-07-25T14:15:00Z',
              shipping_address: '654 Maple Lane, House 12, Seattle, WA 98101, United States',
              order_status: 'cancelled',
              shipping_fee: 40.00,
              total_amount: 78.97,
              status_updated_by: 2,
              status_updated_at: '2025-07-26T10:30:00Z',
              payment: {
                id: 2005,
                payment_date: '2025-07-25T14:20:00Z',
                payment_method: 'Credit Card',
                amount: 78.97,
                payment_status: 'refunded',
                transaction_id: 'TXN_1005_CC_789123'
              },
              books: [
                {
                  book_id: 110,
                  title: 'Of Mice and Men',
                  author: 'John Steinbeck',
                  price: 11.99,
                  quantity: 1,
                  isbn: '978-0-14-017739-8'
                },
                {
                  book_id: 111,
                  title: 'The Grapes of Wrath',
                  author: 'John Steinbeck',
                  price: 15.99,
                  quantity: 2,
                  isbn: '978-0-14-303943-3'
                }
              ]
            }
          ];
          setOrders(sampleOrders);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders: ' + error.message);
      // Set empty array on error
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || (!newOrderStatus && !newPaymentStatus)) {
      toast.error('Please select at least one status to update');
      return;
    }

    setUpdating(true);
    try {
      const adminId = sessionStorage.getItem('id');
      const response = await fetch(`${API_BASE_URL}/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: adminId,
          order_status: newOrderStatus || selectedOrder.order_status,
          payment_status: newPaymentStatus || selectedOrder.payment?.payment_status
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      
      toast.success('Order status updated successfully!');
      fetchOrders();
      setShowStatusModal(false);
      setNewOrderStatus('');
      setNewPaymentStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      case 'on_hold':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      case 'partially_refunded':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'chargeback':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'returned':
        return <ArrowUpDown className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      if (!order) return false;
      const matchesOrderStatus = filterStatus === 'all' || order.order_status?.toLowerCase() === filterStatus;
      const matchesPaymentStatus = paymentFilterStatus === 'all' || order.payment?.payment_status?.toLowerCase() === paymentFilterStatus;
      const matchesSearch = searchTerm === '' || 
        order.id?.toString().includes(searchTerm) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.payment?.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesOrderStatus && matchesPaymentStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.ordered_at || 0) - new Date(a.ordered_at || 0);
        case 'oldest':
          return new Date(a.ordered_at || 0) - new Date(b.ordered_at || 0);
        case 'amount_high':
          return (b.total_amount || 0) - (a.total_amount || 0);
        case 'amount_low':
          return (a.total_amount || 0) - (b.total_amount || 0);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '৳0';
    try {
      return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0
      }).format(price);
    } catch (error) {
      return `৳${price || 0}`;
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.order_status || '');
    setNewPaymentStatus(order.payment?.payment_status || '');
    setShowStatusModal(true);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading orders...</p>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <BackToAdminButton />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <ShoppingCart className="mr-3 text-primary-600" />
                  Order Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage customer orders, payments, and shipping status
                </p>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <Button
                onClick={fetchOrders}
                variant="outline"
                className="ml-4"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <ShoppingCart className="text-blue-600 text-xl w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="text-green-600 text-xl w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatPrice(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="text-yellow-600 text-xl w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {orders.filter(order => order.order_status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <CheckCircle className="text-purple-600 text-xl w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {orders.filter(order => order.order_status === 'delivered').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Order Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                >
                  <option value="all">All Order Status</option>
                  {orderStatusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Status Filter */}
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={paymentFilterStatus}
                  onChange={(e) => setPaymentFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                >
                  <option value="all">All Payment Status</option>
                  {paymentStatusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount_high">Amount (High to Low)</option>
                  <option value="amount_low">Amount (Low to High)</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-center md:justify-end">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedOrders.length} of {orders.length} orders
                </span>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Mobile Cards for small screens */}
            <div className="md:hidden">
              {filteredAndSortedOrders.map((order) => (
                <div key={order.id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">#{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.customer?.name}</p>
                      <p className="text-xs text-gray-500">{order.customer?.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.order_status)}`}>
                      {order.order_status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <p className="font-medium">{formatPrice(order.total_amount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(order.payment?.payment_status)}`}>
                        {order.payment?.payment_status?.replace('_', ' ').toUpperCase() || 'UNPAID'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    {formatDate(order.ordered_at)}
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <Button
                      onClick={() => openOrderModal(order)}
                      variant="ghost"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>View</span>
                    </Button>
                    <Button
                      onClick={() => openStatusModal(order)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span>Update</span>
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredAndSortedOrders.length === 0 && (
                <div className="p-8 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all' || paymentFilterStatus !== 'all'
                      ? 'Try adjusting your search or filter criteria' 
                      : 'No orders have been placed yet'}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getOrderStatusIcon(order.order_status)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              #{order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.books?.length || 0} book(s)
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total_amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Shipping: {formatPrice(order.shipping_fee)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.order_status)}`}>
                          {order.order_status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment?.payment_status)}`}>
                          {order.payment?.payment_status?.replace('_', ' ').toUpperCase() || 'UNPAID'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(order.ordered_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            onClick={() => openOrderModal(order)}
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>View</span>
                          </Button>
                          <Button
                            onClick={() => openStatusModal(order)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span>Update</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedOrders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500">
                          {searchTerm || filterStatus !== 'all' || paymentFilterStatus !== 'all'
                            ? 'Try adjusting your search or filter criteria' 
                            : 'No orders have been placed yet'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Details Modal */}
          {showModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Order Details - #{selectedOrder.id}
                    </h3>
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="ghost"
                      size="sm"
                    >
                      <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    </Button>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Information */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Order Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600 w-20">Order ID:</span>
                          <span className="text-sm font-medium">#{selectedOrder.id}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600 w-20">Date:</span>
                          <span className="text-sm">{formatDate(selectedOrder.ordered_at)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600 w-20">Total:</span>
                          <span className="text-sm font-medium">{formatPrice(selectedOrder.total_amount)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600 w-20">Shipping:</span>
                          <span className="text-sm">{formatPrice(selectedOrder.shipping_fee)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-3"></div>
                          <span className="text-sm text-gray-600 w-20">Status:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(selectedOrder.order_status)}`}>
                            {selectedOrder.order_status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                          </span>
                        </div>

                        {selectedOrder.status_updated_at && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-600 w-20">Updated:</span>
                            <span className="text-sm">{formatDate(selectedOrder.status_updated_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Customer Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600 w-20">Name:</span>
                          <span className="text-sm font-medium">{selectedOrder.customer?.name}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600 w-20">Email:</span>
                          <span className="text-sm">{selectedOrder.customer?.email}</span>
                        </div>

                        {selectedOrder.customer?.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-600 w-20">Phone:</span>
                            <span className="text-sm">{selectedOrder.customer?.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                          <span className="text-sm text-gray-600 w-20">Address:</span>
                          <span className="text-sm flex-1">{selectedOrder.shipping_address || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  {selectedOrder.payment && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 border-b pb-2 mb-4">Payment Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <span className="text-sm text-gray-600">Method:</span>
                            <p className="text-sm font-medium">{selectedOrder.payment.payment_method || 'Not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-3"></div>
                          <div>
                            <span className="text-sm text-gray-600">Status:</span>
                            <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.payment.payment_status)}`}>
                              {selectedOrder.payment.payment_status?.replace('_', ' ').toUpperCase() || 'UNPAID'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <span className="text-sm text-gray-600">Amount:</span>
                            <p className="text-sm font-medium">{formatPrice(selectedOrder.payment.amount)}</p>
                          </div>
                        </div>

                        {selectedOrder.payment.payment_date && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                              <span className="text-sm text-gray-600">Payment Date:</span>
                              <p className="text-sm">{formatDate(selectedOrder.payment.payment_date)}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedOrder.payment.transaction_id && (
                          <div className="flex items-center">
                            <Hash className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                              <span className="text-sm text-gray-600">Transaction ID:</span>
                              <p className="text-sm font-mono text-blue-600">{selectedOrder.payment.transaction_id}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  {selectedOrder.books && selectedOrder.books.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 border-b pb-2 mb-4">Order Items</h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedOrder.books.map((book, index) => (
                                <tr key={book.book_id || index} className="hover:bg-gray-75">
                                  <td className="px-4 py-3">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                      {book.isbn && (
                                        <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{book.author}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{formatPrice(book.price)}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{book.quantity}</td>
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {formatPrice(book.price * book.quantity)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-100">
                              <tr>
                                <td colSpan="4" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                  Subtotal:
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {formatPrice(selectedOrder.books.reduce((sum, book) => sum + (book.price * book.quantity), 0))}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="4" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                  Shipping:
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {formatPrice(selectedOrder.shipping_fee)}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="4" className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                                  Total:
                                </td>
                                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                  {formatPrice(selectedOrder.total_amount)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="neutral"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setShowModal(false);
                        openStatusModal(selectedOrder);
                      }}
                      variant="primary"
                    >
                      <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span>Update Status</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Update Modal */}
          {showStatusModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Update Order Status
                    </h3>
                    <Button
                      onClick={() => setShowStatusModal(false)}
                      variant="ghost"
                      size="sm"
                    >
                      <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    </Button>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Update the status for Order #{selectedOrder.id}
                  </p>

                  <div className="space-y-4">
                    {/* Order Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Status
                      </label>
                      <select
                        value={newOrderStatus}
                        onChange={(e) => setNewOrderStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {orderStatusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Status
                      </label>
                      <select
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {paymentStatusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => setShowStatusModal(false)}
                      variant="neutral"
                      disabled={updating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStatusUpdate}
                      variant="primary"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Update Status
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminOrderManagement;
