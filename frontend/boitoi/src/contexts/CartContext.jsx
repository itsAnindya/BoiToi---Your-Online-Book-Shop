import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCart } from '../services/cartApi';
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

  // Get current user from session storage
  const getCurrentUser = () => {
    return {
      id: sessionStorage.getItem('id'),
      username: sessionStorage.getItem('username'),
    };
  };

  // Load cart on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user.id) {
      loadCart(user.id);
    }
  }, []);

  // Load cart from API
  const loadCart = async (userId) => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    try {
      const result = await getCart(userId);
      if (result.success) {
        dispatch({ type: CART_ACTIONS.SET_CART, payload: result.cart });
      } else {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: result.error });
        toast.error(result.error);
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      toast.error('Failed to load cart');
    }
  };

  // Add item to cart
  const addToCart = (book, quantity = 1) => {
    const cartItem = {
      book_id: book.id || book.book_id,
      title: book.title,
      author: book.author,
      price: book.price,
      thumbnail: book.thumbnail || book.image_url,
      quantity: quantity,
    };
    
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
    toast.success(`Added "${book.title}" to cart`);
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
  const removeFromCart = (bookId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: bookId });
    toast.success('Item removed from cart');
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success('Cart cleared');
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
