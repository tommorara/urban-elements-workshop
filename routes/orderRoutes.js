const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Public: Submit an order
router.post('/', orderController.createOrder);

// Admin: Get all orders
router.get('/', orderController.getAllOrders); // protect with middleware later

module.exports = router;

