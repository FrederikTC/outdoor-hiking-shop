const PaymentSchema = new mongoose.Schema({
    order_id: mongoose.Schema.Types.ObjectId,
    method: String,
    status: String,
    amount: Number,
    payment_date: Date
    });
    module.exports = mongoose.model('Payment', PaymentSchema);