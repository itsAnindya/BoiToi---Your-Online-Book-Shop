# Cart Feature Implementation - BoiToi Book Shop

## Overview
Complete cart functionality implementation for the BoiToi book shop with frontend React components and backend Node.js API endpoints.

## Backend Implementation

### Database Schema Updates

#### Updated Cart Table
```sql
CREATE TABLE `cart` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `BOOK_ID` int NOT NULL,
  `QUANTITY` int NOT NULL DEFAULT 1,
  `ADDED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `unique_user_book` (`USER_ID`, `BOOK_ID`),
  FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE CASCADE,
  FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE CASCADE
);
```

### API Endpoints

#### 1. Get Cart Items
- **Endpoint**: `GET /api/cart/:userId`
- **Description**: Fetches all cart items for a user with book details and authors
- **Response Format**:
```json
{
  "success": true,
  "message": "Cart items fetched successfully",
  "cart": [
    {
      "cart_id": 1,
      "book_id": 100,
      "title": "Book Title",
      "author": "Author Name",
      "price": 200.00,
      "thumbnail": "/images/books/defaultbook.jpg",
      "quantity": 2,
      "added_at": "2025-01-01T00:00:00.000Z",
      "isbn": "9789844322288",
      "description": "Book description"
    }
  ],
  "summary": {
    "totalItems": 2,
    "totalAmount": 400.00,
    "itemCount": 1
  }
}
```

#### 2. Add to Cart
- **Endpoint**: `POST /api/cart/add`
- **Body**: `{ "user_id": 1, "book_id": 100, "quantity": 1 }`
- **Features**: 
  - Handles duplicate entries by updating quantity
  - Validates user and book existence
  - Returns appropriate success/error messages

#### 3. Update Cart Item
- **Endpoint**: `PUT /api/cart/update`
- **Body**: `{ "user_id": 1, "book_id": 100, "quantity": 3 }`

#### 4. Remove Cart Item
- **Endpoint**: `DELETE /api/cart/remove`
- **Body**: `{ "user_id": 1, "book_id": 100 }`

#### 5. Save Cart
- **Endpoint**: `PUT /api/cart/save`
- **Body**: `{ "user_id": 1, "items": [{"book_id": 100, "quantity": 2}] }`

#### 6. Place Order
- **Endpoint**: `POST /api/cart/place-order`
- **Body**: `{ "user_id": 1 }`
- **Features**: Clears cart after order placement

### Backend Features
- **Auto-increment ID**: Uses MySQL AUTO_INCREMENT for cart IDs
- **Duplicate handling**: Prevents duplicate user-book entries with UNIQUE constraint
- **Author joining**: Properly joins with book_author and author tables
- **Error handling**: Comprehensive error handling for all scenarios
- **Data validation**: Validates user and book existence before operations

## Frontend Implementation

### 1. Cart Context (`CartContext.jsx`)
- **Global state management** for cart data
- **Automatic cart loading** for logged-in users
- **Real-time updates** for cart operations
- **Local state synchronization** with backend

### 2. Cart Page (`CartPage.jsx`)
- **User-specific heading**: Shows "{username}'s Cart"
- **Complete item display**: Thumbnail, title, author, price
- **Quantity controls**: +/- buttons for quantity adjustment
- **Item removal**: Delete button for individual items
- **Save functionality**: Saves current cart state to backend
- **Order placement**: Converts cart to order
- **Empty state**: Beautiful empty cart with CTA
- **Responsive design**: Works on all screen sizes
- **Loading states**: Proper loading indicators

### 3. Cart API Service (`cartApi.jsx`)
- **API communication** for all cart operations
- **Error handling** and response formatting
- **Consistent interface** for frontend components

### 4. AddToCart Component (`AddToCartButton.jsx`)
- **Reusable component** for adding items to cart
- **Multiple variants**: Primary, secondary, outline, ghost
- **Size options**: Small, medium, large
- **Loading states**: Shows spinner during operations
- **Authentication checks**: Prompts login when needed
- **Immediate feedback**: Updates UI before backend sync

### 5. Navigation Integration (`NavBar.jsx`)
- **Cart icon**: Only visible when user is logged in
- **Item count badge**: Shows total cart items (1-99+)
- **Click navigation**: Direct link to cart page
- **Mobile responsive**: Compact mobile cart icon

### 6. Test Page (`CartTestPage.jsx`)
- **Testing interface** for cart functionality
- **Sample books** for testing add to cart
- **Multiple add options** (1 item, 2 items)
- **User status display** and cart link

## Usage Instructions

### For Users
1. **Login Required**: Must be logged in to use cart features
2. **Adding Items**: Use AddToCartButton component or direct API calls
3. **Viewing Cart**: Click cart icon in navigation
4. **Managing Cart**: Use +/- buttons, delete items, save changes
5. **Placing Orders**: Click "Place Order" to complete purchase

### For Developers
1. **Adding Cart to Pages**:
```jsx
import AddToCartButton from '../components/AddToCartButton';

<AddToCartButton 
  book={bookObject} 
  quantity={1}
  variant="primary"
  size="medium"
/>
```

2. **Using Cart Context**:
```jsx
import { useCart } from '../contexts/CartContext';

const { cart, addToCart, getCartItemsCount } = useCart();
```

3. **Testing**: Visit `/cart-test` route for testing cart functionality

## Database Migration
Run the `cart_table_update.sql` script to update your database schema:
```sql
-- Run this script to update the cart table
source backend/database/cart_table_update.sql;
```

## Dependencies
- **Backend**: mysql2, express, cors
- **Frontend**: react, react-router-dom, react-hot-toast, react-icons

## Features Completed ✅
- ✅ Backend API endpoints for all cart operations
- ✅ Database schema with proper constraints
- ✅ Frontend cart page with full functionality
- ✅ Cart context for state management
- ✅ Navigation integration with cart icon
- ✅ Add to cart component for reuse
- ✅ Authentication integration
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Loading states and animations
- ✅ Test page for development

## Authentication Flow
1. User logs in → session data stored
2. Cart context loads user cart automatically
3. Cart operations require valid user session
4. Cart icon and features only available when logged in
5. Automatic prompts for login when needed

## Error Handling
- **Database errors**: Proper error messages and logging
- **Authentication errors**: Login prompts and redirects
- **Validation errors**: User-friendly error messages
- **Network errors**: Retry mechanisms and fallbacks
- **UI feedback**: Toast notifications for all operations

This implementation provides a complete, production-ready cart system for the BoiToi book shop!
