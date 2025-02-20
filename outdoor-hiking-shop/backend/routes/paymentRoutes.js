const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Payment
router.post('/payments', (req, res) => {
  const { order_id, payment_method, payment_status } = req.body;
  const query = `INSERT INTO payments (order_id, payment_method, payment_status) VALUES (?, ?, ?)`;
  db.query(query, [order_id, payment_method, payment_status], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Payment created' });
  });
});

// READ All Payments
router.get('/payments', (req, res) => {
  db.query('SELECT * FROM payments', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Payment by Order ID
router.get('/payments/order/:orderId', (req, res) => {
  const query = `SELECT * FROM payments WHERE order_id = ?`;
  db.query(query, [req.params.orderId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(result);
  });
});

// UPDATE Payment
router.put('/payments/:id', (req, res) => {
  const { order_id, payment_method, payment_status } = req.body;
  const query = `UPDATE payments SET order_id = ?, payment_method = ?, payment_status = ? WHERE id = ?`;
  db.query(query, [order_id, payment_method, payment_status, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Payment not found');
    res.status(200).send('Payment updated');
  });
});

// DELETE Payment
router.delete('/payments/:id', (req, res) => {
  const query = `DELETE FROM payments WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Payment not found');
    res.status(200).send('Payment deleted');
  });
});

module.exports = router;
