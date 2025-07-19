const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const bookController = require('./controllers/bookController');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/api/books/all', bookController.getAllBooks);

const PORT = 3335;
app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  
  // Test the new all books endpoint
  setTimeout(() => {
    const http = require('http');
    
    console.log('🔍 Testing /api/books/all endpoint...');
    
    http.get(`http://localhost:${PORT}/api/books/all`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ All Books API Response Success!');
          console.log(`📊 Found ${result.length} categories`);
          
          // Count total books
          const totalBooks = result.reduce((sum, category) => sum + category.top_books.length, 0);
          console.log(`📚 Total books: ${totalBooks}`);
          
          if (result.length > 0) {
            console.log('📋 First category:', {
              name: result[0].category_name,
              books: result[0].top_books.length
            });
            
            if (result[0].top_books.length > 0) {
              console.log('📖 First book:', {
                title: result[0].top_books[0].TITLE,
                price: result[0].top_books[0].PRICE,
                authors: result[0].top_books[0].AUTHORS
              });
            }
          }
        } catch (error) {
          console.error('❌ JSON Parse Error:', error.message);
          console.log('Raw response:', data);
        }
        process.exit(0);
      });
    }).on('error', (err) => {
      console.error('❌ Request failed:', err.message);
      process.exit(1);
    });
  }, 1000);
});
