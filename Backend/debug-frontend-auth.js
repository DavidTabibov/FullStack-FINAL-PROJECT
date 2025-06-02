import axios from 'axios';

const debugFrontendAuth = async () => {
    console.log('🔍 DEBUGGING FRONTEND AUTHENTICATION FLOW\n');
    
    try {
        // Test direct API call first
        console.log('1️⃣ Testing direct API login...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@luxefashionboutique.com',
            password: 'Admin123!'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        console.log('✅ API Login Response:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        console.log('Headers:', response.headers);

        // Check if token is in the response
        if (response.data.data && response.data.data.token) {
            console.log('\n2️⃣ Token Analysis:');
            console.log('Token exists:', !!response.data.data.token);
            console.log('Token length:', response.data.data.token.length);
            console.log('Token preview:', response.data.data.token.substring(0, 50) + '...');
        }

        // Test the same request as the frontend would make
        console.log('\n3️⃣ Testing Frontend-style request...');
        const frontendResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@luxefashionboutique.com',
            password: 'Admin123!'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
            // Note: Not using withCredentials to match frontend
        });

        console.log('Frontend Response Status:', frontendResponse.status);
        console.log('Frontend Response Data:', JSON.stringify(frontendResponse.data, null, 2));

        console.log('\n🔍 POTENTIAL ISSUES TO CHECK:');
        console.log('1. Check browser developer tools for:');
        console.log('   - Console errors during login');
        console.log('   - Network tab for failed requests');
        console.log('   - Local storage for token');
        console.log('   - Application tab for stored data');
        console.log('');
        console.log('2. Frontend auth service might have issues with:');
        console.log('   - Response data structure parsing');
        console.log('   - Token storage in localStorage');
        console.log('   - Auth context state update');
        console.log('   - Navigation timing');
        console.log('');
        console.log('3. Common frontend auth problems:');
        console.log('   - CORS configuration');
        console.log('   - Async state updates');
        console.log('   - Race conditions in navigation');
        console.log('   - Context provider not wrapping components');

    } catch (error) {
        console.error('❌ Debug failed:', error.response?.data || error.message);
    }
};

debugFrontendAuth(); 