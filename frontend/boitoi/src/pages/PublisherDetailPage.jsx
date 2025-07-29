import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import { Building2, BookOpen, Mail, ArrowLeft, Building, Phone, Globe, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublisherDetailPage = () => {
  const { id } = useParams();
  const [publisher, setPublisher] = useState(null);
  const [publisherBooks, setPublisherBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublisherDetails();
  }, [id]);

  const fetchPublisherDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/publisher/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch publisher details');
      }
      
      const result = await response.json();
      const publisherData = result.publisher;
      
      setPublisher(publisherData);
      setPublisherBooks(publisherData.books || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching publisher details:', err);
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
                <p className="text-lg text-neutral-600">Loading publisher details...</p>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !publisher) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="text-red-600 mb-4">
                <Building2 className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">Publisher Not Found</h2>
              </div>
              <p className="text-red-700 mb-4">{error || 'Publisher not found'}</p>
              <Link
                to="/publishers"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Publishers
              </Link>
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
          
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/publishers"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Publishers
            </Link>
          </div>

          {/* Publisher Header */}
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden mb-8">
            <div className="md:flex">
              {/* Publisher Logo/Icon */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="aspect-square bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Building className="w-24 h-24 text-white" />
                </div>
              </div>

              {/* Publisher Info */}
              <div className="md:w-2/3 lg:w-3/4 p-8">
                <h1 className="text-4xl font-bold text-neutral-900 mb-4">{publisher.PUBLISHER_NAME}</h1>
                
                {/* Publisher Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Contact Information</h3>
                    
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-neutral-600">Email</p>
                        {publisher.EMAIL && publisher.EMAIL !== 'NULL' ? (
                          <a 
                            href={`mailto:${publisher.EMAIL}`}
                            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            {publisher.EMAIL}
                          </a>
                        ) : (
                          <p className="font-medium text-neutral-400">NULL</p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-neutral-600">Phone</p>
                        {publisher.PHONE && publisher.PHONE !== 'NULL' ? (
                          <a 
                            href={`tel:${publisher.PHONE}`}
                            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            {publisher.PHONE}
                          </a>
                        ) : (
                          <p className="font-medium text-neutral-400">NULL</p>
                        )}
                      </div>
                    </div>

                    {/* Website */}
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-neutral-600">Website</p>
                        {publisher.WEBSITE && publisher.WEBSITE !== 'NULL' ? (
                          <a 
                            href={publisher.WEBSITE.startsWith('http') ? publisher.WEBSITE : `https://${publisher.WEBSITE}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            {publisher.WEBSITE}
                          </a>
                        ) : (
                          <p className="font-medium text-neutral-400">NULL</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Address Information</h3>
                    
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-600">Address</p>
                        <p className="font-medium">
                          {publisher.ADDRESS && publisher.ADDRESS !== 'NULL' ? publisher.ADDRESS : 'NULL'}
                        </p>
                      </div>
                    </div>

                    {/* City */}
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-neutral-600">City</p>
                        <p className="font-medium">
                          {publisher.CITY && publisher.CITY !== 'NULL' ? publisher.CITY : 'NULL'}
                        </p>
                      </div>
                    </div>

                    {/* State */}
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-neutral-600">State</p>
                        <p className="font-medium">
                          {publisher.STATE && publisher.STATE !== 'NULL' ? publisher.STATE : 'NULL'}
                        </p>
                      </div>
                    </div>

                    {/* Country */}
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-neutral-600">Country</p>
                        <p className="font-medium">
                          {publisher.COUNTRY && publisher.COUNTRY !== 'NULL' ? publisher.COUNTRY : 'NULL'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Books Count Info */}
                <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-neutral-600">Books Published</p>
                    <p className="font-medium">{publisherBooks.length} book{publisherBooks.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Publisher Description */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">About {publisher.PUBLISHER_NAME}</h2>
                  <p className="text-neutral-700 leading-relaxed">
                    {publisher.PUBLISHER_NAME} is a trusted publisher in our collection, bringing quality books to readers worldwide. 
                    Explore their diverse catalog of publications spanning various genres and topics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Publisher's Books */}
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Books by {publisher.PUBLISHER_NAME}
              </h2>
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {publisherBooks.length} book{publisherBooks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {publisherBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-600 mb-2">No books available</h3>
                <p className="text-neutral-500">This publisher doesn't have any books in our collection yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {publisherBooks.map((book) => (
                  <div key={book.BOOK_ID} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Link to={`/books/${book.BOOK_ID}`} className="no-underline text-inherit">
                        {book.COVER_URL ? (
                          <img
                            src={book.COVER_URL}
                            alt={book.TITLE}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-48 bg-gradient-to-br from-neutral-400 to-neutral-600 flex items-center justify-center hover:scale-105 transition-transform duration-300 ${book.COVER_URL ? 'hidden' : 'flex'}`}
                        >
                          <BookOpen className="w-16 h-16 text-white" />
                        </div>
                      </Link>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <Link to={`/books/${book.BOOK_ID}`} className="no-underline text-inherit">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-primary-600 transition-colors text-center">
                          {book.TITLE}
                        </h3>
                      </Link>

                      {book.AUTHORS && (
                        <p className="text-sm text-gray-600 text-center mt-auto">
                          by {book.AUTHORS}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PublisherDetailPage;
