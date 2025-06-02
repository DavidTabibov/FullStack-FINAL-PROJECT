import axios from 'axios';

const debugProfile = async () => {
    try {
        console.log('🔍 Debugging Profile Endpoint\n');
        
        // First login to get token
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@luxefashionboutique.com',
            password: 'Admin123!'
        });

        const token = loginResponse.data.data.token;
        console.log('✅ Login successful, token received');

        // Test profile endpoint
        const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📋 Raw Profile Response:');
        console.log(JSON.stringify(profileResponse.data, null, 2));

        // Check what fields are available
        console.log('\n🔍 Available fields:');
        Object.keys(profileResponse.data).forEach(key => {
            console.log(`   - ${key}: ${typeof profileResponse.data[key]} = ${profileResponse.data[key]}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
};

debugProfile(); 