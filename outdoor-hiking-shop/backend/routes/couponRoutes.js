const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Coupon
router.post('/coupons', (req, res) => {
  const { code, discount, valid_from, valid_until, usage_limit } = req.body;
  const query = `INSERT INTO coupons (code, discount, valid_from, valid_until, usage_limit) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [code, discount, valid_from, valid_until, usage_limit], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Coupon created' });
  });
});

// READ All Coupons
router.get('/coupons', (req, res) => {
  db.query('SELECT * FROM coupons', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// UPDATE Coupon
router.put('/coupons/:id', (req, res) => {
  const { code, discount, valid_from, valid_until, usage_limit } = req.body;
  const query = `UPDATE coupons SET code = ?, discount = ?, valid_from = ?, valid_until = ?, usage_limit = ? WHERE id = ?`;
  db.query(query, [code, discount, valid_from, valid_until, usage_limit, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Coupon not found');
    res.status(200).send('Coupon updated');
  });
});

// DELETE Coupon
router.delete('/coupons/:id', (req, res) => {
  const query = `DELETE FROM coupons WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Coupon not found');
    res.status(200).send('Coupon deleted');
  });
});

module.exports = router;
