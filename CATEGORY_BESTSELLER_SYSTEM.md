# Category Bestseller System Documentation

## Overview

The Category Bestseller System automatically tracks and updates the most popular books in each category based on recent sales data. It analyzes delivered orders from the past 30 days to determine bestsellers.

## System Architecture

### Core Components

1. **Database Tables**
   - `category_bestseller`: Stores ranked bestseller data
   - `order`: Order records with status tracking
   - `order_book`: Order items with quantities
   - `book`: Book information with categories
   - `category`: Product categories

2. **Backend Services**
   - `BestsellerService`: Core business logic for calculations
   - `SchedulerService`: Handles periodic updates
   - `bestsellerController`: API endpoints

3. **Database Procedures**
   - `UpdateCategoryBestsellers()`: Stored procedure for updates

## How It Works

### Calculation Logic

```sql
-- Core query that powers the bestseller system
SELECT 
    c.ID as CATEGORY_ID,
    b.ID as BOOK_ID,
    SUM(ob.QUANTITY) as total_sold,
    ROW_NUMBER() OVER (PARTITION BY c.ID ORDER BY SUM(ob.QUANTITY) DESC) as book_rank
FROM `order` o
INNER JOIN order_book ob ON o.ID = ob.ORDER_ID
INNER JOIN book b ON ob.BOOK_ID = b.ID
INNER JOIN category c ON b.CATEGORY_ID = c.ID
WHERE 
    o.ORDER_STATUS = 'delivered'        -- Only completed orders
    AND o.ORDERD_AT >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)  -- Last 30 days
    AND b.SHOW_BOOK = 1                 -- Only visible books
    AND b.CATEGORY_ID IS NOT NULL       -- Must have category
GROUP BY c.ID, b.ID
HAVING total_sold > 0
```

### Update Process

1. **Clear Old Data**: Remove existing monthly data for current period
2. **Calculate Rankings**: Run the bestseller calculation query
3. **Store Results**: Insert top 10 books per category into `category_bestseller`
4. **Verify**: Confirm update success and log statistics

## API Endpoints

### Manual Update
```
POST /api/bestsellers/update
```
Manually trigger bestseller update (admin access recommended)

### Get All Bestsellers
```
GET /api/bestsellers/all?limit=50
```
Retrieve bestsellers for all categories

### Get Category Bestsellers
```
GET /api/bestsellers/category/:categoryId?limit=10
```
Get bestsellers for specific category

### Get System Status
```
GET /api/bestsellers/status
```
Check current bestseller system status

## Scheduled Updates

### Automatic Schedule
- **Daily**: 2:00 AM - Update bestseller rankings
- **Weekly**: Sunday 3:00 AM - Maintenance and cleanup

### Configuration
```javascript
// In server.js
const schedulerService = require('./services/schedulerService');
schedulerService.start(); // Starts all scheduled jobs
```

## Database Schema

### category_bestseller Table
```sql
CREATE TABLE `category_bestseller` (
  `PERIOD_TYPE` enum('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL DEFAULT 'MONTHLY',
  `PERIOD_START` date NOT NULL,
  `CATEGORY_ID` int NOT NULL,
  `POSITION` int NOT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`PERIOD_TYPE`, `PERIOD_START`, `CATEGORY_ID`, `POSITION`)
);
```

## Usage Examples

### Backend Service Usage
```javascript
const BestsellerService = require('./services/bestsellerService');

// Update bestsellers
const result = await BestsellerService.updateCategoryBestsellersSQL();

// Get bestsellers for category
const bestsellers = await BestsellerService.getBestsellersByCategory(categoryId, 10);

// Get all bestsellers
const allBestsellers = await BestsellerService.getBestsellersByCategory(null, 50);
```

### API Usage
```javascript
// Frontend API calls
const response = await fetch('/api/bestsellers/all');
const bestsellerData = await response.json();

// Update bestsellers (admin)
const updateResponse = await fetch('/api/bestsellers/update', { method: 'POST' });
```

