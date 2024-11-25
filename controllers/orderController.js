const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Create an Order
const createOrder = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required and cannot be empty.' });
        }

        let totalPrice = 0;
        const populatedProducts = [];

        for (const item of products) {
            const { product: productId, quantity } = item;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Product ID and valid quantity are required for all items.' });
            }

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(400).json({ message: `Product with ID ${productId} does not exist.` });
            }

            totalPrice += product.price * quantity;
            populatedProducts.push({
                product: productId,
                quantity,
                seller: product.seller, // Extract seller from the product document
            });
        }

        const order = new Order({
            customer: req.user._id, // Authenticated user's ID
            products: populatedProducts,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json({ message: 'Order created successfully.', order: createdOrder });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while creating the order.', error: error.message });
    }
};

// Get Customer's Orders
const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('products.product', 'name price') // Populate product details
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while retrieving orders.', error: error.message });
    }
};

// Get Seller's Orders
const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const orders = await Order.find({ 'products.seller': sellerId })
            .populate('customer', 'name email') // Populate customer details
            .populate('products.product', 'name price') // Populate product details
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for your products.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while retrieving orders.', error: error.message });
    }
};

module.exports = { createOrder, getCustomerOrders, getSellerOrders };
