const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// =============================
// CREATE Shipping Method
// =============================
router.post('/', (req, res) => {
  const { methodName, cost, estimatedDelivery } = req.body;

  // Validate required fields
  if (!methodName || !cost || !estimatedDelivery) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the shipping method already exists
  const checkQuery = `SELECT * FROM shipping_methods WHERE method_name = ?`;
  db.query(checkQuery, [methodName], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to create shipping method' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Shipping method already exists' });
    }

    // Create and save new shipping method
    const insertQuery = `
      INSERT INTO shipping_methods (method_name, cost, estimated_delivery) 
      VALUES (?, ?, ?)
    `;
    db.query(insertQuery, [methodName, cost, estimatedDelivery], (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ message: 'Failed to create shipping method' });
      }
      res.status(201).json({ id: result.insertId, message: 'Shipping method created' });
    });
  });
});

// =============================
// READ All Shipping Methods
// =============================
router.get('/', (req, res) => {
  const query = `SELECT * FROM shipping_methods ORDER BY method_name ASC`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch shipping methods' });
    }
    res.status(200).json(results);
  });
});

// =============================
// READ Single Shipping Method by ID
// =============================
router.get('/:id', (req, res) => {
  const query = `SELECT * FROM shipping_methods WHERE id = ?`;
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch shipping method' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Shipping method not found' });
    }
    res.status(200).json(results[0]);
  });
});

// =============================
// UPDATE Shipping Method
// =============================
router.put('/:id', (req, res) => {
  const { methodName, cost, estimatedDelivery } = req.body;

  // Validate required fields
  if (!methodName || !cost || !estimatedDelivery) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the new method name already exists (and isn't the current one)
  const checkQuery = `SELECT * FROM shipping_methods WHERE method_name = ? AND id != ?`;
  db.query(checkQuery, [methodName, req.params.id], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to update shipping method' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Shipping method name already in use' });
    }

    const updateQuery = `
      UPDATE shipping_methods 
      SET method_name = ?, cost = ?, estimated_delivery = ? 
      WHERE id = ?
    `;
    db.query(updateQuery, [methodName, cost, estimatedDelivery, req.params.id], (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ message: 'Failed to update shipping method' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Shipping method not found' });
      }
      res.status(200).json({ message: 'Shipping method updated' });
    });
  });
});

// =============================
// DELETE Shipping Method
// =============================
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM shipping_methods WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to delete shipping method' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Shipping method not found' });
    }
    res.status(200).json({ message: 'Shipping method deleted' });
  });
});

module.exports = router;
