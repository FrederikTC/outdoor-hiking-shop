const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// REGISTER User
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or Username already exists' });
    }

    // Create and save new user
    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();

    // Generate JWT token after successful registration
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
});

// LOGIN User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token after successful login
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to login', error: err.message });
  }
});

// READ All Users (Admin Only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// READ User by ID (Protected Route)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

// UPDATE User (Protected Route)
router.put('/:id', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let updatedFields = { username, email };

    // If password is being updated, hash it
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.code === 11000) {
      // Handle unique constraint error for email or username
      return res.status(409).json({ message: 'Email or Username already exists' });
    }
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

// DELETE User (Admin Only)
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

module.exports = router;
