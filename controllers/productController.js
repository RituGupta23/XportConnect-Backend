// controllers/productController.js
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Add a new product (seller)
const addProduct = async (req, res) => {
  const { name, description, price, image } = req.body;
  if (!name || !description || !price || image) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (price <= 0) {
    return res.status(400).json({ message: "Price must be greater than zero" });
  }
  const product = new Product({
    seller: req.user._id,
    name,
    description,
    price,
    image,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// Get products for a specific seller
const getSellerProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
};

// Get all products (for customers)
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

module.exports = { addProduct, getSellerProducts, getAllProducts };
