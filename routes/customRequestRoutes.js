// routes/customRequestRoutes.js

const adminMiddleware = require('../middleware/adminMiddleware');
const express = require('express');
const router = express.Router();
const customRequestController = require('../controllers/customRequestController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware'); // Optional: if only logged-in users can submit

// --- Multer Setup for Custom Request Images ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/custom-requests/'); // Save images in uploads/custom-requests folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});

const upload = multer({ storage: storage });

// @route   POST /api/custom-requests
// @desc    Submit a custom design request
// @access  Public (or Private if logged in is required)
router.post('/', upload.array('requestImages', 5), customRequestController.submitCustomRequest); // Allows up to 5 images

// @route   GET /api/custom-requests
// @desc    Get all custom requests (Admin only)
// @access  Private (Admin)
router.get('/', authMiddleware, adminMiddleware, customRequestController.getAllCustomRequests);

// @route   GET /api/custom-requests/:id
// @desc    Get a single custom request (Admin only)
// @access  Private (Admin)
router.get('/:id', authMiddleware, adminMiddleware, customRequestController.getCustomRequestById);

// @route   PUT /api/custom-requests/:id/status
// @desc    Update status of a custom request (Admin only)
// @access  Private (Admin)
router.put('/:id/status', authMiddleware, adminMiddleware, customRequestController.updateCustomRequestStatus);

// @route   DELETE /api/custom-requests/:id
// @desc    Delete a custom request (Admin only)
// @access  Private (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, customRequestController.deleteCustomRequest);

module.exports = router;
