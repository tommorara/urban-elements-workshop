const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { protect } = require('../middleware/authMiddleware');
const {
  submitCustomRequest,
  getUserRequests
} = require('../controllers/customRequestController');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/custom/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Submit custom request (with multiple image uploads allowed)
router.post('/', protect, upload.array('referenceImage', 5), submitCustomRequest);

// Get user’s own custom requests (you must define this in the controller if not yet)
router.get('/user', protect, getUserRequests);

module.exports = router;
