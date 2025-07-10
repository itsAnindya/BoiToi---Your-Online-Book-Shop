import { useState, useEffect } from 'react';

export const useFilters = (allBooks) => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [activeFilters, setActiveFilters] = useState({ search: '', price: null });

  const applyFilters = () => {
    let filtered = [...allBooks];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(book =>
        book.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.AUTHORS?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    if (priceFilter.min !== '' || priceFilter.max !== '') {
      filtered = filtered.filter(book => {
        const price = parseFloat(book.PRICE) || 0;
        const min = priceFilter.min === '' ? 0 : parseFloat(priceFilter.min);
        const max = priceFilter.max === '' ? Infinity : parseFloat(priceFilter.max);
        return price >= min && price <= max;
      });
    }

    setFilteredBooks(filtered);

    // Update active filters for display
    setActiveFilters({
      search: searchQuery,
      price: (priceFilter.min !== '' || priceFilter.max !== '') ? priceFilter : null
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceFilter({ min: '', max: '' });
    setActiveFilters({ search: '', price: null });
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, priceFilter, allBooks]);

  useEffect(() => {
    setFilteredBooks(allBooks);
  }, [allBooks]);

  return {
    filteredBooks,
    searchQuery,
    setSearchQuery,
    priceFilter,
    setPriceFilter,
    activeFilters,
    clearFilters,
    applyFilters
  };
};