import { API_BASE_URL } from "../config";

const apiBaseUrl = `${API_BASE_URL}/api`;

// Create AbortController for request timeout
const createTimeoutController = (timeoutMs = 10000) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
};

// Get order history for a user
export const getOrderHistory = async (userId) => {
  const controller = createTimeoutController(8000);
  
  try {
    console.log('Getting order history for user:', userId);
    
    const response = await fetch(`${apiBaseUrl}/orders/history/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    console.log('Order history API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Order history API response data:', data);

    return {
      success: true,
      orders: data.orders || [],
    };
  } catch (error) {
    console.error('Order history API error details:', {
      message: error.message,
      name: error.name,
    });
    
    let errorMessage = 'Network error - please check your connection';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout - server may be slow';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Connection failed - backend may be down';
    } else if (error.message.includes('HTTP')) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Get detailed order information
export const getOrderDetails = async (orderId, userId = null) => {
  const controller = createTimeoutController(8000);
  
  try {
    console.log('Getting order details for order:', orderId);
    
    const queryParam = userId ? `?userId=${userId}` : '';
    const response = await fetch(`${apiBaseUrl}/orders/details/${orderId}${queryParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    console.log('Order details API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Order details API response data:', data);

    return {
      success: true,
      order: data.order,
    };
  } catch (error) {
    console.error('Order details API error details:', {
      message: error.message,
      name: error.name,
    });
    
    let errorMessage = 'Failed to fetch order details';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout - please try again';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Connection failed - please check your connection';
    } else if (error.message.includes('HTTP')) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Update order status (admin function)
export const updateOrderStatus = async (orderId, status) => {
  const controller = createTimeoutController(8000);
  
  try {
    console.log(`Updating order ${orderId} status to:`, status);
    
    const response = await fetch(`${apiBaseUrl}/orders/status/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        status: status,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Update order status API response:', data);

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error('Update order status API error:', error);
    
    let errorMessage = 'Failed to update order status';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout - please try again';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Connection failed - please check your connection';
    } else if (error.message.includes('HTTP')) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};
