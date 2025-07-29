import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import { Heart, ShoppingCart, Trash2, BookOpen } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useCartActions } from '../hooks/useCartActions';
import { BOOK_CONSTANTS } from '../constants/books';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCartActions();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const userId = sessionStorage.getItem('id');
    const userRole = sessionStorage.getItem('role');

    if (!userId || (userRole !== 'user' && userRole !== 'admin')) {
      setError('Please log in as a user or admin to view wishlist');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/wishlist/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlistItems(data.wishlist || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    const userId = sessionStorage.getItem('id');

    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookId: bookId,
          userId: parseInt(userId)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      // Remove item from local state
      setWishlistItems(prev => prev.filter(item => item.BOOK_ID !== bookId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove from wishlist. Please try again.');
    }
  };

  const handleAddToCart = (book) => {
    const cartBook = {
      id: book.BOOK_ID,
      book_id: book.BOOK_ID,
      title: book.TITLE,
      author: book.AUTHORS || 'Unknown Author',
      price: book.PRICE,
      thumbnail: book.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE,
    };
    
    const success = addToCart(cartBook, 1);
    if (success) {
      alert(`"${book.TITLE}" has been added to your cart!`);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-lg text-neutral-600">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Error Loading Wishlist</h2>
              <p className="text-neutral-600 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()} variant="primary">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-100 p-3 rounded-full">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-neutral-900">My Wishlist</h1>
                <p className="text-neutral-600 mt-1">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'book' : 'books'} saved for later
                </p>
              </div>
            </div>
          </div>

          {/* Wishlist Content */}
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft p-12 border border-neutral-200 text-center">
              <Heart className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Your wishlist is empty</h2>
              <p className="text-lg text-neutral-600 mb-8">
                Discover amazing books and save them for later!
              </p>
              <Link to="/books">
                <Button variant="primary" size="lg" className="bg-gradient-to-r from-primary-600 to-primary-700">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Books
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div 
                  key={item.BOOK_ID} 
                  className="bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden hover:shadow-medium transition-all duration-300 group"
                >
                  {/* Book Cover */}
                  <div className="relative">
                    <Link to={`/books/${item.BOOK_ID}`}>
                      <img
                        src={item.COVER_URL || BOOK_CONSTANTS.PLACEHOLDER_IMAGE}
                        alt={item.TITLE}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeFromWishlist(item.BOOK_ID)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Added Date Badge */}
                    <div className="absolute bottom-3 left-3 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Added {new Date(item.ADDED_AT).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-6">
                    <Link to={`/books/${item.BOOK_ID}`}>
                      <h3 className="text-lg font-bold text-neutral-900 mb-4 line-clamp-2 hover:text-primary-600 transition-colors">
                        {item.TITLE}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(item.PRICE)}
                      </span>
                      
                      {item.GENRE && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                          {item.GENRE}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        variant="primary"
                        size="sm"
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      
                      <Link to={`/books/${item.BOOK_ID}`} className="block">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {wishlistItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-neutral-200 mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Quick Actions</h3>
                  <p className="text-neutral-600">Manage your entire wishlist</p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      wishlistItems.forEach(item => handleAddToCart(item));
                    }}
                    variant="primary"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add All to Cart
                  </Button>
                  
                  <Link to="/books">
                    <Button variant="outline" size="lg">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Wishlist;
