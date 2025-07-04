// src/components/Navbar.jsx
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { FaBars, FaTimes, FaBook, FaShoppingCart, FaUser } from 'react-icons/fa';
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
    <nav className="bg-blue-800 text-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/"><div className="flex items-center space-x-2">
            <BookOpen />
            {/* <FaBook className="text-2xl" /> */}
            <span className="font-bold text-xl">BoiToi</span>
          </div></Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.link}
                className="hover:text-slate-100 transition-colors text-slate-100"
              >
                {item.text}
              </a>
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
                <a
                  key={item.id}
                  href={item.link}
                  className="block py-2 hover:bg-amber-700 px-4 rounded transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.text}
                </a>
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
      </div>
    </nav>
  );
};

export default NavBar;


// //Make a responsive navigation bar for BoiToi -- Your Online Bookshop project
// //The navigation bar will include Logo, "BoiToi", Books, Authors, Publishers, About us on the left part.
// //The right part will have a search icon, cart and signin/login button
// //Use react-js

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { BookOpen, Tag, Users, Building2, Search, ShoppingCart } from 'lucide-react';
// import AuthButton from './AuthButton';  // Assuming you have an AuthButton component
// import SearchBar from './SearchBar';  // Assuming you have a SearchBar component
// import CartIcon from './CartIcon';  // Assuming you have a CartIcon component
// // import '../../styles/NavBar.css';  // Assuming you have a CSS file for styles

// const NavBar = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     // Implement search functionality
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Link to="/" className="logo">BoiToi</Link>
//         <Link to="/books" className="nav-link"><BookOpen /> Books</Link>
//         <Link to="/authors" className="nav-link"><Users /> Authors</Link>
//         <Link to="/publishers" className="nav-link"><Building2 /> Publishers</Link>
//         <Link to="/about" className="nav-link">About Us</Link>
//       </div>
//       <div className="navbar-right">
//         <SearchBar onSearch={handleSearch} />
//         <CartIcon />
//         <AuthButton />
//       </div>
//     </nav>
//   );
// };

// export default NavBar;