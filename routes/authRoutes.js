// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Log in a user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/users
// @desc    Get all users (optional - can be restricted later)
// @access  Public (for now)
router.get('/users', authController.getAllUsers);

module.exports = router;
