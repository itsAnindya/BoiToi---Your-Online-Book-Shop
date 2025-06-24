import { Search } from 'lucide-react';

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

export default SearchBar;