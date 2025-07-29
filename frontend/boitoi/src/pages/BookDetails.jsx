import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import { ShoppingCart, Star, CheckCircle, X, Heart } from 'lucide-react';
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
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  useEffect(() => {
    // Fetch book details
    fetch(`${API_BASE_URL}/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('Error fetching book:', err));

    // Fetch existing reviews
    fetchReviews();

    // Check if user has existing review (if username is available)
    if (username) {
      checkExistingReview();
    }
  }, [id, username]);

  const fetchReviews = () => {
    fetch(`${API_BASE_URL}/api/reviews/book/${id}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setReviewStats(data.stats || null);
      })
      .catch(err => console.error('Error fetching reviews:', err));
  };

  const checkExistingReview = () => {
    const userId = sessionStorage.getItem('id');
    if (!userId) return;

    fetch(`${API_BASE_URL}/api/reviews/book/${id}/user/${userId}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {
          return null; // No existing review
        }
        throw new Error('Failed to check existing review');
      })
      .then(data => {
        if (data) {
          setExistingReview(data);
          setRating(data.RATING);
          setComment(data.COMMENT || '');
          setReviewSubmitted(true);
        }
      })
      .catch(err => console.error('Error checking existing review:', err));
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const submitReview = () => {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      alert('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const reviewData = {
      bookId: book.ID,
      userId: parseInt(userId),
      rating: rating,
      comment: comment.trim() || null
    };

    const url = existingReview 
      ? `${API_BASE_URL}/api/reviews/${existingReview.ID}`
      : `${API_BASE_URL}/api/reviews`;
    
    const method = existingReview ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        setReviewSubmitted(true);
        fetchReviews(); // Refresh reviews
        if (!existingReview) {
          // If it was a new review, check for the created review
          checkExistingReview();
        }
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    })
    .catch(err => {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    });
  };

  const addToWishlist = async () => {
    const userId = sessionStorage.getItem('id');
    const userRole = sessionStorage.getItem('role');
    
    if (!userId || (userRole !== 'user' && userRole !== 'admin')) {
      alert('Please log in as a user or admin to add items to wishlist');
      return;
    }

    setIsAddingToWishlist(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookId: book.ID,
          userId: parseInt(userId),
          added_at: new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();

      if (response.ok) {
        setWishlistAdded(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setWishlistAdded(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist. Please try again.');
    } finally {
      setIsAddingToWishlist(false);
    }
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
                  <p className="text-sm text-neutral-500 mb-4">Free shipping over $50</p>
                  
                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-lg py-4 shadow-medium hover:shadow-strong transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Rating and Reviews - Modern Card */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-soft p-8 border border-primary-100">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-primary-500" />
                  {existingReview ? 'Update Your Review' : 'Rate & Review'}
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

                  {/* Comment Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-neutral-800 text-lg">Share your thoughts</h4>
                    <div className="relative">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you think of this book? Share your insights..."
                        className="w-full p-4 border-2 border-neutral-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
                        rows="4"
                        maxLength="500"
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
                        {comment.length}/500
                      </div>
                    </div>
                    
                    {/* Submit Review Button */}
                    {!reviewSubmitted && rating > 0 && (
                      <Button
                        onClick={submitReview}
                        variant="success"
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {existingReview ? 'Update Review' : 'Submit Review'}
                      </Button>
                    )}
                    
                    {/* Review Submitted Confirmation */}
                    {reviewSubmitted && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          {existingReview ? 'Review updated successfully!' : 'Review submitted successfully!'}
                        </span>
                      </div>
                    )}
                    
                    {/* Edit Button for Existing Review */}
                    {reviewSubmitted && existingReview && (
                      <Button
                        onClick={() => setReviewSubmitted(false)}
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Edit Review
                      </Button>
                    )}
                  </div>

                  {/* Wishlist Section - Only show for users and admins (not publishers) */}
                  {(() => {
                    const userRole = sessionStorage.getItem('role');
                    const userId = sessionStorage.getItem('id');
                    return (userRole === 'user' || userRole === 'admin') && userId && (
                      <div className="mt-6 pt-6 border-t border-neutral-200">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-neutral-800 text-lg">Save for Later</h4>
                          
                          {!wishlistAdded ? (
                            <Button
                              onClick={addToWishlist}
                              disabled={isAddingToWishlist}
                              variant="outline"
                              size="lg"
                              className="w-full border-2 border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400 transition-all duration-200"
                            >
                              <Heart className="w-5 h-5 mr-2" />
                              {isAddingToWishlist ? 'Adding to Wishlist...' : 'Add to Wishlist'}
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 text-pink-600 bg-pink-50 p-4 rounded-xl">
                              <Heart className="w-5 h-5 fill-current" />
                              <span className="font-medium">Added to your wishlist!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
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
                  <p className="text-lg text-neutral-700 leading-relaxed text-left">{book.DESCRIPTION}</p>
                </div>
              </div>

              {/* Reviews Display Section */}
              {reviewStats && reviewStats.totalReviews > 0 && (
                <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Customer Reviews</h2>
                  
                  {/* Review Statistics */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary-600">{reviewStats.averageRating}</div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(reviewStats.averageRating)
                                  ? 'text-amber-400 fill-current'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-neutral-600 mt-1">
                          {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3 mb-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-neutral-200 rounded-full h-2">
                              <div
                                className="bg-amber-400 h-2 rounded-full"
                                style={{
                                  width: `${reviewStats.totalReviews > 0 
                                    ? (reviewStats.ratingDistribution[rating] / reviewStats.totalReviews) * 100 
                                    : 0}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-neutral-600 w-8">
                              {reviewStats.ratingDistribution[rating]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.ID} className="border-b border-neutral-200 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {review.FIRST_NAME ? review.FIRST_NAME.charAt(0) : review.USERNAME.charAt(0)}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-neutral-900">
                                {review.FIRST_NAME && review.LAST_NAME 
                                  ? `${review.FIRST_NAME} ${review.LAST_NAME}` 
                                  : review.USERNAME}
                              </span>
                              {review.IS_VERIFIED_PURCHASER && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                              <span className="text-sm text-neutral-500">
                                {new Date(review.POSTED_AT).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.RATING
                                      ? 'text-amber-400 fill-current'
                                      : 'text-neutral-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm font-medium text-neutral-700">
                                {review.RATING}/5
                              </span>
                            </div>
                            
                            {review.COMMENT && (
                              <p className="text-neutral-700 leading-relaxed text-left">{review.COMMENT}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {reviews.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" size="md">
                          View All {reviews.length} Reviews
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

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