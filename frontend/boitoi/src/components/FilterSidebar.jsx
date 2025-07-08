import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../config'; // Adjust the import path as necessary

/* ----------------------- filter logic ----------------------------- */
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



const handlePriceFilterApply = () => {
  applyFilters();
  setIsFilterOpen(false);
};

const clearFilters = () => {
  setSearchQuery('');
  setPriceFilter({ min: '', max: '' });
  setActiveFilters({ search: '', price: null });
};


const FilterSidebar = () => (
  <div className="w-64 bg-white border-r border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      {(activeFilters.search || activeFilters.price) && (
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      )}
    </div>

    {/* Price Filter */}
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Min Price ($)</label>
          <input
            type="number"
            placeholder="0"
            value={priceFilter.min}
            onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Max Price ($)</label>
          <input
            type="number"
            placeholder="999"
            value={priceFilter.max}
            onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handlePriceFilterApply}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>

    {/* Active Filters */}
    {(activeFilters.search || activeFilters.price) && (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h3>
        <div className="space-y-2">
          {activeFilters.search && (
            <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
              <span className="text-sm text-blue-800">Search: "{activeFilters.search}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {activeFilters.price && (
            <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
              <span className="text-sm text-blue-800">
                Price: ${activeFilters.price.min || '0'} - ${activeFilters.price.max || '∞'}
              </span>
              <button
                onClick={() => setPriceFilter({ min: '', max: '' })}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

export default FilterSidebar;