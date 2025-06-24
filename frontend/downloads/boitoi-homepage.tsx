import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, ChevronLeft, ChevronRight, BookOpen, Users, Building2, Tag } from 'lucide-react';

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BoiToi
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavItem icon={<BookOpen className="w-4 h-4" />} text="Books" />
            <NavItem icon={<Tag className="w-4 h-4" />} text="Genre" />
            <NavItem icon={<Users className="w-4 h-4" />} text="Authors" />
            <NavItem icon={<Building2 className="w-4 h-4" />} text="Publishers" />
          </nav>

          <div className="flex items-center space-x-4">
            <SearchBar />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

// Navigation Item Component
const NavItem = ({ icon, text }) => (
  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group">
    <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span className="font-medium">{text}</span>
  </button>
);

// Search Bar Component
const SearchBar = () => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search books..."
      className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
  </div>
);

// Cart Icon Component
const CartIcon = () => (
  <button className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group">
    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
      3
    </span>
  </button>
);

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

// Bestseller Card Component
const BestsellerCard = ({ book }) => {
  const discount = Math.round(((parseFloat(book.originalPrice.slice(1)) - parseFloat(book.price.slice(1))) / parseFloat(book.originalPrice.slice(1))) * 100);
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <img 
            src={book.image} 
            alt={book.title}
            className="w-64 h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h2>
          <p className="text-2xl text-gray-600 mb-6">by {book.author}</p>
          
          <div className="flex items-center justify-center md:justify-start mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="ml-2 text-gray-600">({book.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-4 mb-8">
            <span className="text-3xl font-bold text-green-600">{book.price}</span>
            <span className="text-xl text-gray-500 line-through">{book.originalPrice}</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Save {discount}%
            </span>
          </div>

          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Book Categories Section
const BookCategories = () => {
  const categories = [
    {
      title: "Fiction",
      books: [
        { id: 1, title: "The Midnight Library", author: "Matt Haig", price: "$13.99", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop", rating: 4.6 },
        { id: 2, title: "Klara and the Sun", author: "Kazuo Ishiguro", price: "$15.99", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", rating: 4.4 },
        { id: 3, title: "The Guest List", author: "Lucy Foley", price: "$14.99", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop", rating: 4.5 },
        { id: 4, title: "Where the Crawdads Sing", author: "Delia Owens", price: "$16.99", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", rating: 4.8 }
      ]
    },
    {
      title: "Non-Fiction",
      books: [
        { id: 5, title: "Educated", author: "Tara Westover", price: "$17.99", image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&h=400&fit=crop", rating: 4.7 },
        { id: 6, title: "Becoming", author: "Michelle Obama", price: "$18.99", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop", rating: 4.9 },
        { id: 7, title: "The Body Keeps the Score", author: "Bessel van der Kolk", price: "$19.99", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop", rating: 4.6 },
        { id: 8, title: "Sapiens", author: "Yuval Noah Harari", price: "$20.99", image: "https://images.unsplash.com/photo-1533327325824-76bc4e62d560?w=300&h=400&fit=crop", rating: 4.8 }
      ]
    },
    {
      title: "Mystery & Thriller",
      books: [
        { id: 9, title: "Gone Girl", author: "Gillian Flynn", price: "$14.99", image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop", rating: 4.3 },
        { id: 10, title: "The Silent Patient", author: "Alex Michaelides", price: "$15.99", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300&h=400&fit=crop", rating: 4.5 },
        { id: 11, title: "Big Little Lies", author: "Liane Moriarty", price: "$13.99", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop", rating: 4.4 },
        { id: 12, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", price: "$16.99", image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=400&fit=crop", rating: 4.6 }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => (
          <CategorySection key={category.title} category={category} index={index} />
        ))}
      </div>
    </section>
  );
};

// Category Section Component
const CategorySection = ({ category, index }) => (
  <div className={`mb-20 ${index % 2 === 1 ? 'bg-white rounded-3xl p-8 shadow-lg' : ''}`}>
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-4xl font-bold text-gray-900">{category.title}</h2>
      <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-2 group">
        <span>View All</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {category.books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  </div>
);

// Book Card Component
const BookCard = ({ book }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2">
    <div className="relative">
      <img 
        src={book.image} 
        alt={book.title}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ShoppingCart className="w-4 h-4 text-gray-700" />
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
      <p className="text-gray-600 mb-3">{book.author}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          ))}
          <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
        </div>
        <span className="text-lg font-bold text-green-600">{book.price}</span>
      </div>
    </div>
  </div>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">BoiToi</span>
          </div>
          <p className="text-gray-400 mb-6">Your trusted online bookshop for discovering amazing stories and knowledge.</p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Books</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Authors</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Publishers</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Genres</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Shipping Info</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Returns</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
          <p className="text-gray-400 mb-4">Get the latest updates on new releases and special offers.</p>
          <div className="flex space-x-2">
            <input 
              type="email" 
              placeholder="Your email"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2025 BoiToi. All rights reserved. Made with ❤️ for book lovers.</p>
      </div>
    </div>
  </footer>
);

// Main Homepage Component
const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <BookCategories />
      <Footer />
    </div>
  );
};

export default Homepage;