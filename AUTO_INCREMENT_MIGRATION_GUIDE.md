# BoiToi Database AUTO_INCREMENT Migration Guide

## Overview
This document provides a complete guide for migrating the BoiToi database to use AUTO_INCREMENT for all primary key ID columns, eliminating the need for manual ID management in the application code.

## Changes Made

### Database Structure Changes

The following tables have been updated to use AUTO_INCREMENT on their primary key ID columns:

1. **author** - `ID` now AUTO_INCREMENT
2. **book** - `ID` now AUTO_INCREMENT  
3. **category** - `ID` now AUTO_INCREMENT
4. **discount** - `ID` now AUTO_INCREMENT
5. **inventory_log** - `ID` now AUTO_INCREMENT
6. **order** - `ID` now AUTO_INCREMENT
7. **order_discount** - `ID` now AUTO_INCREMENT
8. **payment** - `ID` now AUTO_INCREMENT
9. **permission** - `ID` now AUTO_INCREMENT
10. **publisher** - `ID` now AUTO_INCREMENT
11. **publisher_request** - `ID` now AUTO_INCREMENT
12. **return_request** - `ID` now AUTO_INCREMENT
13. **review** - `ID` now AUTO_INCREMENT
14. **search_log** - `ID` now AUTO_INCREMENT
15. **shipping** - `ID` now AUTO_INCREMENT
16. **user** - `ID` now AUTO_INCREMENT
17. **user_address** - `ID` now AUTO_INCREMENT
18. **wishlist** - `ID` now AUTO_INCREMENT

### Tables Already Using AUTO_INCREMENT
These tables were already correctly configured:
- `admin_permission`
- `cart`
- `notifications`
- `publisher_book_draft`

### Tables Not Changed
These tables use composite primary keys or foreign key references and don't need AUTO_INCREMENT:
- `admin` (uses USER_ID as PK which references user.ID)
- `book_author` (composite PK: BOOK_ID, AUTHOR_ID)
- `book_category` (composite PK: BOOK_ID, CATEGORY_ID)
- `category_bestseller` (composite PK: PERIOD_TYPE, PERIOD_START, CATEGORY_ID, POSITION)
- `favourite` (composite PK: USER_ID, BOOK_ID)
- `order_book` (composite PK: ORDER_ID, BOOK_ID)
- `review_reaction` (composite PK: REVIEW_ID, USER_ID)

## Application Code Changes Required

### 1. Remove Manual ID Generation Code

**Files to Update:**

#### `authController.js` - User Registration
**Before:**
```javascript
const countUserSql = 'SELECT COUNT(*) AS count FROM USER';
db.query(countUserSql, async (err, countResult) => {
  const id = countResult[0].count + 1;
  const insertUserSql = `INSERT INTO USER (ID, USERNAME, EMAIL, ...) VALUES (?, ?, ?, ...)`;
  const userValues = [id, username, email, ...];
```

**After:**
```javascript
const insertUserSql = `INSERT INTO USER (USERNAME, EMAIL, PASSWORD_HASH, FIRST_NAME, LAST_NAME, PHONE, CREATED_AT, LAST_ACTIVE, IS_ACTIVE, GENDER, BIRTHDAY) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)`;
const userValues = [username, email, hashedPassword, first_name, last_name, phone, 0, gender, birthday];
db.query(insertUserSql, userValues, (err, result) => {
  if (err) return res.status(500).json({ message: 'Server error inserting user' });
  
  const userId = result.insertId; // Get auto-generated ID
  // Continue with address insertion...
});
```

#### `authController.js` - User Address Creation
**Before:**
```javascript
const countAddressSql = 'SELECT COUNT(*) AS count FROM USER_ADDRESS';
db.query(countAddressSql, (err, addressCountResult) => {
  const userAddressId = addressCountResult[0].count + 1;
  const insertAddressSql = `INSERT INTO USER_ADDRESS (ID, USER_ID, ...) VALUES (?, ?, ...)`;
  const addressValues = [userAddressId, id, ...];
```

