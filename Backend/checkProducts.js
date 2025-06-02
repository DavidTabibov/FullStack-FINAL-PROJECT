import mongoose from 'mongoose';
import Product from './models/Product.js';

// Connect to database
mongoose.connect('mongodb://localhost:27017/fashion-store');

const checkProducts = async () => {
  try {
    console.log('Connecting to database...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for connection
    
    const products = await Product.find({});
    console.log('\n=== Current Products in Database ===');
    console.log(`Total products: ${products.length}\n`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. Name: ${product.name}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Description: ${product.description?.substring(0, 50)}...`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Images: ${product.images?.length || 0} images`);
      console.log(`   Created: ${product.createdAt}`);
      console.log('---');
    });
    
    mongoose.disconnect();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
};

checkProducts(); 