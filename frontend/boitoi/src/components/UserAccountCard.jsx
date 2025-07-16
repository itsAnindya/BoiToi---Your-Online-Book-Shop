import React from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const UserAccountCard = ({ onLogout }) => {
  const { getCurrentUser } = useCart();
  const user = getCurrentUser();

  const handleLogout = () => {
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('username');
    toast.success('Logged out successfully');
    if (onLogout) onLogout();
  };

  if (!user?.id) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-primary-100 p-3 rounded-full">
          <FaUser className="text-primary-600 text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{user.username}</h3>
          <p className="text-sm text-gray-600">User Account</p>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          to="/profile"
          className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <FaCog className="text-primary-600" />
          <span>Account Settings</span>
        </Link>

        {/* Admin Control Panel - Only show for admins */}
        {user.role === 'admin' && (
          <Link
            to="/admin"
            className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaUserShield className="text-red-600" />
            <span>Admin Control Panel</span>
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserAccountCard;
