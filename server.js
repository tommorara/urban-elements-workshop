// server.js

// 1. Load environment variables
require('dotenv').config();

// 2. Import core packages
const express = require('express');
const cors = require('cors');
const path = require('path');

// 3. Import custom modules
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const customRequestRoutes = require('./routes/customRequestRoutes');

// 4. Connect to MongoDB
connectDB();

// 5. Initialize Express app
const app = express();

// Define PORT (from .env or default to 5000)
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Accept connections from any IP

// 6. Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 8. Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/custom-requests', customRequestRoutes);

// 9. Default test route
app.get('/', (req, res) => {
  res.send('🛠️ Urban Elements Workshop Backend API is running');
});

// signup.html
app.post('/signup', (req, res) => {
  const { fullName, email, confirmEmail } = req.body;
  
  if (email !== confirmEmail) {
    return res.status(400).json({ message: 'Emails do not match' });
  }
  console.log('User signed up:', req.body);

  res.status(200).json({ message: 'Signup successful' });
});

// Image storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); 
  },
})

const upload = multer({ storage: storage });

// to use all the images in the products field
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image upload endpoint
app.post('/upload', upload.single('products'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  console.log('File uploaded:', req.file);
});

 // File uploaded successfully
  res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });

  // scheme for the uploaded file or products on mongoDB
  const products = new mongoose.model({
    id:{ type: Number, required: true },
    name:{ type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true }, 
    date: {type: Date, default: Date.now}

  });

// Add products to the database
app.post('/addproducts', async (req, res) => {
  const product = new product, { id, name, description, price, images } = req.body;
})
  try {
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });

// 10. Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

