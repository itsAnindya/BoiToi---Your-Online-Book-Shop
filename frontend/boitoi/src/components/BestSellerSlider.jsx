import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react';
import { API_BASE_URL } from '../config';

const BestsellerSlider = () => {
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBestsellerBooks();
  }, []);

  const fetchBestsellerBooks = async () => {
    try {
      setLoading(true);
      // Replace with your actual server endpoint
      const response = await fetch(`${API_BASE_URL}/api/books/home`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      } else {
        console.log("response status:", response.status);
      }
      
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load bestseller books');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === books.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? books.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-600">
            <BookOpen className="w-6 h-6 animate-pulse" />
            <span>Loading bestseller books...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchBestsellerBooks}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center text-gray-600">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <p>No bestseller books available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          📚 Bestseller Books
        </h2>
        <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-4">
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our top-rated books loved by readers worldwide
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Main Slider */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {books.map((book, index) => (
              <div
                key={book.id}
                className="w-full flex-shrink-0 flex items-center justify-center"
              >
                <div className="flex flex-col items-center space-y-4 max-w-xs">
                  {/* Book Cover */}
                  <div className="relative group">
                    <div className="w-48 h-72 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 transform group-hover:scale-105 transition-transform duration-300">
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Fallback placeholder */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center" style={{ display: book.cover_url ? 'none' : 'flex' }}>
                        <div className="text-center">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm font-medium px-4 text-center">
                            {book.title}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white rounded-full p-3 shadow-lg">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Title */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <div className="flex items-center justify-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-6 space-x-2">
        {books.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Book Counter */}
      <div className="text-center mt-4 text-sm text-gray-500">
        {currentIndex + 1} of {books.length} books
      </div>
    </div>
  );
};

export default BestsellerSlider;