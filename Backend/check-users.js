import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-store';

async function checkAndCreateUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check existing users
        const users = await User.find({});
        console.log(`📊 Found ${users.length} users in database:`);
        
        users.forEach(user => {
            console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.role}`);
        });

        // Check if test user exists
        const testUser = await User.findOne({ email: 'test@example.com' });
        
        if (!testUser) {
            console.log('\n🔧 Creating test user...');
            
            const newUser = new User({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'TestPass1234!', // Will be hashed automatically by the model
                role: 'user'
            });

            await newUser.save();
            console.log('✅ Test user created successfully!');
            console.log('Email: test@example.com');
            console.log('Password: TestPass1234!');
        } else {
            console.log('\n✅ Test user already exists!');
            console.log('Email: test@example.com');
            console.log('Password: TestPass1234!');
        }

        // Create admin user if doesn't exist
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        
        if (!adminUser) {
            console.log('\n🔧 Creating admin user...');
            
            const newAdmin = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'AdminPass1234!',
                role: 'admin'
            });

            await newAdmin.save();
            console.log('✅ Admin user created successfully!');
            console.log('Email: admin@example.com');
            console.log('Password: AdminPass1234!');
        } else {
            console.log('\n✅ Admin user already exists!');
            console.log('Email: admin@example.com');
            console.log('Password: AdminPass1234!');
        }

        console.log('\n📋 Available test credentials:');
        console.log('Regular User: test@example.com / TestPass1234!');
        console.log('Admin User: admin@example.com / AdminPass1234!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

checkAndCreateUsers(); 