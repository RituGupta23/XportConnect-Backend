// routes/productRoutes.js
const express = require('express');
const { addProduct, getSellerProducts, getAllProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('seller'), addProduct); // Only seller can add products
router.get('/', getAllProducts);  // Everyone can view products
router.get('/my-products', protect, authorize('seller'), getSellerProducts); // Seller can view their products

module.exports = router;
