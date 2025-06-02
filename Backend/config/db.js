// backend/Config/db.js

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
    try {
        // Provide default values if environment variables are not set
        const mongoURI = process.env.NODE_ENV === 'production'
            ? process.env.MONGODB_URI_ATLAS || 'mongodb://localhost:27017/fashion-store'
            : process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-store';

        console.log('Attempting MongoDB connection to:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            retryReads: true
        };

        let conn;
        try {
            // Primary connection attempt
            conn = await mongoose.connect(mongoURI, options);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        } catch (primaryError) {
            console.log('Primary MongoDB connection failed, trying fallback...');
            
            // Fallback to local MongoDB
            const fallbackURI = 'mongodb://localhost:27017/fashion-store';
            try {
                conn = await mongoose.connect(fallbackURI, options);
                console.log(`✅ MongoDB Connected (fallback): ${conn.connection.host}`);
            } catch (fallbackError) {
                console.error('❌ Both primary and fallback MongoDB connections failed');
                console.error('Primary error:', primaryError.message);
                console.error('Fallback error:', fallbackError.message);
                
                // For development, we can still run without MongoDB
                if (process.env.NODE_ENV !== 'production') {
                    console.log('⚠️  Running in development mode without MongoDB. Some features may not work.');
                    return null;
                }
                throw fallbackError;
            }
        }

        // Create required directories if they don't exist
        ['logs', 'uploads'].forEach(dir => {
            const dirPath = path.join(__dirname, '..', dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`📁 Directory created: ${dirPath}`);
            }
        });

        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        
        // In development, we can continue without MongoDB for testing
        if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️  Continuing without database connection in development mode');
            return null;
        }
        
        // In production, we should fail
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    // Ignore expected errors during fallback attempts
    if (err.code && err.code === 'ENOTFOUND') return;
    console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed through app termination');
    process.exit(0);
});

export default connectDB;
