const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true,  // Ensures uniqueness regardless of case
    index: true       // Indexing for faster queries
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

module.exports = mongoose.model('Category', CategorySchema);
