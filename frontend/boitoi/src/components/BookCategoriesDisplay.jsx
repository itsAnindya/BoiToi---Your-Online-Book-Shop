import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Share2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const BookCategoriesDisplay = ({ apiUrl = `${API_BASE_URL}/show_books` }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/show_books`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message || 'Failed to load books');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (book) => {
    // Implement add to cart logic here
    console.log('Added to cart:', book);
    // You can call your cart API or update cart state
  };

  const handleShare = (book) => {
    // Implement share functionality
    console.log('Sharing book:', book);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {categories.map((category) => (
        <div key={category.id} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-600 pb-2">
            {category.name}
          </h2>
          
          <div className="grid grid-cols-5 gap-4">
            {category.books.slice(0, 5).map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    ৳{book.price}
                  </div>
                  <button
                    onClick={() => handleShare(book)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transition-colors"
                  >
                    <Share2 className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm leading-tight">
                    {book.title}
                  </h3>
                  
                  <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                    {book.authors.join(' • ')}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    {renderStars(book.rating)}
                    <span className="text-xs text-gray-500">
                      ({book.reviews || 0})
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors text-xs"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}{'}'}
          </div>
          
          {category.books.length > 5 && (
            <div className="text-center mt-6">
              <button className="text-blue-600 hover:text-blue-800 font-semibold">
                View All {category.name} Books →
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookCategoriesDisplay;