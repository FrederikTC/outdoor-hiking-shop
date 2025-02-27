require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

// MongoDB Models
const Address = require('../models/Address');
const Cart = require('../models/Cart');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const InventoryLog = require('../models/InventoryLog');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const Review = require('../models/Review');
const ShippingMethod = require('../models/ShippingMethod');
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
    console.log('Connected to MySQL');

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

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
      console.log('Users Imported');
    };

    // Import Addresses
    const importAddresses = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM addresses');
      const addresses = rows.map(row => ({
        userId: row.user_id,
        addressLine1: row.address_line1,
        addressLine2: row.address_line2,
        city: row.city,
        state: row.state,
        postalCode: row.postal_code,
        country: row.country
      }));
      await Address.insertMany(addresses);
      console.log('Addresses Imported');
    };

    // Import Categories
    const importCategories = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM categories');
      const categories = rows.map(row => ({
        name: row.name
      }));
      await Category.insertMany(categories);
      console.log('Categories Imported');
    };

    // Import Products
    const importProducts = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM products');
      const products = rows.map(row => ({
        name: row.name,
        description: row.description,
        price: row.price,
        stock: row.stock,
        imageUrl: row.image_url,
        isFeatured: row.isFeatured
      }));
      await Product.insertMany(products);
      console.log('Products Imported');
    };

    // Import Carts
    const importCarts = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM cart_items');
      const carts = rows.map(row => ({
        userId: row.user_id,
        productId: row.product_id,
        quantity: row.quantity
      }));
      await Cart.insertMany(carts);
      console.log('Carts Imported');
    };

    // Import Orders
    const importOrders = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM orders');
      const orders = rows.map(row => ({
        userId: row.user_id,
        total: row.total,
        status: row.status, // Match the possible enum values like 'pending', 'completed', etc.
        shippingMethodId: row.shipping_method_id,
        orderDate: row.created_at
      }));
      await Order.insertMany(orders);
      console.log('Orders Imported');
    };

    // Import Order Items
    const importOrderItems = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM order_items');
      const orderItems = rows.map(row => ({
        orderId: row.order_id,
        productId: row.product_id,
        quantity: row.quantity,
        price: row.price
      }));
      await OrderItem.insertMany(orderItems);
      console.log('Order Items Imported');
    };

    // Import Payments
    const importPayments = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM payments');
      const payments = rows.map(row => ({
        orderId: row.order_id,
        paymentMethod: row.payment_method, // Make sure this matches the enum in the database ('credit_card', 'paypal', 'bank_transfer')
        paymentStatus: row.payment_status, // Ensure this matches the payment_status values like 'pending', 'completed', etc.
        paymentDate: row.payment_date
      }));
      await Payment.insertMany(payments);
      console.log('Payments Imported');
    };

    // Import Coupons
    const importCoupons = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM coupons');
      const coupons = rows.map(row => ({
        code: row.code,
        discount: row.discount,
        validFrom: row.valid_from,
        validUntil: row.valid_until,
        usageLimit: row.usage_limit,
        usageCount: row.usage_count
      }));
      await Coupon.insertMany(coupons);
      console.log('Coupons Imported');
    };

    // Import Inventory Logs
    const importInventoryLogs = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM inventory_logs');
      const inventoryLogs = rows.map(row => ({
        productId: row.product_id,
        changeQuantity: row.change_quantity,
        changeReason: row.change_reason, // Match 'restock', 'sale', etc.
        changedAt: row.changed_at
      }));
      await InventoryLog.insertMany(inventoryLogs);
      console.log('Inventory Logs Imported');
    };

    // Import Reviews
    const importReviews = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM reviews');
      const reviews = rows.map(row => ({
        productId: row.product_id,
        userId: row.user_id,
        rating: row.rating,
        reviewText: row.review_text
      }));
      await Review.insertMany(reviews);
      console.log('Reviews Imported');
    };

    // Import Shipping Methods
    const importShippingMethods = async () => {
      const [rows] = await mysqlConnection.query('SELECT * FROM shipping_methods');
      const shippingMethods = rows.map(row => ({
        methodName: row.method_name,
        cost: row.cost,
        estimatedDelivery: row.estimated_delivery
      }));
      await ShippingMethod.insertMany(shippingMethods);
      console.log('Shipping Methods Imported');
    };

    // ========================
    // Execute All Imports
    // ========================
    await importUsers();
    await importAddresses();
    await importCategories();
    await importProducts();
    await importCarts();
    await importOrders();
    await importOrderItems();
    await importPayments();
    await importCoupons();
    await importInventoryLogs();
    await importReviews();
    await importShippingMethods();

    console.log('✅ All data imported successfully!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error importing data:', err);
    process.exit(1);
  } finally {
    if (mysqlConnection) {
      mysqlConnection.end();
    }
  }
})();
