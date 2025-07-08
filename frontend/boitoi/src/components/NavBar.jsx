import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { FaBars, FaTimes, FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 1, text: 'Home', link: '/' },
    { id: 2, text: 'Books', link: '/books' },
    { id: 3, text: 'Categories', link: '/categories' },
    { id: 4, text: 'Bestsellers', link: '/bestsellers' },
    { id: 5, text: 'Authors', link: '/authors' },
    { id: 6, text: 'Publishers', link: '/publishers' },
    { id: 7, text: 'About', link: '/about' },
    { id: 8, text: 'Contact', link: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-800 text-white shadow-lg h-16 z-50">
      <div className="max-w-6xl mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen />
          <span className="font-bold text-xl">BoiToi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="hover:text-slate-100 transition-colors text-slate-100"
            >
              {item.text}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="hidden md:flex space-x-6">
          <button className="hover:text-amber-200 transition-colors">
            <FaShoppingCart className="text-xl" />
          </button>
          <Link to="/auth">
            <button className="hover:text-amber-200 transition-colors">
              <FaUser className="text-xl" />
            </button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden py-4 border-t border-amber-700">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="block py-2 hover:bg-amber-700 px-4 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.text}
              </Link>
            ))}
            <div className="flex space-x-6 pt-4 justify-center">
              <button className="p-2 hover:bg-amber-700 rounded-full">
                <FaShoppingCart />
              </button>
              <button className="p-2 hover:bg-amber-700 rounded-full">
                <FaUser />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
