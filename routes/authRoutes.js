// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import authentication controller functions
const {
  register,
  login,
  getAllUsers
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Log in a user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/users
// @desc    Get all users (for admin or dev testing)
// @access  Public (or protect with middleware later)
router.get('/users', getAllUsers);

module.exports = router;

