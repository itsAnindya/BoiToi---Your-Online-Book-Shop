import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import { Users, BookOpen, Search, Filter, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState([]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    // Filter authors based on search query
    if (searchQuery.trim() === '') {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter(author =>
        author.NAME.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAuthors(filtered);
    }
  }, [authors, searchQuery]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/authors`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch authors');
      }
      
      const result = await response.json();
      // Extract the data array from the response
      const authorsData = result.data || result;
      setAuthors(authorsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-lg text-neutral-600">Loading authors...</p>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="text-red-600 mb-4">
                <Users className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">Error Loading Authors</h2>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={fetchAuthors}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-10 h-10 text-primary-600" />
              <h1 className="text-4xl font-bold text-neutral-900">Authors</h1>
            </div>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover the brilliant minds behind your favorite books. Explore our collection of talented authors.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 border border-neutral-200">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Authors Count */}
          <div className="mb-8">
            <p className="text-neutral-600 text-center">
              {searchQuery ? (
                <>Showing {filteredAuthors.length} of {authors.length} authors</>
              ) : (
                <>Showing {authors.length} author{authors.length !== 1 ? 's' : ''}</>
              )}
            </p>
          </div>

          {/* Authors Grid */}
          {filteredAuthors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                {searchQuery ? 'No authors found' : 'No authors available'}
              </h3>
              <p className="text-neutral-500">
                {searchQuery 
                  ? 'Try adjusting your search criteria.' 
                  : 'Authors will appear here once they\'re added to the system.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAuthors.map((author) => (
                <div 
                  key={author.ID || author.NAME} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Author Photo */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link to={`/author/${author.ID}`} className="no-underline text-inherit">
                      {author.PHOTO_URL ? (
                        <img
                          src={author.PHOTO_URL}
                          alt={author.NAME}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-full h-48 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center hover:scale-105 transition-transform duration-300 ${author.PHOTO_URL ? 'hidden' : 'flex'}`}
                      >
                        <User className="w-16 h-16 text-white" />
                      </div>
                    </Link>
                  </div>

                  {/* Author Name */}
                  <div className="p-4 flex flex-col flex-grow">
                    <Link to={`/author/${author.ID}`} className="no-underline text-inherit">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight text-center group-hover:text-primary-600 transition-colors">
                        {author.NAME}
                      </h3>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Featured Authors Section (if you want to highlight some authors) */}
          {!searchQuery && authors.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
                Featured Authors
              </h2>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center border border-primary-100">
                <p className="text-neutral-700 mb-4">
                  Discover more amazing authors and their incredible works in our extensive collection.
                </p>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                >
                  <BookOpen className="w-5 h-5" />
                  Browse All Books
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AuthorsPage;
