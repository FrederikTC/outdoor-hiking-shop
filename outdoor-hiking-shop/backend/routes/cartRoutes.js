const express = require('express');
const router = express.Router();
const db = require('../db');

// ADD to Cart
router.post('/cart', (req, res) => {
  const { product_id, quantity } = req.body;

  // Check if the product is already in the cart
  const checkQuery = `SELECT * FROM cart_items WHERE product_id = ?`;
  db.query(checkQuery, [product_id], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      // If product is already in cart, update the quantity
      const updateQuery = `UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?`;
      db.query(updateQuery, [quantity, product_id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Cart updated');
      });
    } else {
      // If product is not in cart, add a new entry
      const insertQuery = `INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)`;
      db.query(insertQuery, [product_id, quantity], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Added to cart');
      });
    }
  });
});

// GET Cart Items
router.get('/cart', (req, res) => {
  const query = `
    SELECT 
      ci.id, 
      ci.quantity, 
      p.id AS product_id, 
      p.name, 
      p.price, 
      p.image_url 
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// DELETE Cart Item
router.delete('/cart/:id', (req, res) => {
  const query = `DELETE FROM cart_items WHERE id = ?`;
  db.query(query, [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Item removed from cart');
  });
});

module.exports = router;
