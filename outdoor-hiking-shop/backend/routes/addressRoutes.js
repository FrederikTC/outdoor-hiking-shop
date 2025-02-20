const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE Address
router.post('/addresses', (req, res) => {
  const { user_id, address_line1, address_line2, city, state, postal_code, country } = req.body;
  const query = `INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [user_id, address_line1, address_line2, city, state, postal_code, country], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, message: 'Address created' });
  });
});

// READ All Addresses
router.get('/addresses', (req, res) => {
  db.query('SELECT * FROM addresses', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// UPDATE Address
router.put('/addresses/:id', (req, res) => {
  const { user_id, address_line1, address_line2, city, state, postal_code, country } = req.body;
  const query = `UPDATE addresses SET user_id = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE id = ?`;
  db.query(query, [user_id, address_line1, address_line2, city, state, postal_code, country, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Address not found');
    res.status(200).send('Address updated');
  });
});

// DELETE Address
router.delete('/addresses/:id', (req, res) => {
  const query = `DELETE FROM addresses WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Address not found');
    res.status(200).send('Address deleted');
  });
});

module.exports = router;
