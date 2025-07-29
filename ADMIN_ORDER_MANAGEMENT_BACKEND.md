# Admin Order Management System - Backend Implementation

## Overview
This document outlines the complete backend implementation for the Admin Order Management system in the BoiToi application.

## Files Created/Modified

### 1. `/backend/controllers/adminOrderController.js`
**Purpose**: Main controller handling all admin order management operations

**Functions**:
- `getAllOrders()` - Retrieve orders with filtering, pagination, and sorting
- `getOrderDetails()` - Get comprehensive order details including books and customer info
- `updateOrderStatus()` - Update order and payment status with transaction safety
- `getOrderStatistics()` - Provide dashboard statistics for orders

**Key Features**:
- Comprehensive filtering by order status, payment status
- Pagination with limit/offset
- Sorting by date (newest/oldest)
- Transaction-based status updates
- Detailed order information with joined customer and payment data

### 2. `/backend/routes/adminOrderRoutes.js`
**Purpose**: Route definitions for admin order management endpoints

**Endpoints**:
- `GET /api/admin/orders` - List all orders with optional filters
- `GET /api/admin/orders/statistics` - Get order statistics
- `GET /api/admin/orders/:orderId` - Get specific order details
- `PUT /api/admin/orders/:orderId/status` - Update order/payment status

### 3. `/backend/server.js` (Modified)
**Changes Made**:
- Added import for `adminOrderRoutes`
- Mounted admin order routes at `/api/admin/orders`

## Database Integration

### Tables Used
1. **order** - Main order information
   - ORDER_ID, USER_ID, ORDER_STATUS, PAYMENT_STATUS
   - ORDER_DATE, TOTAL_AMOUNT, SHIPPING_ADDRESS, etc.

2. **order_book** - Junction table for order items
   - ORDER_ID, BOOK_ID, QUANTITY, PRICE_PER_UNIT

3. **payment** - Payment transaction details
   - PAYMENT_ID, ORDER_ID, PAYMENT_STATUS, AMOUNT, METHOD

4. **user** - Customer information
   - USER_ID, USERNAME, EMAIL, FULL_NAME

5. **book** - Book details for order items
   - BOOK_ID, TITLE, ISBN, PRICE

### Status Enums
**ORDER_STATUS**: pending, confirmed, processing, shipped, delivered, cancelled, returned, refunded, on_hold

**PAYMENT_STATUS**: unpaid, pending, processing, paid, refunded, partially_refunded, failed, cancelled, chargeback

## API Documentation

### GET /api/admin/orders
**Query Parameters**:
- `status` - Filter by order status
- `payment_status` - Filter by payment status
- `limit` - Number of results per page (default: 50)
- `offset` - Pagination offset (default: 0)
- `sort` - Sort order: 'newest' or 'oldest' (default: 'newest')

**Response**:
```json
{
  "success": true,
  "orders": [
    {
      "ORDER_ID": 1,
      "CUSTOMER_NAME": "John Doe",
      "CUSTOMER_EMAIL": "john@example.com",
      "ORDER_STATUS": "pending",
      "PAYMENT_STATUS": "unpaid",
      "ORDER_DATE": "2024-01-15T10:30:00.000Z",
      "TOTAL_AMOUNT": "29.99",
      "TOTAL_BOOKS": 2
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

### GET /api/admin/orders/:orderId
**Response**:
```json
{
  "success": true,
  "order": {
    "ORDER_ID": 1,
    "CUSTOMER_NAME": "John Doe",
    "CUSTOMER_EMAIL": "john@example.com",
    "ORDER_STATUS": "pending",
    "PAYMENT_STATUS": "unpaid",
    "ORDER_DATE": "2024-01-15T10:30:00.000Z",
    "TOTAL_AMOUNT": "29.99",
    "SHIPPING_ADDRESS": "123 Main St, City, State 12345",
    "books": [
      {
        "BOOK_ID": 1,
        "TITLE": "Sample Book",
        "ISBN": "1234567890",
        "QUANTITY": 2,
        "PRICE_PER_UNIT": "14.99"
      }
    ],
    "payment": {
      "PAYMENT_ID": 1,
      "PAYMENT_METHOD": "credit_card",
      "PAYMENT_STATUS": "unpaid",
      "AMOUNT": "29.99"
    }
  }
}
```

### PUT /api/admin/orders/:orderId/status
**Request Body**:
```json
{
  "order_status": "confirmed",
  "payment_status": "paid"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

### GET /api/admin/orders/statistics
**Response**:
```json
{
  "success": true,
  "statistics": {
    "total_orders": 45,
    "pending_orders": 12,
    "completed_orders": 28,
    "cancelled_orders": 5,
    "total_revenue": "1250.75",
    "pending_payments": 8,
    "failed_payments": 2
  }
}
```

## Frontend Integration

### API Calls Required
The frontend `AdminOrderManagement.jsx` component should make these API calls:

1. **Load Orders**: `GET /api/admin/orders?status=${filter}&limit=50&offset=${page*50}`
2. **Load Statistics**: `GET /api/admin/orders/statistics`
3. **Load Order Details**: `GET /api/admin/orders/${orderId}`
4. **Update Status**: `PUT /api/admin/orders/${orderId}/status`

### Error Handling
All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Security Considerations

### Current Implementation
- No authentication middleware is currently applied
- Follows the same pattern as existing admin controllers

### Recommended Enhancements
1. Add admin authentication middleware
2. Implement role-based access control
3. Add request rate limiting
4. Add input validation and sanitization
5. Log all admin actions for audit trail

## Testing

### Test File: `/backend/test_admin_order_management.js`
A comprehensive test script is provided to verify all endpoints:
- Get all orders
- Get order statistics  
- Get filtered orders
- Get specific order details
- Update order status

**To run tests**:
1. Start the server: `npm start`
2. Run tests: `node test_admin_order_management.js`

## Next Steps

1. **Start Server**: Ensure the backend server is running
2. **Test Endpoints**: Use the provided test script or tools like Postman
3. **Frontend Integration**: Update frontend API calls to use new endpoints
4. **Add Authentication**: Implement proper admin authentication
5. **Add Logging**: Implement audit logging for admin actions

## Dependencies

### Required
- express
- mysql2
- cors
- dotenv

### Database Connection
Ensure the database connection is properly configured in `/config/database.js`

## Error Resolution

### Common Issues
1. **Database Connection**: Verify MySQL connection and credentials
2. **Missing Tables**: Ensure order, payment, order_book tables exist
3. **Status Enum Values**: Verify ORDER_STATUS and PAYMENT_STATUS enum values match
4. **Foreign Key Constraints**: Ensure proper relationships between tables

The implementation provides a robust, scalable admin order management system that integrates seamlessly with the existing BoiToi application architecture.
