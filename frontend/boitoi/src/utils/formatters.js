export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(price ?? 0);
};

export const handleAddToCart = (id, title) => {
  console.log(`Add to cart → ${id} (${title})`);
};