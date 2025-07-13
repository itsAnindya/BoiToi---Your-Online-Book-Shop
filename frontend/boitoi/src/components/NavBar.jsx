import React, { useState, useRef, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getCartItemsCount, getCurrentUser, clearCart } = useCart();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  
  const cartItemsCount = getCartItemsCount();
  const user = getCurrentUser();
  const isLoggedIn = user && user.id;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all session storage items
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    
    // Clear cart data when logging out
    clearCart(); 
    
    setShowUserMenu(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    { id: 1, text: 'Home', link: '/' },
    { id: 2, text: 'Books', link: '/books' },
    { id: 3, text: 'Categories', link: '/categories' },
    { id: 4, text: 'Bestsellers', link: '/bestsellers' },
    { id: 5, text: 'Authors', link: '/authors' },
    { id: 6, text: 'Publishers', link: '/publishers' },
    { id: 7, text: 'About', link: '/about' },
    { id: 8, text: 'Contact', link: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900 text-white shadow-lg h-16 z-50 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
          <BookOpen className="text-slate-300" />
          <span className="font-bold text-xl text-white">BoiToi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="hover:text-slate-100 transition-colors text-slate-100"
            >
              {item.text}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="hidden md:flex space-x-6 items-center">
          {isLoggedIn && (
            <Link to="/cart" className="relative hover:text-slate-300 transition-colors">
              <FaShoppingCart className="text-xl text-white" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>
          )}
          
          {/* User Account Menu */}
          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 hover:text-slate-300 transition-colors"
              >
                <FaUser className="text-xl text-white" />
                <span className="hidden lg:block text-white">{user.username}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaCog className="mr-3 text-gray-600" />
                    <span className="text-gray-800">Account Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3 text-gray-600" />
                    <span className="text-gray-800">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <button className="hover:text-slate-300 transition-colors">
                <FaUser className="text-xl text-white" />
              </button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} className="text-white" /> : <FaBars size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden py-4 border-t border-slate-700">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="block py-2 hover:bg-slate-700 px-4 rounded transition-colors text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.text}
              </Link>
            ))}
            <div className="flex space-x-6 pt-4 justify-center">
              {isLoggedIn && (
                <Link to="/cart" className="relative p-2 hover:bg-slate-700 rounded-full text-white">
                  <FaShoppingCart />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
              
              {/* Mobile User Menu */}
              {isLoggedIn ? (
                <div className="flex flex-col space-y-2 w-full">
                  <div className="text-center text-sm text-slate-300 mb-2">
                    Welcome, {user.username}
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center justify-center space-x-2 p-2 hover:bg-slate-700 rounded text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaCog />
                    <span>Account Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 p-2 hover:bg-slate-700 rounded text-white"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="p-2 hover:bg-slate-700 rounded-full text-white">
                  <FaUser />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
