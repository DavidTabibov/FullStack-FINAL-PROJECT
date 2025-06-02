console.log('🧪 Simple Backend Test...\n');

async function testSimple() {
    console.log('1. Testing with built-in fetch...');
    
    try {
        // Use native fetch if available (Node 18+)
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: 'Test',
                lastName: 'User',
                email: 'test2@example.com',
                password: 'TestPass123!'
            })
        });

        console.log('✅ Response status:', response.status);
        const data = await response.json();
        console.log('✅ Response data:', JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('ℹ️  This might be a Node.js version issue or server issue.');
        
        // Alternative test with http module
        console.log('\n2. Testing with Node.js http module...');
        const http = require('http');
        
        const postData = JSON.stringify({
            firstName: 'Test',
            lastName: 'User',
            email: 'test3@example.com',
            password: 'TestPass123!'
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`✅ Status: ${res.statusCode}`);
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log('✅ HTTP Response:', JSON.stringify(jsonData, null, 2));
                } catch (e) {
                    console.log('Response data:', data);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request error: ${e.message}`);
        });

        req.write(postData);
        req.end();
    }
}

testSimple(); 