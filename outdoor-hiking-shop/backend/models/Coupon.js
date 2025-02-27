const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true, 
    index: true,  // Indexing for faster queries
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]+$/.test(v);  // Alphanumeric only, uppercase
      },
      message: props => `${props.value} is not a valid coupon code!`
    }
  },
  discount: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100  // Percentage discount (0-100)
  },
  validFrom: { 
    type: Date, 
    required: true 
  },
  validUntil: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(v) {
        return v > this.validFrom;
      },
      message: props => `validUntil (${props.value}) should be later than validFrom`
    }
  },
  usageLimit: { 
    type: Number, 
    default: null, 
    min: 1  // Null for unlimited usage
  },
  usageCount: { 
    type: Number, 
    default: 0,
    validate: {
      validator: function(v) {
        return (this.usageLimit === null) || (v <= this.usageLimit);
      },
      message: props => `Usage count (${props.value}) exceeds the usage limit`
    }
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

module.exports = mongoose.model('Coupon', CouponSchema);
