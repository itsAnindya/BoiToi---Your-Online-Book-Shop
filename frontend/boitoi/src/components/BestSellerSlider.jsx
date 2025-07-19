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
      <div className="w-full px-4 py-8">
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md border border-neutral-200">
          <div className="flex items-center space-x-3 text-neutral-600">
            <BookOpen className="w-8 h-8 animate-pulse text-primary-600" />
            <span className="text-xl font-medium">Loading bestseller books...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8">
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md border border-red-200">
          <div className="text-center text-neutral-700">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-red-400 opacity-50" />
            <p className="text-xl font-medium mb-4 text-red-600">{error}</p>
            <button 
              onClick={fetchBestsellerBooks}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium shadow-md"
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
      <div className="w-full px-4 py-8">
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md border border-neutral-200">
          <div className="text-center text-neutral-600">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-neutral-400 opacity-50" />
            <p className="text-xl">No bestseller books available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  const visibleBooks = getVisibleBooks();

  return (
    <div className="w-full py-8 px-4 bg-neutral-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-3">
          Featured Bestsellers
        </h2>
        <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
          Discover the most popular books loved by readers worldwide
        </p>
      </div>

      {/* Main Slider Container */}
      <div className="relative max-w-6xl mx-auto">
        {/* Carousel */}
        <div className="relative h-96 bg-white rounded-lg shadow-md border border-neutral-200 overflow-hidden">
          {/* Books Display */}
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
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
                      transform: `translateX(${position * 280}px) scale(${isCenter ? 1.1 : 0.9})`,
                      opacity: isCenter ? 1 : 0.6
                    }}
                    onClick={() => !isCenter && goToSlide(index)}
                  >
                    {/* Modern Book Card Style */}
                    <div className={`relative group ${isCenter ? 'w-56 h-72' : 'w-48 h-64'}`}>
                      <div className="w-full h-full bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden border border-neutral-200 transform group-hover:scale-105 transition-all duration-300">
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
                          className="w-full h-full bg-neutral-100 flex items-center justify-center" 
                          style={{ display: book.cover_url ? 'none' : 'flex' }}
                        >
                          <div className="text-center px-4">
                            <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                            <p className="text-neutral-700 text-sm font-medium text-center leading-tight">
                              {book.title}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Center book overlay */}
                      {isCenter && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                      
                      {/* Subtle glow effect for center book */}
                      {isCenter && (
                        <div className="absolute -inset-1 bg-primary-500/20 rounded-lg blur opacity-30"></div>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-neutral-50 border border-neutral-200 shadow-md rounded-full p-3 transition-all duration-200 hover:scale-110 disabled:opacity-50 z-40"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-neutral-50 border border-neutral-200 shadow-md rounded-full p-3 transition-all duration-200 hover:scale-110 disabled:opacity-50 z-40"
          >
            <ChevronRight className="w-5 h-5 text-neutral-700" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center mt-6 space-x-6">
          {/* Play/Pause Button */}
          <button
            onClick={toggleAutoPlay}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                    ? 'bg-primary-600 scale-125'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Book Counter */}
        <div className="text-center mt-4 text-neutral-600">
          <span className="text-sm font-medium">
            {currentIndex + 1} of {books.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BestsellerSlider;