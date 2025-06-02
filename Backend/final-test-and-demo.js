import axios from 'axios';
import { exec } from 'child_process';

const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

const finalTest = async () => {
    console.log('🎯 FINAL ADMIN LOGIN & PROFILE TEST');
    console.log('=====================================\n');
    
    try {
        // Test 1: Backend API Tests
        console.log('🔧 BACKEND API TESTS');
        console.log('--------------------');
        
        // Login Test
        console.log('1️⃣ Testing Admin Login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@luxefashionboutique.com',
            password: 'Admin123!'
        });

        if (loginResponse.status === 200 && loginResponse.data.data) {
            console.log('   ✅ Login successful!');
            console.log(`   👤 User: ${loginResponse.data.data.user.firstName} ${loginResponse.data.data.user.lastName}`);
            console.log(`   🔑 Role: ${loginResponse.data.data.user.role}`);
        }

        const token = loginResponse.data.data.token;

        // Profile Test
        console.log('\n2️⃣ Testing Profile Access...');
        const profileResponse = await axios.get(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profileResponse.status === 200) {
            console.log('   ✅ Profile access successful!');
            console.log(`   📋 Name: ${profileResponse.data.firstName} ${profileResponse.data.lastName}`);
            console.log(`   📧 Email: ${profileResponse.data.email}`);
            console.log(`   🔑 Role: ${profileResponse.data.role}`);
            console.log(`   📅 Created: ${new Date(profileResponse.data.createdAt).toLocaleDateString()}`);
        }

        // Admin Dashboard Test
        console.log('\n3️⃣ Testing Admin Dashboard...');
        const adminResponse = await axios.get(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (adminResponse.status === 200) {
            console.log('   ✅ Admin dashboard access successful!');
            console.log(`   👥 Total users: ${adminResponse.data.length}`);
            
            const userBreakdown = adminResponse.data.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});
            
            Object.entries(userBreakdown).forEach(([role, count]) => {
                console.log(`   📊 ${role}: ${count} users`);
            });
        }

        // Token Verification Test
        console.log('\n4️⃣ Testing Token Verification...');
        const verifyResponse = await axios.get(`${API_URL}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (verifyResponse.status === 200) {
            console.log('   ✅ Token verification successful!');
        }

        console.log('\n🎉 ALL BACKEND TESTS PASSED!\n');

        // Frontend Testing Instructions
        console.log('🌐 FRONTEND TESTING');
        console.log('-------------------');
        console.log('Now testing the frontend application...\n');

        console.log('📋 ADMIN CREDENTIALS:');
        console.log('   📧 Email: admin@luxefashionboutique.com');
        console.log('   🔑 Password: Admin123!');
        console.log('');

        console.log('🔍 TESTING CHECKLIST:');
        console.log('   □ 1. Login page loads correctly');
        console.log('   □ 2. Admin can login with credentials above');
        console.log('   □ 3. User is redirected after successful login');
        console.log('   □ 4. Admin menu/options are visible');
        console.log('   □ 5. Profile page shows correct admin data');
        console.log('   □ 6. Admin dashboard is accessible');
        console.log('   □ 7. User can logout successfully');
        console.log('');

        console.log('🚀 Opening frontend application...');
        
        // Open frontend in browser
        exec(`start ${FRONTEND_URL}/login`, (error) => {
            if (error) {
                console.log('⚠️ Could not auto-open browser. Please manually navigate to:');
                console.log(`   ${FRONTEND_URL}/login`);
            } else {
                console.log('✅ Frontend opened in browser!');
            }
        });

        console.log('\n📝 MANUAL TESTING STEPS:');
        console.log('1. The login page should now be open in your browser');
        console.log('2. Enter the admin credentials shown above');
        console.log('3. Click "Sign In"');
        console.log('4. Verify you are redirected to the home page');
        console.log('5. Check if admin-specific features are visible');
        console.log('6. Navigate to your profile page');
        console.log('7. Verify profile shows: Admin Manager, admin@luxefashionboutique.com');
        console.log('8. Test admin dashboard access if available');
        console.log('9. Test logout functionality');

        console.log('\n✨ SUMMARY');
        console.log('----------');
        console.log('✅ Backend API: All tests passed');
        console.log('✅ Admin user: Ready for testing');
        console.log('✅ Profile endpoint: Fixed and working');
        console.log('✅ Authentication: Fully functional');
        console.log('🔄 Frontend: Ready for manual testing');

    } catch (error) {
        console.error('\n❌ TEST FAILED:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.error(`   Error: ${error.message}`);
        }
    }
};

// Run the final test
finalTest(); 