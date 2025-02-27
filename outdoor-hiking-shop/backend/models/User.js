const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    index: true,  // Indexing for faster username lookups
    minlength: 3,
    maxlength: 30,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true,  // Indexing for faster email lookups
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 8,
    select: false  // Exclude password from query results by default
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user',
    index: true  // Indexing for faster role-specific queries
  }
}, { 
  timestamps: true,
  strict: true,  // Prevent saving unknown fields
  versionKey: false  // Disable the default __v version key
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 12;  // Recommended: 10-12 for security vs. performance
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method for authentication
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Ensure unique email and username with custom error message
UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    if (error.keyPattern.email) {
      next(new Error('Email already exists'));
    } else if (error.keyPattern.username) {
      next(new Error('Username already exists'));
    }
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
