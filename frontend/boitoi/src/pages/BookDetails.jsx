import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import { ShoppingCart, Star, CheckCircle, X } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useCartActions } from '../hooks/useCartActions';
import { BOOK_CONSTANTS } from '../constants/books';

const BookDetails = ({ username }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { addToCart } = useCartActions();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(false);

  const [comment, setComment] = useState('');
  const [commentConfirmed, setCommentConfirmed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('Error fetching book:', err));
  }, [id]);

  const handleRatingClick = (value) => {
    setRating(value);
    setConfirmedRating(false);
  };

  const submitRating = () => {
    axios.post(`${API_BASE_URL}/api/ratings`, {
      bookId: book.ID,
      rating,
      username,
    }).then(() => setConfirmedRating(true));
  };

  const submitComment = () => {
    axios.post(`${API_BASE_URL}/api/comments`, {
      bookId: book.ID,
      comment,
      username,
    }).then(() => setCommentConfirmed(true));
  };

  const handleAddToCart = () => {
    // Transform book data to match cart expectations
    const cartBook = {
      id: book.ID,
      book_id: book.ID,
      title: book.TITLE,
      author: book.AUTHORS || 'Unknown Author',
      price: book.PRICE,
      thumbnail: book.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE,
    };
    
    const success = addToCart(cartBook, 1);
    if (success) {
      setShowSuccessDialog(true);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  if (!book) return (<DefaultLayout><p>Loading...</p></DefaultLayout>);

  return (
    <DefaultLayout>
      {/* Modern Container with Proper Spacing */}
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Main Content - Modern Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            {/* Left Column - Book Image and Rating (2/5 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Book Cover with Modern Card Design */}
              <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200">
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <img
                      src={book.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE}
                      alt={book.TITLE}
                      className="w-72 h-96 object-cover rounded-xl shadow-medium transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                
                {/* Quick Price Display */}
                <div className="text-center border-t border-neutral-200 pt-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {formatPrice(book.PRICE)}
                  </div>
                  <p className="text-sm text-neutral-500">Free shipping over $50</p>
                </div>
              </div>

              {/* Rating and Reviews - Modern Card */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-soft p-8 border border-primary-100">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-primary-500" />
                  Rate & Review
                </h3>
                
                <div className="space-y-6">
                  {/* Star Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-10 h-10 cursor-pointer transition-all duration-200 hover:scale-110 ${
                            star <= (hovered || rating)
                              ? 'text-amber-400 fill-current drop-shadow-sm'
                              : 'text-neutral-300 hover:text-amber-200'
                          }`}
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => setHovered(star)}
                          onMouseLeave={() => setHovered(0)}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-neutral-700">
                      {rating > 0 ? `${rating}/5` : 'Rate it!'}
                    </span>
                  </div>

                  {/* Rating Confirmation */}
                  {!confirmedRating && rating > 0 && (
                    <Button
                      onClick={submitRating}
                      variant="primary"
                      size="md"
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Confirm Rating
                    </Button>
                  )}
                  {confirmedRating && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Rating submitted!</span>
                    </div>
                  )}

                  {/* Comment Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-neutral-800 text-lg">Share your thoughts</h4>
                    <div className="relative">
                      <textarea
                        value={comment}
                        onChange={(e) => {
                          setComment(e.target.value);
                          setCommentConfirmed(false);
                        }}
                        placeholder="What did you think of this book? Share your insights..."
                        className="w-full p-4 border-2 border-neutral-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
                        rows="4"
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
                        {comment.length}/500
                      </div>
                    </div>
                    
                    {!commentConfirmed && comment.trim() && (
                      <Button
                        onClick={submitComment}
                        variant="success"
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Submit Review
                      </Button>
                    )}
                    {commentConfirmed && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Comment submitted!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Book Information (3/5 width) */}
            <div className="lg:col-span-3 space-y-8">
              {/* Book Header */}
              <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-neutral-900 mb-4 leading-tight">{book.TITLE}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      {book.GENRE}
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-600 font-medium">{book.LANGUAGE}</span>
                  </div>
                </div>
                
                <div className="prose prose-neutral max-w-none">
                  <p className="text-lg text-neutral-700 leading-relaxed">{book.DESCRIPTION}</p>
                </div>
              </div>

              {/* Book Details */}
              <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Book Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Authors */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      Authors
                    </h3>
                    <div className="space-y-2">
                      {book.AUTHORS?.split(' · ').map((name, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                          <span className="text-neutral-700 font-medium">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Publisher Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                      Publisher
                    </h3>
                    <p className="text-neutral-700 font-medium">{book.PUBLISHER_NAME}</p>
                  </div>

                  {/* ISBN */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-gold rounded-full"></div>
                      ISBN
                    </h3>
                    <p className="text-neutral-700 font-mono text-sm bg-neutral-50 px-3 py-2 rounded-lg border">
                      {book.ISBN}
                    </p>
                  </div>

                  {/* Publication Date */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-emerald rounded-full"></div>
                      Added
                    </h3>
                    <p className="text-neutral-700">{new Date(book.ADDED_AT).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-strong p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Ready to read?</h3>
                    <p className="text-primary-100">Add this book to your collection</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold mb-1">{formatPrice(book.PRICE)}</div>
                    <div className="text-sm text-primary-200">Free shipping over $50</div>
                  </div>
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  variant="authSecondary"
                  size="lg"
                  className="w-full bg-white text-primary-700 hover:bg-primary-50 hover:text-primary-800 font-semibold text-lg py-4 shadow-medium hover:shadow-strong transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 transform animate-scale-in shadow-2xl border border-neutral-200">
            {/* Close button */}
            <Button
              onClick={closeSuccessDialog}
              variant="ghost"
              size="sm"
              className="absolute top-6 right-6 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Success content */}
            <div className="text-center pt-4">
              {/* Animated checkmark */}
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center animate-bounce shadow-medium">
                <CheckCircle className="w-12 h-12 text-white animate-pulse" />
              </div>

              {/* Success message */}
              <h3 className="text-3xl font-bold text-neutral-900 mb-3">
                🎉 Added to Cart!
              </h3>
              <p className="text-lg text-neutral-700 mb-2 font-medium">
                <strong>"{book.TITLE}"</strong>
              </p>
              <p className="text-neutral-600 mb-6">
                has been successfully added to your cart
              </p>

              {/* Book thumbnail */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={book.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE}
                    alt={book.TITLE}
                    className="w-16 h-20 object-cover rounded-lg shadow-medium"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={closeSuccessDialog}
                  variant="secondary"
                  size="lg"
                  className="px-8 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => {
                    closeSuccessDialog();
                    window.location.href = '/cart';
                  }}
                  variant="primary"
                  size="lg"
                  className="px-8 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-medium hover:shadow-strong flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern CSS Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Enhanced hover effects */
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }
      `}</style>
    </DefaultLayout>
  );
};

export default BookDetails;