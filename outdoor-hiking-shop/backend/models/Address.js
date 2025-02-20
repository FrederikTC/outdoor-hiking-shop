const AddressSchema = new mongoose.Schema({ street: String, city: String, postal_code: String, country: String });
module.exports = mongoose.model('Address', AddressSchema);