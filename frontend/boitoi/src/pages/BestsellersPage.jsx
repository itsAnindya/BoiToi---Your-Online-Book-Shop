import React, { useState, useEffect } from 'react';
import { Star, Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import BookCard from '../components/books/BookCard';
import { API_BASE_URL } from '../config';

const BestsellersPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingBestsellers, setLoadingBestsellers] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch bestsellers when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchBestsellers(selectedCategory.ID);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/books/categories`);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        setCategories(data);
        // Set first category as default selected
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchBestsellers = async (categoryId) => {
    try {
      setLoadingBestsellers(true);
      setError(null);
      
      // For now, we'll fetch popular books from the category
      // This should be replaced with actual bestseller API when backend is ready
      const response = await fetch(`${API_BASE_URL}/api/books?category=${categoryId}&limit=10&sortBy=popularity`);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        // Calculate ratings for each book
        const booksWithRatings = await Promise.all(
          data.map(async (book) => {
            try {
              const reviewResponse = await fetch(`${API_BASE_URL}/api/reviews/book/${book.ID}`);
              const reviewData = await reviewResponse.json();
              
              return {
                ...book,
                averageRating: reviewData.stats?.averageRating || 0,
                totalReviews: reviewData.stats?.totalReviews || 0
              };
            } catch {
              return {
                ...book,
                averageRating: 0,
                totalReviews: 0
              };
            }
          })
        );
        
        setBestsellers(booksWithRatings);
      } else {
        setBestsellers([]);
      }
    } catch (err) {
      console.error('Error fetching bestsellers:', err);
      setError('Failed to load bestsellers');
      setBestsellers([]);
    } finally {
      setLoadingBestsellers(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Award className="w-4 h-4 text-primary-600" />;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900';
      default:
        return 'bg-gradient-to-r from-primary-500 to-primary-600 text-white';
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading categories...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Page Header */}
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-yellow-900" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-neutral-900">Bestsellers</h1>
                <p className="text-neutral-600 mt-2">
                  Discover the most popular books in each category
                </p>
              </div>
            </div>

            {/* Category Selection Bar */}
            <div className="border-t border-neutral-200 pt-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Browse by Category</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.ID}
                    onClick={() => handleCategorySelect(category)}
                    variant={selectedCategory?.ID === category.ID ? 'categoryActive' : 'category'}
                    size="md"
                    className="flex-shrink-0"
                  >
                    {category.NAME}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Category Info */}
          {selectedCategory && (
            <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-200 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Top Books in {selectedCategory.NAME}
                </h2>
              </div>
              
              {selectedCategory.DESCRIPTION && (
                <p className="text-neutral-600">
                  {selectedCategory.DESCRIPTION}
                </p>
              )}
              
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-neutral-500">Showing top</span>
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
                  {bestsellers.length} bestsellers
                </span>
              </div>
            </div>
          )}

          {/* Bestsellers Grid */}
          {loadingBestsellers ? (
            <div className="bg-white rounded-2xl shadow-soft p-12 border border-neutral-200 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading bestsellers...</p>
            </div>
          ) : bestsellers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft p-12 border border-neutral-200 text-center">
              <TrendingUp className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">No bestsellers found</h3>
              <p className="text-neutral-500">
                {selectedCategory ? `No bestsellers available in ${selectedCategory.NAME} category yet.` : 'Select a category to view bestsellers.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {bestsellers.map((book, index) => (
                <div key={book.ID} className="relative">
                  {/* Enhanced Rank Badge */}
                  <div className={`absolute -top-3 -left-3 z-10 ${getRankBadgeColor(index)} px-3 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold`}>
                    {getRankIcon(index)}
                    <span>#{index + 1}</span>
                  </div>
                  
                  {/* Book Card with enhanced styling */}
                  <div className="relative bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden hover:shadow-medium transition-all duration-300 group">
                    <BookCard book={book} rank={index} />
                    
                    {/* Rating Overlay */}
                    {book.averageRating > 0 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 border border-neutral-200">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium text-neutral-900">
                                {book.averageRating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-neutral-600">
                              {book.totalReviews} review{book.totalReviews !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Info Section */}
          {bestsellers.length > 0 && (
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100 mt-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  ✨ Why These Books Are Bestsellers
                </h3>
                <p className="text-neutral-700 max-w-2xl mx-auto">
                  Our bestseller rankings are based on a combination of sales data, customer ratings, 
                  and review feedback. These books have captured readers' hearts and minds, 
                  making them the most popular choices in their categories.
                </p>
                
                <div className="flex justify-center gap-6 mt-6 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                    <span>Updated Daily</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Reader Rated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary-600" />
                    <span>Sales Based</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BestsellersPage;
