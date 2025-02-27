const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection
const authenticateUser = require('../utils/authMiddleware');

// =============================
// CREATE Review (Protected Route)
// =============================
router.post('/', authenticateUser, (req, res) => {
  const { productId, rating, reviewText } = req.body;
  const userId = req.user.id;

  // Check for required fields
  if (!productId || !rating || !reviewText) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const insertQuery = `
    INSERT INTO reviews (product_id, user_id, rating, review_text) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(insertQuery, [productId, userId, rating, reviewText], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to create review' });
    }
    res.status(201).json({ id: result.insertId, message: 'Review created' });
  });
});

// =============================
// READ All Reviews
// =============================
router.get('/', (req, res) => {
  const query = `
    SELECT 
      r.id, 
      r.rating, 
      r.review_text, 
      r.created_at, 
      p.id AS product_id, 
      p.name AS product_name, 
      u.id AS user_id, 
      u.username 
    FROM reviews r
    INNER JOIN products p ON r.product_id = p.id
    INNER JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch reviews' });
    }
    res.status(200).json(results);
  });
});

// =============================
// READ Reviews by Product ID
// =============================
router.get('/product/:productId', (req, res) => {
  const query = `
    SELECT 
      r.id, 
      r.rating, 
      r.review_text, 
      r.created_at, 
      u.id AS user_id, 
      u.username 
    FROM reviews r
    INNER JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;
  db.query(query, [req.params.productId], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch reviews' });
    }
    res.status(200).json(results);
  });
});

// =============================
// UPDATE Review (Protected Route)
// =============================
router.put('/:id', authenticateUser, (req, res) => {
  const { rating, reviewText } = req.body;

  // Check for required fields
  if (!rating || !reviewText) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Only allow the user to update their own review
  const updateQuery = `
    UPDATE reviews 
    SET rating = ?, review_text = ? 
    WHERE id = ? AND user_id = ?
  `;
  db.query(updateQuery, [rating, reviewText, req.params.id, req.user.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to update review' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }
    res.status(200).json({ message: 'Review updated' });
  });
});

// =============================
// DELETE Review (Protected Route)
// =============================
router.delete('/:id', authenticateUser, (req, res) => {
  // Only allow the user to delete their own review
  const query = `DELETE FROM reviews WHERE id = ? AND user_id = ?`;
  db.query(query, [req.params.id, req.user.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to delete review' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }
    res.status(200).json({ message: 'Review deleted' });
  });
});

module.exports = router;
