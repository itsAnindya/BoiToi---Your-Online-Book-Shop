import React, { useState } from 'react';
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { addToCart as addToCartAPI } from '../services/cartApi';
import toast from 'react-hot-toast';

const AddToCartButton = ({ 
  book, 
  quantity = 1, 
  className = '',
  variant = 'primary',
  size = 'medium',
  showIcon = true,
  children 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart: addToCartContext, getCurrentUser } = useCart();
  
  const user = getCurrentUser();

  const handleAddToCart = async () => {
    if (!user.id) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsLoading(true);
    
    try {
      // Add to local context first for immediate UI feedback
      addToCartContext(book, quantity);
      
      // Then sync with backend
      const result = await addToCartAPI(user.id, book.id || book.book_id, quantity);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Style variants
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600';
      case 'outline':
        return 'bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50';
      case 'ghost':
        return 'bg-transparent text-blue-600 border-transparent hover:bg-blue-50';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600';
    }
  };

  // Size variants
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm';
      case 'medium':
        return 'px-4 py-2';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();
  const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || !user.id}
      className={finalClassName}
      title={!user.id ? 'Please login to add items to cart' : `Add ${book.title} to cart`}
    >
      {isLoading ? (
        <FaSpinner className={`animate-spin ${showIcon && children ? 'mr-2' : ''}`} />
      ) : (
        showIcon && <FaShoppingCart className={children ? 'mr-2' : ''} />
      )}
      {children || (isLoading ? 'Adding...' : 'Add to Cart')}
    </button>
  );
};

export default AddToCartButton;
