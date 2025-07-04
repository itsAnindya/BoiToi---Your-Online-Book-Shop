// API service functions
const API_BASE_URL = 'http://162.168.0.126:3001/api'; // Replace with your backend URL

// Login API call
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return {
      success: true,
      data: data,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Signup API call
export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        birthday: userData.birthday,
        gender: userData.gender,
        address: {
          type: userData.addressType,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          zipCode: userData.zipCode,
        },
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return {
      success: true,
      data: data,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Updated handleSubmit function for your React component
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

      const result = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      if (result.success) {
        // Store token in localStorage or context
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        console.log('Login successful:', result.user);
        // Redirect to dashboard or home page
        // window.location.href = '/dashboard';
      } else {
        setError(result.error);
      }
    } else {
      // Signup
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const result = await signupUser(formData);

      if (result.success) {
        // Store token in localStorage or context
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        console.log('Signup successful:', result.user);
        // Redirect to dashboard or home page
        // window.location.href = '/dashboard';
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

// Additional state variables you'll need in your component
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

// Error display component (add this to your JSX)
{error && (
  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-4">
    {error}
  </div>
)}

// Updated button with loading state
<button
  type="button"
  onClick={handleSubmit}
  disabled={loading}
  className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300 shadow-lg ${
    loading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {loading ? (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
      {isLogin ? 'Logging in...' : 'Creating Account...'}
    </div>
  ) : (
    isLogin ? 'Login to BoiToi' : 'Create BoiToi Account'
  )}
</button>

// Token management utilities
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

// API interceptor for authenticated requests
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  // Handle token expiration
  if (response.status === 401) {
    logout();
    return;
  }

  return response;
};