const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection

// ================================
// CREATE Address
// ================================
router.post('/', (req, res) => {
  const { userId, addressLine1, addressLine2, city, state, postalCode, country } = req.body;
  const insertQuery = `
    INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(insertQuery, [userId, addressLine1, addressLine2, city, state, postalCode, country], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Address created' });
  });
});

// ================================
// READ All Addresses
// ================================
router.get('/', (req, res) => {
  const selectQuery = `
    SELECT 
      a.id, 
      a.address_line1, 
      a.address_line2, 
      a.city, 
      a.state, 
      a.postal_code, 
      a.country,
      u.id AS user_id, 
      u.username, 
      u.email 
    FROM addresses a
    INNER JOIN users u ON a.user_id = u.id
    ORDER BY a.id ASC
  `;
  db.query(selectQuery, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// ================================
// READ Address by ID
// ================================
router.get('/:id', (req, res) => {
  const selectByIdQuery = `
    SELECT 
      a.id, 
      a.address_line1, 
      a.address_line2, 
      a.city, 
      a.state, 
      a.postal_code, 
      a.country,
      u.id AS user_id, 
      u.username, 
      u.email 
    FROM addresses a
    INNER JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `;
  db.query(selectByIdQuery, [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Address not found');
    res.status(200).json(results[0]);
  });
});

// ================================
// UPDATE Address
// ================================
router.put('/:id', (req, res) => {
  const { userId, addressLine1, addressLine2, city, state, postalCode, country } = req.body;
  const updateQuery = `
    UPDATE addresses 
    SET 
      user_id = ?, 
      address_line1 = ?, 
      address_line2 = ?, 
      city = ?, 
      state = ?, 
      postal_code = ?, 
      country = ?
    WHERE id = ?
  `;
  db.query(updateQuery, [userId, addressLine1, addressLine2, city, state, postalCode, country, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Address not found');
    res.status(200).send({ message: 'Address updated' });
  });
});

// ================================
// DELETE Address
// ================================
router.delete('/:id', (req, res) => {
  const deleteQuery = `DELETE FROM addresses WHERE id = ?`;
  db.query(deleteQuery, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Address not found');
    res.status(200).send({ message: 'Address deleted' });
  });
});

module.exports = router;
