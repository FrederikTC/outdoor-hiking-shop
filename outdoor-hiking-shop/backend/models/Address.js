const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User',
    index: true  // Indexing for faster queries
  },
  addressLine1: { 
    type: String, 
    required: true, 
    trim: true 
  },
  addressLine2: { 
    type: String, 
    trim: true 
  },
  city: { 
    type: String, 
    required: true, 
    trim: true 
  },
  state: { 
    type: String, 
    required: true, 
    trim: true 
  },
  postalCode: { 
    type: String, 
    required: true, 
    trim: true 
  },
  country: { 
    type: String, 
    required: true, 
    trim: true,
    lowercase: true  // Store country names in lowercase
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

module.exports = mongoose.model('Address', AddressSchema);
