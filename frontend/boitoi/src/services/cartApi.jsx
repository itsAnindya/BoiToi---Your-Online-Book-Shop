import { API_BASE_URL } from "../config";

const apiBaseUrl = `${API_BASE_URL}/api`;

// Create AbortController for request timeout
const createTimeoutController = (timeoutMs = 10000) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
};

// Get user cart
export const getCart = async (userId) => {
  const controller = createTimeoutController(8000); // 8 second timeout
  
  try {
    console.log('Getting cart for user:', userId);
    console.log('API URL:', `${apiBaseUrl}/cart/${userId}`);
    
    const response = await fetch(`${apiBaseUrl}/cart/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    console.log('Cart API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Cart API response data:', data);

    return {
      success: true,
      cart: data.cart || [], // Backend now returns cart directly
    };
  } catch (error) {
    console.error('Cart API error details:', {
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

// Add item to cart
export const addToCart = async (userId, bookId, quantity = 1) => {
  const controller = createTimeoutController(8000); // 8 second timeout
  
  try {
    const response = await fetch(`${apiBaseUrl}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        user_id: userId,
        book_id: bookId,
        quantity: quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Add to cart API response:', data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Add to cart API error:', error);
    
    let errorMessage = 'Failed to add item to cart';
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

// Update cart item quantity
export const updateCartItem = async (userId, bookId, quantity) => {
  const controller = createTimeoutController(8000);
  
  try {
    const response = await fetch(`${apiBaseUrl}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        user_id: userId,
        book_id: bookId,
        quantity: quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    let errorMessage = 'Failed to update cart item';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout - please try again';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Connection failed - please check your connection';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Remove item from cart
export const removeFromCart = async (userId, bookId) => {
  const controller = createTimeoutController(8000);
  
  try {
    const response = await fetch(`${apiBaseUrl}/cart/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        user_id: userId,
        book_id: bookId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    let errorMessage = 'Failed to remove item from cart';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout - please try again';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Connection failed - please check your connection';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Save cart (update multiple items at once)
export const saveCart = async (userId, cartItems) => {
  try {
    const response = await fetch(`${apiBaseUrl}/cart/save`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        items: cartItems,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save cart');
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

// Place order
export const placeOrder = async (userId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/cart/place-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to place order');
    }

    return {
      success: true,
      orderId: data.orderId,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
