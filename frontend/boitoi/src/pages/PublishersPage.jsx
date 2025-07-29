import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import { Building2, BookOpen, Search, Filter, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublishersPage = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPublishers, setFilteredPublishers] = useState([]);

  useEffect(() => {
    fetchPublishers();
  }, []);

  useEffect(() => {
    // Filter publishers based on search query
    if (searchQuery.trim() === '') {
      setFilteredPublishers(publishers);
    } else {
      const filtered = publishers.filter(publisher =>
        publisher.PUBLISHER_NAME.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPublishers(filtered);
    }
  }, [publishers, searchQuery]);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/publisher`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch publishers');
      }
      
      const result = await response.json();
      // Extract the publishers array from the response
      const publishersData = result.publishers || result.data || result;
      setPublishers(publishersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching publishers:', err);
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
                <p className="text-lg text-neutral-600">Loading publishers...</p>
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
                <Building2 className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">Error Loading Publishers</h2>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={fetchPublishers}
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
              <Building2 className="w-10 h-10 text-primary-600" />
              <h1 className="text-4xl font-bold text-neutral-900">Publishers</h1>
            </div>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover the publishing houses behind your favorite books. Explore our collection of trusted publishers.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 border border-neutral-200">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search publishers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Publishers Count */}
          <div className="mb-8">
            <p className="text-neutral-600 text-center">
              {searchQuery ? (
                <>Showing {filteredPublishers.length} of {publishers.length} publishers</>
              ) : (
                <>Showing {publishers.length} publisher{publishers.length !== 1 ? 's' : ''}</>
              )}
            </p>
          </div>

          {/* Publishers Grid */}
          {filteredPublishers.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                {searchQuery ? 'No publishers found' : 'No publishers available'}
              </h3>
              <p className="text-neutral-500">
                {searchQuery 
                  ? 'Try adjusting your search criteria.' 
                  : 'Publishers will appear here once they\'re added to the system.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredPublishers.map((publisher) => (
                <div 
                  key={publisher.PUBLISHER_ID || publisher.PUBLISHER_NAME} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Publisher Logo/Icon */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link to={`/publisher/${publisher.PUBLISHER_ID}`} className="no-underline text-inherit">
                      <div className="w-full h-48 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                        <Building className="w-16 h-16 text-white" />
                      </div>
                    </Link>
                  </div>

                  {/* Publisher Name */}
                  <div className="p-4 flex flex-col flex-grow">
                    <Link to={`/publisher/${publisher.PUBLISHER_ID}`} className="no-underline text-inherit">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight text-center group-hover:text-primary-600 transition-colors">
                        {publisher.PUBLISHER_NAME}
                      </h3>
                    </Link>
                    {publisher.EMAIL && (
                      <p className="text-sm text-gray-500 text-center mt-2 truncate">
                        {publisher.EMAIL}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Featured Publishers Section */}
          {!searchQuery && publishers.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
                Featured Publishers
              </h2>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center border border-primary-100">
                <p className="text-neutral-700 mb-4">
                  Discover more amazing publishers and their incredible book collections in our extensive library.
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

export default PublishersPage;
