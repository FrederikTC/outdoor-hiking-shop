const mongoose = require('mongoose');

const ShippingMethodSchema = new mongoose.Schema({
  methodName: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true,  // Ensure method names are unique
    index: true    // Indexing for faster shipping method searches
  },
  cost: { 
    type: Number, 
    required: true, 
    min: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Cost cannot be negative'
    },
    index: true  // Indexing for faster cost-specific queries
  },
  estimatedDelivery: { 
    type: String, 
    required: true, 
    trim: true,
    validate: {
      validator: function(v) {
        return /^(?:\d+-\d+ days|\d+ day)$/.test(v);
      },
      message: 'Estimated delivery must be in the format "3-5 days" or "1 day"'
    }
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

module.exports = mongoose.model('ShippingMethod', ShippingMethodSchema);
