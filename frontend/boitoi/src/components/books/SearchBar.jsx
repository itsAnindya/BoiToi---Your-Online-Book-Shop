import React, { memo } from 'react';
import { Search } from 'lucide-react';

const SearchBar = memo(({ 
  searchQuery, 
  onSearchChange, 
  onKeyPress,
  placeholder = "Search books by title or author..."
}) => {
  return (
    <div className="sticky top-16 bg-white z-40 border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={onSearchChange}
            onKeyPress={onKeyPress}
            className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
});

export default SearchBar;