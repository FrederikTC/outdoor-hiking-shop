const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product_id: mongoose.Schema.Types.ObjectId,
  quantity: Number,
  price: Number
});

const PaymentSchema = new mongoose.Schema({
  payment_id: mongoose.Schema.Types.ObjectId,
  method: String,
  status: String
});

const OrderSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  items: [OrderItemSchema],
  payment: PaymentSchema,
  shipping_method: String,
  status: String,
  order_date: Date
});

module.exports = mongoose.model('Order', OrderSchema);
