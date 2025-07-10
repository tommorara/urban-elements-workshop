const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Authenticated: Submit an order
router.post('/', protect, orderController.createOrder);

// Public or admin: Get all orders (add admin middleware later)
router.get('/', orderController.getAllOrders);

module.exports = router;
