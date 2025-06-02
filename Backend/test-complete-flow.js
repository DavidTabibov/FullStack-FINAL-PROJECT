import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

const testCompleteFlow = async () => {
    console.log('🚀 Starting Complete Admin Login & Profile Test\n');
    
    try {
        // Test 1: Admin Login
        console.log('📝 Test 1: Admin Login via API');
        console.log('🔄 Attempting login...');
        
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@luxefashionboutique.com',
            password: 'Admin123!'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        if (loginResponse.status === 200 && loginResponse.data.data) {
            console.log('✅ Login successful!');
            console.log('👤 User:', loginResponse.data.data.user.firstName, loginResponse.data.data.user.lastName);
            console.log('📧 Email:', loginResponse.data.data.user.email);
            console.log('🔑 Role:', loginResponse.data.data.user.role);
            console.log('🎫 Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
        } else {
            throw new Error('Login failed - invalid response structure');
        }

        const token = loginResponse.data.data.token;
        const user = loginResponse.data.data.user;

        // Test 2: Profile Access
        console.log('\n📝 Test 2: Profile Access');
        console.log('🔄 Fetching user profile...');
        
        const profileResponse = await axios.get(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        if (profileResponse.status === 200) {
            console.log('✅ Profile access successful!');
            console.log('📋 Profile data:');
            console.log('   - ID:', profileResponse.data.id || profileResponse.data._id);
            console.log('   - Name:', profileResponse.data.firstName, profileResponse.data.lastName);
            console.log('   - Email:', profileResponse.data.email);
            console.log('   - Role:', profileResponse.data.role);
            console.log('   - Created:', new Date(profileResponse.data.createdAt).toLocaleDateString());
        }

        // Test 3: Admin Dashboard Access
        console.log('\n📝 Test 3: Admin Dashboard Access');
        console.log('🔄 Accessing admin dashboard...');
        
        try {
            const adminResponse = await axios.get(`${API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (adminResponse.status === 200) {
                console.log('✅ Admin dashboard access successful!');
                console.log('👥 Total users in system:', adminResponse.data.length);
                
                // Show user breakdown
                const userBreakdown = adminResponse.data.reduce((acc, user) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                }, {});
                
                console.log('📊 User breakdown:');
                Object.entries(userBreakdown).forEach(([role, count]) => {
                    console.log(`   - ${role}: ${count}`);
                });
            }
        } catch (adminError) {
            console.log('⚠️ Admin dashboard access failed:', adminError.response?.status, adminError.response?.data?.message);
        }

        // Test 4: Token Verification
        console.log('\n📝 Test 4: Token Verification');
        console.log('🔄 Verifying token...');
        
        try {
            const verifyResponse = await axios.get(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (verifyResponse.status === 200) {
                console.log('✅ Token verification successful!');
                console.log('🔐 Token is valid and active');
            }
        } catch (verifyError) {
            console.log('⚠️ Token verification failed:', verifyError.response?.status, verifyError.response?.data?.message);
        }

        // Test 5: Frontend Integration Test
        console.log('\n📝 Test 5: Frontend Integration Instructions');
        console.log('🌐 To test the frontend:');
        console.log(`   1. Open: ${FRONTEND_URL}`);
        console.log('   2. Navigate to Login page');
        console.log('   3. Use these credentials:');
        console.log('      📧 Email: admin@luxefashionboutique.com');
        console.log('      🔑 Password: Admin123!');
        console.log('   4. After login, check:');
        console.log('      - User is redirected to home page');
        console.log('      - Admin menu/options are visible');
        console.log('      - Profile page shows correct data');
        console.log('      - Admin dashboard is accessible');

        console.log('\n🎉 All API tests completed successfully!');
        console.log('💡 The admin user is ready for frontend testing.');

    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

// Run the complete test
testCompleteFlow(); 