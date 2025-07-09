// server.js

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const customRequestRoutes = require('./routes/customRequestRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Enable CORS for all origins (adjust in production)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Database Connection ---
const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASS);
const dbName = process.env.DB_NAME;

const uri = `mongodb+srv://${username}:${password}@cluster0.m7po6dv.mongodb.net/${dbName}`;

mongoose.connect(uri, {
	  useNewUrlParser: true,
	  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Connection error:", err));

// --- Routes ---
app.use('/api/auth', authRoutes);
api.use('/api/products', productRoutes);
app.use('/api/custom-requests', customRequestRoutes);

// Basic Root Route
app.get('/', (req, res) => {
	res.send('Urban Elements Workshop Backend API');
});

// Start the server
app.listen(PORT, (error) => {
	console.log(`Server running on port ${PORT}`);
});
