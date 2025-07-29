import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Calendar, 
  DollarSign, 
  User, 
  Tag, 
  Eye, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowUpDown,
  Filter,
  Search,
  RefreshCw,
  Plus,
  Hash,
  FileText,
  Activity,
  TrendingUp,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import Button, { BackToAdminButton } from '../components/ui/Button';
import DefaultLayout from '../layouts/DefaultLayout';
import toast from 'react-hot-toast';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [updating, setUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Form state for creating/editing discounts
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    percentage: '',
    value: '',
    startedAt: '',
    endedAt: '',
    maxUsage: '',
    minExpense: ''
  });

  const discountStatusOptions = ['active', 'inactive', 'expired'];

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [filterStatus, sortBy]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      if (filterStatus !== 'all') {
        queryParams.append('status', filterStatus);
      }
      queryParams.append('sort', sortBy);
      queryParams.append('limit', '100');
      
      const url = `${API_BASE_URL}/api/admin/discounts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDiscounts(data.data?.discounts || []);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.message || 'Failed to fetch discounts');
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast.error(`Failed to load discounts: ${error.message}`);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscount = async () => {
    try {
      setUpdating(true);
      
      // Prepare form data with percentage conversion
      const submissionData = { ...formData };
      
      // Convert percentage from 0-100 range to 0-1 range for database
      if (formData.discountType === 'percentage' && formData.percentage) {
        submissionData.percentage = parseFloat(formData.percentage) / 100;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/discounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Discount created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchDiscounts();
      } else {
        throw new Error(data.message || 'Failed to create discount');
      }
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error(`Failed to create discount: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (discountId, currentStatus) => {
    try {
      setUpdating(true);
      const action = currentStatus === 'active' ? 'deactivate' : 'activate';
      
      const response = await fetch(`${API_BASE_URL}/api/admin/discounts/${discountId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Discount ${action}d successfully!`);
        fetchDiscounts();
      } else {
        throw new Error(data.message || 'Failed to update discount status');
      }
    } catch (error) {
      console.error('Error updating discount status:', error);
      toast.error(`Failed to update status: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      percentage: '',
      value: '',
      startedAt: '',
      endedAt: '',
      maxUsage: '',
      minExpense: ''
    });
  };

  const getDiscountStatus = (discount) => {
    const now = new Date();
    const startDate = new Date(discount.started_at);
    const endDate = new Date(discount.ended_at);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    if (discount.times_used >= discount.max_usage) return 'exhausted';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'exhausted': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredDiscounts = discounts
    .filter(discount => {
      if (searchTerm) {
        return discount.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               discount.description?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter(discount => {
      if (filterStatus === 'all') return true;
      return getDiscountStatus(discount) === filterStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.added_at) - new Date(a.added_at);
        case 'oldest':
          return new Date(a.added_at) - new Date(b.added_at);
        case 'usage_high':
          return (b.times_used || 0) - (a.times_used || 0);
        case 'usage_low':
          return (a.times_used || 0) - (b.times_used || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading discounts...</p>
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
                  <Percent className="mr-3 text-primary-600" />
                  Discount Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Create, manage, and monitor discount codes and promotions
                </p>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={fetchDiscounts}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  <span>Refresh</span>
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Discount</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Tag className="text-blue-600 text-xl w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Discounts</p>
                  <p className="text-2xl font-semibold text-gray-900">{discounts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="text-green-600 text-xl w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Discounts</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {discounts.filter(d => getDiscountStatus(d) === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <TrendingUp className="text-orange-600 text-xl w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Usage</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {discounts.reduce((sum, d) => sum + (d.times_used || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="text-red-600 text-xl w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {discounts.filter(d => getDiscountStatus(d) === 'expired').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by code or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full md:w-64"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="exhausted">Exhausted</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="text-gray-400 w-4 h-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="usage_high">Most Used</option>
                    <option value="usage_low">Least Used</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Discounts Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code & Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDiscounts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Tag className="w-12 h-12 text-gray-300 mb-4" />
                          <p className="text-lg font-medium">No discounts found</p>
                          <p className="text-sm">Create your first discount to get started</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDiscounts.map((discount) => {
                      const status = getDiscountStatus(discount);
                      return (
                        <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="flex items-center">
                                <Hash className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">
                                  {discount.code}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {discount.description || 'No description'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {discount.discount_type === 'percentage' ? (
                                <div className="flex items-center text-green-600">
                                  <Percent className="w-4 h-4 mr-1" />
                                  <span className="font-medium">{(discount.percentage * 100).toFixed(0)}%</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-blue-600">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span className="font-medium">৳{discount.value}</span>
                                </div>
                              )}
                            </div>
                            {discount.min_expense && (
                              <div className="text-xs text-gray-500 mt-1">
                                Min: ৳{discount.min_expense}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div>{formatDate(discount.started_at)}</div>
                                <div className="text-gray-500">to {formatDate(discount.ended_at)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Activity className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div className="font-medium">
                                  {discount.times_used || 0} / {discount.max_usage || '∞'}
                                </div>
                                {discount.max_usage && (
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div 
                                      className="bg-primary-600 h-2 rounded-full" 
                                      style={{
                                        width: `${Math.min(100, ((discount.times_used || 0) / discount.max_usage) * 100)}%`
                                      }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => {
                                  setSelectedDiscount(discount);
                                  setShowModal(true);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-primary-600 hover:text-primary-700"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleToggleStatus(discount.id, status)}
                                variant={status === 'active' ? 'danger' : 'success'}
                                size="sm"
                                disabled={updating || status === 'expired'}
                              >
                                {status === 'active' ? (
                                  <>
                                    <XCircle className="w-4 h-4" />
                                    <span>Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Activate</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Discount Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Plus className="mr-3 text-primary-600" />
                      Create New Discount
                    </h2>
                    <Button
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Code *
                        </label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                          placeholder="e.g., SAVE20"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Type *
                        </label>
                        <select
                          value={formData.discountType}
                          onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe this discount..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    {/* Discount Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.discountType === 'percentage' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Percentage (0-100) *
                          </label>
                          <input
                            type="number"
                            value={formData.percentage}
                            onChange={(e) => setFormData({...formData, percentage: e.target.value})}
                            placeholder="e.g., 20 (for 20%)"
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter a value between 0 and 100</p>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fixed Amount (৳) *
                          </label>
                          <input
                            type="number"
                            value={formData.value}
                            onChange={(e) => setFormData({...formData, value: e.target.value})}
                            placeholder="e.g., 100.00"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Order Amount (৳)
                        </label>
                        <input
                          type="number"
                          value={formData.minExpense}
                          onChange={(e) => setFormData({...formData, minExpense: e.target.value})}
                          placeholder="e.g., 500.00"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.startedAt}
                          onChange={(e) => setFormData({...formData, startedAt: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.endedAt}
                          onChange={(e) => setFormData({...formData, endedAt: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Usage Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Usage Count
                      </label>
                      <input
                        type="number"
                        value={formData.maxUsage}
                        onChange={(e) => setFormData({...formData, maxUsage: e.target.value})}
                        placeholder="Leave empty for unlimited usage"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8">
                    <Button
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      variant="outline"
                      disabled={updating}
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </Button>
                    <Button
                      onClick={handleCreateDiscount}
                      variant="primary"
                      disabled={updating || !formData.code || !formData.startedAt || !formData.endedAt}
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Create Discount</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Discount Modal */}
          {showModal && selectedDiscount && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Eye className="mr-3 text-primary-600" />
                      Discount Details
                    </h2>
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getDiscountStatus(selectedDiscount))}`}>
                        {getDiscountStatus(selectedDiscount).charAt(0).toUpperCase() + getDiscountStatus(selectedDiscount).slice(1)}
                      </span>
                      <div className="text-sm text-gray-500">
                        ID: #{selectedDiscount.id}
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Code:</span>
                            <div className="text-lg font-bold text-gray-900">{selectedDiscount.code}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Description:</span>
                            <div className="text-gray-900">{selectedDiscount.description || 'No description'}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Type:</span>
                            <div className="text-gray-900 capitalize">{selectedDiscount.discount_type}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Value</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Amount:</span>
                            <div className="text-lg font-bold text-green-600">
                              {selectedDiscount.discount_type === 'percentage' 
                                ? `${(selectedDiscount.percentage * 100).toFixed(0)}%` 
                                : `৳${selectedDiscount.value}`}
                            </div>
                          </div>
                          {selectedDiscount.min_expense && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Minimum Order:</span>
                              <div className="text-gray-900">৳{selectedDiscount.min_expense}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Usage & Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Times Used:</span>
                            <div className="text-gray-900">{selectedDiscount.times_used || 0}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Usage Limit:</span>
                            <div className="text-gray-900">{selectedDiscount.max_usage || 'Unlimited'}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Date Range</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Start Date:</span>
                            <div className="text-gray-900">
                              {new Date(selectedDiscount.started_at).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">End Date:</span>
                            <div className="text-gray-900">
                              {new Date(selectedDiscount.ended_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="outline"
                    >
                      <span>Close</span>
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

export default DiscountManagement;
