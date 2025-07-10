import React from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';

const LoadingState = ({ searchQuery, onSearchChange, onKeyPress }) => {
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onKeyPress={onKeyPress}
        />
        <div className="flex">
          <FilterSidebar
            priceFilter={{ min: '', max: '' }}
            onPriceFilterChange={() => {}}
            onPriceFilterApply={() => {}}
            activeFilters={{ search: '', price: null }}
            onClearFilters={() => {}}
            onClearSearch={() => {}}
            onClearPrice={() => {}}
          />
          <div className="flex-1 p-6">
            <div className="animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="mb-8">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="bg-gray-200 rounded-lg h-80"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LoadingState;