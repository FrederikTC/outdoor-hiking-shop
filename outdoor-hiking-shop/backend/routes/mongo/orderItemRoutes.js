const express = require('express');
const router = express.Router();
const OrderItem = require('../../models/OrderItem');

// CREATE Order Item
router.post('/', async (req, res) => {
  try {
    const { orderId, productId, quantity, price } = req.body;

    // Create a new order item
    const newOrderItem = new OrderItem({ orderId, productId, quantity, price });
    const savedOrderItem = await newOrderItem.save();
    res.status(201).json(savedOrderItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order item', error: err.message });
  }
});

// READ All Order Items
router.get('/', async (req, res) => {
  try {
    const orderItems = await OrderItem.find()
      .populate('orderId', 'total status')
      .populate('productId', 'name price imageUrl')
      .sort({ createdAt: -1 });
    res.status(200).json(orderItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order items', error: err.message });
  }
});

// READ Order Items by Order ID
router.get('/order/:orderId', async (req, res) => {
  try {
    const orderItems = await OrderItem.find({ orderId: req.params.orderId })
      .populate('productId', 'name price imageUrl')
      .sort({ createdAt: -1 });
    res.status(200).json(orderItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order items', error: err.message });
  }
});

// UPDATE Order Item
router.put('/:id', async (req, res) => {
  try {
    const { quantity, price } = req.body;

    const updatedOrderItem = await OrderItem.findByIdAndUpdate(
      req.params.id, 
      { quantity, price },
      { new: true, runValidators: true }
    );
    if (!updatedOrderItem) return res.status(404).json({ message: 'Order item not found' });
    res.status(200).json(updatedOrderItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order item', error: err.message });
  }
});

// DELETE Order Item
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrderItem = await OrderItem.findByIdAndDelete(req.params.id);
    if (!deletedOrderItem) return res.status(404).json({ message: 'Order item not found' });
    res.status(200).json({ message: 'Order item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order item', error: err.message });
  }
});

module.exports = router;
