import React, { memo, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import RangeSlider from '../ui/RangeSlider';

const FilterSidebar = memo(({ 
  priceFilter, 
  onPriceFilterChange, 
  onPriceFilterApply,
  activeFilters,
  onClearFilters,
  onClearSearch,
  onClearPrice,
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
  return (
    <div className="w-64 bg-white border-r border-neutral-200 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        {(activeFilters.search || activeFilters.price) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            Clear all
          </Button>
        )}
      </div>

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
      {(activeFilters.search || activeFilters.price) && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">Active Filters</h3>
          <div className="space-y-2">
            {activeFilters.search && (
              <div className="flex items-center justify-between bg-primary-50 px-3 py-2 rounded-md border border-primary-200">
                <span className="text-sm text-primary-800">Search: "{activeFilters.search}"</span>
                <button
                  onClick={onClearSearch}
                  className="text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {activeFilters.price && (
              <div className="flex items-center justify-between bg-secondary-50 px-3 py-2 rounded-md border border-secondary-200">
                <span className="text-sm text-secondary-800">
                  Price: ${activeFilters.price.min || '0'} - ${activeFilters.price.max || '∞'}
                </span>
                <button
                  onClick={onClearPrice}
                  className="text-secondary-600 hover:text-secondary-800 transition-colors"
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