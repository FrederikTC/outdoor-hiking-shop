require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Outdoor Hiking Shop API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
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

app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', orderItemRoutes);
app.use('/api', paymentRoutes);
app.use('/api', addressRoutes);
app.use('/api', reviewRoutes);
app.use('/api', inventoryLogRoutes);
app.use('/api', couponRoutes);
app.use('/api', shippingMethodRoutes);
app.use('/api', cartRoutes);

const connectDB = require('./config/mongoose');
connectDB();

const neo4j = require('neo4j-driver');

// Connect to Neo4j
const driver = neo4j.driver(
  'bolt://localhost:7687', 
  neo4j.auth.basic('neo4j', 'your_password')
);

const session = driver.session();

const neo4jRoutes = require('./routes/neo4jRoutes');
app.use('/neo4j', neo4jRoutes);