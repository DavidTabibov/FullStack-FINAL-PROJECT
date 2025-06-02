import mongoose from 'mongoose';
import Product from './models/Product.js';

// Connect to database
mongoose.connect('mongodb://localhost:27017/fashion-store');

const updateProducts = async () => {
  try {
    console.log('Connecting to database...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get all products and manually filter Hebrew ones
    console.log('Finding Hebrew products...');
    const allProducts = await Product.find({});
    const hebrewProducts = allProducts.filter(product => 
      /[\u0590-\u05FF]/.test(product.name) || 
      /[\u0590-\u05FF]/.test(product.description)
    );
    
    console.log(`Found ${hebrewProducts.length} Hebrew products to remove`);
    
    // Delete Hebrew products by ID
    for (const product of hebrewProducts) {
      console.log(`Removing: ${product.name}`);
      await Product.findByIdAndDelete(product._id);
    }
    
    // Get remaining products
    const products = await Product.find({});
    console.log(`\nRemaining products: ${products.length}`);
    
    // Add more English products if needed
    const englishProducts = [
      {
        name: "Designer Wool Coat",
        description: "Luxurious wool blend coat with contemporary styling, perfect for sophisticated autumn and winter looks. Features premium buttons and elegant tailoring.",
        brand: "Luxe Collection",
        category: "women",
        subcategory: "coats",
        price: 299.99,
        salePrice: 249.99,
        sizes: [
          { size: "XS", quantity: 10 },
          { size: "S", quantity: 15 },
          { size: "M", quantity: 20 },
          { size: "L", quantity: 15 },
          { size: "XL", quantity: 10 }
        ],
        colors: [
          { name: "Black", code: "#000000" },
          { name: "Navy", code: "#000080" },
          { name: "Camel", code: "#C19A6B" }
        ],
        images: [
          "https://images.unsplash.com/photo-1539533018447-63fcce2678e3",
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf"
        ],
        countInStock: 70,
        isNew: true,
        isSale: true,
        rating: 4.8,
        numReviews: 24
      },
      {
        name: "Athletic Performance Hoodie",
        description: "High-performance hoodie made from moisture-wicking fabric with four-way stretch. Perfect for workouts and casual wear with modern athletic styling.",
        brand: "Active Wear Pro",
        category: "men",
        subcategory: "hoodies",
        price: 89.99,
        sizes: [
          { size: "S", quantity: 12 },
          { size: "M", quantity: 20 },
          { size: "L", quantity: 25 },
          { size: "XL", quantity: 18 },
          { size: "XXL", quantity: 8 }
        ],
        colors: [
          { name: "Black", code: "#000000" },
          { name: "Navy", code: "#000080" },
          { name: "Gray", code: "#808080" },
          { name: "White", code: "#FFFFFF" }
        ],
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
          "https://images.unsplash.com/photo-1503341455058-e79c4702fa90"
        ],
        countInStock: 83,
        rating: 4.6,
        numReviews: 18
      },
      {
        name: "Rainbow Unicorn Dress",
        description: "Magical unicorn-themed dress with sparkly rainbow details and comfortable cotton blend fabric. Perfect for parties and special occasions.",
        brand: "Kids Magic",
        category: "kids",
        subcategory: "dresses",
        price: 39.99,
        sizes: [
          { size: "2T", quantity: 8 },
          { size: "3T", quantity: 10 },
          { size: "4T", quantity: 12 },
          { size: "5T", quantity: 10 },
          { size: "6T", quantity: 8 }
        ],
        colors: [
          { name: "Rainbow", code: "#FF6B6B" },
          { name: "Pink", code: "#FFB6C1" }
        ],
        images: [
          "https://images.unsplash.com/photo-1518832760749-c5bd2d1852b3",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5d2"
        ],
        countInStock: 48,
        isNew: true,
        rating: 4.9,
        numReviews: 12
      },
      {
        name: "Designer Watch Collection",
        description: "Premium stainless steel watch with Swiss movement and sapphire crystal. Water-resistant and perfect for both casual and formal occasions.",
        brand: "TimeX Elite",
        category: "accessories",
        subcategory: "watches",
        price: 599.99,
        salePrice: 449.99,
        sizes: [
          { size: "One Size", quantity: 25 }
        ],
        colors: [
          { name: "Silver", code: "#C0C0C0" },
          { name: "Gold", code: "#FFD700" },
          { name: "Rose Gold", code: "#E8B4B8" }
        ],
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          "https://images.unsplash.com/photo-1524592094714-0f0654e20314"
        ],
        countInStock: 25,
        isSale: true,
        rating: 4.7,
        numReviews: 31
      },
      {
        name: "Summer Floral Maxi Dress",
        description: "Elegant floral maxi dress with flowing silhouette and breathable fabric. Perfect for summer events and vacation wear with feminine styling.",
        brand: "Summer Dreams",
        category: "women",
        subcategory: "dresses",
        price: 119.99,
        sizes: [
          { size: "XS", quantity: 8 },
          { size: "S", quantity: 15 },
          { size: "M", quantity: 20 },
          { size: "L", quantity: 15 },
          { size: "XL", quantity: 8 }
        ],
        colors: [
          { name: "Floral Blue", code: "#4169E1" },
          { name: "Floral Pink", code: "#FFB6C1" },
          { name: "Floral Yellow", code: "#FFFF99" }
        ],
        images: [
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b"
        ],
        countInStock: 66,
        isNew: true,
        rating: 4.5,
        numReviews: 22
      },
      {
        name: "Classic Denim Jacket",
        description: "Timeless denim jacket with premium construction and vintage-inspired details. A wardrobe essential that pairs perfectly with any outfit.",
        brand: "Classic Denim Co.",
        category: "men",
        subcategory: "jackets",
        price: 129.99,
        sizes: [
          { size: "S", quantity: 12 },
          { size: "M", quantity: 18 },
          { size: "L", quantity: 22 },
          { size: "XL", quantity: 15 },
          { size: "XXL", quantity: 8 }
        ],
        colors: [
          { name: "Classic Blue", code: "#6495ED" },
          { name: "Black", code: "#000000" },
          { name: "Light Wash", code: "#B0C4DE" }
        ],
        images: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c"
        ],
        countInStock: 75,
        rating: 4.4,
        numReviews: 16
      }
    ];
    
    // Check if these products already exist
    for (const product of englishProducts) {
      const exists = await Product.findOne({ name: product.name });
      if (!exists) {
        console.log(`Adding: ${product.name}`);
        await Product.create(product);
      }
    }
    
    // Final count
    const finalProducts = await Product.find({});
    console.log(`\nTotal products after update: ${finalProducts.length}`);
    
    // Show all products
    console.log('\n=== All Products (English Only) ===');
    finalProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.category} - $${product.price}`);
    });
    
    mongoose.disconnect();
    console.log('\nDatabase updated successfully!');
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
};

updateProducts(); 