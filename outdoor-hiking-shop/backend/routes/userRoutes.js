const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('../utils/authMiddleware');

// =============================
// CREATE User (Registration)
// =============================
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if email already exists
  const checkQuery = `SELECT * FROM users WHERE email = ?`;
  db.query(checkQuery, [email], async (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to register user' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const insertQuery = `
      INSERT INTO users (username, email, password) 
      VALUES (?, ?, ?)
    `;
    db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ message: 'Failed to register user' });
      }
      res.status(201).json({ id: result.insertId, message: 'User registered successfully' });
    });
  });
});

// =============================
// READ All Users (Admin Only)
// =============================
router.get('/', authMiddleware, (req, res) => {
  // Only allow admin to view all users
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const query = `SELECT id, username, email, created_at FROM users`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch users' });
    }
    res.status(200).json(results);
  });
});

// =============================
// READ Single User (Secured)
// =============================
router.get('/:id', authMiddleware, (req, res) => {
  // Only allow the user to view their own profile or admin to view others
  if (req.user.id != req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const query = `SELECT id, username, email, created_at FROM users WHERE id = ?`;
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to fetch user' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(results[0]);
  });
});

// =============================
// UPDATE User (Secured)
// =============================
router.put('/:id', authMiddleware, async (req, res) => {
  // Only allow the user to update their own profile
  if (req.user.id != req.params.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updateQuery = `
    UPDATE users 
    SET username = ?, email = ?, password = ? 
    WHERE id = ?
  `;
  db.query(updateQuery, [username, email, hashedPassword, req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to update user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
});

// =============================
// DELETE User (Admin or Own Account)
// =============================
router.delete('/:id', authMiddleware, (req, res) => {
  // Only allow the user to delete their own profile or admin
  if (req.user.id != req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const deleteQuery = `DELETE FROM users WHERE id = ?`;
  db.query(deleteQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to delete user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

// =============================
// LOGIN User (Authentication)
// =============================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = `SELECT id, username, email, password, role FROM users WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Failed to login' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token after successful login
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token and user info in the response
    res.status(200).json({ token, user_id: user.id, username: user.username });
  });
});

module.exports = router;
