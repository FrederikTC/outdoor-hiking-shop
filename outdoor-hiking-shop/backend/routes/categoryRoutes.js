const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// ================================
// CREATE Category
// ================================
router.post('/', (req, res) => {
  const { name } = req.body;

  // Check if category already exists
  const checkQuery = `SELECT * FROM categories WHERE name = ?`;
  db.query(checkQuery, [name], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create and save new category
    const insertQuery = `INSERT INTO categories (name) VALUES (?)`;
    db.query(insertQuery, [name], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: 'Category created' });
    });
  });
});

// ================================
// READ All Categories
// ================================
router.get('/', (req, res) => {
  const query = `SELECT * FROM categories ORDER BY name ASC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// ================================
// READ Category by ID
// ================================
router.get('/:id', (req, res) => {
  const query = `SELECT * FROM categories WHERE id = ?`;
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(results[0]);
  });
});

// ================================
// UPDATE Category
// ================================
router.put('/:id', (req, res) => {
  const { name } = req.body;

  // Check if category name already exists for a different category
  const checkQuery = `SELECT * FROM categories WHERE name = ? AND id != ?`;
  db.query(checkQuery, [name, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Category name already taken' });
    }

    // Update category name
    const updateQuery = `UPDATE categories SET name = ? WHERE id = ?`;
    db.query(updateQuery, [name, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json({ message: 'Category updated' });
    });
  });
});

// ================================
// DELETE Category
// ================================
router.delete('/:id', (req, res) => {
  const deleteQuery = `DELETE FROM categories WHERE id = ?`;
  db.query(deleteQuery, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  });
});

module.exports = router;
