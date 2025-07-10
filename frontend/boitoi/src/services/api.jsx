// const API_BASE_URL = 'http://192.168.0.126:3001/api';

// // Enhanced response handler
// const handleResponse = async (response) => {
//   const contentType = response.headers.get('content-type');

//   // Check if response is JSON
//   if (!contentType || !contentType.includes('application/json')) {
//     const text = await response.text();
//     throw new Error(`Invalid response: ${text.substring(0, 100)}`);
//   }

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || `Request failed with status ${response.status}`);
//   }

//   return data;
// };

// // Login API call with better error handling
// export const loginUser = async (credentials) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: credentials.username,
//         password: credentials.password,
//       }),
//     });

//     const data = await handleResponse(response);

//     if (!data.token || !data.user) {
//       throw new Error('Server response missing required fields');
//     }

//     localStorage.setItem('authToken', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));

//     return {
//       success: true,
//       token: data.token,
//       user: data.user,
//     };
//   } catch (error) {
//     console.error('Login error:', error);
//     return {
//       success: false,
//       error: error.message.includes('Invalid response') 
//         ? 'Server returned an unexpected response' 
//         : error.message,
//     };
//   }
// };

// // Enhanced authenticatedFetch
// export const authenticatedFetch = async (endpoint, options = {}) => {
//   const token = getAuthToken();
//   const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

//   try {
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` }),
//         ...options.headers,
//       },
//     });

//     if (response.status === 401) {
//       logout({ redirect: false });
//       throw new Error('Session expired. Please login again.');
//     }

//     return await handleResponse(response);
//   } catch (error) {
//     console.error(`API request to ${url} failed:`, error);
//     throw error;
//   }
// };

// API service functions
import React from "react";
import { API_BASE_URL } from "../config";
const apiBaseUrl = `${API_BASE_URL}/api`; // Replace with your backend

// Login API call
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
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
    const response = await fetch(`${apiBaseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,

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