const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const productController = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- Multer Setup for Product Images ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/'); // Save images in uploads/products folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private (Admin)
router.post(
  '/',
  protect,
  isAdmin,
  upload.single('productImage'),
  productController.createProduct
);

// @route   GET /api/products
// @desc    Get all products (Public browsing)
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by ID (Public browsing)
// @access  Public
router.get('/:id', productController.getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private (Admin)
router.put(
  '/:id',
  protect,
  isAdmin,
  upload.single('productImage'),
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private (Admin)
router.delete(
  '/:id',
  protect,
  isAdmin,
  productController.deleteProduct
);

module.exports = router;

