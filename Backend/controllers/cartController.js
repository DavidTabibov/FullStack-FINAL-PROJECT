import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock'
  });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1, size, color } = req.body;

    // Product validation
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // בדיקת מלאי
    if (product.countInStock < quantity) {
        res.status(400);
        throw new Error('Not enough stock available');
    }

    // הוספה לעגלה
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // בדיקה אם הפריט כבר קיים בעגלה
    const existingItem = cart.items.find(
        item => item.product.toString() === productId && 
                item.size === size && 
                item.color?.code === color?.code
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            name: product.name,
            image: product.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
            price: product.salePrice > 0 ? product.salePrice : product.price,
            quantity,
            size,
            color
        });
    }

    await cart.save();

    cart = await cart.populate({
        path: 'items.product',
        select: 'name images price countInStock'
    });

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

// @desc    Update cart item quantity
// @route   PATCH /api/cart/items/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const item = cart.items.id(itemId);
    if (!item) {
        res.status(404);
        throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
        cart.items.pull(itemId);
    } else {
        item.quantity = quantity;
    }

    await cart.save();
    
    cart = await cart.populate({
        path: 'items.product',
        select: 'name images price countInStock'
    });

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items.pull(itemId);
    await cart.save();
    
    cart = await cart.populate({
        path: 'items.product',
        select: 'name images price countInStock'
    });

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    // כאן צריך להוסיף לוגיקה לבדיקת תקינות הקופון מול מודל קופונים
    // לצורך הדוגמה נשתמש בקופון קבוע
    const coupon = {
        code: 'SUMMER2023',
        discount: 10,
        expiresAt: new Date('2023-12-31')
    };

    if (code !== coupon.code) {
        res.status(400);
        throw new Error('Invalid coupon code');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.coupon = coupon;
    await cart.save();

    cart = await cart.populate({
        path: 'items.product',
        select: 'name images price countInStock'
    });

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

export {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    applyCoupon
};
