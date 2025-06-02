import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
    console.log('🧪 Testing Authentication Flow...\n');

    // Test Registration
    console.log('1. Testing Registration...');
    try {
        console.log('Making request to:', `${API_URL}/auth/register`);
        
        const registerResponse = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'TestPass123!'
            }),
            timeout: 10000 // 10 second timeout
        });

        console.log('Response status:', registerResponse.status);
        console.log('Response headers:', Object.fromEntries(registerResponse.headers.entries()));

        if (!registerResponse.ok) {
            console.log('❌ Registration failed with status:', registerResponse.status);
            const errorText = await registerResponse.text();
            console.log('Error response:', errorText);
            return;
        }

        const registerData = await registerResponse.json();
        console.log('✅ Registration Response:', JSON.stringify(registerData, null, 2));

        if (registerData.status === 'success') {
            const token = registerData.data.token;
            console.log('✅ Registration successful, token received');

            // Test Login
            console.log('\n2. Testing Login...');
            const loginResponse = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'TestPass123!'
                }),
                timeout: 10000
            });

            const loginData = await loginResponse.json();
            console.log('✅ Login Response:', JSON.stringify(loginData, null, 2));

            if (loginData.status === 'success') {
                console.log('✅ Login successful');

                // Test Token Verification
                console.log('\n3. Testing Token Verification...');
                const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${loginData.data.token}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000
                });

                const verifyData = await verifyResponse.json();
                console.log('✅ Verify Response:', JSON.stringify(verifyData, null, 2));
            } else {
                console.log('❌ Login failed:', loginData.message);
            }
        } else {
            console.log('❌ Registration failed:', registerData.message);
        }
    } catch (error) {
        console.error('❌ Error during auth flow test:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test
testAuthFlow(); 