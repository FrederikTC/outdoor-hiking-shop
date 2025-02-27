const express = require('express');
const router = express.Router();
const InventoryLog = require('../../models/InventoryLog');

// CREATE Inventory Log
router.post('/', async (req, res) => {
  try {
    const { productId, changeQuantity, changeReason } = req.body;

    // Create a new inventory log
    const newLog = new InventoryLog({ productId, changeQuantity, changeReason });
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create inventory log', error: err.message });
  }
});

// READ All Inventory Logs
router.get('/', async (req, res) => {
  try {
    const inventoryLogs = await InventoryLog.find()
      .populate('productId', 'name price')
      .sort({ changedAt: -1 });
    res.status(200).json(inventoryLogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory logs', error: err.message });
  }
});

// READ Inventory Log by ID
router.get('/:id', async (req, res) => {
  try {
    const inventoryLog = await InventoryLog.findById(req.params.id)
      .populate('productId', 'name price');
    if (!inventoryLog) return res.status(404).json({ message: 'Inventory log not found' });
    res.status(200).json(inventoryLog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory log', error: err.message });
  }
});

// UPDATE Inventory Log
router.put('/:id', async (req, res) => {
  try {
    const { productId, changeQuantity, changeReason } = req.body;

    const updatedLog = await InventoryLog.findByIdAndUpdate(
      req.params.id, 
      { productId, changeQuantity, changeReason },
      { new: true, runValidators: true }
    );
    if (!updatedLog) return res.status(404).json({ message: 'Inventory log not found' });
    res.status(200).json(updatedLog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update inventory log', error: err.message });
  }
});

// DELETE Inventory Log
router.delete('/:id', async (req, res) => {
  try {
    const deletedLog = await InventoryLog.findByIdAndDelete(req.params.id);
    if (!deletedLog) return res.status(404).json({ message: 'Inventory log not found' });
    res.status(200).json({ message: 'Inventory log deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete inventory log', error: err.message });
  }
});

module.exports = router;
