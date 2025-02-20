const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Review
router.post('/reviews', (req, res) => {
  const { product_id, user_id, rating, review_text } = req.body;
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

// UPDATE Review
router.put('/reviews/:id', (req, res) => {
  const { product_id, user_id, rating, review_text } = req.body;
  const query = `UPDATE reviews SET product_id = ?, user_id = ?, rating = ?, review_text = ? WHERE id = ?`;
  db.query(query, [product_id, user_id, rating, review_text, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Review not found');
    res.status(200).send('Review updated');
  });
});

// DELETE Review
router.delete('/reviews/:id', (req, res) => {
  const query = `DELETE FROM reviews WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Review not found');
    res.status(200).send('Review deleted');
  });
});

module.exports = router;
