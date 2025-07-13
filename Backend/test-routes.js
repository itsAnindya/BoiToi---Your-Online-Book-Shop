const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use('/api/user', userRoutes);

console.log('Testing route registration...');
console.log('User routes registered at /api/user');

// List all routes
app._router.stack.forEach(layer => {
  if (layer.route) {
    console.log(`${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}`);
  } else if (layer.name === 'router') {
    console.log(`Router middleware detected`);
    if (layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach(routeLayer => {
        if (routeLayer.route) {
          console.log(`  ${Object.keys(routeLayer.route.methods).join(',').toUpperCase()} ${routeLayer.route.path}`);
        }
      });
    }
  }
});

console.log('Route registration test completed.');
