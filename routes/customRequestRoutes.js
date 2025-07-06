const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  submitCustomRequest,
  getAllCustomRequests,
  getCustomRequestById,
  updateCustomRequestStatus,
  deleteCustomRequest,
} = require('../controllers/customRequestController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- Multer Setup for Custom Request Images ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/custom-requests/'); // Save images in this folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filenames
  },
});

const upload = multer({ storage });

/**
 * @route   POST /api/custom-requests
 * @desc    Submit a custom design request
 * @access  Public or Protected (change 'protect' if required)
 */
router.post(
  '/',
  upload.array('requestImages', 5), // Accepts up to 5 images
  submitCustomRequest
);

/**
 * @route   GET /api/custom-requests
 * @desc    Get all custom requests
 * @access  Admin only
 */
router.get('/', protect, isAdmin, getAllCustomRequests);

/**
 * @route   GET /api/custom-requests/:id
 * @desc    Get a single custom request by ID
 * @access  Admin only
 */
router.get('/:id', protect, isAdmin, getCustomRequestById);

/**
 * @route   PUT /api/custom-requests/:id/status
 * @desc    Update status of a custom request
 * @access  Admin only
 */
router.put('/:id/status', protect, isAdmin, updateCustomRequestStatus);

/**
 * @route   DELETE /api/custom-requests/:id
 * @desc    Delete a custom request
 * @access  Admin only
 */
router.delete('/:id', protect, isAdmin, deleteCustomRequest);

module.exports = router;

