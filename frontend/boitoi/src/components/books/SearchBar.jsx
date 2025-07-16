import React, { memo } from 'react';
import { Search } from 'lucide-react';

const SearchBar = memo(({ 
  searchQuery, 
  onSearchChange, 
  onKeyPress,
  placeholder = "Search books by title or author..."
}) => {
  return (
    <div className="sticky top-16 bg-white z-40 border-b border-neutral-200 px-6 py-4 shadow-soft">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={onSearchChange}
            onKeyPress={onKeyPress}
            className="w-full pl-12 pr-4 py-3 text-lg border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-neutral-400"
          />
        </div>
      </div>
    </div>
  );
});

export default SearchBar;