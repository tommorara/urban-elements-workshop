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

// 10. Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

