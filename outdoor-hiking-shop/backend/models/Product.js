const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
    log_id: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    date: Date
});
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    category: { category_id: mongoose.Schema.Types.ObjectId, name: String },
    inventory_logs: [InventoryLogSchema],
    reviews: [
        { review_id: mongoose.Schema.Types.ObjectId, user_id: mongoose.Schema.Types.ObjectId, rating: Number, comment: String }
    ]
});
module.exports = mongoose.model('Product', ProductSchema);