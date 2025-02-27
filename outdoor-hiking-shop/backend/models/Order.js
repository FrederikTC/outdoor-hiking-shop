const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
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
    min: 0 
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User',
    index: true  // Indexing for faster user-specific queries
  },
  total: { 
    type: Number, 
    required: true, 
    min: 0,
    validate: {
      validator: function(value) {
        // Calculate total from cartItems and check if it matches the total
        const calculatedTotal = this.cartItems.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        return value === calculatedTotal;
      },
      message: 'Total price does not match the sum of cart items'
    }
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'cancelled'], 
    required: true,
    lowercase: true,  // Store status in lowercase for consistency
    index: true       // Indexing for faster status-based queries
  },
  shippingMethodId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'ShippingMethod'
  },
  cartItems: [OrderItemSchema],
  orderDate: { 
    type: Date, 
    default: Date.now,
    index: true  // Indexing for faster date range queries
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

module.exports = mongoose.model('Order', OrderSchema);
