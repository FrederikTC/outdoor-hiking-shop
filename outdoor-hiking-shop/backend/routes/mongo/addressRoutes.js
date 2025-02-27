const express = require('express');
const router = express.Router();
const Address = require('../../models/Address');

// CREATE Address
router.post('/', async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create address', error: err.message });
  }
});

// READ All Addresses
router.get('/', async (req, res) => {
  try {
    const addresses = await Address.find().populate('userId', 'username email').sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addresses', error: err.message });
  }
});

// READ Address by ID
router.get('/:id', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).populate('userId', 'username email');
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(address);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch address', error: err.message });
  }
});

// UPDATE Address
router.put('/:id', async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update address', error: err.message });
  }
});

// DELETE Address
router.delete('/:id', async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    if (!deletedAddress) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete address', error: err.message });
  }
});

module.exports = router;
