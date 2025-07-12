import { addToCart } from '../services/booksApi'; // Adjust path based on your structure
import toast from 'react-hot-toast';

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price ?? 0);
};

export const handleAddToCart = async (id, title) => {
  console.log(`Add to cart → ${id} (${title})`);

  try {
    const result = await addToCart(id);
    console.log("Cart response:", result);
    
    // Show success toast with book title
    if (result && result.message) {
      toast.success(result.message, {
        icon: '📚',
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
      });
    } else {
      toast.success(`Book - ${title} has been added to your cart`, {
        icon: '📚',
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
      });
    }
  } catch (err) {
    console.error("Add to cart failed:", err.response?.data || err.message);
    toast.error("You must be logged in to add items to cart.", {
      icon: '❌',
      style: {
        borderRadius: '10px',
        background: '#EF4444',
        color: '#fff',
      },
    });
  }
};