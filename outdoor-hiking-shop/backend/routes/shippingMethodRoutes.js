const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Shipping Method
router.post('/shipping-methods', (req, res) => {
  const { method_name, cost, estimated_delivery } = req.body;
  const query = `INSERT INTO shipping_methods (method_name, cost, estimated_delivery) VALUES (?, ?, ?)`;
  db.query(query, [method_name, cost, estimated_delivery], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Shipping method created' });
  });
});

// READ All Shipping Methods
router.get('/shipping-methods', (req, res) => {
  db.query('SELECT * FROM shipping_methods', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// UPDATE Shipping Method
router.put('/shipping-methods/:id', (req, res) => {
  const { method_name, cost, estimated_delivery } = req.body;
  const query = `UPDATE shipping_methods SET method_name = ?, cost = ?, estimated_delivery = ? WHERE id = ?`;
  db.query(query, [method_name, cost, estimated_delivery, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Shipping method not found');
    res.status(200).send('Shipping method updated');
  });
});

// DELETE Shipping Method
router.delete('/shipping-methods/:id', (req, res) => {
  const query = `DELETE FROM shipping_methods WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Shipping method not found');
    res.status(200).send('Shipping method deleted');
  });
});

module.exports = router;
