import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export const useCartActions = () => {
  const { addToCart: addToCartContext, getCurrentUser } = useCart();

  const addToCart = (book, quantity = 1) => {
    const user = getCurrentUser();
    
    if (!user.id) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      addToCartContext(book, quantity);
      return true;
    } catch (error) {
      toast.error('Failed to add item to cart');
      return false;
    }
  };

  const requiresAuth = () => {
    const user = getCurrentUser();
    if (!user.id) {
      toast.error('Please login to access cart features');
      return false;
    }
    return true;
  };

  return {
    addToCart,
    requiresAuth,
  };
};
