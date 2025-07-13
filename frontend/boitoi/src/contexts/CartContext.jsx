import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { getCart, removeFromCart as removeFromCartApi, addToCart as addToCartApi } from '../services/cartApi';
import toast from 'react-hot-toast';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ERROR: 'SET_ERROR',
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case CART_ACTIONS.SET_CART:
      return { 
        ...state, 
        items: action.payload, 
        isLoading: false, 
        error: null 
      };
    
    case CART_ACTIONS.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        item => item.book_id === action.payload.book_id
      );
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        // New item, add to cart
        return { ...state, items: [...state.items, action.payload] };
      }
    
    case CART_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.book_id === action.payload.book_id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.book_id !== action.payload),
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };
    
    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    default:
      return state;
  }
};

// Initial State
const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loadingUserId, setLoadingUserId] = useState(null); // Track which user is currently loading
  const [lastLoadTime, setLastLoadTime] = useState(0); // Track last load time for rate limiting

  // Get current user from session storage
  const getCurrentUser = () => {
    return {
      id: sessionStorage.getItem('id'),
      username: sessionStorage.getItem('username'),
    };
  };

  // Load cart from API with rate limiting
  const loadCart = useCallback(async (userId) => {
    if (!userId) return;
    
    // Rate limiting: prevent requests within 1 second of each other
    const now = Date.now();
    if (now - lastLoadTime < 1000) {
      console.log('Rate limit: Skipping cart load, too soon since last request');
      return;
    }
    
    // Prevent multiple simultaneous requests for the same user
    if (loadingUserId === userId) {
      console.log('Cart is already loading for user:', userId);
      return;
    }
    
    setLoadingUserId(userId);
    setLastLoadTime(now);
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    try {
      console.log(`Loading cart for user: ${userId}`);
      const result = await getCart(userId);
      if (result.success) {
        console.log('Cart loaded successfully:', result.cart);
        dispatch({ type: CART_ACTIONS.SET_CART, payload: result.cart });
      } else {
        console.error('Failed to load cart:', result.error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: result.error });
        // Only show error toast once, not repeatedly
        if (!result.error.includes('fetch')) {
          toast.error(result.error);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      // Avoid showing network error toasts repeatedly
      if (!error.message.includes('fetch')) {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoadingUserId(null);
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  }, []); // No dependencies to prevent infinite loops

  // Function to refresh cart when user changes
  const refreshCart = useCallback(() => {
    console.log('RefreshCart called');
    const user = getCurrentUser();
    if (user.id) {
      console.log('Refreshing cart for user:', user.id);
      loadCart(user.id);
    } else {
      console.log('No user found, clearing cart');
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [loadCart]);

  // Load cart on mount and when user changes
  useEffect(() => {
    const user = getCurrentUser();
    if (user.id) {
      loadCart(user.id);
    }
  }, []); // Remove loadCart dependency to prevent infinite loop

  // Listen for storage changes (user login/logout)
  useEffect(() => {
    let timeoutId;
    
    const handleStorageChange = () => {
      // Debounce to prevent rapid successive calls
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const user = getCurrentUser();
        if (user.id) {
          console.log('Storage change detected, loading cart for user:', user.id);
          loadCart(user.id);
        } else {
          console.log('Storage change detected, no user found, clearing cart');
          dispatch({ type: CART_ACTIONS.CLEAR_CART });
        }
      }, 500); // Increased debounce time
    };

    // Custom event for manual refresh (same-page login/logout)
    const handleManualRefresh = () => {
      console.log('Manual cart refresh triggered');
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const user = getCurrentUser();
        if (user.id) {
          loadCart(user.id);
        } else {
          dispatch({ type: CART_ACTIONS.CLEAR_CART });
        }
      }, 200); // Increased debounce time
    };

    // Listen for storage events (when user logs in from another tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom cart refresh events
    window.addEventListener('cartRefresh', handleManualRefresh);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartRefresh', handleManualRefresh);
    };
  }, []); // Remove loadCart dependency to prevent infinite loop

  // Add item to cart
  const addToCart = async (book, quantity = 1) => {
    const user = getCurrentUser();
    if (!user.id) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      // Call backend API to add to database
      const result = await addToCartApi(user.id, book.id || book.book_id, quantity);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to add item to cart');
        return;
      }

      // Update local state only if API call succeeds
      const cartItem = {
        book_id: book.id || book.book_id,
        title: book.title,
        author: book.author || 'Unknown Author',
        price: parseFloat(book.price) || 0,
        thumbnail: book.thumbnail || book.image_url || book.cover_url || '/images/books/defaultbook.jpg',
        quantity: quantity,
      };
      
      dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
      toast.success(`Added "${book.title}" to cart`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
    }
  };

  // Update item quantity
  const updateItemQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    dispatch({ 
      type: CART_ACTIONS.UPDATE_ITEM, 
      payload: { book_id: bookId, quantity } 
    });
  };

  // Remove item from cart
  const removeFromCart = async (bookId) => {
    const user = getCurrentUser();
    if (!user.id) {
      toast.error('Please login to remove items from cart');
      return;
    }

    try {
      // Call backend API to remove from database
      await removeFromCartApi(user.id, bookId);
      
      // Update local state
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: bookId });
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error(error.message || 'Failed to remove item from cart');
    }
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    console.log('Cart cleared');
  };

  // Get cart total
  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Get cart items count
  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart: state.items,
    isLoading: state.isLoading,
    error: state.error,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    refreshCart,
    getCartTotal,
    getCartItemsCount,
    getCurrentUser,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
