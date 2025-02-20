const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discount: Number,
    valid_from: Date,
    valid_to: Date
    });
    module.exports = mongoose.model('Coupon', CouponSchema);