import axios from 'axios';

const testDemoLogin = async () => {
    console.log('🧪 Testing Demo Login Authentication...\n');
    
    try {
        // Test Admin Demo Login
        console.log('1. Testing Admin Demo Login...');
        const adminResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@luxefashionboutique.com',
            password: 'Admin123!'
        });
        
        console.log('✅ Admin Login Success!');
        console.log('   Token:', adminResponse.data.data.token ? 'Received' : 'Missing');
        console.log('   User:', adminResponse.data.data.user.firstName, adminResponse.data.data.user.lastName);
        console.log('   Role:', adminResponse.data.data.user.role);
        console.log('   Response structure:', {
            status: adminResponse.data.status,
            hasToken: !!adminResponse.data.data.token,
            hasUser: !!adminResponse.data.data.user
        });
        console.log('');
        
        // Test Customer Demo Login
        console.log('2. Testing Customer Demo Login...');
        const customerResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'john@example.com',
            password: 'User123!'
        });
        
        console.log('✅ Customer Login Success!');
        console.log('   Token:', customerResponse.data.data.token ? 'Received' : 'Missing');
        console.log('   User:', customerResponse.data.data.user.firstName, customerResponse.data.data.user.lastName);
        console.log('   Role:', customerResponse.data.data.user.role);
        console.log('   Response structure:', {
            status: customerResponse.data.status,
            hasToken: !!customerResponse.data.data.token,
            hasUser: !!customerResponse.data.data.user
        });
        console.log('');
        
        console.log('🎉 All demo logins working correctly!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.error('   ⚠️  Backend server is not running on localhost:5000');
            console.error('   Please start the backend server with: npm start');
        }
    }
};

// Run the test
testDemoLogin(); 