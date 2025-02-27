const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// CREATE Product
router.post('/', (req, res) => {
  const { name, description, price, stock, categoryId, imageUrl, isFeatured } = req.body;

  const insertQuery = `
    INSERT INTO products (name, description, price, stock, category_id, image_url, isFeatured) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(insertQuery, [name, description, price, stock, categoryId, imageUrl, isFeatured || false], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Product created' });
  });
});

// READ All Products
router.get('/', (req, res) => {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.stock, 
      p.image_url, 
      p.isFeatured, 
      c.id AS category_id, 
      c.name AS category_name 
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    ORDER BY p.name ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Featured Products
router.get('/featured', (req, res) => {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.stock, 
      p.image_url, 
      p.isFeatured, 
      c.id AS category_id, 
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
router.get('/category/:id', (req, res) => {
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
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Single Product by ID
router.get('/:id', (req, res) => {
  const query = `SELECT * FROM products WHERE id = ?`;
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send({ message: 'Product not found' });
    res.status(200).json(results[0]);
  });
});

// UPDATE Product
router.put('/:id', (req, res) => {
  const { name, description, price, stock, categoryId, imageUrl, isFeatured } = req.body;

  const updateQuery = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?, isFeatured = ? 
    WHERE id = ?
  `;
  db.query(updateQuery, [name, description, price, stock, categoryId, imageUrl, isFeatured || false, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Product not found' });
    res.status(200).send({ message: 'Product updated' });
  });
});

// DELETE Product
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM products WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Product not found' });
    res.status(200).send({ message: 'Product deleted' });
  });
});

module.exports = router;