**After:**
```javascript
const insertAddressSql = `INSERT INTO USER_ADDRESS (USER_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, COUNTRY, ZIP_CODE, IS_DEFAULT) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
const addressValues = [userId, address_type, address, city, state, country, zipCode, 1];
db.query(insertAddressSql, addressValues, (err, result) => {
  if (err) return res.status(500).json({ message: 'Server error inserting address' });
  
  const addressId = result.insertId; // Get auto-generated ID
  // Success response...
});
```

#### `publisherController.js` - Book Request Submission
**Before:**
```javascript
const getMaxRequestIdSql = 'SELECT COALESCE(MAX(ID), 0) + 1 as next_id FROM PUBLISHER_REQUEST';
db.query(getMaxRequestIdSql, (err, requestIdResults) => {
  const requestId = requestIdResults[0].next_id;
  const insertRequestSql = `INSERT INTO PUBLISHER_REQUEST (ID, PUBLISHER_ID, ...) VALUES (?, ?, ...)`;
```

**After:**
```javascript
const insertRequestSql = `INSERT INTO PUBLISHER_REQUEST (PUBLISHER_ID, REQUEST_TYPE, STATUS, SUBMITTED_AT, NOTES) VALUES (?, 'ADD_BOOK', 'PENDING', NOW(), ?)`;
const notes = `New book contribution request: ${title}`;
db.query(insertRequestSql, [publisherId, notes], (err, result) => {
  if (err) return db.rollback(() => res.status(500).json({ message: 'Error creating request' }));
  
  const requestId = result.insertId; // Get auto-generated ID
  // Continue with book draft insertion...
});
```

#### `publisherController.js` - Book Draft Creation
**Before:**
```javascript
const getMaxDraftIdSql = 'SELECT COALESCE(MAX(ID), 0) + 1 as next_id FROM PUBLISHER_BOOK_DRAFT';
db.query(getMaxDraftIdSql, (err, draftIdResults) => {
  const draftId = draftIdResults[0].next_id;
  const insertDraftSql = `INSERT INTO PUBLISHER_BOOK_DRAFT (ID, TITLE, ...) VALUES (?, ?, ...)`;
```

**After:**
```javascript
const insertDraftSql = `INSERT INTO PUBLISHER_BOOK_DRAFT (TITLE, ISBN, PAGE_COUNT, LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, COVER_URL, GENRE, REQUEST_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
db.query(insertDraftSql, [title, isbn, page_count, language || 'English', edition || '1st', price, stock_quantity, description, cover_url, genre, requestId], (err, result) => {
  if (err) return db.rollback(() => res.status(500).json({ message: 'Error creating book draft' }));
  
  const draftId = result.insertId; // Get auto-generated ID
  // Continue with notifications...
});
```

#### `userController.js` - Address Creation
**Before:**
```javascript
const countAddressSql = 'SELECT COUNT(*) AS count FROM USER_ADDRESS';
db.query(countAddressSql, (err, countResult) => {
  const newAddressId = countResult[0].count + 1;
  const insertAddressSql = `INSERT INTO USER_ADDRESS (ID, USER_ID, ...) VALUES (?, ?, ...)`;
```

**After:**
```javascript
const insertAddressSql = `INSERT INTO USER_ADDRESS (USER_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, COUNTRY, ZIP_CODE, IS_DEFAULT) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
const addressValues = [userId, addressType, address, city, state, country, zipCode, isDefault || 0];
db.query(insertAddressSql, addressValues, (err, result) => {
  if (err) return res.status(500).json({ message: 'Server error creating new address' });
  
  const newAddressId = result.insertId; // Get auto-generated ID
  res.status(201).json({ 
    message: 'New address created successfully',
    addressId: newAddressId
  });
});
```

#### `orderController.js` - Order Creation
**Before:**
```javascript
const insertOrderSql = `INSERT INTO \`order\` (USER_ID, ORDERD_AT, ORDER_STATUS, SHIPPING_FEE, TOTAL_AMOUNT) VALUES (?, NOW(), 'pending', ?, ?)`;
```

**After:**
```javascript
const insertOrderSql = `INSERT INTO \`order\` (USER_ID, ORDER_STATUS, SHIPPING_FEE, TOTAL_AMOUNT) VALUES (?, 'pending', ?, ?)`;
db.query(insertOrderSql, [user_id, shippingFee, totalAmount], (orderErr, orderResult) => {
  if (orderErr) return db.rollback(() => res.status(500).json({ success: false, message: 'Server error during order creation' }));
  
  const orderId = orderResult.insertId; // Get auto-generated ID
  // Continue with order items...
});
```

### 2. Update Stored Procedures

The stored procedures have been updated in the new SQL file to work with AUTO_INCREMENT:

- `ApproveBookRequest` - Now uses `LAST_INSERT_ID()` instead of manual ID calculation
- `ProcessBookAuthors` - Uses AUTO_INCREMENT for new authors
- Helper functions marked as deprecated since AUTO_INCREMENT handles ID generation

### 3. Benefits of AUTO_INCREMENT Migration

1. **Eliminates Race Conditions**: No more issues with concurrent requests generating duplicate IDs
2. **Simplifies Code**: Removes complex ID generation logic from application
3. **Better Performance**: Database handles ID generation more efficiently
4. **Atomic Operations**: ID generation is part of the insert transaction
5. **Consistency**: All tables follow the same pattern
6. **Maintainability**: Less code to maintain and debug

### 4. Testing the Migration

1. **Backup Current Database**: Always backup before migration
2. **Run Migration Script**: Execute `boitoi_db_struct_auto_increment.sql`
3. **Update Application Code**: Apply all the code changes mentioned above
4. **Test Key Workflows**:
   - User registration
   - Book submission by publishers
   - Order placement
   - Address management
   - Any other functionality that creates new records

### 5. Migration Steps

1. **Stop the application** to prevent data corruption during migration
2. **Backup the current database**:
   ```sql
   mysqldump -u username -p boitoi_db > backup_before_migration.sql
   ```
3. **Run the migration script**:
   ```sql
   mysql -u username -p boitoi_db < boitoi_db_struct_auto_increment.sql
   ```
4. **Update application code** with all the changes mentioned above
5. **Test thoroughly** in a development environment first
6. **Deploy to production** after successful testing

### 6. Potential Issues and Solutions

**Issue**: Existing data with manual IDs might have gaps
**Solution**: AUTO_INCREMENT will continue from the highest existing ID + 1

**Issue**: Foreign key references might break during migration
**Solution**: The script disables foreign key checks during migration

**Issue**: Application might still try to provide ID values
**Solution**: Remove ID from INSERT statements or the database will ignore provided ID values when AUTO_INCREMENT is set

### 7. Rollback Plan

If issues arise, you can rollback using:
1. Restore from backup: `mysql -u username -p boitoi_db < backup_before_migration.sql`
2. Revert application code changes
3. Test functionality

## Conclusion

This migration will significantly improve the reliability and maintainability of the BoiToi application by eliminating manual ID management and potential race conditions. Follow the steps carefully and test thoroughly before deploying to production.
