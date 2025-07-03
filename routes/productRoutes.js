// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

// --- Multer Setup for Product Images ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/'); // Save images in uploads/products folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});

const upload = multer({ storage: storage });

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private (Admin)
router.post('/', authMiddleware, adminMiddleware, upload.single('productImage'), productController.createProduct);

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
router.put('/:id', authMiddleware, adminMiddleware, upload.single('productImage'), productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
