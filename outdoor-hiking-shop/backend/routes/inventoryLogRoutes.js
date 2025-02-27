const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// ================================
// CREATE Inventory Log
// ================================
router.post('/', (req, res) => {
  const { productId, changeQuantity, changeReason } = req.body;

  const insertQuery = `
    INSERT INTO inventory_logs (product_id, change_quantity, change_reason) 
    VALUES (?, ?, ?)
  `;
  db.query(insertQuery, [productId, changeQuantity, changeReason], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, message: 'Inventory log created' });
  });
});

// ================================
// READ All Inventory Logs
// ================================
router.get('/', (req, res) => {
  const query = `
    SELECT 
      il.id, 
      il.change_quantity, 
      il.change_reason, 
      il.changed_at, 
      p.id AS product_id, 
      p.name, 
      p.price 
    FROM inventory_logs il
    INNER JOIN products p ON il.product_id = p.id
    ORDER BY il.changed_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// ================================
// READ Inventory Log by ID
// ================================
router.get('/:id', (req, res) => {
  const query = `
    SELECT 
      il.id, 
      il.change_quantity, 
      il.change_reason, 
      il.changed_at, 
      p.id AS product_id, 
      p.name, 
      p.price 
    FROM inventory_logs il
    INNER JOIN products p ON il.product_id = p.id
    WHERE il.id = ?
  `;
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Inventory log not found' });
    res.status(200).json(results[0]);
  });
});

// ================================
// UPDATE Inventory Log
// ================================
router.put('/:id', (req, res) => {
  const { productId, changeQuantity, changeReason } = req.body;

  const updateQuery = `
    UPDATE inventory_logs 
    SET product_id = ?, change_quantity = ?, change_reason = ? 
    WHERE id = ?
  `;
  db.query(updateQuery, [productId, changeQuantity, changeReason, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Inventory log not found' });
    res.status(200).json({ message: 'Inventory log updated' });
  });
});

// ================================
// DELETE Inventory Log
// ================================
router.delete('/:id', (req, res) => {
  const deleteQuery = `DELETE FROM inventory_logs WHERE id = ?`;
  db.query(deleteQuery, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Inventory log not found' });
    res.status(200).json({ message: 'Inventory log deleted' });
  });
});

module.exports = router;
