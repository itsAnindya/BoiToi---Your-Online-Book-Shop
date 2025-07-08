import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const BestsellerBooksSection = ({ apiBaseUrl = API_BASE_URL }) => {
  /* --------------------------- state -------------------------------- */
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /* -------------------------- effects ------------------------------- */
  useEffect(() => { fetchBestsellerBooks(); }, []);

  /* ----------------------- data fetcher ----------------------------- */
  const fetchBestsellerBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/books/categories`, {
        method : 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      /* quick console dump for dev‑check */
      console.log('--- Categories & books from backend ---');
      data.forEach(c => {
        console.log(`Category: ${c.category_name}`);
        c.top_books.forEach(b => console.log(`  • ${b.TITLE}`));
      });

      setCategoriesData(data);
    } catch (e) {
      console.error('Fetch error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------- helpers ------------------------------- */
  const formatPrice = p =>
    new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' })
      .format(p ?? 0);

  const handleAddToCart = (id, title) =>
    console.log(`Add to cart → ${id} (${title})`);

  /* ------------------ presentational bits -------------------------- */
  const BookCard = ({ book, rank }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* cover + rank */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={book.COVER_URL || '/placeholder-book-cover.jpg'}
          alt={book.TITLE}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = '/placeholder-book-cover.jpg'; }}
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <Star className="w-3 h-3 mr-1" />#{rank + 1}
        </div>
      </div>

      {/* details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
          {book.TITLE}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {book.AUTHORS || 'Unknown author'}
        </p>

        <div className="mt-auto">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(book.PRICE)}
          </span>

          <button
            onClick={() => handleAddToCart(book.ID, book.TITLE)}
            className="mt-3 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const CategorySection = ({ category }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{category.category_name}</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {category.top_books.map((b, idx) => (
          <BookCard key={b.ID} book={b} rank={idx} />
        ))}
      </div>
    </div>
  );

  /* ------------------------- render ------------------------------- */
  if (loading) {
    /* skeleton loader */
    return (
      <div className="py-8">
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="bg-gray-200 rounded-lg h-80"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    /* error pane */
    return (
      <div className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Books</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBestsellerBooks}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* main view */
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bestseller Books</h1>
        <p className="text-gray-600">Discover the most popular books in each category</p>
      </div>

      {categoriesData.length ? (
        categoriesData.map(cat => (
          <CategorySection key={cat.category_id} category={cat} />
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bestseller books found</p>
        </div>
      )}
    </div>
  );
};

export default BestsellerBooksSection;
