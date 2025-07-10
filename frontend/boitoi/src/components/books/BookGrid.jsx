import React, { memo } from 'react';
import BookCard from './BookCard';
import { BOOK_CONSTANTS } from '../../constants/books';
import Button from '../ui/Button';

const BookGrid = memo(({ 
  categoriesData, 
  filteredBooks, 
  activeFilters,
  onViewAll 
}) => {
  const gridClasses = `grid grid-cols-1 ${BOOK_CONSTANTS.GRID_BREAKPOINTS.sm} ${BOOK_CONSTANTS.GRID_BREAKPOINTS.md} ${BOOK_CONSTANTS.GRID_BREAKPOINTS.lg} gap-6`;

  // Show filtered results
  if (activeFilters.search || activeFilters.price) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Search Results ({filteredBooks.length})
          </h2>
        </div>
        <div className={gridClasses}>
          {filteredBooks.map((book) => (
            <BookCard key={book.ID} book={book} />
          ))}
        </div>
      </div>
    );
  }

  // Show books by category
  return categoriesData.map(category => (
    <div key={category.category_id} className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{category.category_name}</h2>
        <Button
          variant="link"
          onClick={() => onViewAll && onViewAll(category)}
        >
          View All
        </Button>
      </div>
      <div className={gridClasses}>
        {category.top_books.map((book, idx) => (
          <BookCard key={book.ID} book={book} rank={idx} />
        ))}
      </div>
    </div>
  ));
});

export default BookGrid;