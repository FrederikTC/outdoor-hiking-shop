const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Product',
    index: true  // Indexing for faster product-specific queries
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User',
    index: true  // Indexing for faster user-specific queries
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    },
    index: true  // Indexing for faster rating-specific queries
  },
  reviewText: { 
    type: String, 
    required: true, 
    trim: true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Review text cannot be empty'
    }
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

// Compound Index to ensure unique review per user per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
