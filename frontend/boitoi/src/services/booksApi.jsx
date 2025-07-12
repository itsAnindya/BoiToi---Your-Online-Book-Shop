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
  }
};

export const addToCart = async (bookId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};
