import React from 'react';

const EmptyState = ({ activeFilters }) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">
        {activeFilters.search || activeFilters.price
          ? 'No books found matching your search criteria'
          : 'No books available'
        }
      </p>
    </div>
  );
};

export default EmptyState;