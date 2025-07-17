import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import { ShoppingCart, CheckCircle, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const BookDetails = ({ username }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { getCurrentUser } = useCart();

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(false);

  const [comment, setComment] = useState('');
  const [commentConfirmed, setCommentConfirmed] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Get current user
  const user = getCurrentUser();

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
      username: user?.username || username, // Use user from context or fallback to prop
    }).then(() => setConfirmedRating(true));
  };

  const submitComment = () => {
    axios.post(`${API_BASE_URL}/api/comments`, {
      bookId: book.ID,
      comment,
      username: user?.username || username, // Use user from context or fallback to prop
    }).then(() => setCommentConfirmed(true));
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      // TODO: Implement the SQL queries for adding to cart
      // This should call an API endpoint that will execute SQL queries
      // Example API call:
      const response = await axios.post(`${API_BASE_URL}/api/cart/add`, {
        userId: user.id,      // Now using the actual user ID
        bookId: book.ID,
        quantity: 1
      });

      if (response.data.success) {
        setShowSuccessDialog(true);
      } else {
        alert('Failed to add book to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding book to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  if (!book) return (<DefaultLayout><p>Loading...</p></DefaultLayout>);

  return (
    <DefaultLayout>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left: Cover + Rating + Comment */}
        <div className="w-full">
          <img
            src={book.COVER_URL}
            alt={book.TITLE}
            className="max-w-[300px] w-full h-auto rounded shadow mb-4"
          />

          {/* Rating */}
          <div className="mb-6">
            <h2 className="font-semibold mb-1 ml-[-192px]">Rating:</h2>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <span
                  key={val}
                  className={`cursor-pointer text-2xl ${
                    (hovered || rating) >= val ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                  onClick={() => handleRatingClick(val)}
                  onMouseEnter={() => setHovered(val)}
                  onMouseLeave={() => setHovered(0)}
                >
                  ★
                </span>
              ))}
            </div>
            {!confirmedRating && rating > 0 && (
              <Button
                onClick={submitRating}
                variant="primary"
                size="sm"
                className="mt-1"
              >
                Confirm Rating
              </Button>
            )}
            {confirmedRating && (
              <p className="text-green-600 mt-1">Rating submitted!</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <h2 className="font-semibold mb-1">Leave a Comment:</h2>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setCommentConfirmed(false);
              }}
            />
            {!commentConfirmed && comment.trim() && (
              <Button
                onClick={submitComment}
                variant="success"
                size="sm"
              >
                Submit Comment
              </Button>
            )}
            {commentConfirmed && (
              <p className="text-green-600 mt-1">Comment submitted!</p>
            )}
          </div>
        </div>

        {/* Right: Book Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{book.TITLE}</h1>
          <p className="mb-4 text-gray-800">{book.DESCRIPTION}</p>

          <div className="mb-2">
            <h2 className="font-semibold">Authors:</h2>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {book.AUTHORS?.split(' · ').map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </div>

          <p><strong>Language:</strong> {book.LANGUAGE}</p>
          <p><strong>Publisher:</strong> {book.PUBLISHER_NAME}</p>
          <p><strong>Genre:</strong> {book.GENRE}</p>
          <p><strong>ISBN:</strong> {book.ISBN}</p>
          <p><strong>Added At:</strong> {book.ADDED_AT}</p>

          {/* Add to Cart Button */}
          <div className="mt-6">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 transform animate-scale-in shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeSuccessDialog}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

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
                  src={book.COVER_URL}
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
    </DefaultLayout>
  );
};

export default BookDetails;