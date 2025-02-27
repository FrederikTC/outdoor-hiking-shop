const mongoose = require('mongoose');
const slugify = require('slugify');  // Slugify for generating SEO-friendly URLs

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    index: true  // Indexing for faster product searches
  },
  slug: { 
    type: String, 
    unique: true, 
    index: true  // Indexing for SEO-friendly URLs
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
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
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Category',
    index: true  // Indexing for faster category-specific queries
  },
  imageUrl: { 
    type: String, 
    default: '',
    validate: {
      validator: function(v) {
        return v === '' || /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'Invalid image URL'
    }
  },
  isFeatured: { 
    type: Boolean, 
    default: false,
    index: true  // Indexing for faster featured product queries
  }
}, { 
  timestamps: true,
  strict: true  // Prevent saving unknown fields
});

// Auto-generate SEO-friendly slug from name
ProductSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
