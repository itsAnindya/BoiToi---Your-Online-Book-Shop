import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BestsellerCard from './BestsellerCard';

// Hero Section Component
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bestsellers = [
    {
      id: 1,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      price: "$14.99",
      originalPrice: "$19.99",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      rating: 4.8,
      reviews: 12543
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      price: "$16.99",
      originalPrice: "$22.99",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
      rating: 4.9,
      reviews: 8765
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      price: "$15.99",
      originalPrice: "$20.99",
      image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop",
      rating: 4.7,
      reviews: 9876
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bestsellers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bestsellers.length) % bestsellers.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bestsellers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bestsellers.length]);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(156,146,172,0.1) 1px, transparent 0)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Bestsellers
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular books that everyone's talking about
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center">
            <button 
              onClick={prevSlide}
              className="absolute left-4 z-10 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
            </button>

            <div className="w-full max-w-4xl">
              <BestsellerCard book={bestsellers[currentSlide]} />
            </div>

            <button 
              onClick={nextSlide}
              className="absolute right-4 z-10 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
            </button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {bestsellers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;