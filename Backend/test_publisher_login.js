const fetch = require('node-fetch');

// Test publisher login
const testPublisherLogin = async () => {
  try {
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
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Publisher login successful!');
      console.log('Publisher ID:', data.id);
      console.log('Publisher Name:', data.name);
      console.log('Role:', data.role);
    } else {
      console.log('❌ Publisher login failed:', data.message);
    }
    
  } catch (error) {
    console.error('Error testing publisher login:', error.message);
  }
};

console.log('Testing publisher login...');
console.log('Username: EduGorilla Publication');
console.log('Password: securepass123');
console.log('---');

testPublisherLogin();
