import { BookOpen, Users, Building2, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import NavItem from './NavItem';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';

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

export default Header;