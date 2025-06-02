import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['men', 'women', 'kids', 'accessories']
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price must be a positive number'],
    default: 0
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  sizes: [{
    size: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  }],
  countInStock: {
    type: Number,
    required: [true, 'Count in stock is required'],
    min: [0, 'Count in stock must be a positive number'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isSale: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.salePrice && this.price > this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
