// controllers/claimController.js
const Claim = require('../models/claimModel');
const Order = require('../models/orderModel');

// File a claim for an order
const fileClaim = async (req, res) => {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.customer.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Order not found or not authorized to file claim' });
    }

    const claim = new Claim({ order: orderId, reason });
    const createdClaim = await claim.save();
    res.status(201).json(createdClaim);
};

// Get claims for a customer
const getCustomerClaims = async (req, res) => {
    const claims = await Claim.find({ customer: req.user._id });
    res.json(claims);
};

module.exports = { fileClaim, getCustomerClaims };
