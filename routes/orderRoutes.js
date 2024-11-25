const express = require('express');
const { createOrder, getCustomerOrders, getSellerOrders } = require('../controllers/orderController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('customer'), createOrder); // Create order
router.get('/customer', protect, authorize('seller'), getCustomerOrders); // Get customer orders
router.get('/seller', protect, authorize('seller'), getSellerOrders); // Get seller orders

module.exports = router;
