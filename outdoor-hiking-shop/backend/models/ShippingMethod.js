const ShippingMethodSchema = new mongoose.Schema({
    name: String,
    cost: Number,
    estimated_delivery_days: Number
    });
    module.exports = mongoose.model('ShippingMethod', ShippingMethodSchema);