/**
 * Health Check Controller
 * Provides endpoints for monitoring server health
 */

/**
 * Basic test endpoint
 */
const test = (req, res) => {
  console.log('Test endpoint accessed');
  res.status(200).json({ 
    message: 'Backend is connected!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
};

/**
 * Health check endpoint
 */
const health = (req, res) => {
  console.log('Health check endpoint accessed');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  test,
  health
};