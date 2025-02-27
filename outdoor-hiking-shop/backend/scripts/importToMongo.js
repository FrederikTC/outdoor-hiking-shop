require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

// MongoDB Models
const Address = require('../models/Address');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

// MySQL Connection
const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

(async () => {
  let mysqlConnection;
  try {
    // Connect to MySQL
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connected to MySQL');

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // ========================
    // Import Data Functions
    // ========================

    // Import Users
    const importUsers = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM users');
      const users = rows.map(row => ({
        username: row.username,
        email: row.email,
        password: row.password,
        role: row.role
      }));
      await User.insertMany(users);
      console.log('✅ Users Imported');
    };

    // Import Addresses
    const importAddresses = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM addresses');
      const addresses = [];
      for (const row of rows) {
        const user = await User.findOne({ email: row.user_email });
        if (!user) {
          console.warn(`❗ User not found for email: ${row.user_email}. Skipping address.`);
          continue;
        }
        addresses.push({
          userId: user._id,
          addressLine1: row.address_line1,
          addressLine2: row.address_line2,
          city: row.city,
          state: row.state,
          postalCode: row.postal_code,
          country: row.country
        });
      }
      if (addresses.length > 0) {
        await Address.insertMany(addresses);
      }
      console.log('✅ Addresses Imported');
    };

    // Import Categories
    const importCategories = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM categories');
      const categories = rows.map(row => ({
        name: row.name,
        slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-')
      }));
      await Category.insertMany(categories);
      console.log('✅ Categories Imported');
    };

    // Import Products
    const importProducts = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM products');
      const products = [];
      for (const row of rows) {
        const category = await Category.findOne({ name: row.category_name });
        if (!category) {
          console.warn(`❗ Category not found for product: ${row.name}. Skipping product.`);
          continue;
        }
        products.push({
          name: row.name,
          description: row.description,
          price: row.price,
          stock: row.stock,
          imageUrl: row.image_url || '/images/default-product.jpg',
          isFeatured: row.is_featured,
          slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-'),
          categoryId: category._id
        });
      }
      if (products.length > 0) {
        await Product.insertMany(products);
      }
      console.log('✅ Products Imported');
    };

    // ========================
    // Execute All Imports
    // ========================
    await importUsers();
    await importAddresses();
    await importCategories();
    await importProducts();

    console.log('🎉 All data imported successfully!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error importing data:', err);
    process.exit(1);
  }
})();
