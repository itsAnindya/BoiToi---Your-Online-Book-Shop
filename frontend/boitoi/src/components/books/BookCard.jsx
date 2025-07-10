import React, { memo } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice, handleAddToCart } from '../../utils/formatters';
import { BOOK_CONSTANTS } from '../../constants/books';
import Button from '../ui/Button';

const BookCard = memo(({ book, rank, onAddToCart = handleAddToCart }) => {
  const handleImageError = (e) => {
    e.target.src = BOOK_CONSTANTS.PLACEHOLDER_IMAGE;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={book.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE}
          alt={book.TITLE}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        {rank !== undefined && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            #{rank + 1}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
          {book.TITLE}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {book.AUTHORS || 'Unknown author'}
        </p>

        <div className="mt-auto">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(book.PRICE)}
          </span>

          <Button
            onClick={() => onAddToCart(book.ID, book.TITLE)}
            className="mt-3 w-full flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
});

export default BookCard;