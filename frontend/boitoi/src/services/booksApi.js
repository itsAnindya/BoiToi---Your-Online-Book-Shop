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