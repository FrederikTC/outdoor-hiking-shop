const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// =============================
// CREATE Order
// =============================
router.post('/', (req, res) => {
  const { userId, total, status, shippingMethodId, cartItems } = req.body;

  // Check for required fields
  if (!userId || !total || !status || !shippingMethodId || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert the order first
  const insertOrderQuery = `
    INSERT INTO orders (user_id, total, status, shipping_method_id) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(insertOrderQuery, [userId, total, status, shippingMethodId], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to create order' });
    }

    const orderId = result.insertId; // Get the newly created order ID

    // Now insert all the order items linked to this order
    cartItems.forEach((item) => {
      const insertItemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price) 
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertItemQuery, [orderId, item.productId, item.quantity, item.price], (err) => {
        if (err) {
          console.error('Database Error:', err);
          return res.status(500).json({ message: 'Failed to create order items' });
        }
      });
    });

    // Send back the order ID
    res.status(201).json({ orderId, message: 'Order created successfully' });
  });
});

// =============================
// READ All Orders
// =============================
router.get('/', (req, res) => {
  const query = `
    SELECT 
      o.id AS order_id, 
      o.total, 
      o.status, 
      o.created_at, 
      u.id AS user_id, 
      u.username, 
      u.email, 
      sm.id AS shipping_method_id, 
      sm.methodName AS shipping_method_name, 
      sm.cost AS shipping_cost
    FROM orders o
    INNER JOIN users u ON o.user_id = u.id
    INNER JOIN shipping_methods sm ON o.shipping_method_id = sm.id
    ORDER BY o.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }
    res.status(200).json(results);
  });
});

// =============================
// READ Order by ID
// =============================
router.get('/:id', (req, res) => {
  const query = `
    SELECT 
      o.id AS order_id, 
      o.total, 
      o.status, 
      o.created_at, 
      u.id AS user_id, 
      u.username, 
      u.email, 
      sm.id AS shipping_method_id, 
      sm.methodName AS shipping_method_name, 
      sm.cost AS shipping_cost
    FROM orders o
    INNER JOIN users u ON o.user_id = u.id
    INNER JOIN shipping_methods sm ON o.shipping_method_id = sm.id
    WHERE o.id = ?
  `;
  db.query(query, [req.params.id], (err, orderResults) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch order' });
    }
    if (orderResults.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get the order items for this order
    const itemQuery = `
      SELECT 
        oi.id AS order_item_id, 
        oi.quantity, 
        oi.price, 
        p.id AS product_id, 
        p.name, 
        p.image_url 
      FROM order_items oi
      INNER JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    db.query(itemQuery, [req.params.id], (err, itemResults) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ message: 'Failed to fetch order items' });
      }

      const orderData = orderResults[0];
      orderData.items = itemResults;
      res.status(200).json(orderData);
    });
  });
});

// =============================
// UPDATE Order Status
// =============================
router.put('/:id', (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const updateQuery = `
    UPDATE orders 
    SET status = ? 
    WHERE id = ?
  `;
  db.query(updateQuery, [status, req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to update order' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order status updated' });
  });
});

// =============================
// DELETE Order
// =============================
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM orders WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to delete order' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted' });
  });
});

module.exports = router;
