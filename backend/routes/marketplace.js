const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const auth = require('../middleware/auth');

// Public routes
router.get('/products', marketplaceController.getProducts);
router.get('/products/:id', marketplaceController.getProduct);
router.get('/orders/track/:tracking_number', marketplaceController.getOrderTracking);

// Protected routes (requires login)
router.use(auth);

// Cart
router.get('/cart', marketplaceController.getCart);
router.post('/cart', marketplaceController.addToCart);
router.delete('/cart/:cart_item_id', marketplaceController.removeFromCart);

// Wishlist
router.get('/wishlist', marketplaceController.getWishlist);
router.post('/wishlist', marketplaceController.addToWishlist);
router.delete('/wishlist/:wishlist_id', marketplaceController.removeFromWishlist);

// Checkout
router.post('/checkout', marketplaceController.checkout);

module.exports = router;
