import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Phone, Calendar, MapPin, Home, Building, Lock } from 'lucide-react';
import { loginUser, signupUser, publisherLogin } from '../services/api';
import { useCart } from '../contexts/CartContext';
import Button, { BackToHomeButton } from '../components/ui/Button';

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
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);
    
    // If switching to signup, force user type to 'user' and disable publisher option
    if (!newIsLogin) {
      setUserType('user');
    }
    
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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      {/* Personal Account Button */}
      {user && user.id && (
        <div className="absolute top-6 right-8 z-10">
          <Link to={`/books/user/${user.id}`}>
            <Button variant="primary" size="md">
              Personal Account
            </Button>
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-soft p-8 w-full max-w-lg border border-neutral-200">
        {/* Back to Home Button */}
        <BackToHomeButton className="mb-4" />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-primary-600 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Welcome to BoiToi</h1>
          <p className="text-neutral-600 text-sm">Your Online Bookshop</p>
        </div>

        {/* Auth Toggle */}
        <div className="flex bg-neutral-100 p-1 rounded-xl mb-6 gap-1">
          <Button
            onClick={() => setIsLogin(true)}
            variant={isLogin ? 'authToggleActive' : 'authToggle'}
            size="md"
            className="flex-1"
          >
            Login
          </Button>
          <Button
            onClick={() => setIsLogin(false)}
            variant={isLogin ? 'authToggle' : 'authToggleActive'}
            size="md"
            className="flex-1"
          >
            Sign Up
          </Button>
        </div>

        {/* User Type Toggle */}
        <div className="flex bg-neutral-100 p-1 rounded-xl mb-2 gap-1">
          <Button
            onClick={() => setUserType('user')}
            variant={userType === 'user' ? 'authToggleActive' : 'authToggle'}
            size="md"
            className="flex-1"
          >
            User
          </Button>
          <Button
            onClick={() => setUserType('publisher')}
            variant={userType === 'publisher' ? 'authToggleActive' : 'authToggle'}
            size="md"
            className={`flex-1 ${isLogin ? '' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!isLogin}
          >
            Publisher
          </Button>
        </div>
        
        {/* Publisher signup notice */}
        {!isLogin && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm text-center">
              Publisher registration requires approval. Please contact support or use the publisher login for existing accounts.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {isLogin ? (
            // Login Form
            <>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    name="username"
                    placeholder={userType === 'publisher' ? 'Publisher Name' : 'Username'}
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                variant="authPrimary"
                size="lg"
                className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Logging in...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? `Login to BoiToi${userType === 'publisher' ? ' (Publisher)' : ''}` : `Create BoiToi Account${userType === 'publisher' ? ' (Publisher)' : ''}`
                )}
              </Button>
            </>
          ) : (
            // Signup Form
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(37 99 235) #f5f5f4' }}
            >
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-neutral-900 font-semibold text-lg">Personal Information</h3>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    name="username"
                    placeholder={userType === 'publisher' ? 'Publisher Name' : 'Username'}
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <h3 className="text-neutral-900 font-semibold text-lg">Address Information</h3>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'home' }))}
                    variant={formData.addressType === 'home' ? 'authToggleActive' : 'authToggle'}
                    size="sm"
                    className="flex-1"
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'office' }))}
                    variant={formData.addressType === 'office' ? 'authToggleActive' : 'authToggle'}
                    size="sm"
                    className="flex-1"
                  >
                    <Building className="w-4 h-4" />
                    <span>Office</span>
                  </Button>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-4 text-neutral-400 w-4 h-4" />
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
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
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="button"
                onClick={handleSubmit}
                variant="authPrimary"
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
          <p className="text-neutral-600 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <Button
              onClick={toggleAuthMode}
              variant="link"
              size="sm"
              className="p-0 h-auto font-medium"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </Button>
          </p>
          
          {/* Publisher Login Link */}
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-neutral-600 text-sm mb-2">Are you a publisher?</p>
            <Link to="/publisher-login">
              <Button
                variant="link"
                size="sm"
                className="inline-flex items-center gap-2 p-0 h-auto font-medium"
              >
                <BookOpen className="w-4 h-4" />
                Publisher Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f4;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(37 99 235);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(29 78 216);
        }
      `}</style>
    </div>
  );
};

export default AuthPage;