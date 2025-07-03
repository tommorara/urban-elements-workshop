// seeds/seedProducts.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product'); // Import the Product model

dotenv.config(); // Load environment variables

// Sample product data
const sampleProducts = [
  {
    name: "Nairobi Industrial Coffee Table",
    description: "A sleek and sturdy coffee table crafted from reclaimed steel and a solid acacia wood top, perfect for urban living.",
    price: 15000,
    category: "Living Room",
    material: ["Steel", "Wood"],
    imageUrl: "http://localhost:5000/uploads/products/sample-coffee-table.jpg", // Placeholder URL, you'll need to add actual images
    stock: 10
  },
  {
    name: "Mombasa Sunburst Mirror",
    description: "An eye-catching decorative mirror featuring a sunburst design with a polished brass frame and a large reflective surface.",
    price: 8500,
    category: "Decor",
    material: ["Mirror", "Metal"],
    imageUrl: "http://localhost:5000/uploads/products/sample-mirror.jpg", // Placeholder URL
    stock: 25
  },
  {
    name: "Lamu Sideboard Cabinet",
    description: "A minimalist sideboard with a rich walnut finish, featuring clean lines, ample storage, and brushed steel handles.",
    price: 35000,
    category: "Storage",
    material: ["Wood", "Steel"],
    imageUrl: "http://localhost:5000/uploads/products/sample-sideboard.jpg", // Placeholder URL
    stock: 5
  },
  {
    name: "Kilimanjaro Bookshelf",
    description: "A tall, open-back bookshelf with a powder-coated black steel frame and five spacious wooden shelves. Ideal for displaying books and decor.",
    price: 18000,
    category: "Storage",
    material: ["Steel", "Wood"],
    imageUrl: "http://localhost:5000/uploads/products/sample-bookshelf.jpg", // Placeholder URL
    stock: 15
  },
  {
    name: "Karen Glass Dining Table",
    description: "An elegant dining table with a tempered glass top and a robust steel base, seating up to six.",
    price: 45000,
    category: "Dining",
    material: ["Glass", "Steel"],
    imageUrl: "http://localhost:5000/uploads/products/sample-dining-table.jpg", // Placeholder URL
    stock: 7
  }
];

const connectDBAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');

    // Clear existing products if any
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`${createdProducts.length} products seeded successfully!`);

    // For the sample images to work, you'll need to create the `uploads/products` directory
    // and place placeholder image files with the specified names (e.g., sample-coffee-table.jpg) there.
    // Or, you can update the `imageUrl` to actual URLs or remove them for now.

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close the Mongoose connection
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed.');
      process.exit(0); // Exit the script
    });
  }
};

// Execute the seeding function
connectDBAndSeed();
