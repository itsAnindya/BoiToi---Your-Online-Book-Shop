import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
import { User, BookOpen, Calendar, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button, { BackToAuthorsButton } from '../components/ui/Button';

const AuthorDetailPage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuthorDetails();
  }, [id]);

  const fetchAuthorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/authors/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch author details');
      }
      
      const result = await response.json();
      const authorData = result.data;
      
      setAuthor(authorData);
      setAuthorBooks(authorData.BOOKS || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching author details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      // Parse the date as-is since it's already a DATE type in DB
      // Don't add time to avoid any timezone conversion issues
      const dateParts = dateString.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is 0-based in JS Date
        const day = parseInt(dateParts[2]);
        const date = new Date(year, month, day);
        
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return dateString;
    } catch {
      return dateString;
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
                <p className="text-lg text-neutral-600">Loading author details...</p>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !author) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="text-red-600 mb-4">
                <User className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">Author Not Found</h2>
              </div>
              <p className="text-red-700 mb-4">{error || 'Author not found'}</p>
              <BackToAuthorsButton />
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
          <BackToAuthorsButton />

          {/* Author Header */}
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden mb-8">
            <div className="md:flex">
              {/* Author Photo */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="aspect-square bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  {author.PHOTO_URL ? (
                    <img
                      src={author.PHOTO_URL}
                      alt={author.NAME}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full flex items-center justify-center ${author.PHOTO_URL ? 'hidden' : 'flex'}`}
                  >
                    <User className="w-24 h-24 text-white" />
                  </div>
                </div>
              </div>

              {/* Author Info */}
              <div className="md:w-2/3 lg:w-3/4 p-8">
                <h1 className="text-4xl font-bold text-neutral-900 mb-4">{author.NAME}</h1>
                
                {/* Author Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {author.DATE_OF_BIRTH && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-neutral-600">Date of Birth</p>
                        <p className="font-medium">{formatDate(author.DATE_OF_BIRTH)}</p>
                      </div>
                    </div>
                  )}
                  
                  {author.NATIONALITY && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-neutral-600">Nationality</p>
                        <p className="font-medium">{author.NATIONALITY}</p>
                      </div>
                    </div>
                  )}

                  {/* Show message when both fields are null */}
                  {!author.DATE_OF_BIRTH && !author.NATIONALITY && (
                    <div className="col-span-full text-center py-4">
                      <p className="text-neutral-500 italic">Personal details not available</p>
                    </div>
                  )}
                </div>

                {/* Website */}
                {author.WEBSITE && (
                  <div className="mb-6">
                    <a
                      href={author.WEBSITE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Bio */}
                {author.BIO ? (
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-3">Biography</h2>
                    <p className="text-neutral-700 leading-relaxed">{author.BIO}</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-neutral-500 italic">Biography not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Author's Books */}
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Books by {author.NAME}
              </h2>
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {authorBooks.length} book{authorBooks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {authorBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-600 mb-2">No books available</h3>
                <p className="text-neutral-500">This author doesn't have any books in our collection yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {authorBooks.map((book) => (
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
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight hover:text-primary-600 transition-colors">
                          {book.TITLE}
                        </h3>
                      </Link>

                      {book.SUMMARY && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {book.SUMMARY}
                        </p>
                      )}

                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                          <span>{book.PUBLICATION_DATE ? new Date(book.PUBLICATION_DATE).getFullYear() : 'N/A'}</span>
                          {book.PAGE_COUNT && <span>{book.PAGE_COUNT} pages</span>}
                        </div>
                        
                        {book.PRICE && (
                          <span className="text-lg font-bold text-primary-600">
                            ${parseFloat(book.PRICE).toFixed(2)}
                          </span>
                        )}
                      </div>
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

export default AuthorDetailPage;
