require('dotenv').config();
const db = require('../db'); // MySQL Connection
const { faker } = require('@faker-js/faker');


const NUM_RECORDS = 10; // Number of records per table

// Utility to run queries
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Generate a random number between min and max
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random string of letters
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate random email address
const generateRandomEmail = () => `${generateRandomString(5)}@example.com`;

// Generate random product data
const generateProductData = () => ({
  name: `Product ${generateRandomString(5)}`,
  description: `Description for product ${generateRandomString(8)}`,
  price: getRandomInt(10, 500),
  stock: getRandomInt(1, 100),
  image_url: 'https://via.placeholder.com/150', // Placeholder image URL
  isFeatured: Math.random() < 0.5, // Random true or false
});

// Seed Categories
const seedCategories = async () => {
  const categories = [
    'Tents', 'Backpacks', 'Camping Gear', 'Sleeping Bags', 'Hiking Boots',
    'Outdoor Clothing', 'Mountain Bikes', 'Climbing Gear', 'Water Bottles',
    'Hiking Poles', 'Camping Stoves', 'First Aid Kits'
  ];

  for (let category of categories) {
    const existingCategory = await runQuery(`
      SELECT * FROM categories WHERE name = ?
    `, [category]);

    if (existingCategory.length === 0) {
      await runQuery(`
        INSERT INTO categories (name) 
        VALUES (?)
      `, [category]);
      console.log(`Category '${category}' seeded`);
    } else {
      console.log(`Category '${category}' already exists`);
    }
  }
};

// Seed Products
const seedProducts = async () => {
  const categoriesFromDB = await runQuery('SELECT id FROM categories');

  if (categoriesFromDB.length === 0) {
    console.log('No categories found in the database.');
    return;
  }

  for (let i = 0; i < NUM_RECORDS; i++) {
    const category = categoriesFromDB[Math.floor(Math.random() * categoriesFromDB.length)];

    const productData = generateProductData();

    await runQuery(`
      INSERT INTO products (name, description, price, stock, category_id, image_url, isFeatured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      productData.name,
      productData.description,
      productData.price,
      productData.stock,
      category.id,
      productData.image_url,
      productData.isFeatured
    ]);
  }

  console.log('Products Seeded');
};

// Seed Users
const seedUsers = async () => {
  for (let i = 0; i < NUM_RECORDS; i++) {
    const userData = {
      username: generateRandomString(8),
      email: generateRandomEmail(),
      password: generateRandomString(12),
      role: Math.random() < 0.5 ? 'user' : 'admin',
    };

    await runQuery(`
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `, [
      userData.username,
      userData.email,
      userData.password,
      userData.role
    ]);
  }
  console.log('Users Seeded');
};

// Seed Addresses
const seedAddresses = async () => {
  for (let i = 0; i < NUM_RECORDS; i++) {
    await runQuery(`
      INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      getRandomInt(1, NUM_RECORDS),
      `Address Line 1-${generateRandomString(5)}`,
      `Address Line 2-${generateRandomString(3)}`,
      `City-${generateRandomString(6)}`,
      `State-${generateRandomString(4)}`,
      getRandomInt(10000, 99999),
      `Country-${generateRandomString(6)}`
    ]);
  }
  console.log('Addresses Seeded');
};

// Seed Carts
const seedCarts = async () => {
  const products = await runQuery('SELECT id FROM products');
  const users = await runQuery('SELECT id FROM users');

  for (let i = 0; i < NUM_RECORDS; i++) {
    await runQuery(`
      INSERT INTO cart_items (product_id, user_id, quantity) 
      VALUES (?, ?, ?)
    `, [
      products[Math.floor(Math.random() * products.length)].id,  // Randomly pick a product ID
      users[Math.floor(Math.random() * users.length)].id,        // Randomly pick a user ID
      getRandomInt(1, 10)  // Random quantity between 1 and 10
    ]);
  }
  console.log('Carts Seeded');
};


// Seed Coupons
const seedCoupons = async () => {
  for (let i = 0; i < NUM_RECORDS; i++) {
    await runQuery(`
      INSERT INTO coupons (code, discount, valid_from, valid_until, usage_limit)
      VALUES (?, ?, ?, ?, ?)
    `, [
      generateRandomString(10),
      getRandomInt(5, 50),
      new Date(),
      new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      getRandomInt(1, 100)
    ]);
  }
  console.log('Coupons Seeded');
};

