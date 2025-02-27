const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Order',
    index: true  // Indexing for faster order-specific queries
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Product',
    index: true  // Indexing for faster product-specific queries
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Price cannot be negative'
    }
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
