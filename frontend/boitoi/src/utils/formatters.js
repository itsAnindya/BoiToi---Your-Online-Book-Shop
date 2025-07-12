import { addToCart } from '../services/booksApi'; // Adjust path based on your structure

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
  } catch (err) {
    console.error("Add to cart failed:", err.response?.data || err.message);
    alert("You must be logged in to add items to cart.");
  }
};