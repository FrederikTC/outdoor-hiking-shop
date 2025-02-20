const OrderItemSchema = new mongoose.Schema({ product_id: mongoose.Schema.Types.ObjectId, quantity: Number, price: Number });
module.exports = mongoose.model('OrderItem', OrderItemSchema);