const express = require('express');
const router = express.Router();
const Review = require('../../models/Review');

// CREATE Review
router.post('/', async (req, res) => {
  try {
    const { productId, userId, rating, reviewText } = req.body;

    // Create a new review
    const newReview = new Review({ productId, userId, rating, reviewText });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    if (err.code === 11000) {
      // Handle unique constraint error for compound index
      return res.status(409).json({ message: 'User has already reviewed this product' });
    }
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
});

// READ All Reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('productId', 'name')
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
});

// READ Reviews by Product ID
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews by product', error: err.message });
  }
});

// READ Reviews by User ID
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate('productId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews by user', error: err.message });
  }
});

// UPDATE Review
router.put('/:id', async (req, res) => {
  try {
    const { rating, reviewText } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, reviewText },
      { new: true, runValidators: true }
    );
    if (!updatedReview) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update review', error: err.message });
  }
});

// DELETE Review
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
});

module.exports = router;
