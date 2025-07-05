require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas!");
    return mongoose.disconnect(); // Optional: close connection after test
  })
  .catch((err) => {
    console.error("❌ Connection error:", err.message);
  });

