import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const BestsellerBooksSection = ({ apiBaseUrl = API_BASE_URL }) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBestsellerBooks();
  }, []);

  const fetchBestsellerBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/books/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategoriesData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bestseller books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (bookId, bookTitle) => {
    // Add your cart logic here
    console.log(`Adding book ${bookId} (${bookTitle}) to cart`);
    // You might want to call an API endpoint or update global state
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const BookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={book.cover_url || '/placeholder-book-cover.jpg'}
          alt={book.title}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder-book-cover.jpg';
          }}
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <Star className="w-3 h-3 mr-1" />
          #{book.rank}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {book.authors.join(' • ')}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(book.price)}
            </span>
            {book.stock_quantity > 0 ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                In Stock
              </span>
            ) : (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
          
          <button
            onClick={() => handleAddToCart(book.id, book.title)}
            disabled={book.stock_quantity === 0}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              book.stock_quantity > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const CategorySection = ({ category }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {category.books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="bg-gray-200 rounded-lg h-80"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Books
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBestsellerBooks}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bestseller Books</h1>
        <p className="text-gray-600">Discover the most popular books in each category</p>
      </div>
      
      {categoriesData.length > 0 ? (
        categoriesData.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bestseller books found</p>
        </div>
      )}
    </div>
  );
};

export default BestsellerBooksSection;