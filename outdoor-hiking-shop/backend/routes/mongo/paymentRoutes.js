const express = require('express');
const router = express.Router();
const Payment = require('../../models/Payment');

// CREATE Payment
router.post('/', async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentStatus, paymentDate } = req.body;

    // Create a new payment
    const newPayment = new Payment({ orderId, paymentMethod, paymentStatus, paymentDate });
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payment', error: err.message });
  }
});

// READ All Payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('orderId', 'total status')
      .sort({ paymentDate: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
});

// READ Payment by Order ID
router.get('/order/:orderId', async (req, res) => {
  try {
    const payments = await Payment.find({ orderId: req.params.orderId })
      .populate('orderId', 'total status')
      .sort({ paymentDate: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
});

// UPDATE Payment
router.put('/:id', async (req, res) => {
  try {
    const { paymentMethod, paymentStatus, paymentDate } = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { paymentMethod, paymentStatus, paymentDate },
      { new: true, runValidators: true }
    );
    if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(updatedPayment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payment', error: err.message });
  }
});

// DELETE Payment
router.delete('/:id', async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete payment', error: err.message });
  }
});

module.exports = router;
