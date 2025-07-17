import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- import useNavigate
import { BookOpen, User, Mail, Phone, Calendar, MapPin, Home, Building } from 'lucide-react';
import { loginUser, signupUser, publisherLogin } from '../services/api';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('user'); // 'user' or 'publisher'
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
    addressType: 'home',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate(); // <-- initialize navigate
  const { getCurrentUser, refreshCart } = useCart();

  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.id) {
      navigate('/profile'); // Redirect to profile if already logged in
    }
  }, [navigate, getCurrentUser]);

  // Get user from sessionStorage (null if not logged in)
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        if (!formData.username || !formData.password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        let result;
        if (userType === 'publisher') {
          // Use publisher login
          result = await publisherLogin({
            username: formData.username,
            password: formData.password,
          });
        } else {
          // Use regular user login
          result = await loginUser({
            username: formData.username,
            password: formData.password,
          });
        }

        if (result.success) {
          console.log('Login successful:', result);
          
          if (userType === 'publisher') {
            // Store publisher data in the same format as regular users
            const publisherUser = {
              id: result.publisher.id,
              username: result.publisher.username || result.publisher.name,
              email: result.publisher.email,
              name: result.publisher.name,
              role: 'publisher'
            };
            
            // Store in sessionStorage like regular users
            sessionStorage.setItem('user', JSON.stringify(publisherUser));
            sessionStorage.setItem('id', result.publisher.id);
            sessionStorage.setItem('username', result.publisher.username || result.publisher.name);
            sessionStorage.setItem('role', 'publisher');
            
            // Store publisher-specific data as well for backwards compatibility
            sessionStorage.setItem('publisherId', result.publisher.id);
            sessionStorage.setItem('publisherName', result.publisher.name);
            sessionStorage.setItem('publisherEmail', result.publisher.email);
            sessionStorage.setItem('userType', 'publisher');
            
            // Redirect to homepage so publishers can access all features
            navigate('/');
          } else {
            // Trigger cart refresh for regular users
            refreshCart();
            // Redirect to books page
            navigate('/books');
          }
        } else {
          setError(result.error);
        }
      } else {
        // Signup (only for regular users, publishers need separate registration)
        if (userType === 'publisher') {
          setError('Publisher registration is not available through this form. Please contact support.');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const result = await signupUser(formData);

        if (result.success) {
          sessionStorage.setItem('authToken', result.token);
          sessionStorage.setItem('user', JSON.stringify(result.user));
          sessionStorage.setItem('username', result.user.username);
          console.log('Signup successful:', result.user);
          // Redirect to personal account page
          navigate(`/books/user/${result.user.id}`);
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthday: '',
      gender: '',
      addressType: 'home',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
      {/* Personal Account Button */}
      {user && user.id && (
        <div className="absolute top-6 right-8 z-10">
          <Link
            to={`/books/user/${user.id}`}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            Personal Account
          </Link>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BoiToi</h1>
          <p className="text-white/70">Your Online Bookshop</p>
        </div>

        {/* Auth Toggle */}
        <div className="flex bg-white/10 p-1 rounded-2xl mb-4 gap-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${isLogin
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${isLogin
              ? 'text-white/70 hover:text-white hover:bg-white/5'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* User Type Toggle */}
        <div className="flex bg-white/10 p-1 rounded-2xl mb-8 gap-2">
          <button
            onClick={() => setUserType('user')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 ${userType === 'user'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            User
          </button>
          <button
            onClick={() => setUserType('publisher')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 ${userType === 'publisher'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Publisher
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {isLogin ? (
            // Login Form
            <>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    placeholder={userType === 'publisher' ? 'Publisher Name' : 'Username'}
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5">🔒</div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                variant="primary"
                size="lg"
                className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Logging in...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? `Login to BoiToi${userType === 'publisher' ? ' (Publisher)' : ''}` : `Create BoiToi Account${userType === 'publisher' ? ' (Publisher)' : ''}`
                )}
              </Button>
            </>
          ) : (
            // Signup Form
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Personal Information</h3>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    placeholder={userType === 'publisher' ? 'Publisher Name' : 'Username'}
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="none">Prefer not to say</option>
                </select>
              </div>

              {/* Address Information */}
              <div className="space-y-4 pt-4 border-t border-white/20">
                <h3 className="text-white font-semibold text-lg">Address Information</h3>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'home' }))}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${formData.addressType === 'home'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'office' }))}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${formData.addressType === 'office'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Office</span>
                  </button>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-4 text-white/50 w-5 h-5" />
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5">🔒</div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5">🔒</div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Create BoiToi Account
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-white/70">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleAuthMode}
              className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-300"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
          
          {/* Publisher Login Link */}
          <div className="pt-4 border-t border-white/20">
            <p className="text-white/70 text-sm mb-2">Are you a publisher?</p>
            <Link
              to="/publisher-login"
              className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 font-medium transition-colors duration-300"
            >
              <BookOpen className="w-4 h-4" />
              Publisher Login
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AuthPage;