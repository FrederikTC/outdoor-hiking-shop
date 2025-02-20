const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Category
router.post('/categories', (req, res) => {
  const { name } = req.body;
  const query = `INSERT INTO categories (name) VALUES (?)`;
  db.query(query, [name], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Category created' });
  });
});

// READ All Categories
router.get('/categories', (req, res) => {
  const query = `SELECT * FROM categories ORDER BY name ASC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});


// UPDATE Category
router.put('/categories/:id', (req, res) => {
  const { name } = req.body;
  const query = `UPDATE categories SET name = ? WHERE id = ?`;
  db.query(query, [name, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Category not found');
    res.status(200).send('Category updated');
  });
});

// DELETE Category
router.delete('/categories/:id', (req, res) => {
  const query = `DELETE FROM categories WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Category not found');
    res.status(200).send('Category deleted');
  });
});

// Get Category by ID
router.get('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const query = `SELECT name FROM categories WHERE id = ?`;

  db.query(query, [categoryId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('Category not found');
    res.status(200).json(result[0]);
  });
});


module.exports = router;
