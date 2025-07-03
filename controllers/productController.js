// controllers/productController.js

const Product = require('../models/Product');
const fs = require('fs'); // Node.js file system module
const path = require('path');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  const { name, description, price, category, material } = req.body;

  // Multer stores file info in req.file
  if (!req.file) {
    return res.status(400).json({ message: 'Product image is required' });
  }

  // Construct the full URL for the image
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;

  try {
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price), // Ensure price is a number
      category,
      material: Array.isArray(material) ? material : material.split(',').map(m => m.trim()), // Handle comma-separated string or array
      imageUrl,
      stock: parseInt(req.body.stock, 10) || 0, // Handle optional stock, default to 0
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error.message);
    // Clean up the uploaded file if product creation fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting partial upload:', err);
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Get all products error:', error.message);
    res.status(500).json({ message: 'Server error retrieving products' });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Get product by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error retrieving product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  const { name, description, price, category, material, stock } = req.body;
  const productId = req.params.id;
  let updatedProductData = { ...req.body }; // Start with data from request body

  // Handle potential new image upload
  if (req.file) {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    updatedProductData.imageUrl = imageUrl;

    // If you want to delete the old image file when a new one is uploaded:
    try {
      const productToUpdate = await Product.findById(productId);
      if (productToUpdate && productToUpdate.imageUrl) {
        const oldImagePath = path.join(__dirname, '../uploads/products', path.basename(productToUpdate.imageUrl));
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting old product image:', err);
          });
        }
      }
    } catch (error) {
      console.error('Error finding product to delete old image:', error);
    }
  }

  // Ensure price and stock are numbers
  if (updatedProductData.price) {
    updatedProductData.price = parseFloat(updatedProductData.price);
  }
  if (updatedProductData.stock !== undefined) { // Check for undefined as stock can be 0
    updatedProductData.stock = parseInt(updatedProductData.stock, 10);
  }
   if (updatedProductData.material) {
      // Handle comma-separated string or array
      updatedProductData.material = Array.isArray(updatedProductData.material)
        ? updatedProductData.material
        : updatedProductData.material.split(',').map(m => m.trim());
    }


  try {
    const product = await Product.findByIdAndUpdate(productId, updatedProductData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    if (!product) {
      // If a new image was uploaded but the product doesn't exist, clean up the image
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting partial upload:', err);
        });
      }
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Update product error:', error.message);
    // Clean up the uploaded file if update fails due to validation or other errors
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting partial upload on update error:', err);
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optional: Delete the associated image file from the server
    if (product.imageUrl) {
      const imageFileName = path.basename(product.imageUrl);
      const imagePath = path.join(__dirname, '../uploads/products', imageFileName);

      // Check if the file exists before attempting to delete
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.warn(`Image file not found for deletion: ${imagePath}`);
        } else {
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting product image:', unlinkErr);
              // Decide if you want to stop deletion of product record if image deletion fails
            }
          });
        }
      });
    }

    await product.remove(); // Or Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error.message);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};
