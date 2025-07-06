const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.delete('/users', protect, isAdmin, async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: '✅ All users deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

