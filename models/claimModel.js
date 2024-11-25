// models/claimModel.js
const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    reason: { type: String, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Approved, Rejected
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
