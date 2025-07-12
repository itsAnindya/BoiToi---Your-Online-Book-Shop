import axios from 'axios';

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price ?? 0);
};

import axios from 'axios';

export const handleAddToCart = async (id, title) => {
  console.log(`Add to cart → ${id} (${title})`);

  const token = localStorage.getItem('token'); // or use context/state

  if (!token) {
    alert("You must be logged in to add items to the cart.");
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:3000/api/cart',
      { bookId: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Added to cart:", response.data);
  } catch (err) {
    console.error("Failed to add to cart:", err.response?.data || err.message);
    alert("Could not add to cart.");
  }
};
