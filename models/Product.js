// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  material: {
    type: [String], // e.g., ['Steel', 'Wood', 'Glass']
    required: [true, 'Product material is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image is required'],
  },
  stock: {
    type: Number,
    default: 0, // Assuming stock management, or can be null for custom orders
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update 'updatedAt' timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
