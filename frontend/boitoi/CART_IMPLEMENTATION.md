# Cart Feature Implementation

## Overview
This implementation provides a complete cart functionality for the BoiToi book shop frontend.

## Features Implemented

### 1. Cart Service (cartApi.jsx)
- API calls for cart operations (add, update, remove, save, place order)
- Error handling and response management

### 2. Cart Context (CartContext.jsx)
- Global state management for cart items
- Automatic cart loading for logged-in users
- Real-time cart updates

### 3. Cart Page (CartPage.jsx)
- Display cart items with thumbnails, titles, and authors
- Quantity controls (+/- buttons)
- Item removal functionality
- Save cart state
- Place order functionality
- Empty cart state
- Responsive design

### 4. Navigation Integration (NavBar.jsx)
- Cart icon in header (only visible when logged in)
- Cart items count badge
- Click to navigate to cart page

### 5. Application Integration (App.jsx)
- Cart context provider wrapping
- Cart route added

### 6. Cart Hook (useCartActions.jsx)
- Simplified cart operations for other components
- Authentication checks

## Usage

### Adding to Cart (in other components)
```jsx
import { useCartActions } from '../hooks/useCartActions';

const { addToCart } = useCartActions();

// In your component
const handleAddToCart = () => {
  addToCart(book, 1); // book object, quantity
};
```

### Cart Features
- **View Cart**: Click cart icon in navigation
- **Update Quantities**: Use +/- buttons
- **Remove Items**: Click trash icon
- **Save Cart**: Saves current state to backend
- **Place Order**: Converts cart to order

## Dependencies
- react-hot-toast (for notifications)
- react-icons (for icons)
- react-router-dom (for navigation)

## Backend API Endpoints Expected
- GET `/api/cart/:userId` - Get user cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update` - Update item quantity
- DELETE `/api/cart/remove` - Remove item from cart
- PUT `/api/cart/save` - Save entire cart
- POST `/api/cart/place-order` - Place order

## Authentication
- Uses sessionStorage for user info (id, username)
- Cart features only available to logged-in users
- Automatic redirects and notifications for auth requirements
