import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaBook, 
  FaUser, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaEye,
  FaFileAlt,
  FaDollarSign,
  FaHashtag,
  FaGlobe
} from 'react-icons/fa';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const BookRequestsManagement = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-requests/pending`);
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data);
      } else {
        throw new Error(data.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load book requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setNotes('');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;

    // Validate notes for rejection
    if (actionType === 'reject' && !notes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);

    try {
      const adminId = sessionStorage.getItem('id'); // Get admin ID from session
      const endpoint = actionType === 'approve' ? 'approve' : 'reject';
      
      const response = await fetch(`${API_BASE_URL}/api/admin/book-requests/${selectedRequest.ID}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: parseInt(adminId),
          notes: notes.trim() || (actionType === 'approve' ? 'Request approved' : 'Request rejected')
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
        setShowModal(false);
        setSelectedRequest(null);
        setNotes('');
        // Refresh the requests list
        fetchPendingRequests();
      } else {
        throw new Error(data.message || `Failed to ${actionType} request`);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      toast.error(error.message || `Failed to ${actionType} request`);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              onClick={() => navigate('/admin')}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 mb-4"
            >
              <FaArrowLeft className="text-sm" />
              Back to Admin Panel
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Book Requests Management</h1>
                <p className="text-gray-600 mt-2">
                  Review and manage book contribution requests from publishers
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-primary-600">{requests.length}</p>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pending Book Requests</h2>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FaBook className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-600">All book requests have been processed.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <div key={request.ID} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{request.TITLE}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.STATUS)}`}>
                            <FaClock className="inline mr-1" />
                            {request.STATUS}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            <span className="text-sm">
                              <strong>Publisher:</strong> {request.PUBLISHER_NAME}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaHashtag className="text-gray-400" />
                            <span className="text-sm">
                              <strong>ISBN:</strong> {request.ISBN}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaDollarSign className="text-gray-400" />
                            <span className="text-sm">
                              <strong>Price:</strong> {formatPrice(request.PRICE)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaFileAlt className="text-gray-400" />
                            <span className="text-sm">
                              <strong>Genre:</strong> {request.GENRE}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <span className="text-sm">
                              <strong>Submitted:</strong> {formatDate(request.SUBMITTED_AT)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaGlobe className="text-gray-400" />
                            <span className="text-sm">
                              <strong>Language:</strong> {request.LANGUAGE}
                            </span>
                          </div>
                        </div>

                        {request.DESCRIPTION && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">
                              <strong>Description:</strong> {request.DESCRIPTION}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleAction(request, 'approve')}
                            variant="success"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <FaCheckCircle />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleAction(request, 'reject')}
                            variant="danger"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <FaTimesCircle />
                            Reject
                          </Button>
                        </div>
                      </div>

                      {request.COVER_URL && (
                        <div className="ml-6 flex-shrink-0">
                          <img
                            src={request.COVER_URL}
                            alt={request.TITLE}
                            className="w-20 h-28 object-cover rounded border"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {actionType === 'approve' ? 'Approve' : 'Reject'} Book Request
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Book:</strong> {selectedRequest.TITLE}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Publisher:</strong> {selectedRequest.PUBLISHER_NAME}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {actionType === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={actionType === 'approve' ? 'Enter approval notes...' : 'Enter rejection reason...'}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    size="sm"
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmAction}
                    variant={actionType === 'approve' ? 'success' : 'danger'}
                    size="sm"
                    disabled={processing}
                    className="flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {actionType === 'approve' ? <FaCheckCircle /> : <FaTimesCircle />}
                        {actionType === 'approve' ? 'Approve' : 'Reject'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default BookRequestsManagement;
