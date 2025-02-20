const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Order
router.post('/', (req, res) => {
  const { user_id, total, status } = req.body;
  const query = `INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)`;
  db.query(query, [user_id, total, status], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ orderId: result.insertId, message: 'Order created' });
  });
});

// READ All Orders
router.get('/', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// UPDATE Order
router.put('/:id', (req, res) => {
  const { user_id, total, status } = req.body;
  const query = `UPDATE orders SET user_id = ?, total = ?, status = ? WHERE id = ?`;
  db.query(query, [user_id, total, status, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Order not found');
    res.status(200).send('Order updated');
  });
});

// DELETE Order
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM orders WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Order not found');
    res.status(200).send('Order deleted');
  });
});

// Exporting the router
module.exports = router;
