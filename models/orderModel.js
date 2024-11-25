const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Shipped, Delivered
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
