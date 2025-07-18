import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import {
  FaUsers,
  FaBook,
  FaShoppingCart,
  FaChartBar,
  FaCogs,
  FaDatabase,
  FaUserShield,
  FaStore,
  FaArrowLeft,
  FaClipboardList
} from 'react-icons/fa';
import Button from '../components/ui/Button';

const AdminControlPanel = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useCart();
  const user = getCurrentUser();

  // Redirect if user is not admin
  useEffect(() => {
    if (!user?.id) {
      navigate('/auth');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Don't render if not admin
  if (!user?.id || user.role !== 'admin') {
    return null;
  }

  const adminSections = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage user accounts, permissions, and access',
      icon: FaUsers,
      color: 'bg-primary-500',
      link: '/admin/users'
    },
    {
      id: 'books',
      title: 'Book Management',
      description: 'Add, edit, and manage book inventory',
      icon: FaBook,
      color: 'bg-green-500',
      link: '/admin/books'
    },
    {
      id: 'book-requests',
      title: 'Book Requests',
      description: 'Review and approve publisher book submissions',
      icon: FaClipboardList,
      color: 'bg-blue-500',
      link: '/admin/book-requests'
    },
    {
      id: 'orders',
      title: 'Order Management',
      description: 'View and manage customer orders',
      icon: FaShoppingCart,
      color: 'bg-purple-500',
      link: '/admin/orders'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'View sales reports and analytics',
      icon: FaChartBar,
      color: 'bg-yellow-500',
      link: '/admin/analytics'
    },
    {
      id: 'categories',
      title: 'Category Management',
      description: 'Manage book categories and genres',
      icon: FaStore,
      color: 'bg-indigo-500',
      link: '/admin/categories'
    },
    {
      id: 'admins',
      title: 'Admin Management',
      description: 'Manage admin users and permissions',
      icon: FaUserShield,
      color: 'bg-red-500',
      link: '/admin/admins'
    },
    {
      id: 'database',
      title: 'Database Tools',
      description: 'Database maintenance and backup tools',
      icon: FaDatabase,
      color: 'bg-gray-500',
      link: '/admin/database'
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: FaCogs,
      color: 'bg-orange-500',
      link: '/admin/settings'
    }
  ];

  const handleSectionClick = (link) => {
    // Book requests page is implemented
    if (link === '/admin/book-requests') {
      navigate('/admin/book-requests');
      return;
    }

    // For other features, show placeholder message
    alert(`This feature will be implemented soon!\nRedirect: ${link}`);
  };

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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, <span className="font-semibold">{user.username}</span>.
                Manage your BoiToi bookstore from here.
              </p>
            </div>
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              <FaUserShield className="inline mr-2" />
              Administrator
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <FaUsers className="text-primary-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaBook className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-semibold text-gray-900">5,678</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaShoppingCart className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">892</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FaChartBar className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">৳45,321</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div
                key={section.id}
                onClick={() => handleSectionClick(section.link)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${section.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="text-white text-xl" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {section.description}
                  </p>
                </div>
                <div className="px-6 pb-4">
                  <div className="text-primary-600 text-sm font-medium group-hover:underline">
                    Manage →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-gray-500 text-center py-8">
              <FaChartBar className="mx-auto text-4xl mb-4 text-gray-300" />
              <p>Recent activity will be displayed here</p>
              <p className="text-sm mt-2">Connect analytics to see system activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminControlPanel;
