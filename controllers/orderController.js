// controllers/orderController.js
const Order = require('../models/Order');

// @desc    Create new order (supports both guest & logged-in users)
// @route   POST /api/orders
// @access  Public (authenticated users only need product and quantity)
exports.createOrder = async (req, res) => {
  try {
    const { product, quantity, address, name, email } = req.body;

    if (!product || !quantity) {
      return res.status(400).json({ message: 'Product and quantity are required' });
    }

    const orderData = {
      product,
      quantity,
      address: address || null,
      phone: null, // placeholder, not required
    };

    if (req.user) {
      // Authenticated user: info from token
      orderData.user = req.user._id;
      orderData.name = req.user.name || null;
      orderData.email = req.user.email || null;
    } else {
      // Guest user: must provide name, email, address
      if (!name || !email || !address) {
        return res.status(400).json({
          message: 'Guests must provide name, email, and address',
        });
      }
      orderData.name = name;
      orderData.email = email;
    }

    const order = await Order.create(orderData);

    res.status(201).json({ message: '✅ Order placed successfully', order });
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// Optional: Admin - get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};
