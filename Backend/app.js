import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import logger from './middleware/loggerMiddleware.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Set default environment variables if not provided
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'development-jwt-secret-key-please-change-in-production-' + Math.random().toString(36);
    console.log('⚠️  JWT_SECRET not found in environment, using generated default for development');
}

if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = 'development-session-secret-key-please-change-in-production';
    console.log('⚠️  SESSION_SECRET not found in environment, using default for development');
}

if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/fashion-store';
    console.log('ℹ️  MONGODB_URI not found in environment, using default local MongoDB');
}

// Debug: Check if required environment variables are loaded
console.log('🔧 Environment Configuration:');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ EXISTS' : '❌ MISSING');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✅ EXISTS' : '❌ MISSING');
console.log('  SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ EXISTS' : '❌ MISSING');

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Initialize Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        // Always points to local DB; for production with Atlas, replace with process.env.MONGODB_URI_ATLAS
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-store',
        ttl: 4 * 60 * 60,          // 4 hours in seconds
        autoRemove: 'interval',   // Session expiration
        autoRemoveInterval: 10    // Cleanup checks every 10 minutes
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only in real HTTPS
        maxAge: 4 * 60 * 60 * 1000                     // 4 hours in milliseconds
    }
}));

// Use logger middleware
app.use(logger);

// Static files directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Server health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongoConnection: mongoose.connection.readyState === 1,
        jwtSecret: !!process.env.JWT_SECRET,
        envKeys: Object.keys(process.env).filter(key => key.includes('JWT'))
    });
});

// Initialize data endpoint (for development)
app.post('/api/initialize', async (req, res) => {
    try {
        if (process.env.NODE_ENV !== 'development') {
            return res.status(403).json({ 
                error: 'This endpoint is only available in development mode' 
            });
        }

        const initializeData = await import('./config/initialData.js')
            .then(module => module.default);
        
        await initializeData();
        
        res.json({ 
            message: 'Initial data loaded successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error loading initial data:', error);
        res.status(500).json({ 
            error: 'Failed to load initial data',
            details: error.message 
        });
    }
});

// Create sample product endpoint (for development)
app.post('/api/create-sample-product', async (req, res) => {
    try {
        const Product = (await import('./models/Product.js')).default;
        
        const sampleProduct = {
            name: "חולצת טי שירט קלאסית",
            description: "חולצת טי שירט נוחה ואיכותית מכותנה 100%, מושלמת לכל יום",
            brand: "Fashion Brand",
            category: "men",
            subcategory: "חולצות",
            price: 89.90,
            salePrice: 0,
            images: ["/uploads/default-tshirt.jpg"],
            sizes: [
                { size: "S", quantity: 10 },
                { size: "M", quantity: 15 },
                { size: "L", quantity: 12 },
                { size: "XL", quantity: 8 }
            ],
            colors: [
                { name: "שחור", code: "#000000" },
                { name: "לבן", code: "#FFFFFF" },
                { name: "כחול", code: "#0066CC" }
            ],
            countInStock: 45,
            isFeatured: true,
            isNew: true,
            isSale: false
        };

        const product = await Product.create(sampleProduct);
        
        res.json({ 
            message: 'Sample product created successfully',
            product: product
        });
    } catch (error) {
        console.error('Error creating sample product:', error);
        res.status(500).json({ 
            error: 'Failed to create sample product',
            details: error.message 
        });
    }
});

// Create multiple sample products endpoint (for development)
app.post('/api/create-sample-products', async (req, res) => {
    try {
        const Product = (await import('./models/Product.js')).default;
        
        const sampleProducts = [
            {
                name: "ג'ינס סקיני נשים",
                description: "ג'ינס סקיני מחמיא ונוח, עשוי מבד איכותי עם מעט אלסטן",
                brand: "Denim Co",
                category: "women",
                subcategory: "מכנסיים",
                price: 199.90,
                salePrice: 149.90,
                images: ["/uploads/default-jeans.jpg"],
                sizes: [
                    { size: "XS", quantity: 5 },
                    { size: "S", quantity: 12 },
                    { size: "M", quantity: 18 },
                    { size: "L", quantity: 10 },
                    { size: "XL", quantity: 6 }
                ],
                colors: [
                    { name: "כחול כהה", code: "#1a237e" },
                    { name: "כחול בהיר", code: "#42a5f5" },
                    { name: "שחור", code: "#000000" }
                ],
                countInStock: 51,
                isFeatured: true,
                isNew: false,
                isSale: true
            },
            {
                name: "נעלי ספורט ילדים",
                description: "נעלי ספורט נוחות וצבעוניות לילדים, מתאימות לפעילות יומיומית",
                brand: "Kids Sport",
                category: "kids",
                subcategory: "נעליים",
                price: 129.90,
                salePrice: 0,
                images: ["/uploads/default-kids-shoes.jpg"],
                sizes: [
                    { size: "28", quantity: 8 },
                    { size: "30", quantity: 10 },
                    { size: "32", quantity: 12 },
                    { size: "34", quantity: 9 },
                    { size: "36", quantity: 7 }
                ],
                colors: [
                    { name: "ורוד", code: "#e91e63" },
                    { name: "כחול", code: "#2196f3" },
                    { name: "ירוק", code: "#4caf50" }
                ],
                countInStock: 46,
                isFeatured: false,
                isNew: true,
                isSale: false
            },
            {
                name: "תיק יד אלגנטי",
                description: "תיק יד מעור איכותי, מושלם לאירועים מיוחדים ולשימוש יומיומי",
                brand: "Luxury Bags",
                category: "accessories",
                subcategory: "תיקים",
                price: 299.90,
                salePrice: 0,
                images: ["/uploads/default-handbag.jpg"],
                sizes: [
                    { size: "One Size", quantity: 20 }
                ],
                colors: [
                    { name: "שחור", code: "#000000" },
                    { name: "חום", code: "#8d6e63" },
                    { name: "אדום", code: "#d32f2f" }
                ],
                countInStock: 20,
                isFeatured: true,
                isNew: false,
                isSale: false
            }
        ];

        const createdProducts = [];
        for (const productData of sampleProducts) {
            const existingProduct = await Product.findOne({ name: productData.name });
            if (!existingProduct) {
                const product = await Product.create(productData);
                createdProducts.push(product);
            }
        }
        
        res.json({ 
            message: `${createdProducts.length} sample products created successfully`,
            products: createdProducts
        });
    } catch (error) {
        console.error('Error creating sample products:', error);
        res.status(500).json({ 
            error: 'Failed to create sample products',
            details: error.message 
        });
    }
});

// Handle non-existent routes
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database connection
const mongoURI = process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI_ATLAS
    : process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-store';

(async () => {
    const conn = await connectDB();
    if (conn) {
        console.log('MongoDB Connected via connectDB');
        if (process.env.NODE_ENV === 'development') {
            import('./config/initialData.js')
                .then(({ default: initializeData }) => initializeData())
                .catch(err => console.error('Error loading initial data:', err));
        }
    } else {
        console.warn('Running without MongoDB connection');
    }
})();

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;