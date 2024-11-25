// routes/claimRoutes.js
const express = require('express');
const { fileClaim, getCustomerClaims } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, fileClaim);  // Customers can file claims
router.get('/', protect, getCustomerClaims);  // Customers can view their claims

module.exports = router;
