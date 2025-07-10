import { ChevronRight } from 'lucide-react';
import BookCard from './BookCard';

// Category Section Component
const CategorySection = ({ category, index }) => (
  <div className={`mb-20 ${index % 2 === 1 ? 'bg-white rounded-3xl p-8 shadow-lg' : ''}`}>
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-4xl font-bold text-gray-900">{category.title}</h2>
      <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-2 group">
        <span>View All</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {category.books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  </div>
);

export default CategorySection;