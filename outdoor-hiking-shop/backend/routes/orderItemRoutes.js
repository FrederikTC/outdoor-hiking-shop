const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Order Item
router.post('/order-items', (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;
  const query = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
  db.query(query, [order_id, product_id, quantity, price], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Order item created' });
  });
});

// READ All Order Items
router.get('/order-items', (req, res) => {
  db.query('SELECT * FROM order_items', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Order Items by Order ID
router.get('/order-items/order/:orderId', (req, res) => {
  const query = `SELECT * FROM order_items WHERE order_id = ?`;
  db.query(query, [req.params.orderId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// UPDATE Order Item
router.put('/order-items/:id', (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;
  const query = `UPDATE order_items SET order_id = ?, product_id = ?, quantity = ?, price = ? WHERE id = ?`;
  db.query(query, [order_id, product_id, quantity, price, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Order item not found');
    res.status(200).send('Order item updated');
  });
});

// DELETE Order Item
router.delete('/order-items/:id', (req, res) => {
  const query = `DELETE FROM order_items WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Order item not found');
    res.status(200).send('Order item deleted');
  });
});

module.exports = router;
