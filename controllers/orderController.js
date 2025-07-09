// controllers/orderController.js
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { product, name, email, address, quantity } = req.body;

    if (!product || !name || !address || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = await Order.create({ product, name, email, address, quantity });

    res.status(201).json({ message: 'Order received', order });
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// Optional: get all orders for admin panel
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

