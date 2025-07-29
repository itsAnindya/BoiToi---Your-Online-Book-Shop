// Test script for admin stats endpoint
// Run with: node test_admin_stats.js

const fetch = require('node-fetch');

async function testAdminStats() {
  console.log('🧪 Testing Admin Stats Endpoint\n');

  try {
    const response = await fetch('http://localhost:3001/api/admin/stats');
    const data = await response.json();

    if (data.success) {
      console.log('✅ Admin Stats API working!');
      console.log('\n📊 Current Statistics:');
      console.log(`- Total Users: ${data.data.total_users}`);
      console.log(`- Total Books: ${data.data.total_books}`);
      console.log(`- Total Orders: ${data.data.total_orders}`);
      console.log(`- Total Revenue: ৳${data.data.total_revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      console.log(`- Confirmed Revenue: ৳${data.data.confirmed_revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      console.log(`- Revenue per Order: ৳${data.data.revenue_per_order}`);
      
      console.log('\n📈 Order Status Breakdown:');
      Object.entries(data.data.order_status_breakdown).forEach(([status, count]) => {
        console.log(`  - ${status}: ${count} orders`);
      });

      console.log('\n📚 Top Categories:');
      data.data.top_categories.slice(0, 3).forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.category_name}: ${cat.book_count} books`);
      });

      console.log('\n🕐 Recent Activity:');
      console.log(`- Orders today: ${data.data.orders_today}`);
      console.log(`- Orders this week: ${data.data.orders_this_week}`);
      console.log(`- Orders this month: ${data.data.orders_this_month}`);

      console.log('\n🎉 Ready for frontend integration!');
    } else {
      console.error('❌ API Error:', data.message);
    }

  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  }
}

testAdminStats();
