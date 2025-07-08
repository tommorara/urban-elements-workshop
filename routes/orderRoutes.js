const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create a new order (Logged-in users only)
// @access  Private (User)
router.post('/', protect, orderController.createOrder);

// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
// @access  Private (User)
router.get('/', protect, orderController.getUserOrders);

module.exports = router;

