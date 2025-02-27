const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Product',
    index: true  // Indexing for faster queries by product
  },
  changeQuantity: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(v) {
        return v !== 0;
      },
      message: 'Change quantity cannot be zero'
    }
  },
  changeReason: { 
    type: String, 
    required: true, 
    trim: true,
    enum: ['restock', 'sale', 'return', 'damage', 'adjustment'],
    index: true  // Indexing for faster filtering by reason
  },
  changedAt: { 
    type: Date, 
    default: Date.now,
    index: true  // Indexing for faster date-based queries
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);
