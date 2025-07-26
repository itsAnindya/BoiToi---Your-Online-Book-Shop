import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaBook, FaPlus, FaUser, FaChartBar, FaSignOutAlt, FaBuilding, FaEye, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL } from '../config';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const PublisherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publisher, setPublisher] = useState(null);
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if publisher is logged in - check both new and old session storage formats
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const publisherId = sessionStorage.getItem('publisherId') || user.id;
    const publisherName = sessionStorage.getItem('publisherName') || user.name;

    if (!publisherId || !publisherName) {
      toast.error('Please log in as a publisher');
      navigate('/auth');
      return;
    }

    // Verify that the logged-in publisher matches the dashboard ID
    if (publisherId !== id) {
      toast.error('Access denied. You can only view your own dashboard.');
      navigate('/auth');
      return;
    }

    // Check if user is actually a publisher
    if (user.role !== 'publisher' && sessionStorage.getItem('userType') !== 'publisher') {
      toast.error('Access denied. Publisher access required.');
      navigate('/auth');
      return;
    }

    fetchPublisherData();
  }, [id, navigate]);

  const fetchPublisherData = async () => {
    try {
      // Fetch publisher profile
      const profileResponse = await fetch(`${API_BASE_URL}/api/publisher/${id}/profile`);
      const profileData = await profileResponse.json();

      if (profileResponse.ok) {
        setPublisher(profileData);
      }

      // Fetch publisher stats
      const statsResponse = await fetch(`${API_BASE_URL}/api/publisher/stats/${id}`);
      const statsData = await statsResponse.json();

      if (statsResponse.ok) {
        setStats(statsData);
      }

      // Fetch publisher requests
      const requestsResponse = await fetch(`${API_BASE_URL}/api/publisher/${id}/book-requests`);
      const requestsData = await requestsResponse.json();

      if (requestsResponse.ok) {
        setRequests(requestsData);
      }

    } catch (error) {
      console.error('Error fetching publisher data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all session storage items
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');

    // Clear publisher session data
    sessionStorage.removeItem('publisherId');
    sessionStorage.removeItem('publisherName');
    sessionStorage.removeItem('publisherEmail');
    sessionStorage.removeItem('publisherRole');
    sessionStorage.removeItem('publisherToken');
    sessionStorage.removeItem('userType');

    toast.success('Logged out successfully');
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back Button */}
        <div
          className="mb-6 flex items-center"
        >
          <Button
            onClick={() => navigate('/')}
            // className="flex items-center space-x-2 text-white hover:text-gray-800 transition-colors group"
            variant="ghost"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaBuilding className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {publisher?.NAME || 'Publisher Dashboard'}
                </h1>
                <p className="text-gray-600">Manage your book contributions and submissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={`/publisher/${id}/submit-book`}
              // className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Button variant='secondary'>
                  <FaPlus className="text-sm group-hover:-translate-x-1 transition-transform" />
                  <span>Submit Book</span>
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                // className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                variant='primary'
              >
                <FaSignOutAlt className="text-sm group-hover:-translate-x-1 transition-transform" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests || 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaBook className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests || 0}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaChartBar className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approvedRequests || 0}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaBook className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejectedRequests || 0}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <FaBook className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Book Requests</h2>
          </div>
          <div className="p-6">
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <FaBook className="mx-auto text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">No book requests yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Submit your first book to get started!
                </p>
                <Link
                  to={`/publisher/${id}/submit-book`}
                  // className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  className='mt-4 px-4 py-2 inline-block'
                >
                  <Button variant='neutral'>
                    Submit Book
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ISBN
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Publication Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.slice(0, 10).map((request) => (
                      <tr key={request.ID} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.TITLE || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {request.ISBN || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {request.PUBLISHED_DATE ? (() => {
                              const dateStr = request.PUBLISHED_DATE.split('T')[0];
                              const [year, month, day] = dateStr.split('-');
                              const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                              return `${day.padStart(2, '0')} ${months[parseInt(month) - 1]}, ${year}`;
                            })() : 'Not specified'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${request.PRICE || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.STATUS)}`}>
                            {request.STATUS}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.SUBMITTED_AT).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            // className="text-blue-600 hover:text-blue-900 mr-3"
                            variant="primary"
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          {request.STATUS === 'PENDING' && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Edit Request"
                            >
                              <FaEdit />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Publisher Info */}
        {publisher && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publisher Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-gray-900">{publisher.NAME}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900">{publisher.EMAIL || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900">{publisher.PHONE || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Website</p>
                <p className="text-gray-900">{publisher.WEBSITE || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${publisher.STATUS === 'ACTIVE' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                  }`}>
                  {publisher.STATUS}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-gray-900">
                  {new Date(publisher.CREATED_AT).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherDashboard;
