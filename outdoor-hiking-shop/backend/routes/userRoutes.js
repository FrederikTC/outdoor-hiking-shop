const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('../utils/authMiddleware'); // Importing authMiddleware

// CREATE User (Registration)
router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send('Email already exists');
      }
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, message: 'User created' });
  });
});

// READ All Users (Admin Only - Add role check if needed)
router.get('/users', authMiddleware, (req, res) => {
  db.query('SELECT id, username, email, created_at FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// READ Single User (Secured)
router.get('/users/:id', authMiddleware, (req, res) => {
  // Only allow the user to view their own profile or admin to view others
  if (req.user.id != req.params.id) {
    return res.status(403).send('Access denied');
  }

  const query = `SELECT id, username, email, created_at FROM users WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('User not found');
    res.status(200).json(result[0]);
  });
});

// UPDATE User (Secured)
router.put('/users/:id', authMiddleware, async (req, res) => {
  // Only allow the user to update their own profile
  if (req.user.id != req.params.id) {
    return res.status(403).send('Access denied');
  }

  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
  db.query(query, [username, email, hashedPassword, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('User not found');
    res.status(200).send('User updated');
  });
});

// DELETE User (Admin Only or User's own account)
router.delete('/users/:id', authMiddleware, (req, res) => {
  // Only allow the user to delete their own profile
  if (req.user.id != req.params.id) {
    return res.status(403).send('Access denied');
  }

  const query = `DELETE FROM users WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('User not found');
    res.status(200).send('User deleted');
  });
});

// LOGIN User (Authentication)
router.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT id, username, email, password FROM users WHERE email = ?`;

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Invalid credentials');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).send('Invalid credentials');

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user_id: user.id, username: user.username });
  });
});

module.exports = router;
