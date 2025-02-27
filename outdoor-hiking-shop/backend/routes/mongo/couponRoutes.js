const express = require('express');
const router = express.Router();
const Coupon = require('../../models/Coupon');

// CREATE Coupon
router.post('/', async (req, res) => {
  try {
    const { code, discount, validFrom, validUntil, usageLimit } = req.body;

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Create a new coupon
    const newCoupon = new Coupon({ code, discount, validFrom, validUntil, usageLimit });
    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create coupon', error: err.message });
  }
});

// READ All Coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ validFrom: -1 });
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch coupons', error: err.message });
  }
});

// READ Single Coupon by ID
router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch coupon', error: err.message });
  }
});

// UPDATE Coupon
router.put('/:id', async (req, res) => {
  try {
    const { code, discount, validFrom, validUntil, usageLimit } = req.body;

    // Check if the new code is already in use by another coupon
    const existingCoupon = await Coupon.findOne({ code, _id: { $ne: req.params.id } });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already in use' });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id, 
      { code, discount, validFrom, validUntil, usageLimit },
      { new: true, runValidators: true }
    );
    if (!updatedCoupon) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json(updatedCoupon);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update coupon', error: err.message });
  }
});

// DELETE Coupon
router.delete('/:id', async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete coupon', error: err.message });
  }
});

module.exports = router;
