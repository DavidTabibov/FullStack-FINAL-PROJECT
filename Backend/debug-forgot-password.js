import axios from 'axios';
import { spawn } from 'child_process';

const testForgotPassword = async () => {
  console.log('🔧 Testing Forgot Password API...\n');
  
  try {
    // Test the API endpoint
    const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: 'topoopilike@gmail.com'
    }, {
      timeout: 10000,
      validateStatus: () => true // Accept all status codes
    });

    console.log('📊 API Response:');
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    console.log('   Headers:', JSON.stringify(response.headers, null, 2));
    console.log('   Data:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('\n✅ API is working correctly!');
      if (response.data.developmentInfo) {
        console.log('\n🔗 Development Reset URL:');
        console.log('   ', response.data.developmentInfo.resetUrl);
      }
    } else if (response.status === 500) {
      console.log('\n❌ Server Error (500) - Check backend console logs');
    } else {
      console.log('\n⚠️ Unexpected response status');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - Backend server not running');
      console.log('   Please start the backend server with: npm run dev');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('❌ Request timeout - Server may be slow or unresponsive');
    } else {
      console.log('❌ Error:', error.message);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', error.response.data);
      }
    }
  }
};

// Also check if server is running
const checkServerHealth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/verify', {
      timeout: 5000,
      validateStatus: () => true
    });
    
    if (response.status === 401) {
      console.log('✅ Backend server is running (auth endpoint responding)');
      return true;
    } else if (response.status === 200) {
      console.log('✅ Backend server is running and healthy');
      return true;
    } else {
      console.log('⚠️ Backend server responding but with unexpected status:', response.status);
      return true;
    }
  } catch (error) {
    console.log('❌ Backend server not responding:', error.message);
    return false;
  }
};

const main = async () => {
  console.log('🏥 Checking backend server health...');
  const serverRunning = await checkServerHealth();
  
  if (serverRunning) {
    console.log('\n🧪 Testing forgot password endpoint...');
    await testForgotPassword();
  } else {
    console.log('\n💡 Solution: Start the backend server first');
    console.log('   Run: npm run dev');
  }
};

main(); 