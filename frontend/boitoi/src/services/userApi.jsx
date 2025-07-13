import { API_BASE_URL } from '../config';

const apiBaseUrl = `${API_BASE_URL}/api`;

// Get user profile data
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    // Backend returns { message, user } format, we normalize it to include success flag
    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    // Backend returns { success: true, message: '...' } so we can return it directly
    return {
      success: data.success || true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Change user password
export const changeUserPassword = async (userId, passwordData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/user/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update user address
export const updateUserAddress = async (userId, addressId, addressData) => {
  try {
    const url = addressId 
      ? `${apiBaseUrl}/user/${userId}/address/${addressId}`
      : `${apiBaseUrl}/user/${userId}/address`;
    
    const method = addressId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update address');
    }

    return {
      success: true,
      message: data.message,
      addressId: data.addressId,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete user address
export const deleteUserAddress = async (userId, addressId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/user/${userId}/address/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete address');
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
