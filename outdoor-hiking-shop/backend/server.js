require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./db'); // MySQL Connection
const connectDB = require('./config/mongoose'); // MongoDB Connection
const neo4j = require('neo4j-driver');

// Initialize Express App
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// =====================
// Home Route
// =====================
app.get('/', (req, res) => {
    res.send('Outdoor Hiking Shop API is running');
});

// =====================
// MySQL Routes
// =====================
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const addressRoutes = require('./routes/addressRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const inventoryLogRoutes = require('./routes/inventoryLogRoutes');
const couponRoutes = require('./routes/couponRoutes');
const shippingMethodRoutes = require('./routes/shippingMethodRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');

// Register MySQL Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inventory-logs', inventoryLogRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/shipping-methods', shippingMethodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes); // User Routes for MySQL

// =====================
// MongoDB Routes
// =====================
const mongoAddressRoutes = require('./routes/mongo/addressRoutes');
const mongoCartRoutes = require('./routes/mongo/cartRoutes');
const mongoCategoryRoutes = require('./routes/mongo/categoryRoutes');
const mongoCouponRoutes = require('./routes/mongo/couponRoutes');
const mongoInventoryLogRoutes = require('./routes/mongo/inventoryLogRoutes');
const mongoOrderRoutes = require('./routes/mongo/orderRoutes');
const mongoOrderItemRoutes = require('./routes/mongo/orderItemRoutes');
const mongoPaymentRoutes = require('./routes/mongo/paymentRoutes');
const mongoProductRoutes = require('./routes/mongo/productRoutes');
const mongoReviewRoutes = require('./routes/mongo/reviewRoutes');
const mongoShippingMethodRoutes = require('./routes/mongo/shippingMethodRoutes');
const mongoUserRoutes = require('./routes/mongo/userRoutes');

// Register MongoDB Routes
app.use('/mongo/addresses', mongoAddressRoutes);
app.use('/mongo/cart', mongoCartRoutes);
app.use('/mongo/categories', mongoCategoryRoutes);
app.use('/mongo/coupons', mongoCouponRoutes);
app.use('/mongo/inventory-logs', mongoInventoryLogRoutes);
app.use('/mongo/orders', mongoOrderRoutes);
app.use('/mongo/order-items', mongoOrderItemRoutes);
app.use('/mongo/payments', mongoPaymentRoutes);
app.use('/mongo/products', mongoProductRoutes);
app.use('/mongo/reviews', mongoReviewRoutes);
app.use('/mongo/shipping-methods', mongoShippingMethodRoutes);
app.use('/mongo/users', mongoUserRoutes); // User Routes for MongoDB

// =====================
// Neo4j Routes
// =====================
const neo4jRoutes = require('./routes/neo4jRoutes');

// Register Neo4j Routes
app.use('/neo4j', neo4jRoutes);

// =====================
// MongoDB Connection (For Models Only)
// =====================
connectDB();

// =====================
// Neo4j Connection
// =====================
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'your_password'
  ),
  {
    encrypted: 'ENCRYPTION_OFF'
  }
);

driver.verifyConnectivity()
  .then(() => {
    console.log('Neo4j connected successfully');
    // Initialize session after successful connectivity
    global.neo4jSession = driver.session();
  })
  .catch(err => console.error('Neo4j connection failed:', err.message));

// =====================
// Centralized Error Handling Middleware
// =====================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// =====================
// Graceful Shutdown
// =====================
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await global.neo4jSession.close();
  await driver.close();
  process.exit(0);
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
