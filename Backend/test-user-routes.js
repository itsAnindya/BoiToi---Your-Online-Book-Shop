// Simple test file to verify user routes
console.log('Testing user routes...');

try {
  const userController = require('./controllers/userController');
  console.log('✓ userController loaded successfully');
  
  const userRoutes = require('./routes/userRoutes');
  console.log('✓ userRoutes loaded successfully');
  
  console.log('All user route components loaded without errors!');
} catch (error) {
  console.error('✗ Error loading user route components:', error.message);
  console.error('Stack:', error.stack);
}
