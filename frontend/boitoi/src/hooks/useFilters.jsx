import { useState, useEffect, useMemo, useCallback } from 'react';

// Custom hook for debouncing values
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useFilters = (allBooks, categoriesData = []) => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({ search: '', price: null, categories: [] });

  // Debounce search query to avoid filtering on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoized manual filter application (for manual triggers like "Apply" button)
  const applyFilters = useCallback(() => {
    // This is now just for manual triggering, the actual filtering happens in useEffect
    // Force a re-filter by updating state
    setSearchQuery(searchQuery);
  }, [searchQuery]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setPriceFilter({ min: '', max: '' });
    setSelectedCategories([]);
    setActiveFilters({ search: '', price: null, categories: [] });
  }, []);

  // Apply filters when dependencies change (optimized to prevent unnecessary re-renders)
  useEffect(() => {
    if (!allBooks.length) {
      setFilteredBooks([]);
      return;
    }

    let filtered = [...allBooks];

    // Apply search filter with debounced value
    if (debouncedSearchQuery.trim()) {
      const searchLower = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.TITLE?.toLowerCase().includes(searchLower) ||
        book.AUTHORS?.toLowerCase().includes(searchLower)
      );
    }

    // Apply price filter
    if (priceFilter.min !== '' || priceFilter.max !== '') {
      const min = priceFilter.min === '' ? 0 : parseFloat(priceFilter.min);
      const max = priceFilter.max === '' ? Infinity : parseFloat(priceFilter.max);
      
      filtered = filtered.filter(book => {
        const price = parseFloat(book.PRICE) || 0;
        return price >= min && price <= max;
      });
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(book => 
        selectedCategories.includes(book.category_id) || 
        selectedCategories.includes(book.category_name)
      );
    }

    setFilteredBooks(filtered);

    // Update active filters for display
    setActiveFilters({
      search: debouncedSearchQuery,
      price: (priceFilter.min !== '' || priceFilter.max !== '') ? priceFilter : null,
      categories: selectedCategories
    });
  }, [debouncedSearchQuery, priceFilter.min, priceFilter.max, selectedCategories, allBooks]);

  // Initialize filtered books when allBooks changes
  useEffect(() => {
    if (allBooks.length > 0 && filteredBooks.length === 0 && !debouncedSearchQuery && !priceFilter.min && !priceFilter.max && selectedCategories.length === 0) {
      setFilteredBooks(allBooks);
    }
  }, [allBooks, filteredBooks.length, debouncedSearchQuery, priceFilter.min, priceFilter.max, selectedCategories.length]);

  return {
    filteredBooks,
    searchQuery,
    setSearchQuery,
    priceFilter,
    setPriceFilter,
    selectedCategories,
    setSelectedCategories,
    activeFilters,
    clearFilters,
    applyFilters
  };
};