const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// =============================
// CREATE Payment
// =============================
router.post('/', (req, res) => {
  const { orderId, paymentMethod, paymentStatus } = req.body;

  // Check for required fields
  if (!orderId || !paymentMethod || !paymentStatus) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const insertQuery = `
    INSERT INTO payments (order_id, payment_method, payment_status) 
    VALUES (?, ?, ?)
  `;
  db.query(insertQuery, [orderId, paymentMethod, paymentStatus], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to create payment' });
    }
    res.status(201).json({ id: result.insertId, message: 'Payment created' });
  });
});

// =============================
// READ All Payments
// =============================
router.get('/', (req, res) => {
  const query = `
    SELECT 
      p.id, 
      p.payment_method, 
      p.payment_status, 
      p.payment_date, 
      o.id AS order_id, 
      o.total, 
      o.status 
    FROM payments p
    INNER JOIN orders o ON p.order_id = o.id
    ORDER BY p.payment_date DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch payments' });
    }
    res.status(200).json(results);
  });
});

// =============================
// READ Payment by Order ID
// =============================
router.get('/order/:orderId', (req, res) => {
  const query = `
    SELECT 
      p.id, 
      p.payment_method, 
      p.payment_status, 
      p.payment_date, 
      o.id AS order_id, 
      o.total, 
      o.status 
    FROM payments p
    INNER JOIN orders o ON p.order_id = o.id
    WHERE p.order_id = ?
  `;
  db.query(query, [req.params.orderId], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch payment' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(results[0]);
  });
});

// =============================
// UPDATE Payment
// =============================
router.put('/:id', (req, res) => {
  const { orderId, paymentMethod, paymentStatus } = req.body;

  // Check for required fields
  if (!orderId || !paymentMethod || !paymentStatus) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const updateQuery = `
    UPDATE payments 
    SET order_id = ?, payment_method = ?, payment_status = ? 
    WHERE id = ?
  `;
  db.query(updateQuery, [orderId, paymentMethod, paymentStatus, req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to update payment' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment updated' });
  });
});

// =============================
// DELETE Payment
// =============================
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM payments WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to delete payment' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted' });
  });
});

module.exports = router;
