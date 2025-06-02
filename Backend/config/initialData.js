import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';

const initialUsers = [
    {
        firstName: "Admin",
        lastName: "Manager",
        email: "admin@luxefashionboutique.com",
        password: "Admin123!",
        role: "admin"
    },
    {
        firstName: "John",
        lastName: "Customer",
        email: "john@example.com",
        password: "User123!",
        role: "user"
    }
];

const initialProducts = [
    {
        name: "Premium Cotton Classic T-Shirt",
        description: "Ultra-soft premium cotton t-shirt with a classic fit. Perfect for everyday wear with superior comfort and durability. Made from 100% organic cotton.",
        brand: "Luxe Basics",
        category: "men",
        subcategory: "shirts",
        price: 49.99,
        salePrice: 0,
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=500"
        ],
        sizes: [
            { size: "S", quantity: 15 },
            { size: "M", quantity: 25 },
            { size: "L", quantity: 20 },
            { size: "XL", quantity: 12 },
            { size: "XXL", quantity: 8 }
        ],
        colors: [
            { name: "Black", code: "#000000" },
            { name: "White", code: "#FFFFFF" },
            { name: "Navy Blue", code: "#1a237e" },
            { name: "Charcoal", code: "#424242" }
        ],
        countInStock: 80,
        isFeatured: true,
        isNew: true,
        isSale: false
    },
    {
        name: "Designer High-Waisted Skinny Jeans",
        description: "Premium denim skinny jeans with a flattering high-waisted cut. Made from stretch denim for ultimate comfort and style. Features classic five-pocket styling.",
        brand: "Urban Denim Co",
        category: "women",
        subcategory: "pants",
        price: 129.99,
        salePrice: 89.99,
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
        ],
        sizes: [
            { size: "XS", quantity: 8 },
            { size: "S", quantity: 18 },
            { size: "M", quantity: 25 },
            { size: "L", quantity: 15 },
            { size: "XL", quantity: 10 }
        ],
        colors: [
            { name: "Dark Indigo", code: "#1a237e" },
            { name: "Light Blue", code: "#42a5f5" },
            { name: "Black", code: "#000000" },
            { name: "Light Wash", code: "#90CAF9" }
        ],
        countInStock: 76,
        isFeatured: true,
        isNew: false,
        isSale: true
    },
    {
        name: "Kids' Athletic Performance Sneakers",
        description: "High-performance athletic sneakers designed for active kids. Features breathable mesh upper, cushioned sole, and durable construction for all-day comfort.",
        brand: "SportyKids",
        category: "kids",
        subcategory: "shoes",
        price: 79.99,
        salePrice: 0,
        images: [
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500",
            "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500"
        ],
        sizes: [
            { size: "1Y", quantity: 10 },
            { size: "2Y", quantity: 12 },
            { size: "3Y", quantity: 15 },
            { size: "4Y", quantity: 13 },
            { size: "5Y", quantity: 11 },
            { size: "6Y", quantity: 9 }
        ],
        colors: [
            { name: "Pink/White", code: "#e91e63" },
            { name: "Blue/White", code: "#2196f3" },
            { name: "Green/Black", code: "#4caf50" },
            { name: "Red/White", code: "#f44336" }
        ],
        countInStock: 70,
        isFeatured: false,
        isNew: true,
        isSale: false
    },
    {
        name: "Elegant Leather Crossbody Bag",
        description: "Sophisticated genuine leather crossbody bag perfect for day-to-night occasions. Features adjustable strap, multiple compartments, and premium gold-tone hardware.",
        brand: "Luxe Accessories",
        category: "accessories",
        subcategory: "bags",
        price: 189.99,
        salePrice: 149.99,
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
        ],
        sizes: [
            { size: "One Size", quantity: 25 }
        ],
        colors: [
            { name: "Black", code: "#000000" },
            { name: "Brown", code: "#8D6E63" },
            { name: "Cognac", code: "#A0522D" },
            { name: "Navy", code: "#1a237e" }
        ],
        countInStock: 25,
        isFeatured: true,
        isNew: false,
        isSale: true
    },
    {
        name: "Cashmere Blend Sweater",
        description: "Luxurious cashmere blend sweater with a relaxed fit. Perfect for layering or wearing alone. Features ribbed cuffs and hem with a soft, cozy texture.",
        brand: "Cozy Luxe",
        category: "women",
        subcategory: "sweaters",
        price: 199.99,
        salePrice: 0,
        images: [
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500"
        ],
        sizes: [
            { size: "XS", quantity: 5 },
            { size: "S", quantity: 15 },
            { size: "M", quantity: 20 },
            { size: "L", quantity: 12 },
            { size: "XL", quantity: 8 }
        ],
        colors: [
            { name: "Cream", code: "#F5F5DC" },
            { name: "Blush Pink", code: "#FFC0CB" },
            { name: "Camel", code: "#C19A6B" },
            { name: "Charcoal", code: "#36454F" }
        ],
        countInStock: 60,
        isFeatured: true,
        isNew: true,
        isSale: false
    },
    {
        name: "Men's Formal Dress Shirt",
        description: "Classic formal dress shirt in premium cotton with a tailored fit. Features French cuffs, spread collar, and wrinkle-resistant fabric. Perfect for business or formal events.",
        brand: "Executive Style",
        category: "men",
        subcategory: "shirts",
        price: 89.99,
        salePrice: 69.99,
        images: [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
        ],
        sizes: [
            { size: "S", quantity: 10 },
            { size: "M", quantity: 18 },
            { size: "L", quantity: 22 },
            { size: "XL", quantity: 15 },
            { size: "XXL", quantity: 8 }
        ],
        colors: [
            { name: "White", code: "#FFFFFF" },
            { name: "Light Blue", code: "#ADD8E6" },
            { name: "Light Pink", code: "#FFB6C1" },
            { name: "Lavender", code: "#E6E6FA" }
        ],
        countInStock: 73,
        isFeatured: false,
        isNew: false,
        isSale: true
    }
];

const initializeData = async () => {
    try {
        console.log('Starting initial data loading...');

        // Create users
        for (const userData of initialUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                // Password will be automatically hashed in the model
                const user = await User.create(userData);
                console.log(`Created user: ${user.email}`);
            }
        }

        // Create products
        for (const productData of initialProducts) {
            const existingProduct = await Product.findOne({ name: productData.name });
            if (!existingProduct) {
                const product = await Product.create(productData);
                console.log(`Created product: ${product.name}`);
            }
        }

        console.log('Initial data loading completed successfully');
    } catch (error) {
        console.error('Error loading initial data:', error);
        throw error;
    }
};

export default initializeData;