const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  postal_code: String,
  country: String
});

const OrderSummarySchema = new mongoose.Schema({
  order_id: mongoose.Schema.Types.ObjectId,
  status: String,
  total: Number,
  order_date: Date
});

const ReviewSchema = new mongoose.Schema({
  review_id: mongoose.Schema.Types.ObjectId,
  product_id: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: [AddressSchema],
  orders: [OrderSummarySchema],
  reviews: [ReviewSchema]
});

module.exports = mongoose.model('User', UserSchema);
