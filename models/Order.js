// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
   phone: {
     type: String,
     required: true,
   },
  email: String,
  address: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);

