import { useState, useEffect } from 'react';
import { booksApi } from '../services/booksApi';

export const useBooks = (apiBaseUrl) => {
  const [allBooks, setAllBooks] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await booksApi.fetchAllBooks(apiBaseUrl);

      // Flatten books from all categories
      const books = data.reduce((acc, category) => {
        const categoryBooks = category.top_books.map(book => ({
          ...book,
          category_name: category.category_name,
          category_id: category.category_id
        }));
        return [...acc, ...categoryBooks];
      }, []);

      setCategoriesData(data);
      setAllBooks(books);
    } catch (e) {
      console.error('Fetch error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    allBooks,
    categoriesData,
    loading,
    error,
    refetch: fetchBooks
  };
};