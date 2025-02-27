const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User',
    index: true  // Indexing for faster queries by user
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Product',
    index: true  // Indexing for faster queries by product
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }
}, { 
  timestamps: true,
  strict: true
});

module.exports = mongoose.model('Cart', CartSchema);
