const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Inventory Log
router.post('/inventory-logs', (req, res) => {
  const { product_id, change_quantity, change_reason } = req.body;
  const query = `INSERT INTO inventory_logs (product_id, change_quantity, change_reason) VALUES (?, ?, ?)`;
  db.query(query, [product_id, change_quantity, change_reason], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Inventory log created' });
  });
});

// READ All Inventory Logs
router.get('/inventory-logs', (req, res) => {
  db.query('SELECT * FROM inventory_logs', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// UPDATE Inventory Log
router.put('/inventory-logs/:id', (req, res) => {
  const { product_id, change_quantity, change_reason } = req.body;
  const query = `UPDATE inventory_logs SET product_id = ?, change_quantity = ?, change_reason = ? WHERE id = ?`;
  db.query(query, [product_id, change_quantity, change_reason, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Inventory log not found');
    res.status(200).send('Inventory log updated');
  });
});

// DELETE Inventory Log
router.delete('/inventory-logs/:id', (req, res) => {
  const query = `DELETE FROM inventory_logs WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Inventory log not found');
    res.status(200).send('Inventory log deleted');
  });
});

module.exports = router;
