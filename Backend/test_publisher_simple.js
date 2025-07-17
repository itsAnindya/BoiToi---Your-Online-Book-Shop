// Simple test using curl commands to verify publisher login
const { exec } = require('child_process');

console.log('🧪 Testing Publisher Login System...\n');

// Test 1: Publisher Login
console.log('📡 Testing publisher login...');
exec('curl -X POST http://localhost:3001/api/auth/publisher/login -H "Content-Type: application/json" -d "{\\"username\\":\\"EduGorilla Publication\\",\\"password\\":\\"securepass123\\"}"', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  try {
    const data = JSON.parse(stdout);
    if (data.role === 'publisher') {
      console.log('✅ Publisher login successful!');
      console.log('📄 Publisher ID:', data.id);
      console.log('📄 Publisher Name:', data.name);
      console.log('📄 Role:', data.role);
      
      // Test dashboard access
      console.log('\n📊 Testing dashboard access...');
      exec(`curl -X GET http://localhost:3001/api/publisher/${data.id}/profile`, (error2, stdout2, stderr2) => {
        if (error2) {
          console.log('❌ Dashboard error:', error2.message);
          return;
        }
        
        try {
          const dashData = JSON.parse(stdout2);
          console.log('✅ Dashboard accessible!');
          console.log('📊 Publisher Status:', dashData.STATUS);
        } catch (e) {
          console.log('❌ Dashboard parse error:', e.message);
        }
      });
      
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (e) {
    console.log('❌ Parse error:', e.message);
    console.log('Raw response:', stdout);
  }
});

console.log('\n💡 Frontend Test Instructions:');
console.log('1. Go to: http://localhost:5173/auth');
console.log('2. Select: "Publisher" option');
console.log('3. Enter: Username = "EduGorilla Publication", Password = "securepass123"');
console.log('4. Should redirect to homepage with publisher access');
console.log('5. Check user menu for "Publisher Dashboard" link');
