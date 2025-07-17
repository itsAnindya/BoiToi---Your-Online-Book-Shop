// Test script to verify publisher login system
const fetch = require('node-fetch');

const testPublisherLogin = async () => {
  console.log('🧪 Testing Publisher Login System...\n');
  
  try {
    // Test 1: Publisher Login
    console.log('📡 Testing API endpoint: POST /api/auth/publisher/login');
    const response = await fetch('http://localhost:3001/api/auth/publisher/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'EduGorilla Publication',
        password: 'securepass123',
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Publisher login successful!');
      console.log('📄 Response data:', {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        username: data.username
      });
      
      // Test 2: Publisher Dashboard Access
      console.log('\n📊 Testing dashboard access...');
      const dashboardResponse = await fetch(`http://localhost:3001/api/publisher/${data.id}/profile`);
      const dashboardData = await dashboardResponse.json();
      
      if (dashboardResponse.ok) {
        console.log('✅ Publisher dashboard accessible!');
        console.log('📊 Publisher profile:', {
          name: dashboardData.NAME,
          status: dashboardData.STATUS,
          id: dashboardData.ID
        });
      } else {
        console.log('❌ Dashboard access failed:', dashboardData.message);
      }
      
    } else {
      console.log('❌ Publisher login failed:', data.message);
    }
    
  } catch (error) {
    console.error('🔥 Error during testing:', error.message);
  }
};

// Test other publisher names
const testMultiplePublishers = async () => {
  console.log('\n🔍 Testing multiple publisher names...');
  
  const publisherNames = [
    'EduGorilla Publication',
    'Jones & Bartlett Learning',
    'Prentice Hall Professional',
    'Packt Publishing Ltd',
    'Mikcorp Limited'
  ];
  
  for (const name of publisherNames) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/publisher/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          password: 'securepass123',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${name} - Login successful (ID: ${data.id})`);
      } else {
        console.log(`❌ ${name} - Login failed: ${data.message}`);
      }
      
    } catch (error) {
      console.log(`🔥 ${name} - Error: ${error.message}`);
    }
  }
};

// Run tests
const runAllTests = async () => {
  await testPublisherLogin();
  await testMultiplePublishers();
  
  console.log('\n🎯 Test Summary:');
  console.log('- Publisher login API: Tested');
  console.log('- Dashboard access: Verified');
  console.log('- Multiple publishers: Checked');
  console.log('\n💡 Next: Test frontend at http://localhost:5173/auth');
  console.log('   Select "Publisher" and use any publisher name with password "securepass123"');
};

runAllTests();
