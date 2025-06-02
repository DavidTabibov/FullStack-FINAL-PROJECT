import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-store';
const API_URL = 'http://localhost:5000/api';

async function debugLogin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get the test user from database
        const testUser = await User.findOne({ email: 'test@example.com' });
        
        if (!testUser) {
            console.log('❌ Test user not found in database');
            return;
        }

        console.log('📊 Test user found:');
        console.log('- Email:', testUser.email);
        console.log('- Name:', testUser.firstName, testUser.lastName);
        console.log('- Role:', testUser.role);
        console.log('- Password hash length:', testUser.password.length);

        // Test different passwords
        const passwordsToTest = [
            'TestPass1234!',
            'TestPass123!',
            'testpass',
            'password',
            'Test1234!'
        ];

        console.log('\n🔍 Testing password comparisons:');
        for (const password of passwordsToTest) {
            const isMatch = await bcrypt.compare(password, testUser.password);
            console.log(`- "${password}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        }

        // Test with other existing users
        console.log('\n🧪 Testing login with other users:');
        
        const users = await User.find({}).limit(3);
        for (const user of users) {
            console.log(`\nTesting user: ${user.email}`);
            
            // Try common passwords
            const commonPasswords = ['password', 'admin123', 'user123', 'TestPass1234!'];
            for (const password of commonPasswords) {
                try {
                    const loginResponse = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.email,
                            password: password
                        })
                    });

                    const loginData = await loginResponse.json();
                    
                    if (loginResponse.status === 200) {
                        console.log(`✅ LOGIN SUCCESS with ${user.email} / ${password}`);
                        console.log('Token received:', loginData.data.token ? 'Yes' : 'No');
                        break;
                    }
                } catch (error) {
                    // Continue to next password
                }
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

debugLogin(); 