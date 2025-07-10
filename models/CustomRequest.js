const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
  },
  materials: {
    type: [String],
    default: [],
  },
  referenceImageUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Design', 'In Production', 'Completed'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('CustomRequest', customRequestSchema);

