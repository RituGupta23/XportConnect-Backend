// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // For product image
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
