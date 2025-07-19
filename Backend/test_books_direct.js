const bookController = require('./controllers/bookController');

// Mock response object for testing
const mockRes = {
  json: (data) => {
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('Number of books returned:', data.length || 0);
    if (data.length > 0) {
      console.log('Sample book:', data[0]);
    }
  },
  status: (code) => ({
    json: (data) => {
      console.log(`Status ${code}:`, data);
    }
  })
};

// Mock request object
const mockReq = {};

console.log('Testing getAllBooks function...');
console.log('================================');

// Test the getAllBooks function directly
bookController.getAllBooks(mockReq, mockRes);
