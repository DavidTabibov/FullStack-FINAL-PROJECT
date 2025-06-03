import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add address to user
// @route   POST /api/users/address
// @access  Private
const addUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const address = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
      phone: req.body.phone,
      isDefault: req.body.isDefault || false
    };

    // If this is the default address, unset any previous default
    if (address.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      address.isDefault = true;
    }

    user.addresses.push(address);
    const updatedUser = await user.save();

    res.status(201).json({
      addresses: updatedUser.addresses
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user address
// @route   PUT /api/users/address/:id
// @access  Private
const updateUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      res.status(404);
      throw new Error('Address not found');
    }

    // Update address fields
    Object.keys(req.body).forEach(key => {
      user.addresses[addressIndex][key] = req.body[key];
    });

    // If this is being set as default, unset any previous default
    if (req.body.isDefault) {
      user.addresses.forEach((addr, idx) => {
        if (idx !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    const updatedUser = await user.save();

    res.json({
      addresses: updatedUser.addresses
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user address
// @route   DELETE /api/users/address/:id
// @access  Private
const deleteUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      res.status(404);
      throw new Error('Address not found');
    }

    // Remove the address
    user.addresses.splice(addressIndex, 1);

    // If we removed the default address and there are other addresses, set a new default
    if (user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    const updatedUser = await user.save();

    res.json({
      addresses: updatedUser.addresses
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select: 'name price images category brand rating'
  });

  if (user) {
    res.json({
      favorites: user.wishlist
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle product in favorites (add/remove)
// @route   POST /api/users/favorites/:id
// @access  Private
const toggleFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.id;

  if (user) {
    // Check if product is already in favorites
    const isInFavorites = user.wishlist.includes(productId);
    
    if (isInFavorites) {
      // Remove from favorites
      user.wishlist = user.wishlist.filter(
        fav => fav.toString() !== productId
      );
      await user.save();
      res.json({ message: 'Product removed from favorites', action: 'removed' });
    } else {
      // Add to favorites
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: 'Product added to favorites', action: 'added' });
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add product to favorites
// @route   POST /api/users/favorites/:id
// @access  Private
const addToFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.id;

  if (user) {
    // Check if product is already in favorites
    if (user.wishlist.includes(productId)) {
      res.status(400);
      throw new Error('Product already in favorites');
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({ message: 'Product added to favorites' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove product from favorites
// @route   DELETE /api/users/favorites/:id
// @access  Private
const removeFromFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.id;

  if (user) {
    user.wishlist = user.wishlist.filter(
      fav => fav.toString() !== productId
    );
    await user.save();

    res.json({ message: 'Product removed from favorites' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Clear all favorites
// @route   DELETE /api/users/favorites
// @access  Private
const clearAllFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = [];
    await user.save();

    res.json({ message: 'All favorites cleared successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get favorites analytics for admin
// @route   GET /api/users/admin/favorites-analytics
// @access  Private/Admin
const getFavoritesAnalytics = asyncHandler(async (req, res) => {
  const favoritesStats = await User.aggregate([
    { $unwind: '$wishlist' },
    { $group: { _id: '$wishlist', count: { $sum: 1 } } },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $project: { productId: '$_id', count: 1, name: '$product.name', price: '$product.price', category: '$product.category', image: { $arrayElemAt: ['$product.images', 0] } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  res.json({
    success: true,
    data: favoritesStats
  });
});

// @desc    Get users with most favorites for admin
// @route   GET /api/users/admin/users-favorites
// @access  Private/Admin
const getUsersFavoritesStats = asyncHandler(async (req, res) => {
  const userStats = await User.aggregate([
    { 
      $project: { 
        firstName: 1,
        lastName: 1,
        email: 1, 
        favoritesCount: { $size: '$wishlist' }, 
        createdAt: 1,
        fullName: { $concat: ['$firstName', ' ', '$lastName'] }
      } 
    },
    { $sort: { favoritesCount: -1 } },
    { $limit: 50 }
  ]);

  res.json({
    success: true,
    data: userStats
  });
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getFavorites,
  toggleFavorites,
  addToFavorites,
  removeFromFavorites,
  clearAllFavorites,
  getFavoritesAnalytics,
  getUsersFavoritesStats
};
