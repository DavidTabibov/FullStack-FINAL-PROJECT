import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json(product);
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Build query
  const queryObj = {};
  
  // Filtering
  if (req.query.category) {
    queryObj.category = req.query.category;
  }
  
  if (req.query.brand) {
    queryObj.brand = req.query.brand;
  }
  
  if (req.query.priceMin && req.query.priceMax) {
    queryObj.price = { 
      $gte: Number(req.query.priceMin), 
      $lte: Number(req.query.priceMax) 
    };
  }
  
  // Search
  if (req.query.search) {
    queryObj.name = { $regex: req.query.search, $options: 'i' };
  }
  
  // Sorting
  let sortOption = { createdAt: -1 }; // Default sort by newest
  
  if (req.query.sortBy) {
    switch (req.query.sortBy) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
    }
  }
  
  // Execute query
  const products = await Product.find(queryObj)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);
  
  // Get total count
  const total = await Product.countDocuments(queryObj);
  
  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Update product fields
  Object.keys(req.body).forEach(key => {
    product[key] = req.body[key];
  });
  
  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        subCategories: { $addToSet: '$subcategory' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  res.json(categories);
});

// @desc    Get product brands
// @route   GET /api/products/brands
// @access  Public
const getProductBrands = asyncHandler(async (req, res) => {
  const brands = await Product.aggregate([
    {
      $group: {
        _id: '$brand',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  res.json(brands);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .limit(8)
    .select('name price images category brand');
  
  res.json(products);
});

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
const getNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNew: true })
    .limit(8)
    .select('name price images category brand')
    .sort({ createdAt: -1 });
  
  res.json(products);
});

// @desc    Get products on sale
// @route   GET /api/products/sale
// @access  Public
const getSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isSale: true })
    .limit(8)
    .select('name price salePrice images category brand')
    .sort({ createdAt: -1 });
  
  res.json(products);
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(8)
    .select('name price images category brand rating numReviews');
  
  res.json(products);
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400);
    throw new Error('Please provide a search query');
  }
  
  const products = await Product.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(20);
  
  res.json(products);
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  // Validate input
  if (!rating || !comment) {
    res.status(400);
    throw new Error('Rating and comment are required');
  }
  
  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }
  
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );
  
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }
  
  // Create review with proper error handling for user fields
  let reviewerName = 'Anonymous User';
  try {
    if (req.user.firstName && req.user.lastName) {
      reviewerName = `${req.user.firstName} ${req.user.lastName}`;
    } else if (req.user.firstName) {
      reviewerName = req.user.firstName;
    } else if (req.user.name) {
      reviewerName = req.user.name;
    } else if (req.user.email) {
      // Use first part of email as fallback
      reviewerName = req.user.email.split('@')[0];
    }
  } catch (error) {
    console.log('Error getting user name for review:', error);
    reviewerName = 'Anonymous User';
  }
  
  const review = {
    name: reviewerName,
    rating: Number(rating),
    comment: comment.trim(),
    user: req.user._id
  };
  
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  
  // Calculate new average rating
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
    product.reviews.length;
  
  await product.save();
  
  res.status(201).json({ 
    message: 'Review added successfully',
    review: {
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date()
    }
  });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getProductBrands,
  getFeaturedProducts,
  getNewProducts,
  getSaleProducts,
  getTopProducts,
  searchProducts,
  createProductReview
};
