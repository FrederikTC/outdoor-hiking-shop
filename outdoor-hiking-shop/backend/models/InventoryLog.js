const InventoryLogSchema = new mongoose.Schema({
    product_id: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    date: Date
    });
    module.exports = mongoose.model('InventoryLog', InventoryLogSchema);