## Testing and Debugging

### Run Demo Script
```bash
cd backend
node demo_bestseller_update.js
```

### Test Individual Components
```bash
# Test bestseller service
node -e "require('./services/bestsellerService').updateCategoryBestsellersSQL().then(console.log)"

# Check scheduler status
node -e "console.log(require('./services/schedulerService').getStatus())"
```

### Database Queries for Debugging
```sql
-- Check current bestsellers
SELECT cb.*, b.TITLE, c.NAME as CATEGORY_NAME 
FROM category_bestseller cb 
JOIN book b ON cb.BOOK_ID = b.ID 
JOIN category c ON cb.CATEGORY_ID = c.ID 
WHERE PERIOD_TYPE = 'MONTHLY' 
ORDER BY CATEGORY_ID, POSITION;

-- Check recent delivered orders
SELECT COUNT(*) as delivered_orders_last_30_days 
FROM `order` 
WHERE ORDER_STATUS = 'delivered' 
AND ORDERD_AT >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);
```

## Performance Considerations

### Optimization Tips
1. **Database Indexes**: Ensure proper indexes on order date and status
2. **Batch Updates**: Run updates during low-traffic periods
3. **Data Retention**: Clean up old bestseller data periodically
4. **Caching**: Consider caching bestseller results for frontend

### Monitoring
- Log update execution times
- Monitor database performance during updates
- Track bestseller data consistency

## Troubleshooting

### Common Issues

1. **No Bestsellers Generated**
   - Check if orders have 'delivered' status
   - Verify books have assigned categories
   - Confirm orders exist in last 30 days

2. **Scheduler Not Running**
   - Check if schedulerService.start() is called
   - Verify node-cron package is installed
   - Check server logs for cron errors

3. **Database Errors**
   - Ensure proper table relationships
   - Check foreign key constraints
   - Verify MySQL version compatibility

### Debug Commands
```bash
# Check current bestseller count
mysql -e "SELECT COUNT(*) FROM category_bestseller WHERE PERIOD_TYPE='MONTHLY'"

# View recent orders
mysql -e "SELECT COUNT(*), ORDER_STATUS FROM \`order\` WHERE ORDERD_AT >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) GROUP BY ORDER_STATUS"
```

## Production Deployment

### Setup Steps
1. Install dependencies: `npm install node-cron`
2. Add scheduler to server.js
3. Create stored procedure in database
4. Configure appropriate admin access
5. Set up monitoring and logging

### Environment Configuration
```javascript
// config/scheduler.js
module.exports = {
  timezone: process.env.TIMEZONE || 'Asia/Dhaka',
  updateTime: process.env.BESTSELLER_UPDATE_TIME || '0 2 * * *', // 2 AM daily
  cleanupTime: process.env.BESTSELLER_CLEANUP_TIME || '0 3 * * 0' // 3 AM Sunday
};
```

## Future Enhancements

### Potential Improvements
1. **Multiple Time Periods**: Daily, weekly, yearly bestsellers
2. **Geographic Bestsellers**: Region-specific rankings
3. **Trending Detection**: Identify rapidly rising books
4. **Personalized Bestsellers**: User-specific recommendations
5. **Real-time Updates**: Event-driven updates on new orders

### Analytics Integration
- Export bestseller data to analytics platforms
- Generate bestseller reports and insights
- Track bestseller performance over time

---

## Quick Start Guide

1. **Install and Setup**
   ```bash
   cd backend
   npm install
   ```

2. **Initialize Database**
   ```sql
   -- Run the stored procedure script
   source database/update_bestseller_procedure.sql
   ```

3. **Start Server with Scheduler**
   ```bash
   npm start
   ```

4. **Test Manual Update**
   ```bash
   curl -X POST http://localhost:3001/api/bestsellers/update
   ```

5. **View Bestsellers**
   ```bash
   curl http://localhost:3001/api/bestsellers/all
   ```

The system is now ready to automatically maintain bestseller rankings based on your sales data!
