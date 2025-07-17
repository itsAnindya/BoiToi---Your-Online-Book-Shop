import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, ThumbsUp, ThumbsDown, Building, User, Calendar, DollarSign, BookOpen, Hash, Globe } from 'lucide-react';
import { API_BASE_URL } from '../config';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const AdminBookRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-requests`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch book requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const adminId = sessionStorage.getItem('id');
      const response = await fetch(`${API_BASE_URL}/api/admin/book-requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_id: adminId })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      
      toast.success('Book request approved successfully!');
      fetchRequests();
      setShowModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const adminId = sessionStorage.getItem('id');
      const response = await fetch(`${API_BASE_URL}/api/admin/book-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          admin_id: adminId,
          rejection_reason: rejectionReason
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      
      toast.success('Book request rejected successfully!');
      fetchRequests();
      setShowRejectionModal(false);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.STATUS === filterStatus.toUpperCase();
  });

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const openRejectionModal = (request) => {
    setSelectedRequest(request);
    setShowRejectionModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Book Contribution Requests</h1>
          <p className="text-neutral-600">Review and manage publisher book submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Total Requests</p>
              <p className="text-2xl font-bold text-neutral-900">{requests.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.STATUS === 'PENDING').length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.STATUS === 'APPROVED').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{requests.filter(r => r.STATUS === 'REJECTED').length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Publisher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-neutral-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                    <p>No book requests found</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.ID} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{request.TITLE}</div>
                          <div className="text-sm text-neutral-500">ISBN: {request.ISBN}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{request.PUBLISHER_NAME}</div>
                      <div className="text-sm text-neutral-500">{request.PUBLISHER_EMAIL}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.STATUS)}`}>
                        {getStatusIcon(request.STATUS)}
                        <span>{request.STATUS}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(request.SUBMITTED_AT).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => openRequestModal(request)}
                          variant="outline"
                          size="xs"
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Button>
                        {request.STATUS === 'PENDING' && (
                          <>
                            <Button
                              onClick={() => handleApprove(request.ID)}
                              variant="success"
                              size="xs"
                              className="flex items-center space-x-1"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              onClick={() => openRejectionModal(request)}
                              variant="danger"
                              size="xs"
                              className="flex items-center space-x-1"
                            >
                              <ThumbsDown className="w-3 h-3" />
                              <span>Reject</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-900">Book Request Details</h2>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="ghost"
                  size="sm"
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Book Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Book Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">Title</p>
                          <p className="font-medium">{selectedRequest.TITLE}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Hash className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">ISBN</p>
                          <p className="font-medium">{selectedRequest.ISBN}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">Price</p>
                          <p className="font-medium">${selectedRequest.PRICE}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">Genre</p>
                          <p className="font-medium">{selectedRequest.GENRE || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">Page Count</p>
                          <p className="font-medium">{selectedRequest.PAGE_COUNT || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">Language</p>
                          <p className="font-medium">{selectedRequest.LANGUAGE || 'English'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedRequest.DESCRIPTION && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-2">Description</h4>
                      <p className="text-sm text-neutral-600">{selectedRequest.DESCRIPTION}</p>
                    </div>
                  )}
                </div>

                {/* Publisher & Status Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Publisher Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">Publisher Name</p>
                          <p className="font-medium">{selectedRequest.PUBLISHER_NAME}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">Contact Email</p>
                          <p className="font-medium">{selectedRequest.PUBLISHER_EMAIL}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Request Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(selectedRequest.STATUS)}
                        <div>
                          <p className="text-sm text-neutral-500">Status</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.STATUS)}`}>
                            {selectedRequest.STATUS}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-sm text-neutral-500">Submitted</p>
                          <p className="font-medium">{new Date(selectedRequest.SUBMITTED_AT).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {selectedRequest.REVIEWED_AT && (
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-neutral-500" />
                          <div>
                            <p className="text-sm text-neutral-500">Reviewed</p>
                            <p className="font-medium">{new Date(selectedRequest.REVIEWED_AT).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      {selectedRequest.REVIEWED_BY_USERNAME && (
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-neutral-500" />
                          <div>
                            <p className="text-sm text-neutral-500">Reviewed By</p>
                            <p className="font-medium">{selectedRequest.REVIEWED_BY_USERNAME}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedRequest.COVER_URL && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-2">Book Cover</h4>
                      <img 
                        src={selectedRequest.COVER_URL} 
                        alt="Book Cover" 
                        className="w-32 h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedRequest.STATUS === 'PENDING' && (
                <div className="mt-8 flex justify-end space-x-4">
                  <Button
                    onClick={() => openRejectionModal(selectedRequest)}
                    variant="danger"
                    className="flex items-center space-x-2"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Reject Request</span>
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.ID)}
                    variant="success"
                    className="flex items-center space-x-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Approve & Add to Catalog</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-neutral-900">Reject Request</h2>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-neutral-600 mb-4">
                Please provide a reason for rejecting this book request:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows="4"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              
              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReject(selectedRequest.ID)}
                  variant="danger"
                  disabled={!rejectionReason.trim()}
                >
                  Reject Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookRequests;
