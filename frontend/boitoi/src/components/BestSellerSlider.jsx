import { API_BASE_URL } from '../config'; // Adjust the import path as necessary
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, BookOpen, Play, Pause } from 'lucide-react';

const BestsellerSlider = () => {
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchBestsellerBooks();
  }, []);

  useEffect(() => {
    if (isPlaying && books.length > 0) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
    return () => stopAutoSlide();
  }, [isPlaying, books.length]);

  const fetchBestsellerBooks = async () => {
    try {
      setLoading(true);
      // POST request to your server endpoint
      const response = await fetch(`${API_BASE_URL}/api/books/home`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // Add any required payload here
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
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

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === books.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? books.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const getVisibleBooks = () => {
    if (books.length === 0) {
      return [];
    }
    
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + books.length) % books.length;
      visible.push({
        book: books[index],
        position: i,
        index: index
      });
    }
    return visible;
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-6">
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl">
          <div className="flex items-center space-x-2 text-white">
            <BookOpen className="w-8 h-8 animate-pulse" />
            <span className="text-xl font-medium">Loading bestseller books...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
              <div className="w-full px-4 py-6">
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-red-900 via-red-800 to-red-900 rounded-2xl">
          <div className="text-center text-white">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-medium mb-4">{error}</p>
            <button 
              onClick={fetchBestsellerBooks}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
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
              <div className="w-full px-4 py-6">
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl">
          <div className="text-center text-white">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No bestseller books available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  const visibleBooks = getVisibleBooks();

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          🏆 Bestseller Collection
        </h2>
        <div className="flex items-center justify-center space-x-1 text-yellow-400 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 fill-current" />
          ))}
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Top-rated books that captivated readers worldwide
        </p>
      </div>

      {/* Main Slider Container */}
      <div className="relative">
        {/* Carousel */}
        <div className="relative h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden">
          {/* Books Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center px-4 sm:px-10">
              {visibleBooks.map(({ book, position, index }) => {
                const isCenter = position === 0;
                const isLeft = position === -1;
                const isRight = position === 1;
                
                return (
                  <div
                    key={`${book.id}-${index}`}
                    className={`absolute transition-all duration-500 ease-in-out cursor-pointer ${
                      isCenter ? 'z-30' : isLeft ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      transform: `translateX(${position * 350}px) scale(${isCenter ? 1.15 : 0.85})`,
                      opacity: isCenter ? 1 : 0.7
                    }}
                    onClick={() => !isCenter && goToSlide(index)}
                  >
                    {/* Movie Poster Style Book Cover */}
                    <div className={`relative group ${isCenter ? 'w-60 h-80' : 'w-52 h-72'}`}>
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border-2 border-gray-700 transform group-hover:scale-105 transition-all duration-300">
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
                        <div 
                          className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center" 
                          style={{ display: book.cover_url ? 'none' : 'flex' }}
                        >
                          <div className="text-center px-4">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-white text-sm font-medium text-center leading-tight">
                              {book.title}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Center book overlay */}
                      {isCenter && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-lg font-bold mb-2 line-clamp-2">
                              {book.title}
                            </h3>
                            <div className="flex items-center space-x-1 text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Glow effect for center book */}
                      {isCenter && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-200 hover:scale-110 disabled:opacity-50 z-40"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-200 hover:scale-110 disabled:opacity-50 z-40"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center mt-6 space-x-6">
          {/* Play/Pause Button */}
          <button
            onClick={toggleAutoPlay}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-105"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span className="font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Dots Navigation */}
          <div className="flex space-x-2">
            {books.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                    : 'bg-gray-400 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Book Counter */}
        <div className="text-center mt-4 text-gray-600">
          <span className="text-lg font-medium">
            {currentIndex + 1} of {books.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BestsellerSlider;