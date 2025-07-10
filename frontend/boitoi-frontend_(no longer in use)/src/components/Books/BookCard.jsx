import { ShoppingCart, Star } from "lucide-react";

// Book Card Component
const BookCard = ({ book }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2">
    <div className="relative">
      <img 
        src={book.image} 
        alt={book.title}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ShoppingCart className="w-4 h-4 text-gray-700" />
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
      <p className="text-gray-600 mb-3">{book.author}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          ))}
          <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
        </div>
        <span className="text-lg font-bold text-green-600">{book.price}</span>
      </div>
    </div>
  </div>
);

export default BookCard;