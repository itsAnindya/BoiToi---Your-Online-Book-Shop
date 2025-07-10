import React, { memo } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

const FilterSidebar = memo(({ 
  priceFilter, 
  onPriceFilterChange, 
  onPriceFilterApply,
  activeFilters,
  onClearFilters,
  onClearSearch,
  onClearPrice
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {(activeFilters.search || activeFilters.price) && (
          <Button
            variant="link"
            size="sm"
            onClick={onClearFilters}
          >
            Clear all
          </Button>
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
              onChange={(e) => onPriceFilterChange({ ...priceFilter, min: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max Price ($)</label>
            <input
              type="number"
              placeholder="999"
              value={priceFilter.max}
              onChange={(e) => onPriceFilterChange({ ...priceFilter, max: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={onPriceFilterApply}
            className="w-full"
          >
            Apply
          </Button>
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
                  onClick={onClearSearch}
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
                  onClick={onClearPrice}
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
});

export default FilterSidebar;