const express = require('express');
const router = express.Router();
const ShippingMethod = require('../../models/ShippingMethod');

// CREATE Shipping Method
router.post('/', async (req, res) => {
  try {
    const { methodName, cost, estimatedDelivery } = req.body;

    // Create a new shipping method
    const newMethod = new ShippingMethod({ methodName, cost, estimatedDelivery });
    const savedMethod = await newMethod.save();
    res.status(201).json(savedMethod);
  } catch (err) {
    if (err.code === 11000) {
      // Handle unique constraint error for methodName
      return res.status(409).json({ message: 'Shipping method already exists' });
    }
    res.status(500).json({ message: 'Failed to create shipping method', error: err.message });
  }
});

// READ All Shipping Methods
router.get('/', async (req, res) => {
  try {
    const methods = await ShippingMethod.find().sort({ cost: 1 });
    res.status(200).json(methods);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch shipping methods', error: err.message });
  }
});

// READ Shipping Method by ID
router.get('/:id', async (req, res) => {
  try {
    const method = await ShippingMethod.findById(req.params.id);
    if (!method) return res.status(404).json({ message: 'Shipping method not found' });
    res.status(200).json(method);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch shipping method', error: err.message });
  }
});

// UPDATE Shipping Method
router.put('/:id', async (req, res) => {
  try {
    const { methodName, cost, estimatedDelivery } = req.body;

    const updatedMethod = await ShippingMethod.findByIdAndUpdate(
      req.params.id,
      { methodName, cost, estimatedDelivery },
      { new: true, runValidators: true }
    );
    if (!updatedMethod) return res.status(404).json({ message: 'Shipping method not found' });
    res.status(200).json(updatedMethod);
  } catch (err) {
    if (err.code === 11000) {
      // Handle unique constraint error for methodName
      return res.status(409).json({ message: 'Shipping method name already exists' });
    }
    res.status(500).json({ message: 'Failed to update shipping method', error: err.message });
  }
});

// DELETE Shipping Method
router.delete('/:id', async (req, res) => {
  try {
    const deletedMethod = await ShippingMethod.findByIdAndDelete(req.params.id);
    if (!deletedMethod) return res.status(404).json({ message: 'Shipping method not found' });
    res.status(200).json({ message: 'Shipping method deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete shipping method', error: err.message });
  }
});

module.exports = router;
