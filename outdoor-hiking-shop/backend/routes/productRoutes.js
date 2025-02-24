const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Product
router.post('/products', (req, res) => {
  const { name, description, price, stock, category_id, image_url, isFeatured } = req.body;
  const query = `
    INSERT INTO products (name, description, price, stock, category_id, image_url, isFeatured) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name, description, price, stock, category_id, image_url, isFeatured || false], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Product created' });
  });
});

// READ All Products
router.get('/products', (req, res) => {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.stock, 
      p.image_url, 
      p.isFeatured, 
      c.name AS category_name 
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    ORDER BY c.name ASC, p.name ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Featured Products
router.get('/products/featured', (req, res) => {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.stock, 
      p.image_url, 
      p.isFeatured, 
      c.name AS category_name 
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    WHERE p.isFeatured = 1
    ORDER BY p.name ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Products by Category ID
router.get('/products/category/:id', (req, res) => {
  const categoryId = req.params.id;
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.stock, 
      p.image_url 
    FROM products p
    WHERE p.category_id = ?
    ORDER BY p.name ASC
  `;
  db.query(query, [categoryId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Single Product by ID
router.get('/products/:id', (req, res) => {
  const query = `SELECT * FROM products WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('Product not found');
    res.status(200).json(result[0]);
  });
});

// UPDATE Product
router.put('/products/:id', (req, res) => {
  const { name, description, price, stock, category_id, image_url, isFeatured } = req.body;
  const query = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?, isFeatured = ? 
    WHERE id = ?
  `;
  db.query(query, [name, description, price, stock, category_id, image_url, isFeatured || false, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Product not found');
    res.status(200).send('Product updated');
  });
});

// DELETE Product
router.delete('/products/:id', (req, res) => {
  const query = `DELETE FROM products WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Product not found');
    res.status(200).send('Product deleted');
  });
});

module.exports = router;