// Seed Inventory Logs
const seedInventoryLogs = async () => {
  const products = await runQuery('SELECT id FROM products');  // Fetch all product ids
  
  if (products.length === 0) {
    console.log('No products found in the database. Skipping inventory log seeding.');
    return;
  }

  for (let i = 0; i < NUM_RECORDS; i++) {
    const product = faker.helpers.arrayElement(products); // Pick a random product id

    await runQuery(`
      INSERT INTO inventory_logs (product_id, change_quantity, change_reason)
      VALUES (?, ?, ?)
    `, [
      product.id, // Use the randomly selected product id
      faker.number.int({ min: -50, max: 50 }),
      faker.helpers.arrayElement(['restock', 'sale', 'return', 'damage', 'adjustment'])
    ]);
  }
  console.log('Inventory Logs Seeded');
};

// Seed Orders
const seedOrders = async () => {
  const validStatuses = ['pending', 'completed', 'shipped', 'cancelled']; // Only valid statuses
  for (let i = 0; i < NUM_RECORDS; i++) {
    const randomStatus = faker.helpers.arrayElement(validStatuses); // Randomly select a valid status

    await runQuery(`
      INSERT INTO orders (user_id, total, status, shipping_method_id)
      VALUES (?, ?, ?, ?)
    `, [
      faker.number.int({ min: 1, max: NUM_RECORDS }),
      faker.commerce.price(),
      randomStatus, // Use a valid status
      faker.number.int({ min: 1, max: 6 })  // Valid shipping_method_id between 1 and 6 (as per your data)
    ]);
  }
  console.log('Orders Seeded');
};

// Seed Order Items
const seedOrderItems = async () => {
  const products = await runQuery('SELECT id FROM products'); // Ensure products exist
  const orders = await runQuery('SELECT id FROM orders'); // Ensure orders exist
  
  if (products.length === 0 || orders.length === 0) {
    console.log('No products or orders found to seed order items.');
    return;
  }

  for (let i = 0; i < NUM_RECORDS; i++) {
    const product = faker.helpers.arrayElement(products); // Randomly select a product
    const order = faker.helpers.arrayElement(orders); // Randomly select an order

    await runQuery(`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `, [
      order.id,         // Use the randomly selected order ID
      product.id,       // Use the randomly selected product ID
      faker.number.int({ min: 1, max: 5 }), // Random quantity between 1 and 5
      faker.commerce.price() // Random price
    ]);
  }
  console.log('Order Items Seeded');
};


// Seed Payments
const seedPayments = async () => {
  const paymentStatuses = ['pending', 'completed', 'failed', 'refunded']; // Valid payment statuses

  for (let i = 0; i < NUM_RECORDS; i++) {
    const order = faker.helpers.arrayElement(await runQuery('SELECT id FROM orders')); // Randomly select an order
    
    const paymentStatus = faker.helpers.arrayElement(paymentStatuses); // Random payment status from valid options
    console.log(`Inserting payment for order ID ${order.id} with status ${paymentStatus}`); // Log the payment status being inserted
    
    await runQuery(`
      INSERT INTO payments (order_id, payment_method, payment_status)
      VALUES (?, ?, ?)
    `, [
      order.id, // Use the randomly selected order ID
      faker.helpers.arrayElement(['credit_card', 'paypal', 'bank_transfer']), // Random payment method
      paymentStatus // Random payment status from valid options
    ]);
  }
  console.log('Payments Seeded');
};


// Seed Shipping Methods
const seedShippingMethods = async () => {
  for (let i = 0; i < NUM_RECORDS; i++) {
    await runQuery(`
      INSERT INTO shipping_methods (method_name, cost, estimated_delivery)
      VALUES (?, ?, ?)
    `, [
      `Method ${generateRandomString(5)}`,
      getRandomInt(5, 50),
      `${getRandomInt(1, 7)} days`
    ]);
  }
  console.log('Shipping Methods Seeded');
};

// Main Seeder Function
const seedDatabase = async () => {
  try {
    await seedCategories();
    await seedProducts();
    await seedUsers();
    await seedAddresses();
    await seedCarts();
    await seedCoupons();
    await seedInventoryLogs();
    await seedOrders();
    await seedOrderItems();
    await seedPayments();
    await seedShippingMethods();

    console.log('✅ Database Seeding Completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error Seeding Database:', err);
    process.exit(1);
  }
};

seedDatabase();
