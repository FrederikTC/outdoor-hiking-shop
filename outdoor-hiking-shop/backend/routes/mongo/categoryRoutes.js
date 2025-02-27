const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

// CREATE Category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create a new category
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
});

// READ All Categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
});

// READ Single Category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch category', error: err.message });
  }
});

// UPDATE Category
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the new name is already in use by another category
    const existingCategory = await Category.findOne({ name, _id: { $ne: req.params.id } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already in use' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
});

// DELETE Category
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
});

module.exports = router;
