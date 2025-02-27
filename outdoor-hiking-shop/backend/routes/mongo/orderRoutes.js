const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

// CREATE Order
router.post('/', async (req, res) => {
  try {
    const { userId, total, status, shippingMethodId, cartItems } = req.body;

    // Create a new order
    const newOrder = new Order({ userId, total, status, shippingMethodId, cartItems });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

// READ All Orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username email')
      .populate('shippingMethodId', 'methodName cost estimatedDelivery')
      .populate('cartItems.productId', 'name price')
      .sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// READ Order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('shippingMethodId', 'methodName cost estimatedDelivery')
      .populate('cartItems.productId', 'name price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
});

// UPDATE Order Status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
});

// DELETE Order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
});

module.exports = router;
