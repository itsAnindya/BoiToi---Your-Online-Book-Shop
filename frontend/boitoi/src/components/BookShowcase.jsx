import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { API_BASE_URL } from '../config'; // Adjust the import path as necessary

const BookShowcase = () => {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from server
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/show_books`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    // Replace this with your actual cart logic
    alert(`Added "${book.TITLE}" to cart for $${book.PRICE}`);
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading books</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchBooks}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Books
        </h1>
        
        {bookData.map((categoryData) => (
          <div key={categoryData.category.ID} className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {categoryData.category.NAME}
              </h2>
              {categoryData.category.DESCRIPTION && (
                <p className="text-gray-600">
                  {categoryData.category.DESCRIPTION}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {categoryData.top_books.map((book) => (
                <div
                  key={book.ID}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                    <img
                      src={book.COVER_URL || '/api/placeholder/300/400'}
                      alt={book.TITLE}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/400';
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                      {book.TITLE}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-green-600">
                        ${formatPrice(book.PRICE)}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.5</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {bookData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No books found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookShowcase;