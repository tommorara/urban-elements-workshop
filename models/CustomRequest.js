// models/CustomRequest.js

const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Your name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Your email is required'],
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please describe your custom design needs'],
    trim: true,
  },
  projectDetails: { // Optional detailed fields for specific projects
    type: String,
    trim: true,
  },
  imageUploads: { // Array of paths to uploaded images
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in progress', 'completed', 'rejected'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CustomRequest', customRequestSchema);
