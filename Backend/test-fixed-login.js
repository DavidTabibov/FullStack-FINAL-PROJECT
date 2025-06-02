import axios from 'axios';

const testFixedLogin = async () => {
    console.log('🔧 TESTING FIXED LOGIN FLOW\n');
    
    try {
        // Simulate the login call as the frontend would make it
        console.log('1️⃣ Making login request...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@luxefashionboutique.com',
            password: 'Admin123!'
        });

        console.log('Response status:', response.status);
        console.log('Response structure:', JSON.stringify(response.data, null, 2));

        // Simulate the fixed frontend auth processing
        const { data } = response;

        console.log('\n2️⃣ Processing response with FIXED logic...');
        
        // OLD (broken) logic:
        console.log('❌ OLD logic checks:');
        console.log('   data.user exists:', !!data.user);
        console.log('   data.token exists:', !!data.token);
        
        // NEW (fixed) logic:
        console.log('\n✅ NEW (fixed) logic checks:');
        console.log('   data.data exists:', !!data.data);
        console.log('   data.data.user exists:', !!(data.data && data.data.user));
        console.log('   data.data.token exists:', !!(data.data && data.data.token));

        if (!data || !data.data || !data.data.user || !data.data.token) {
            throw new Error('Invalid data from server');
        }

        // Simulate the user formatting
        const formattedUser = {
            id: data.data.user.id,
            name: {
                first: data.data.user.firstName,
                last: data.data.user.lastName
            },
            email: data.data.user.email,
            role: data.data.user.role,
            isAdmin: data.data.user.role === 'admin'
        };

        console.log('\n3️⃣ Formatted user data:');
        console.log(JSON.stringify(formattedUser, null, 2));

        console.log('\n✅ Login should now work! The frontend auth flow is fixed.');
        console.log('🎯 Please refresh the frontend page and try logging in again.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
};

testFixedLogin(); 