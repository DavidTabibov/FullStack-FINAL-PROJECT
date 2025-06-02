import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  // 1. Get user cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // 2. Check if products are in stock
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }
    
    const sizeObj = product.sizes.find(s => s.size === item.size);
    
    if (!sizeObj || sizeObj.quantity < item.quantity) {
      res.status(400);
      throw new Error(`${product.name} is out of stock in size ${item.size}`);
    }
  }

  // 3. Calculate costs
  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice > 300 ? 0 : 30; // Free shipping over 300 ILS
  const taxPrice = Math.round(0.17 * itemsPrice); // 17% VAT
  const totalPrice = itemsPrice + shippingPrice;

  // 4. Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems: cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0],
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color || ''
    })),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: false,
    paidAt: null,
    isDelivered: false,
    deliveredAt: null
  });

  // 5. Update inventory
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
    
    if (sizeIndex !== -1) {
      product.sizes[sizeIndex].quantity -= item.quantity;
      await product.save();
    }
  }

  // 6. Clear cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json(order);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Make sure user is the owner of the order or an admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to view this order');
  }
  
  res.json(order);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'delivered';
  
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address
  };
  
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort('-createdAt');
  res.json(orders);
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$totalPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  res.json(stats);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  order.status = req.body.status;
  
  // Update delivery status based on status
  if (req.body.status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  await order.deleteOne();
  res.json({ message: 'Order removed' });
});

export {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderStats,
  updateOrderStatus,
  deleteOrder
};
