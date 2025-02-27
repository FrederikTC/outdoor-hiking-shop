const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// CREATE Product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, imageUrl, isFeatured } = req.body;

    // Create a new product
    const newProduct = new Product({ name, description, price, stock, categoryId, imageUrl, isFeatured });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

// READ All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'name')
      .sort({ name: 1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// READ Featured Products
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true })
      .populate('categoryId', 'name')
      .sort({ name: 1 });
    res.status(200).json(featuredProducts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch featured products', error: err.message });
  }
});

// READ Products by Category ID
router.get('/category/:id', async (req, res) => {
  try {
    const products = await Product.find({ categoryId: req.params.id })
      .populate('categoryId', 'name')
      .sort({ name: 1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products by category', error: err.message });
  }
});

// READ Single Product by Slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('categoryId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
});

// UPDATE Product
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, imageUrl, isFeatured } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, categoryId, imageUrl, isFeatured },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

// DELETE Product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;
