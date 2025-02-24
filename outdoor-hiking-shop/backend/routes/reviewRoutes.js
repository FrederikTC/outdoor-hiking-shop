const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateUser = require('../utils/authMiddleware');

// CREATE Review (Protected Route)
router.post('/reviews', authenticateUser, (req, res) => {
  const { product_id, rating, review_text } = req.body;
  const user_id = req.user.id;

  const query = `INSERT INTO reviews (product_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)`;
  db.query(query, [product_id, user_id, rating, review_text], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Review created' });
  });
});

// READ All Reviews
router.get('/reviews', (req, res) => {
  db.query('SELECT * FROM reviews', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Reviews by Product ID
router.get('/reviews/product/:productId', (req, res) => {
  const productId = req.params.productId;
  const query = `
    SELECT 
      r.id, 
      r.rating, 
      r.review_text, 
      r.user_id, 
      u.username 
    FROM reviews r
    INNER JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.id DESC
  `;
  db.query(query, [productId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// UPDATE Review (Protected Route)
router.put('/reviews/:id', authenticateUser, (req, res) => {
  const { rating, review_text } = req.body;
  const query = `UPDATE reviews SET rating = ?, review_text = ? WHERE id = ? AND user_id = ?`;
  db.query(query, [rating, review_text, req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Review not found or not authorized');
    res.status(200).send('Review updated');
  });
});

// DELETE Review (Protected Route)
router.delete('/reviews/:id', authenticateUser, (req, res) => {
  const query = `DELETE FROM reviews WHERE id = ? AND user_id = ?`;
  db.query(query, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Review not found or not authorized');
    res.status(200).send('Review deleted');
  });
});

module.exports = router;
