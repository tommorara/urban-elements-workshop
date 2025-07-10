// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserOrders } = require('../controllers/accountController');

router.get('/orders/user', protect, getUserOrders);

module.exports = router;
