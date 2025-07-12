import { API_BASE_URL } from "../config";

const apiBaseUrl = `${API_BASE_URL}/api`;

// Get user cart
export const getCart = async (userId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/cart/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch cart');
    }

    return {
      success: true,
      cart: data.cart || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Add item to cart
export const addToCart = async (userId, bookId, quantity = 1) => {
  try {
    const response = await fetch(`${apiBaseUrl}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        book_id: bookId,
        quantity: quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add item to cart');
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

// Update cart item quantity
export const updateCartItem = async (userId, bookId, quantity) => {
  try {
    const response = await fetch(`${apiBaseUrl}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        book_id: bookId,
        quantity: quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update cart item');
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

// Remove item from cart
export const removeFromCart = async (userId, bookId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/cart/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        book_id: bookId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove item from cart');
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
