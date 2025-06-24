import { BookOpen } from "lucide-react";

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">BoiToi</span>
          </div>
          <p className="text-gray-400 mb-6">Your trusted online bookshop for discovering amazing stories and knowledge.</p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Books</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Authors</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Publishers</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Genres</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Shipping Info</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Returns</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
          <p className="text-gray-400 mb-4">Get the latest updates on new releases and special offers.</p>
          <div className="flex space-x-2">
            <input 
              type="email" 
              placeholder="Your email"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2025 BoiToi. All rights reserved. Made with ❤️ for book lovers.</p>
      </div>
    </div>
  </footer>
);

export default Footer;