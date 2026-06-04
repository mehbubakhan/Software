const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const auth = require('../middleware/auth');
const { permit } = require('../middleware/roles');

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

// Seller routes
router.get('/seller/products', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getSellerProducts);
router.post('/seller/products', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.addSellerProduct);
router.put('/seller/products/:id', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.updateSellerProduct);
router.delete('/seller/products/:id', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.deleteSellerProduct);
router.get('/seller/orders', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getSellerOrders);
router.put('/seller/orders/:id/status', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.updateOrderStatus);

// Admin routes
router.get('/admin/sellers', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getAdminSellers);
router.get('/admin/deliveries', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getAdminDeliveries);
router.get('/admin/payments', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getAdminPayments);
router.get('/admin/complaints', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getAdminComplaints);
router.get('/admin/reviews', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getAdminReviews);
router.get('/admin/notifications', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getAdminNotifications);
router.get('/admin/analytics', permit('marketplace_seller', 'seller', 'admin'), marketplaceController.getAdminAnalytics);

module.exports = router;
