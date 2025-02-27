const express = require('express');
const router = express.Router();
const Cart = require('../../models/Cart');

// CREATE Cart Item
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if the product is already in the cart for this user
    const existingCartItem = await Cart.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      const updatedCartItem = await existingCartItem.save();
      return res.status(200).json(updatedCartItem);
    }

    // Create a new cart item
    const newCartItem = new Cart({ userId, productId, quantity });
    const savedCartItem = await newCartItem.save();
    res.status(201).json(savedCartItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
});

// READ All Cart Items for a User
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId })
      .populate('productId', 'name price imageUrl')
      .sort({ createdAt: -1 });
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart items', error: err.message });
  }
});

// UPDATE Cart Item Quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedCartItem = await Cart.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    if (!updatedCartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.status(200).json(updatedCartItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item', error: err.message });
  }
});

// DELETE Cart Item
router.delete('/:id', async (req, res) => {
  try {
    const deletedCartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete cart item', error: err.message });
  }
});

module.exports = router;
