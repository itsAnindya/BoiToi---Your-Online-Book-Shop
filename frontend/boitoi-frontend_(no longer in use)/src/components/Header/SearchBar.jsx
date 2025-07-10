import { Search } from 'lucide-react';

// Search Bar Component
const SearchBar = () => (
  <div className="flex items-center space-x-2" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
    <input
      type="text"
      placeholder="Search books..."
      
      style={{ width: "256px" }}
      autoComplete="on"
      className="w-64 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-black"
    />
    <div className="bg-white border border-gray-300 border-l-0 rounded-r-full p-2 flex items-center">
      <Search className="w-5 h-5 text-gray-400" />
    </div>
  </div>
);

export default SearchBar;