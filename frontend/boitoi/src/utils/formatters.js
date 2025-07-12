import toast from 'react-hot-toast';

export const formatPrice = (price) => {
  return new Intl.NumberFormat('bd-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(price ?? 0);
};

// This is a fallback handler - components should use useCartActions hook instead
export const handleAddToCart = async (id, title) => {
  console.log(`Add to cart → ${id} (${title})`);
  toast.error("Please use the cart button in the navigation to add items to cart after logging in.", {
    icon: '🔒',
    style: {
      borderRadius: '10px',
      background: '#EF4444',
      color: '#fff',
    },
  });
};