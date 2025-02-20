const ReviewSchema = new mongoose.Schema({
    product_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    review_date: Date
    });
    module.exports = mongoose.model('Review', ReviewSchema);