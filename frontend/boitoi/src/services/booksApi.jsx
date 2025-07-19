import { API_BASE_URL } from '../config';

export const booksApi = {
  async fetchBooksByCategories(apiBaseUrl = `${API_BASE_URL}/api`) {
    const response = await fetch(`${apiBaseUrl}/books/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  },

  async fetchAllBooks(apiBaseUrl = `${API_BASE_URL}/api`) {
    const response = await fetch(`${apiBaseUrl}/books/all`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }
};
export const addToCart = async (bookId) => {
  const id = sessionStorage.getItem('id');
  if (id === null) {
    throw new Error('User not logged in');
  }
  console.log(`Adding book ${bookId} to cart for user ${id}`);
  const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${id}`,
    },
    body: JSON.stringify({ bookId, userId: id }), // Pass userId in body
  });

  if (!response.ok) {
    console.log(`Failed to add book ${bookId} to cart:`, response.statusText);
    throw new Error(`HTTP ${response.status}`);
  }
  console.log(`Book ${bookId} added to cart successfully`);
  return response.json();
};