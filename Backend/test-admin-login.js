import axios from 'axios';

const testAdminLogin = async () => {
    try {
        console.log('🔄 Testing admin login...');
        
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@luxefashionboutique.com',
            password: 'Admin123!'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        console.log('✅ Login successful!');
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        if (response.data.data) {
            console.log('User data:', response.data.data.user);
            console.log('Token:', response.data.data.token ? 'Token received' : 'No token');
            
            // Test accessing admin endpoints
            if (response.data.data.token) {
                console.log('\n🔄 Testing admin profile access...');
                
                const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${response.data.data.token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                
                console.log('✅ Profile access successful!');
                console.log('Profile data:', profileResponse.data);
                
                // Test admin dashboard access
                console.log('\n🔄 Testing admin dashboard access...');
                
                try {
                    const adminResponse = await axios.get('http://localhost:5000/api/users', {
                        headers: {
                            'Authorization': `Bearer ${response.data.data.token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    });
                    
                    console.log('✅ Admin dashboard access successful!');
                    console.log('Admin data length:', adminResponse.data.length || 'N/A');
                } catch (adminError) {
                    console.log('⚠️ Admin dashboard access failed:', adminError.response?.status, adminError.response?.data?.message);
                }
            }
        }

    } catch (error) {
        console.error('❌ Login failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

// Run the test
testAdminLogin(); 