const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// ================================
// ADD to Cart
// ================================
router.post('/', (req, res) => {
  const { productId, userId, quantity } = req.body;

  // Check if the product is already in the cart for this user
  const checkQuery = `SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?`;
  db.query(checkQuery, [productId, userId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      // If product is already in cart, update the quantity
      const updateQuery = `UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ? AND user_id = ?`;
      db.query(updateQuery, [quantity, productId, userId], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: 'Cart updated' });
      });
    } else {
      // If product is not in cart, add a new entry
      const insertQuery = `INSERT INTO cart_items (product_id, user_id, quantity) VALUES (?, ?, ?)`;
      db.query(insertQuery, [productId, userId, quantity], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Added to cart' });
      });
    }
  });
});

// ================================
// GET Cart Items
// ================================
router.get('/', (req, res) => {
  const { userId } = req.query;
  const query = `
    SELECT 
      ci.id, 
      ci.quantity, 
      p.id AS product_id, 
      p.name, 
      p.price, 
      p.image_url, 
      u.id AS user_id, 
      u.username, 
      u.email 
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
    INNER JOIN users u ON ci.user_id = u.id
    WHERE ci.user_id = ?
    ORDER BY ci.id ASC
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// ================================
// DELETE Cart Item
// ================================
router.delete('/:id', (req, res) => {
  const deleteQuery = `DELETE FROM cart_items WHERE id = ?`;
  db.query(deleteQuery, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Item not found in cart' });
    res.status(200).send({ message: 'Item removed from cart' });
  });
});

module.exports = router;
