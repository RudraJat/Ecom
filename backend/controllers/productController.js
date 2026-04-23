import Product from '../models/productModel.js';
import products from '../data/products.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const dbProducts = await Product.find({});
    if (dbProducts.length > 0) {
      res.json(dbProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    console.log('MongoDB fetch failed, returning mock data.');
    res.json(products);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    const product = products.find((p) => p._id === req.params.id || p.name === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  }
};

export { getProducts, getProductById };
