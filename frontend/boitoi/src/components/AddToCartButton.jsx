import React, { useState } from 'react';
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
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
      // Log the details for debugging
      console.log('Adding to cart:', {
        userId: user.id,
        bookId: book.id || book.book_id,
        quantity: quantity,
        book: book
      });

      // The CartContext's addToCart now handles both local state and API call
      await addToCartContext(book, quantity);
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
        return 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600';
      case 'secondary':
        return 'bg-slate-600 text-white hover:bg-slate-700 border-slate-600';
      case 'outline':
        return 'bg-transparent text-indigo-600 border-indigo-600 hover:bg-indigo-50';
      case 'ghost':
        return 'bg-transparent text-indigo-600 border-transparent hover:bg-indigo-50';
      default:
        return 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600';
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
      title={user.id ? `Add ${book.title} to cart` : 'Please login to add items to cart'}
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
