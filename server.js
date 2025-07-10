// server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Import Mongoose models
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const customRequestRoutes = require('./routes/customRequestRoutes');
const orderRoutes = require('./routes/orderRoutes');
const accountRoutes = require('./routes/accountRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend')));


// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// App routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api', accountRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🛠️ Urban Elements Workshop Backend API is running');
});

// Signup endpoint (example)
app.post('/signup', (req, res) => {
  const { fullName, email, confirmEmail } = req.body;

  if (email !== confirmEmail) {
    return res.status(400).json({ message: 'Emails do not match' });
  }

  console.log('User signed up:', req.body);
  res.status(200).json({ message: 'Signup successful' });
});

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// File upload endpoint
app.post('/upload', upload.single('products'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('File uploaded:', req.file);
  res.status(200).json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
  });
});

// === Direct API Endpoints ===

// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Get all users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add new product
app.post('/api/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Delete a product
app.delete('/deleteproduct/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Product deleted successfully' });
});

// Alternative get all products
app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

