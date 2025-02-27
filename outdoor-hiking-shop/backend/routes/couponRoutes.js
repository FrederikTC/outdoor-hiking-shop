const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// ================================
// CREATE Coupon
// ================================
router.post('/', (req, res) => {
  const { code, discount, validFrom, validUntil, usageLimit } = req.body;

  // Check if coupon code already exists
  const checkQuery = `SELECT * FROM coupons WHERE code = ?`;
  db.query(checkQuery, [code], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Create and save new coupon
    const insertQuery = `
      INSERT INTO coupons (code, discount, valid_from, valid_until, usage_limit) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [code, discount, validFrom, validUntil, usageLimit], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: 'Coupon created' });
    });
  });
});

// ================================
// READ All Coupons
// ================================
router.get('/', (req, res) => {
  const query = `SELECT * FROM coupons ORDER BY valid_from DESC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// ================================
// READ Coupon by ID
// ================================
router.get('/:id', (req, res) => {
  const query = `SELECT * FROM coupons WHERE id = ?`;
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json(results[0]);
  });
});

// ================================
// UPDATE Coupon
// ================================
router.put('/:id', (req, res) => {
  const { code, discount, validFrom, validUntil, usageLimit } = req.body;

  // Check if the new code already exists (and isn't the current one)
  const checkQuery = `SELECT * FROM coupons WHERE code = ? AND id != ?`;
  db.query(checkQuery, [code, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Coupon code already in use' });
    }

    // Update coupon details
    const updateQuery = `
      UPDATE coupons 
      SET code = ?, discount = ?, valid_from = ?, valid_until = ?, usage_limit = ? 
      WHERE id = ?
    `;
    db.query(updateQuery, [code, discount, validFrom, validUntil, usageLimit, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Coupon not found' });
      res.status(200).json({ message: 'Coupon updated' });
    });
  });
});

// ================================
// DELETE Coupon
// ================================
router.delete('/:id', (req, res) => {
  const deleteQuery = `DELETE FROM coupons WHERE id = ?`;
  db.query(deleteQuery, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json({ message: 'Coupon deleted' });
  });
});

module.exports = router;
