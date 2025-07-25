import React, { memo, useState } from 'react';
import { ShoppingCart, Star, CheckCircle, X } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCartActions } from '../../hooks/useCartActions';
import { BOOK_CONSTANTS } from '../../constants/books';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const BookCard = memo(({ book, rank }) => {
  const { addToCart } = useCartActions();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const handleImageError = (e) => {
    e.target.src = BOOK_CONSTANTS.PLACEHOLDER_IMAGE;
  };

  const handleAddToCart = async () => {
    // Transform book data to match cart expectations
    const cartBook = {
      id: book.ID,
      book_id: book.ID,
      title: book.TITLE,
      author: book.AUTHORS || 'Unknown Author',
      price: book.PRICE,
      thumbnail: book.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE,
    };
    
    const success = await addToCart(cartBook, 1);
    if (success) {
      setShowSuccessDialog(true);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <div className="relative overflow-hidden rounded-t-lg">
          <Link to={`/books/${book.ID}`} className="no-underline text-inherit">
            <img
              src={book.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE}
              alt={book.TITLE}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          </Link>
          {rank !== undefined && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
              <Star className="w-3 h-3 mr-1" />
              #{rank + 1}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <Link to={`/books/${book.ID}`} className="no-underline text-inherit">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
            {book.TITLE}
          </h3>
          </Link>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {book.AUTHORS || 'Unknown author'}
          </p>

          <div className="mt-auto">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(book.PRICE)}
            </span>

            <Button
              onClick={handleAddToCart}
              className="mt-3 w-full flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 text-sm group-hover:-translate-x-1 transition-transform"/>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 transform animate-scale-in shadow-2xl relative">
            {/* Close button */}
            <Button
              onClick={closeSuccessDialog}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Success content */}
            <div className="text-center">
              {/* Animated checkmark */}
              <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-500 animate-pulse" />
              </div>

              {/* Success message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                🎉 Success!
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                <strong>"{book.TITLE}"</strong>
              </p>
              <p className="text-gray-600 mb-6">
                has been added to your cart successfully!
              </p>

              {/* Book thumbnail */}
              <div className="flex justify-center mb-6">
                <img
                  src={book.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE}
                  alt={book.TITLE}
                  className="w-16 h-20 object-cover rounded shadow-md"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={closeSuccessDialog}
                  variant="secondary"
                  size="md"
                  className="px-6"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => {
                    closeSuccessDialog();
                    window.location.href = '/cart';
                  }}
                  variant="primary"
                  size="md"
                  className="px-6 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
});

export default BookCard;