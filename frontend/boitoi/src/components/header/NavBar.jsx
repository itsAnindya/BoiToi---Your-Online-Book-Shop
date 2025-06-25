//Make a responsive navigation bar for BoiToi -- Your Online Bookshop project
//The navigation bar will include Logo, "BoiToi", Books, Authors, Publishers, About us on the left part.
//The right part will have a search icon, cart and signin/login button
//Use react-js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Tag, Users, Building2, Search, ShoppingCart } from 'lucide-react';
import AuthButton from './AuthButton';  // Assuming you have an AuthButton component
import SearchBar from './SearchBar';  // Assuming you have a SearchBar component
import CartIcon from './CartIcon';  // Assuming you have a CartIcon component
// import '../../styles/NavBar.css';  // Assuming you have a CSS file for styles

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search functionality
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">BoiToi</Link>
        <Link to="/books" className="nav-link"><BookOpen /> Books</Link>
        <Link to="/authors" className="nav-link"><Users /> Authors</Link>
        <Link to="/publishers" className="nav-link"><Building2 /> Publishers</Link>
        <Link to="/about" className="nav-link">About Us</Link>
      </div>
      <div className="navbar-right">
        <SearchBar onSearch={handleSearch} />
        <CartIcon />
        <AuthButton />
      </div>
    </nav>
  );
};

export default NavBar;