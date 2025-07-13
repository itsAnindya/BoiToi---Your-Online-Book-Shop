import React, { useEffect, useState } from 'react';
import AddToCartButton from '../components/AddToCartButton';
import { useCart } from '../contexts/CartContext';

const CartTestPage = () => {
  const { getCurrentUser } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Sample book data for testing
  const sampleBooks = [
    {
      id: 100,
      title: 'দমফাটানো হাসির মীরাক্কেল জোকস্',
      author: 'Unknown Author',
      price: 200.00,
      cover_url: '/images/books/defaultbook.jpg'
    },
    {
      id: 101,
      title: 'জাদরেল জনি',
      author: 'Unknown Author',
      price: 200.00,
      cover_url: '/images/books/defaultbook.jpg'
    },
    {
      id: 102,
      title: 'পুরুষের যতো অসুখ',
      author: 'Unknown Author',
      price: 200.00,
      cover_url: '/images/books/defaultbook.jpg'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Cart Test Page</h1>
        
        {!user?.id ? (
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4 font-medium">Please login to test cart functionality</p>
            <a href="/auth" className="text-indigo-600 hover:underline font-medium">Go to Login</a>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-lg text-green-600 mb-4">
                Logged in as: <strong>{user.username}</strong> (ID: {user.id})
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
                  <img 
                    src={book.cover_url} 
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                    onError={(e) => {
                      e.target.src = '/images/books/defaultbook.jpg';
                    }}
                  />
                  <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">by {book.author}</p>
                  <p className="text-xl font-bold text-indigo-700 mb-4">৳{book.price}</p>
                  
                  <div className="space-y-2">
                    <AddToCartButton 
                      book={book} 
                      quantity={1}
                      className="w-full"
                    />
                    
                    <AddToCartButton 
                      book={book} 
                      quantity={2}
                      variant="outline"
                      className="w-full"
                    >
                      Add 2 to Cart
                    </AddToCartButton>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a 
                href="/cart" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Cart
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTestPage;
