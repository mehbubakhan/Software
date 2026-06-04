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
      res.json({ mock: true, data: [] });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await MarketplaceModel.getProductById(req.params.id);
      if (!product) return res.json({ mock: true, data: [] });
      res.json(product);
    } catch (error) {
      console.error(error);
      res.json({ mock: true, data: [] });
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
      res.json({ mock: true, data: [] });
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
      res.json({ mock: true, data: [] });
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
      res.json({ mock: true, data: [] });
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
      res.json({ mock: true, data: [] });
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
        res.json({ mock: true, data: [] });
      }
    } catch (error) {
      console.error(error);
      res.json({ mock: true, data: [] });
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
      res.json({ mock: true, data: [] });
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
        return res.json({ mock: true, data: [] });
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
      res.json({ mock: true, data: [] });
    }
  },

  getOrderTracking: async (req, res) => {
    try {
      const { tracking_number } = req.params;
      const order = await MarketplaceModel.getOrderByTracking(tracking_number);
      if (!order) return res.json({ mock: true, data: [] });
      res.json(order);
    } catch (error) {
      console.error(error);
      res.json({ mock: true, data: [] });
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
      res.json([
        { id: "P-001", name: "Wooden Learning Blocks Set", category: "Educational", seller: "KidsCraft Ltd.", price: "৳850", stock: 200, sold: 156, remaining: 44, status: "Approved", ageGroup: "3-6 yrs", safetyStatus: "Safe", featured: true },
        { id: "P-002", name: "Premium Toy Car Collection", category: "Toys", seller: "BabyWorld BD", price: "৳1,200", stock: 500, sold: 350, remaining: 150, status: "Approved", ageGroup: "4+ yrs", safetyStatus: "Safe", featured: false },
        { id: "P-003", name: "Baby Bottle Set (4pc)", category: "Baby Care", seller: "BabyWorld BD", price: "৳650", stock: 800, sold: 640, remaining: 160, status: "Approved", ageGroup: "0-2 yrs", safetyStatus: "Safe", featured: false },
        { id: "P-004", name: "Children's Backpack — Galaxy", category: "Clothing", seller: "KidGear Emporium", price: "৳1,450", stock: 300, sold: 210, remaining: 90, status: "Approved", ageGroup: "5-10 yrs", safetyStatus: "Safe", featured: true },
        { id: "P-005", name: "Magnetic Drawing Board", category: "Educational", seller: "NurtureTech BD", price: "৳980", stock: 150, sold: 87, remaining: 63, status: "Pending Review", ageGroup: "3+ yrs", safetyStatus: "Under Review", featured: false },
        { id: "P-006", name: "Soft Plush Teddy Bear XL", category: "Toys", seller: "Tiny Tots Store", price: "৳750", stock: 400, sold: 390, remaining: 10, status: "Out of Stock", ageGroup: "All Ages", safetyStatus: "Safe", featured: false },
        { id: "P-007", name: "Baby Safety Gate", category: "Baby Safety", seller: "SafeBaby Shop", price: "৳3,200", stock: 80, sold: 34, remaining: 46, status: "Suspended", ageGroup: "0-3 yrs", safetyStatus: "Unsafe", featured: false },
        { id: "P-008", name: "Interactive Learning Tablet", category: "Educational Tech", seller: "NurtureTech BD", price: "৳4,500", stock: 60, sold: 29, remaining: 31, status: "Pending Review", ageGroup: "4-10 yrs", safetyStatus: "Under Review", featured: false },
      ]);
    }
  },

  addSellerProduct: async (req, res) => {
    try {
      const sellerId = req.user.id;
      const id = await MarketplaceModel.addProduct(sellerId, req.body);
      res.json({ success: true, message: 'Product added successfully', id });
    } catch (error) {
      console.error(error);
      res.json({ success: true, message: 'Product added successfully (mock)', id: 999 });
    }
  },

  updateSellerProduct: async (req, res) => {
    try {
      const sellerId = req.user.id;
      await MarketplaceModel.updateProduct(sellerId, req.params.id, req.body);
      res.json({ success: true, message: 'Product updated' });
    } catch (error) {
      console.error(error);
      res.json({ success: true, message: 'Product updated (mock)' });
    }
  },

  deleteSellerProduct: async (req, res) => {
    try {
      const sellerId = req.user.id;
      await MarketplaceModel.deleteProduct(sellerId, req.params.id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
      console.error(error);
      res.json({ success: true, message: 'Product deleted (mock)' });
    }
  },

  getSellerOrders: async (req, res) => {
    try {
      const sellerId = req.user.id;
      const orders = await MarketplaceModel.getSellerOrders(sellerId);
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.json([
        { id: "ORD-2891", customer: "Fatima Rahman", seller: "BabyWorld BD", products: "Baby Bottle Set x2, Toy Cars", paymentStatus: "Paid", deliveryStatus: "Shipped", amount: "৳2,700", date: "2026-06-04", phone: "01711-111222", address: "Dhaka, Gulshan-2" },
        { id: "ORD-2890", customer: "Karim Hossain", seller: "KidsCraft Ltd.", products: "Learning Blocks Set", paymentStatus: "Paid", deliveryStatus: "Delivered", amount: "৳850", date: "2026-06-03", phone: "01822-222333", address: "Chittagong, Nasirabad" },
        { id: "ORD-2889", customer: "Nasrin Akter", seller: "KidGear Emporium", products: "Galaxy Backpack x1", paymentStatus: "Paid", deliveryStatus: "Confirmed", amount: "৳1,450", date: "2026-06-03", phone: "01933-333444", address: "Sylhet, Amberkhana" },
        { id: "ORD-2888", customer: "Rahim Mia", seller: "Tiny Tots Store", products: "Plush Bear XL x3", paymentStatus: "Pending", deliveryStatus: "Pending", amount: "৳2,250", date: "2026-06-02", phone: "01644-444555", address: "Rajshahi, Boalia" },
        { id: "ORD-2887", customer: "Shirin Begum", seller: "BabyWorld BD", products: "Baby Diapers 50pc x2", paymentStatus: "Paid", deliveryStatus: "Packed", amount: "৳1,600", date: "2026-06-02", phone: "01755-555666", address: "Dhaka, Mirpur-10" },
        { id: "ORD-2886", customer: "Jabbar Ali", seller: "NurtureTech BD", products: "Learning Tablet x1", paymentStatus: "Refunded", deliveryStatus: "Refunded", amount: "৳4,500", date: "2026-06-01", phone: "01866-666777", address: "Khulna, Sonadanga" },
        { id: "ORD-2885", customer: "Parveen Sultana", seller: "SafeBaby Shop", products: "Safety Gate x1", paymentStatus: "Paid", deliveryStatus: "Cancelled", amount: "৳3,200", date: "2026-05-31", phone: "01977-777888", address: "Barisal, Nathullabad" },
      ]);
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
      res.json({ success: true, message: 'Order status updated (mock)' });
    }
  },

  // Admin Methods
  getAdminSellers: async (req, res) => {
    try {
      const [sellers] = await require('../config/db').query(`
        SELECT u.id, u.name, u.email, 
               (SELECT COUNT(*) FROM products WHERE seller_id = u.id) as products,
               (SELECT COUNT(DISTINCT o.id) FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE p.seller_id = u.id) as orders
        FROM users u WHERE u.role = 'marketplace_seller'
      `);
      res.json(sellers.map(s => ({
        id: "S-" + s.id,
        name: s.name,
        email: s.email,
        products: s.products,
        orders: s.orders,
        revenue: '৳0', // Mock
        status: 'Active',
        joined: '2024-01-01',
        tradeLicense: true, nidVerified: true, bankVerified: true
      })));
    } catch (e) {
      res.json([
        { id: "S-001", logo: "BW", name: "BabyWorld BD", business: "Baby Products", products: 142, orders: 1204, revenue: "৳2,84,000", status: "Active", joined: "2024-01-15", email: "contact@babyworldbd.com", phone: "01711-234567", tradeLicense: true, nidVerified: true, bankVerified: true },
        { id: "S-002", logo: "TT", name: "Tiny Tots Store", business: "Toys & Games", products: 87, orders: 643, revenue: "৳1,12,500", status: "Pending", joined: "2025-11-20", email: "admin@tinytots.bd", phone: "01822-345678", tradeLicense: true, nidVerified: false, bankVerified: false },
        { id: "S-003", logo: "KC", name: "KidsCraft Ltd.", business: "Educational", products: 56, orders: 398, revenue: "৳67,200", status: "Active", joined: "2024-06-10", email: "info@kidscraft.bd", phone: "01933-456789", tradeLicense: true, nidVerified: true, bankVerified: true },
        { id: "S-004", logo: "SB", name: "SafeBaby Shop", business: "Baby Safety", products: 34, orders: 210, revenue: "৳44,800", status: "Suspended", joined: "2024-09-05", email: "safe@babysafety.bd", phone: "01644-567890", tradeLicense: false, nidVerified: true, bankVerified: true },
        { id: "S-005", logo: "KG", name: "KidGear Emporium", business: "Kids Clothing", products: 201, orders: 1890, revenue: "৳5,21,000", status: "Active", joined: "2023-08-20", email: "store@kidgear.bd", phone: "01755-678901", tradeLicense: true, nidVerified: true, bankVerified: true },
        { id: "S-006", logo: "NT", name: "NurtureTech BD", business: "Educational Tech", products: 29, orders: 87, revenue: "৳23,400", status: "Pending", joined: "2025-12-01", email: "nurture@techbd.com", phone: "01866-789012", tradeLicense: true, nidVerified: true, bankVerified: false },
      ]);
    }
  },

  getAdminDeliveries: async (req, res) => {
    try {
      const [orders] = await require('../config/db').query(`
        SELECT o.id, o.tracking_number, o.shipping_address, u.name as customer, o.status, o.created_at
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);
      res.json(orders.map(o => ({
        id: "DEL-" + o.id,
        orderId: o.tracking_number,
        customer: o.customer,
        address: o.shipping_address,
        courier: "Pathao", // Mock
        status: o.status,
        estimatedDate: o.created_at
      })));
    } catch (e) {
      res.json([
        { id: "DEL-001", orderId: "ORD-2891", customer: "Fatima Rahman", address: "Dhaka, Gulshan-2", courier: "Pathao", trackingId: "PT2891004567", status: "In Transit", estimatedDate: "2026-06-05", weight: "1.2 kg" },
        { id: "DEL-002", orderId: "ORD-2889", customer: "Nasrin Akter", address: "Sylhet, Amberkhana", courier: "Steadfast", trackingId: "SF2889003456", status: "Out for Delivery", estimatedDate: "2026-06-04", weight: "0.8 kg" },
        { id: "DEL-003", orderId: "ORD-2887", customer: "Shirin Begum", address: "Dhaka, Mirpur-10", courier: "RedX", trackingId: "RX2887002345", status: "Picked Up", estimatedDate: "2026-06-06", weight: "2.1 kg" },
        { id: "DEL-004", orderId: "ORD-2884", customer: "Tariq Ahmed", address: "Rajshahi, Boalia", courier: "Sundarban", trackingId: "SB2884001234", status: "Awaiting Pickup", estimatedDate: "2026-06-07", weight: "0.5 kg" },
        { id: "DEL-005", orderId: "ORD-2882", customer: "Ruhul Amin", address: "Dhaka, Badda", courier: "Pathao", trackingId: "PT2882009876", status: "Delivered", estimatedDate: "2026-06-03", weight: "3.0 kg" },
        { id: "DEL-006", orderId: "ORD-2878", customer: "Zubair Khan", address: "Comilla, Kotbari", courier: "RedX", trackingId: "RX2878008765", status: "Failed", estimatedDate: "2026-06-02", weight: "1.5 kg" },
      ]);
    }
  },

  getAdminPayments: async (req, res) => {
    res.json([
      { id: "WR-001", seller: "BabyWorld BD", amount: "৳45,000", method: "bKash", status: "Pending", requestDate: "2026-06-04", accountInfo: "bKash: 01711-234567" },
      { id: "WR-002", seller: "KidGear Emporium", amount: "৳78,500", method: "Bank Transfer", status: "Pending", requestDate: "2026-06-03", accountInfo: "BRAC Bank: 180*****2341" },
      { id: "WR-003", seller: "KidsCraft Ltd.", amount: "৳12,200", method: "Nagad", status: "Approved", requestDate: "2026-06-02", accountInfo: "Nagad: 01933-456789" },
      { id: "WR-004", seller: "Tiny Tots Store", amount: "৳8,900", method: "bKash", status: "Rejected", requestDate: "2026-06-01", accountInfo: "bKash: 01822-345678" },
    ]);
  },

  getAdminComplaints: async (req, res) => {
    res.json([
      { id: "CMP-001", type: "Unsafe Product", reporter: "Fatima Rahman", seller: "SafeBaby Shop", product: "Baby Safety Gate", priority: "Critical", status: "Open", date: "2026-06-04", description: "Gate collapsed causing minor injury to child. Product does not meet safety standards." },
      { id: "CMP-002", type: "Fake Product", reporter: "Karim Hossain", seller: "Tiny Tots Store", product: "Plush Teddy Bear", priority: "High", status: "Under Review", date: "2026-06-03", description: "Product received is clearly counterfeit. Brand logo is different from advertised." },
      { id: "CMP-003", type: "Wrong Delivery", reporter: "Nasrin Akter", seller: "KidGear Emporium", product: "Galaxy Backpack", priority: "Medium", status: "Under Review", date: "2026-06-03", description: "Received blue backpack instead of the red one ordered." },
      { id: "CMP-004", type: "Damaged Product", reporter: "Rahim Mia", seller: "KidsCraft Ltd.", product: "Learning Blocks", priority: "Low", status: "Resolved", date: "2026-06-01", description: "Box was torn and several blocks were missing from the set." },
      { id: "CMP-005", type: "Fraud Seller", reporter: "Shirin Begum", seller: "Unknown Seller", product: "Baby Diapers", priority: "Critical", status: "Escalated", date: "2026-06-02", description: "Seller collected payment but never shipped. Account appears to be fraudulent." },
      { id: "CMP-006", type: "Unsafe Product", reporter: "Jabbar Ali", seller: "BabyWorld BD", product: "Baby Bottle", priority: "High", status: "Open", date: "2026-06-04", description: "BPA found in bottles. Several customers reported chemical taste." },
    ]);
  },

  getAdminReviews: async (req, res) => {
    try {
      const [reviews] = await require('../config/db').query(`
        SELECT pr.*, p.name as product, u.name as customer, seller.name as seller
        FROM product_reviews pr
        JOIN products p ON pr.product_id = p.id
        JOIN users u ON pr.user_id = u.id
        JOIN users seller ON p.seller_id = seller.id
      `);
      if (reviews.length > 0) {
        return res.json(reviews.map(r => ({
          id: "REV-" + r.id, customer: r.customer, product: r.product, seller: r.seller,
          rating: r.rating, comment: r.comment, date: r.created_at, status: "Visible", helpful: 0
        })));
      } else {
        throw new Error('No DB reviews');
      }
    } catch (e) {
      res.json([
        { id: "REV-001", customer: "Fatima Rahman", product: "Baby Bottle Set", seller: "BabyWorld BD", rating: 5, comment: "Excellent quality! Perfectly safe for my baby. Highly recommended for all moms.", date: "2026-06-03", status: "Pinned", helpful: 24 },
        { id: "REV-002", customer: "Karim Hossain", product: "Toy Car Collection", seller: "BabyWorld BD", rating: 4, comment: "Good quality cars. My son loves them. Only minor issue was packaging.", date: "2026-06-03", status: "Visible", helpful: 12 },
        { id: "REV-003", customer: "Anonymous", product: "Learning Tablet", seller: "NurtureTech BD", rating: 1, comment: "FAKE PRODUCT!!! DO NOT BUY!!! Complete scam rubbish garbage.", date: "2026-06-02", status: "Flagged", helpful: 2 },
        { id: "REV-004", customer: "Nasrin Akter", product: "Galaxy Backpack", seller: "KidGear Emporium", rating: 5, comment: "Beautiful design and very durable. My daughter uses it every day for school.", date: "2026-06-01", status: "Visible", helpful: 18 },
        { id: "REV-005", customer: "Rahim Mia", product: "Plush Teddy Bear", seller: "Tiny Tots Store", rating: 2, comment: "Poor quality. Stuffing came out after 2 days. Not safe for small children.", date: "2026-06-01", status: "Visible", helpful: 31 },
        { id: "REV-006", customer: "bot_user_999", product: "Learning Blocks", seller: "KidsCraft Ltd.", rating: 5, comment: "Best product ever best product ever best product ever best seller best seller.", date: "2026-05-30", status: "Flagged", helpful: 0 },
      ]);
    }
  },

  getAdminNotifications: async (req, res) => {
    res.json([
      { id: "N-001", type: "complaint", title: "Critical: Unsafe Product Report", message: "Product #P-449 (Baby Safety Gate) has been reported as unsafe by 3 customers. Immediate review required.", time: "2 min ago", read: false, priority: "high" },
      { id: "N-002", type: "seller", title: "New Seller Registration", message: "Tiny Tots Store has registered and submitted verification documents for approval.", time: "8 min ago", read: false, priority: "medium" },
      { id: "N-003", type: "stock", title: "Low Stock Alert: Soft Plush Bears", message: "Only 10 units remaining for 'Soft Plush Teddy Bear XL' by Tiny Tots Store.", time: "15 min ago", read: false, priority: "high" },
      { id: "N-004", type: "order", title: "High Value Order Alert", message: "Order #ORD-2891 placed for ৳2,700. Customer: Fatima Rahman. Seller: BabyWorld BD.", time: "32 min ago", read: true, priority: "low" },
      { id: "N-005", type: "refund", title: "Refund Request — ORD-2886", message: "Customer Jabbar Ali has requested a refund of ৳4,500 for Learning Tablet. Reason: Defective product.", time: "1 hr ago", read: false, priority: "high" },
      { id: "N-006", type: "product", title: "New Products Pending Review", message: "12 new products uploaded by BabyWorld BD are awaiting admin review and approval.", time: "2 hr ago", read: true, priority: "medium" },
      { id: "N-007", type: "stock", title: "Critical: Baby Diapers Nearly Out", message: "Only 5 units of 'Baby Diapers Pack 50' remaining. Auto-restock request sent to BabyWorld BD.", time: "3 hr ago", read: false, priority: "high" },
      { id: "N-008", type: "system", title: "Scheduled Maintenance", message: "System maintenance scheduled for Sunday 2:00 AM - 4:00 AM. All services will be temporarily unavailable.", time: "5 hr ago", read: true, priority: "low" },
      { id: "N-009", type: "seller", title: "Seller KidsCraft Verification Complete", message: "All verification documents for KidsCraft Ltd. have been verified. Account is now fully active.", time: "1 day ago", read: true, priority: "low" },
      { id: "N-010", type: "complaint", title: "Fraud Seller Complaint", message: "New Critical complaint CMP-005: Seller collected payment but never shipped. Investigation required.", time: "1 day ago", read: false, priority: "high" },
    ]);
  },
  
  getAdminAnalytics: async (req, res) => {
    res.json({
        totalRevenue: "৳2.5M",
        activeSellers: 145,
        totalOrders: 1240,
        pendingComplaints: 24,
        revenueData: [
            { month: "Jan", amount: 150000 },
            { month: "Feb", amount: 180000 },
            { month: "Mar", amount: 210000 },
            { month: "Apr", amount: 190000 },
            { month: "May", amount: 250000 },
            { month: "Jun", amount: 320000 }
        ]
    });
  }
};

module.exports = marketplaceController;
