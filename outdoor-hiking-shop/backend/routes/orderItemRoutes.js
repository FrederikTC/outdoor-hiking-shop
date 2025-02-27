const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// CREATE Order Item
router.post('/', (req, res) => {
  const { orderId, productId, quantity, price } = req.body;

  // Check for required fields
  if (!orderId || !productId || !quantity || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const insertQuery = `
    INSERT INTO order_items (order_id, product_id, quantity, price) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(insertQuery, [orderId, productId, quantity, price], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to create order item' });
    }
    res.status(201).json({ id: result.insertId, message: 'Order item created' });
  });
});

// READ All Order Items
router.get('/', (req, res) => {
  const query = `
    SELECT 
      oi.id, 
      oi.quantity, 
      oi.price, 
      p.id AS product_id, 
      p.name, 
      p.price AS product_price, 
      p.image_url, 
      o.id AS order_id, 
      o.total, 
      o.status 
    FROM order_items oi
    INNER JOIN products p ON oi.product_id = p.id
    INNER JOIN orders o ON oi.order_id = o.id
    ORDER BY oi.id DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch order items' });
    }
    res.status(200).json(results);
  });
});

// READ Order Items by Order ID
router.get('/order/:orderId', (req, res) => {
  const query = `
    SELECT 
      oi.id, 
      oi.quantity, 
      oi.price, 
      p.id AS product_id, 
      p.name, 
      p.price AS product_price, 
      p.image_url 
    FROM order_items oi
    INNER JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
    ORDER BY oi.id DESC
  `;
  db.query(query, [req.params.orderId], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch order items by order ID' });
    }
    res.status(200).json(results);
  });
});

// READ Single Order Item by ID
router.get('/:id', (req, res) => {
  const query = `
    SELECT 
      oi.id, 
      oi.quantity, 
      oi.price, 
      p.id AS product_id, 
      p.name, 
      p.price AS product_price, 
      p.image_url 
    FROM order_items oi
    INNER JOIN products p ON oi.product_id = p.id
    WHERE oi.id = ?
  `;
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch order item' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    res.status(200).json(results[0]);
  });
});

// UPDATE Order Item
router.put('/:id', (req, res) => {
  const { orderId, productId, quantity, price } = req.body;

  // Check for required fields
  if (!orderId || !productId || !quantity || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const updateQuery = `
    UPDATE order_items 
    SET order_id = ?, product_id = ?, quantity = ?, price = ? 
    WHERE id = ?
  `;
  db.query(updateQuery, [orderId, productId, quantity, price, req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to update order item' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    res.status(200).json({ message: 'Order item updated' });
  });
});

// DELETE Order Item
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM order_items WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to delete order item' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    res.status(200).json({ message: 'Order item deleted' });
  });
});

module.exports = router;
