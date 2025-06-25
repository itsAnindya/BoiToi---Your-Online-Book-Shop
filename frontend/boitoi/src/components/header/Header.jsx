//header, this is the main header component for the BoiToi application
import React from 'react';
import NavBar from './NavBar';
// import '../../styles/Header.css'; // Assuming you have a CSS file for styles

const Header = () => {
  return (
    <header className="header">
      <NavBar />
    </header>
  );
};

export default Header;
