const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE User
router.post('/users', (req, res) => {
  const { username, email, password } = req.body;
  const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.query(query, [username, email, password], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'User created' });
  });
});

// READ All Users
router.get('/users', (req, res) => {
  db.query('SELECT id, username, email, created_at FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Single User
router.get('/users/:id', (req, res) => {
  const query = `SELECT id, username, email, created_at FROM users WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('User not found');
    res.status(200).json(result[0]);
  });
});

// UPDATE User
router.put('/users/:id', (req, res) => {
  const { username, email, password } = req.body;
  const query = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
  db.query(query, [username, email, password, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('User not found');
    res.status(200).send('User updated');
  });
});

// DELETE User
router.delete('/users/:id', (req, res) => {
  const query = `DELETE FROM users WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('User not found');
    res.status(200).send('User deleted');
  });
});

// LOGIN User
router.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT id, username, email FROM users WHERE email = ? AND password = ?`;

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Invalid credentials');
    res.status(200).json(results[0]);
  });
});


module.exports = router;
