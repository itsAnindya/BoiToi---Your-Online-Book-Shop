import React from 'react';
import { AlertCircle } from 'lucide-react';
import DefaultLayout from '../../layouts/DefaultLayout';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import Button from '../ui/Button';

const ErrorState = ({ 
  error, 
  onRetry, 
  searchQuery, 
  onSearchChange, 
  onKeyPress 
}) => {
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
            priceRange={{ min: 0, max: 1000 }}
          />
          <div className="flex-1 p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Books</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button variant="danger" onClick={onRetry}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ErrorState;