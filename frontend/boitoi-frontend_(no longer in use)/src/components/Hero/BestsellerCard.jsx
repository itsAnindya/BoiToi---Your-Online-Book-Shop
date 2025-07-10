import { Star } from "lucide-react";

// Bestseller Card Component
const BestsellerCard = ({ book }) => {
  const discount = Math.round(((parseFloat(book.originalPrice.slice(1)) - parseFloat(book.price.slice(1))) / parseFloat(book.originalPrice.slice(1))) * 100);
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <img 
            src={book.image} 
            alt={book.title}
            className="w-64 h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h2>
          <p className="text-2xl text-gray-600 mb-6">by {book.author}</p>
          
          <div className="flex items-center justify-center md:justify-start mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="ml-2 text-gray-600">({book.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-4 mb-8">
            <span className="text-3xl font-bold text-green-600">{book.price}</span>
            <span className="text-xl text-gray-500 line-through">{book.originalPrice}</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Save {discount}%
            </span>
          </div>

          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BestsellerCard;