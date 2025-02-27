const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Order',
    index: true  // Indexing for faster order-specific queries
  },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    lowercase: true,  // Store in lowercase for consistency
    index: true       // Indexing for faster payment method queries
  },
  paymentStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    lowercase: true,  // Store in lowercase for consistency
    index: true       // Indexing for faster status-based queries
  },
  paymentDate: { 
    type: Date, 
    default: Date.now,
    index: true,  // Indexing for faster date range queries
    validate: {
      validator: function(v) {
        return v <= Date.now();
      },
      message: 'Payment date cannot be in the future'
    }
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

module.exports = mongoose.model('Payment', PaymentSchema);
