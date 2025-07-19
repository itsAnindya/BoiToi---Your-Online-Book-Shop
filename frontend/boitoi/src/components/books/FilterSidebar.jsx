import React, { memo, useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from '../ui/Button';
import RangeSlider from '../ui/RangeSlider';

const FilterSidebar = memo(({ 
  priceFilter, 
  onPriceFilterChange, 
  onPriceFilterApply,
  categoriesData = [],
  selectedCategories = [],
  onCategoryChange,
  activeFilters,
  onClearFilters,
  onClearSearch,
  onClearPrice,
  onClearCategories,
  priceRange = { min: 0, max: 1000 } // Add price range prop with default values
}) => {
  // Local state for the slider to provide smooth interaction
  const [localPriceRange, setLocalPriceRange] = useState({
    min: priceFilter.min ? parseFloat(priceFilter.min) : priceRange.min,
    max: priceFilter.max ? parseFloat(priceFilter.max) : priceRange.max
  });

  // Update local state when priceFilter prop changes
  useEffect(() => {
    setLocalPriceRange({
      min: priceFilter.min ? parseFloat(priceFilter.min) : priceRange.min,
      max: priceFilter.max ? parseFloat(priceFilter.max) : priceRange.max
    });
  }, [priceFilter, priceRange]);

  const handleSliderChange = (newRange) => {
    setLocalPriceRange(newRange);
    // Immediately update the parent component
    onPriceFilterChange({
      min: newRange.min.toString(),
      max: newRange.max.toString()
    });
  };

  const handleApplyFilter = () => {
    onPriceFilterApply();
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCategoryToggle = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newCategories);
  };
  return (
    <div className="w-64 bg-white border-r border-neutral-200 p-6 shadow-soft sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        {(activeFilters.search || activeFilters.price || activeFilters.categories?.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Categories Filter */}
      {categoriesData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-4">Categories</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categoriesData.map((category) => (
              <label key={category.category_id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.category_id)}
                  onChange={() => handleCategoryToggle(category.category_id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 focus:ring-transparent accent-blue-600"
                />
                <span className="ml-2 text-sm text-neutral-700">
                  {category.category_name}
                  <span className="text-neutral-500 ml-1">
                    ({category.top_books?.length || 0})
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-neutral-900 mb-4">Price Range</h3>
        <div className="px-2">
          <RangeSlider
            min={priceRange.min}
            max={priceRange.max}
            step={5}
            value={localPriceRange}
            onChange={handleSliderChange}
            formatValue={formatPrice}
            className="mb-4"
          />
          <Button
            onClick={handleApplyFilter}
            className="w-full mt-3"
            size="sm"
            variant="primary"
          >
            Apply Filter
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(activeFilters.search || activeFilters.price || activeFilters.categories?.length > 0) && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">Active Filters</h3>
          <div className="space-y-2">
            {activeFilters.search && (
              <div className="flex items-center justify-between bg-primary-50 px-3 py-2 rounded-md border border-primary-200">
                <span className="text-sm text-primary-800">Search: "{activeFilters.search}"</span>
                <Button
                  onClick={onClearSearch}
                  variant="outline"
                  size="xs"
                >
                  <FaTimes className="text-xs" />
                </Button>
              </div>
            )}
            {activeFilters.price && (
              <div className="flex items-center justify-between bg-secondary-50 px-3 py-2 rounded-md border border-secondary-200">
                <span className="text-sm text-secondary-800">
                  Price: ${activeFilters.price.min || '0'} - ${activeFilters.price.max || '∞'}
                </span>
                <Button
                  onClick={onClearPrice}
                  variant="outline"
                  size="xs"
                >
                  <FaTimes className="text-xs" />
                </Button>
              </div>
            )}
            {activeFilters.categories?.length > 0 && (
              <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-md border border-green-200">
                <span className="text-sm text-green-800">
                  Categories: {activeFilters.categories.length} selected
                </span>
                <Button
                  onClick={onClearCategories}
                  variant="outline"
                  size="xs"
                >
                  <FaTimes className="text-xs" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default FilterSidebar;