const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const { productId, quantity, deliveryAddress, note } = req.body;

  if (!productId || !quantity || !deliveryAddress) {
    return res.status(400).json({ message: 'Product ID, quantity, and address are required' });
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Create order
    const order = await Order.create({
      user: req.user._id,
      productId,
      quantity,
      deliveryAddress,
      note,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};

// @desc    Get all orders by logged-in user
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('productId', 'name price imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error.message);
    res.status(500).json({ message: 'Server error retrieving orders' });
  }
};

