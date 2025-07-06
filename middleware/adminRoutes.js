const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// DELETE all users — admin only!
router.delete('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: '✅ All users deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

