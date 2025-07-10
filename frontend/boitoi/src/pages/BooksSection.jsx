import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import { useBooks } from '../hooks/useBooks';
import { useFilters } from '../hooks/useFilters';
import { API_BASE_URL } from '../config';

import SearchBar from '../components/books/SearchBar';
import FilterSidebar from '../components/books/FilterSidebar';
import BookGrid from '../components/books/BookGrid';
import LoadingState from '../components/books/LoadingState';
import ErrorState from '../components/books/ErrorState';
import EmptyState from '../components/books/EmptyState';

const BooksSection = ({ apiBaseUrl = `${API_BASE_URL}/api` }) => {
  // Custom hooks
  const { allBooks, categoriesData, loading, error, refetch } = useBooks(apiBaseUrl);
  const {
    filteredBooks,
    searchQuery,
    setSearchQuery,
    priceFilter,
    setPriceFilter,
    activeFilters,
    clearFilters,
    applyFilters
  } = useFilters(allBooks);

  // Event handlers
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleKeyPress = (e) => e.key === 'Enter' && applyFilters();
  const handlePriceFilterApply = () => applyFilters();
  const handleClearSearch = () => setSearchQuery('');
  const handleClearPrice = () => setPriceFilter({ min: '', max: '' });
  const handleViewAll = (category) => {
    console.log('View all books for category:', category.category_name);
  };

  // Loading state
  if (loading) {
    return (
      <LoadingState
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onKeyPress={handleKeyPress}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onKeyPress={handleKeyPress}
      />
    );
  }

  // Main render
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />

        <div className="flex">
          <FilterSidebar
            priceFilter={priceFilter}
            onPriceFilterChange={setPriceFilter}
            onPriceFilterApply={handlePriceFilterApply}
            activeFilters={activeFilters}
            onClearFilters={clearFilters}
            onClearSearch={handleClearSearch}
            onClearPrice={handleClearPrice}
          />

          <div className="flex-1 p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Books</h1>
              <p className="text-gray-600">
                {activeFilters.search || activeFilters.price
                  ? `Found ${filteredBooks.length} books matching your criteria`
                  : 'Discover books across all categories'
                }
              </p>
            </div>

            {filteredBooks.length > 0 ? (
              <BookGrid
                categoriesData={categoriesData}
                filteredBooks={filteredBooks}
                activeFilters={activeFilters}
                onViewAll={handleViewAll}
              />
            ) : (
              <EmptyState activeFilters={activeFilters} />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BooksSection;

// import SearchBar from '../components/SearchBar';
// import FilterSidebar from '../components/FilterSidebar';
// import React, { useState, useEffect, memo } from 'react';
// import DefaultLayout from '../layouts/DefaultLayout';
// import { API_BASE_URL } from '../config';
// import { Search, Filter, ShoppingCart, Star, AlertCircle, X } from 'lucide-react';

// const BooksSection = ({ apiBaseUrl = `${API_BASE_URL}/api` }) => {
//   /* --------------------------- state -------------------------------- */
//   const [allBooks, setAllBooks] = useState([]);
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [categoriesData, setCategoriesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [activeFilters, setActiveFilters] = useState({ search: '', price: null });

//   /* -------------------------- effects ------------------------------- */
//   useEffect(() => { fetchBooks(); }, []);
//   useEffect(() => { applyFilters(); }, [searchQuery, priceFilter, allBooks]);

//   /* ----------------------- data fetcher ----------------------------- */
//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${apiBaseUrl}/books/categories`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}`);
//       }

//       const data = await res.json();

//       // Flatten books from all categories
//       const books = data.reduce((acc, category) => {
//         const categoryBooks = category.top_books.map(book => ({
//           ...book,
//           category_name: category.category_name,
//           category_id: category.category_id
//         }));
//         return [...acc, ...categoryBooks];
//       }, []);

//       setCategoriesData(data);
//       setAllBooks(books);
//       setFilteredBooks(books);
//     } catch (e) {
//       console.error('Fetch error:', e);
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ----------------------- filter logic ----------------------------- */
//   const applyFilters = () => {
//     let filtered = [...allBooks];

//     // Apply search filter
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(book =>
//         book.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         book.AUTHORS?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Apply price filter
//     if (priceFilter.min !== '' || priceFilter.max !== '') {
//       filtered = filtered.filter(book => {
//         const price = parseFloat(book.PRICE) || 0;
//         const min = priceFilter.min === '' ? 0 : parseFloat(priceFilter.min);
//         const max = priceFilter.max === '' ? Infinity : parseFloat(priceFilter.max);
//         return price >= min && price <= max;
//       });
//     }

//     setFilteredBooks(filtered);

//     // Update active filters for display
//     setActiveFilters({
//       search: searchQuery,
//       price: (priceFilter.min !== '' || priceFilter.max !== '') ? priceFilter : null
//     });
//   };



//   const handlePriceFilterApply = () => {
//     applyFilters();
//     setIsFilterOpen(false);
//   };

//   const clearFilters = () => {
//     setSearchQuery('');
//     setPriceFilter({ min: '', max: '' });
//     setActiveFilters({ search: '', price: null });
//   };

//   /* ------------------------- helpers ------------------------------- */
//   const formatPrice = (p) =>
//     new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
//       .format(p ?? 0);

//   const handleAddToCart = (id, title) =>
//     console.log(`Add to cart → ${id} (${title})`);

//   /* ------------------ presentational bits -------------------------- */
//   const SearchBar = memo(() => (
//     <div className="sticky top-0 bg-white z-50 border-b border-gray-200 px-6 py-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search books by title or author..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
//             className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>
//     </div>
//   ));

//   const FilterSidebar = memo(() => (
//     <div className="w-64 bg-white border-r border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//         {(activeFilters.search || activeFilters.price) && (
//           <button
//             onClick={clearFilters}
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             Clear all
//           </button>
//         )}
//       </div>

//       {/* Price Filter */}
//       <div className="mb-6">
//         <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
//         <div className="space-y-3">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Min Price ($)</label>
//             <input
//               type="number"
//               placeholder="0"
//               value={priceFilter.min}
//               onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Max Price ($)</label>
//             <input
//               type="number"
//               placeholder="999"
//               value={priceFilter.max}
//               onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button
//             onClick={handlePriceFilterApply}
//             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Apply
//           </button>
//         </div>
//       </div>

//       {/* Active Filters */}
//       {(activeFilters.search || activeFilters.price) && (
//         <div className="mb-6">
//           <h3 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h3>
//           <div className="space-y-2">
//             {activeFilters.search && (
//               <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
//                 <span className="text-sm text-blue-800">Search: "{activeFilters.search}"</span>
//                 <button
//                   onClick={() => setSearchQuery('')}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//             {activeFilters.price && (
//               <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
//                 <span className="text-sm text-blue-800">
//                   Price: ${activeFilters.price.min || '0'} - ${activeFilters.price.max || '∞'}
//                 </span>
//                 <button
//                   onClick={() => setPriceFilter({ min: '', max: '' })}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   ));

//   const BookCard = memo(({ book, rank }) => (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
//       <div className="relative overflow-hidden rounded-t-lg">
//         <img
//           src={book.COVER_URL || '/placeholder-book-cover.jpg'}
//           alt={book.TITLE}
//           className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
//           onError={e => { e.target.src = '/placeholder-book-cover.jpg'; }}
//         />
//         {rank !== undefined && (
//           <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
//             <Star className="w-3 h-3 mr-1" />#{rank + 1}
//           </div>
//         )}
//       </div>

//       <div className="p-4 flex flex-col flex-grow">
//         <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
//           {book.TITLE}
//         </h3>

//         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//           {book.AUTHORS || 'Unknown author'}
//         </p>

//         <div className="mt-auto">
//           <span className="text-lg font-bold text-gray-900">
//             {formatPrice(book.PRICE)}
//           </span>

//           <button
//             onClick={() => handleAddToCart(book.ID, book.TITLE)}
//             className="mt-3 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//           >
//             <ShoppingCart className="w-4 h-4" />
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   ));

//   const BookGrid = memo(() => {
//     if (activeFilters.search || activeFilters.price) {
//       // Show filtered results
//       return (
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">
//               Search Results ({filteredBooks.length})
//             </h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredBooks.map((book) => (
//               <BookCard key={book.ID} book={book} />
//             ))}
//           </div>
//         </div>
//       );
//     }

//     // Show books by category
//     return categoriesData.map(category => (
//       <div key={category.category_id} className="mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">{category.category_name}</h2>
//           <button className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {category.top_books.map((book, idx) => (
//             <BookCard key={book.ID} book={book} rank={idx} />
//           ))}
//         </div>
//       </div>
//     ));
//   });

//   /* ------------------------- render ------------------------------- */
//   if (loading) {
//     return (
//       <DefaultLayout>
//         <div className="min-h-screen bg-gray-50">
//           <SearchBar
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
//           />
//           <div className="flex">
//             <FilterSidebar />
//             <div className="flex-1 p-6">
//               <div className="animate-pulse">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={i} className="mb-8">
//                     <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                       {[...Array(4)].map((_, j) => (
//                         <div key={j} className="bg-gray-200 rounded-lg h-80"></div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </DefaultLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DefaultLayout>
//         <div className="min-h-screen bg-gray-50">
//           <SearchBar
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
//           />
//           <div className="flex">
//             <FilterSidebar />
//             <div className="flex-1 p-6">
//               <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//                 <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Books</h3>
//                 <p className="text-red-600 mb-4">{error}</p>
//                 <button
//                   onClick={fetchBooks}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DefaultLayout>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <SearchBar />
//       <div className="flex">
//         <FilterSidebar />
//         <div className="flex-1 p-6">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Books</h1>
//             <p className="text-gray-600">
//               {activeFilters.search || activeFilters.price
//                 ? `Found ${filteredBooks.length} books matching your criteria`
//                 : 'Discover books across all categories'
//               }
//             </p>
//           </div>

//           {filteredBooks.length > 0 ? (
//             <BookGrid />
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-gray-500 text-lg">
//                 {activeFilters.search || activeFilters.price
//                   ? 'No books found matching your search criteria'
//                   : 'No books available'
//                 }
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BooksSection;