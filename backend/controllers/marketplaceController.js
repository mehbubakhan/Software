const MarketplaceModel = require('../models/MarketplaceModel');
const { v4: uuidv4 } = require('uuid');

const marketplaceController = {
  // Products
  getProducts: async (req, res) => {
    try {
      const products = await MarketplaceModel.getAllProducts();
      // Apply filters if passed via query params (e.g., category, minPrice, maxPrice)
      let filteredProducts = products;
      if (req.query.category) {
        filteredProducts = filteredProducts.filter(p => p.category_name === req.query.category);
      }
      res.json(filteredProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await MarketplaceModel.getProductById(req.params.id);
      if (!product) return res.status(500).json({ success: false, error: error.message });
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Cart
  getCart: async (req, res) => {
    try {
      const userId = req.user.id; // Assumes auth middleware
      const cart = await MarketplaceModel.getCartByUserId(userId);
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { product_id, quantity } = req.body;
      await MarketplaceModel.addToCart(userId, product_id, quantity || 1);
      res.json({ message: 'Added to cart successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { cart_item_id } = req.params;
      await MarketplaceModel.removeFromCart(userId, cart_item_id);
      res.json({ message: 'Removed from cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Wishlist
  getWishlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const wishlist = await MarketplaceModel.getWishlistByUserId(userId);
      res.json(wishlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  addToWishlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const { product_id } = req.body;
      const added = await MarketplaceModel.addToWishlist(userId, product_id);
      if (added) {
        res.json({ message: 'Added to wishlist' });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  removeFromWishlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const { wishlist_id } = req.params;
      await MarketplaceModel.removeFromWishlist(userId, wishlist_id);
      res.json({ message: 'Removed from wishlist' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Checkout / Orders
  checkout: async (req, res) => {
    try {
      const userId = req.user.id;
      const { shipping_address } = req.body;

      // Get user cart
      const cartItems = await MarketplaceModel.getCartByUserId(userId);
      if (cartItems.length === 0) {
        return res.status(500).json({ success: false, error: error.message });
      }

      let total_amount = 0;
      const items = cartItems.map(item => {
        total_amount += item.price * item.quantity;
        return { product_id: item.id, quantity: item.quantity, price: item.price };
      });

      const tracking_number = 'TRK' + uuidv4().substring(0, 8).toUpperCase();

      const orderData = { tracking_number, shipping_address, total_amount, items };
      const orderId = await MarketplaceModel.createOrder(userId, orderData);

      // Clear cart
      await MarketplaceModel.clearCart(userId);

      res.json({ message: 'Order placed successfully', orderId, tracking_number });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getOrderTracking: async (req, res) => {
    try {
      const { tracking_number } = req.params;
      const order = await MarketplaceModel.getOrderByTracking(tracking_number);
      if (!order) return res.status(500).json({ success: false, error: error.message });
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Seller Methods
  getSellerProducts: async (req, res) => {
    try {
      const sellerId = req.user.id;
      const products = await MarketplaceModel.getSellerProducts(sellerId);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch seller products' });
    }
  },

  addSellerProduct: async (req, res) => {
    try {
      const sellerId = req.user.id;
      const id = await MarketplaceModel.addProduct(sellerId, req.body);
      
      // Global broadcast to all parents about a new product
      try {
        const pool = require('../config/db');
        await pool.query(
          "INSERT INTO parent_notifications (parent_id, sender_role, title, message) VALUES (NULL, 'marketplace', 'New Product Added', ?)",
          [`A new product "${req.body.name}" has been added to the marketplace.`]
        );
      } catch(err) { 
        console.error('Notification error', err.message);
        if (!global.mockParentNotifications) global.mockParentNotifications = [];
        global.mockParentNotifications.push({
          id: 'm_' + Date.now(),
          sender_role: 'marketplace',
          title: 'New Product Added',
          message: `A new product "${req.body.name}" has been added to the marketplace.`,
          created_at: new Date().toISOString()
        });
      }

      res.json({ success: true, message: 'Product added successfully', id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateSellerProduct: async (req, res) => {
    try {
      const sellerId = req.user.id;
      await MarketplaceModel.updateProduct(sellerId, req.params.id, req.body);
      res.json({ success: true, message: 'Product updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteSellerProduct: async (req, res) => {
    try {
      const sellerId = req.user.id;
      await MarketplaceModel.deleteProduct(sellerId, req.params.id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getSellerOrders: async (req, res) => {
    try {
      const sellerId = req.user.id;
      const orders = await MarketplaceModel.getSellerOrders(sellerId);
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch seller orders' });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const sellerId = req.user.id;
      const { status } = req.body;
      await MarketplaceModel.updateOrderStatus(sellerId, req.params.id, status);
      res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Admin Methods
  getAdminSellers: async (req, res) => {
    try {
      const sellers = await MarketplaceModel.getAdminSellers();
      res.json(sellers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch sellers' });
    }
  },

  getAdminDeliveries: async (req, res) => {
    try {
      const deliveries = await MarketplaceModel.getAdminDeliveries();
      res.json(deliveries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
  },

  getAdminPayments: async (req, res) => {
    try {
      const payments = await MarketplaceModel.getAdminPayments();
      res.json(payments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  },

  getAdminComplaints: async (req, res) => {
    try {
      const complaints = await MarketplaceModel.getAdminComplaints();
      res.json(complaints);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch complaints' });
    }
  },

  getAdminReviews: async (req, res) => {
    try {
      const reviews = await MarketplaceModel.getAdminReviews();
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  },

  getAdminNotifications: async (req, res) => {
    try {
      const notifications = await MarketplaceModel.getAdminNotifications();
      res.json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },
  
  getAdminAnalytics: async (req, res) => {
    try {
      const analytics = await MarketplaceModel.getAdminAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
};

module.exports = marketplaceController;
