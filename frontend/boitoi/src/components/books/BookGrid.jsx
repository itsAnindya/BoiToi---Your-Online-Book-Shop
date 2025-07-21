import React, { memo, useState } from 'react';
import BookCard from './BookCard';
import { BOOK_CONSTANTS } from '../../constants/books';
import Button from '../ui/Button';

const BookGrid = memo(({ 
  categoriesData, 
  filteredBooks, 
  activeFilters
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const BOOKS_PER_CATEGORY_DEFAULT = 8;

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };
  const gridClasses = `grid grid-cols-1 ${BOOK_CONSTANTS.GRID_BREAKPOINTS.sm} ${BOOK_CONSTANTS.GRID_BREAKPOINTS.md} ${BOOK_CONSTANTS.GRID_BREAKPOINTS.lg} gap-6`;

  // Show filtered results
  if (activeFilters.search || activeFilters.price || activeFilters.categories?.length > 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
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
  return categoriesData.map(category => {
    const isExpanded = expandedCategories.has(category.category_id);
    const booksToShow = isExpanded 
      ? category.top_books 
      : category.top_books.slice(0, BOOKS_PER_CATEGORY_DEFAULT);
    const hasMoreBooks = category.top_books.length > BOOKS_PER_CATEGORY_DEFAULT;

    return (
      <div key={category.category_id} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            {category.category_name} ({category.top_books.length} books)
          </h2>
          {hasMoreBooks && (
            <Button
              size="sm"
              onClick={() => toggleCategory(category.category_id)}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          )}
        </div>
        <div className={gridClasses}>
          {booksToShow.map((book, idx) => (
            <BookCard key={book.ID} book={book} rank={idx} />
          ))}
        </div>
        {!isExpanded && hasMoreBooks && (
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-600">
              Showing {BOOKS_PER_CATEGORY_DEFAULT} of {category.top_books.length} books
            </p>
          </div>
        )}
      </div>
    );
  });
});

export default BookGrid;