const db = require('../config/db');

const MarketplaceModel = {
  // --- Products ---
  getAllProducts: async () => {
    const query = `
      SELECT p.*, c.name as category_name, u.name as seller_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getProductById: async (id) => {
    const query = `
      SELECT p.*, c.name as category_name, u.name as seller_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  getSellerProducts: async (sellerId) => {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.seller_id = ?
    `;
    const [rows] = await db.query(query, [sellerId]);
    return rows;
  },

  addProduct: async (sellerId, productData) => {
    // Ensure at least one category exists
    const [cats] = await db.query('SELECT id FROM categories LIMIT 1');
    let category_id = 1;
    if (cats.length === 0) {
      const [res] = await db.query('INSERT INTO categories (name, description) VALUES ("Default", "Default Category")');
      category_id = res.insertId;
    } else {
      category_id = cats[0].id;
    }

    const { name, price, stock } = productData;
    const [result] = await db.query(
      'INSERT INTO products (seller_id, category_id, name, price, stock) VALUES (?, ?, ?, ?, ?)',
      [sellerId, category_id, name, price, stock]
    );
    return result.insertId;
  },

  updateProduct: async (sellerId, productId, data) => {
    const { name, price, stock } = data;
    await db.query(
      'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ? AND seller_id = ?',
      [name, price, stock, productId, sellerId]
    );
  },

  deleteProduct: async (sellerId, productId) => {
    await db.query('DELETE FROM products WHERE id = ? AND seller_id = ?', [productId, sellerId]);
  },

  // --- Cart ---
  getCartByUserId: async (userId) => {
    const query = `
      SELECT c.id as cart_item_id, c.quantity, p.*
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
  },

  addToCart: async (userId, productId, quantity) => {
    // Check if item exists in cart
    const checkQuery = `SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`;
    const [existing] = await db.query(checkQuery, [userId, productId]);

    if (existing.length > 0) {
      // Update quantity
      const updateQuery = `UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`;
      await db.query(updateQuery, [quantity, userId, productId]);
      return { status: 'updated' };
    } else {
      // Insert new
      const insertQuery = `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`;
      await db.query(insertQuery, [userId, productId, quantity]);
      return { status: 'inserted' };
    }
  },

  removeFromCart: async (userId, cartItemId) => {
    const query = `DELETE FROM cart_items WHERE user_id = ? AND id = ?`;
    await db.query(query, [userId, cartItemId]);
  },

  clearCart: async (userId) => {
    const query = `DELETE FROM cart_items WHERE user_id = ?`;
    await db.query(query, [userId]);
  },

  // --- Wishlist ---
  getWishlistByUserId: async (userId) => {
    const query = `
      SELECT w.id as wishlist_id, p.*
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
  },

  addToWishlist: async (userId, productId) => {
    const checkQuery = `SELECT * FROM wishlists WHERE user_id = ? AND product_id = ?`;
    const [existing] = await db.query(checkQuery, [userId, productId]);
    if (existing.length === 0) {
      const insertQuery = `INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)`;
      await db.query(insertQuery, [userId, productId]);
      return true;
    }
    return false; // Already in wishlist
  },

  removeFromWishlist: async (userId, wishlistId) => {
    const query = `DELETE FROM wishlists WHERE user_id = ? AND id = ?`;
    await db.query(query, [userId, wishlistId]);
  },

  // --- Orders ---
  createOrder: async (userId, orderData) => {
    const { tracking_number, shipping_address, total_amount, items } = orderData;
    
    // Begin transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert Order
      const orderQuery = `INSERT INTO orders (user_id, tracking_number, shipping_address, total_amount) VALUES (?, ?, ?, ?)`;
      const [orderResult] = await connection.query(orderQuery, [userId, tracking_number, shipping_address, total_amount]);
      const orderId = orderResult.insertId;

      // Insert Order Items
      for (let item of items) {
        const itemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
        await connection.query(itemQuery, [orderId, item.product_id, item.quantity, item.price]);
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getOrderByTracking: async (trackingNumber) => {
    const query = `SELECT * FROM orders WHERE tracking_number = ?`;
    const [rows] = await db.query(query, [trackingNumber]);
    if (rows.length === 0) return null;

    const order = rows[0];
    const itemsQuery = `
      SELECT oi.*, p.name, p.image_url 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    const [items] = await db.query(itemsQuery, [order.id]);
    order.items = items;
    return order;
  },

  getUserOrders: async (userId) => {
    const query = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await db.query(query, [userId]);
    for (let i = 0; i < rows.length; i++) {
      const order = rows[i];
      const itemsQuery = `
        SELECT oi.*, p.name, p.image_url 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `;
      const [items] = await db.query(itemsQuery, [order.id]);
      order.items = items;
    }
    return rows;
  },

  updateOrderStatus: async (sellerId, orderId, status) => {
    // In a real app we'd verify the seller owns a product in the order.
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  },

  getSellerOrders: async (sellerId) => {
    // Return all orders containing products sold by this seller
    const query = `
      SELECT DISTINCT o.*, u.name as customer_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id
      WHERE p.seller_id = ?
    `;
    const [rows] = await db.query(query, [sellerId]);
    return rows;
  },

  // --- Admin Endpoints for Extended Tables ---

  getAdminSellers: async () => {
    const query = `
      SELECT s.id, s.logo, s.business_name as name, s.business_type as business, s.revenue, s.status, 
             s.trade_license as tradeLicense, s.nid_verified as nidVerified, s.bank_verified as bankVerified, 
             s.phone, s.joined_date as joined, u.email,
             (SELECT COUNT(*) FROM products p WHERE p.seller_id = s.user_id) as products,
             (SELECT COUNT(DISTINCT o.id) FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE p.seller_id = s.user_id) as orders
      FROM seller_profiles s
      JOIN users u ON s.user_id = u.id
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getAdminDeliveries: async () => {
    const query = `
      SELECT d.id, o.tracking_number as orderId, o.customer_name as customer, o.shipping_address as address, 
             d.courier, d.tracking_id as trackingId, d.status, d.estimated_date as estimatedDate, d.weight
      FROM marketplace_deliveries d
      JOIN orders o ON d.order_id = o.id
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getAdminPayments: async () => {
    const query = `
      SELECT p.id, s.business_name as seller, p.amount, p.method, p.status, p.request_date as requestDate, p.account_info as accountInfo
      FROM marketplace_payments p
      JOIN seller_profiles s ON p.seller_id = s.user_id
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getAdminComplaints: async () => {
    const query = `
      SELECT c.id, c.type, c.reporter, s.business_name as seller, p.name as product, c.priority, c.status, c.complaint_date as date, c.description
      FROM marketplace_complaints c
      LEFT JOIN seller_profiles s ON c.seller_id = s.user_id
      LEFT JOIN products p ON c.product_id = p.id
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getAdminReviews: async () => {
    const query = `
      SELECT r.id, u.name as customer, p.name as product, s.business_name as seller, r.rating, r.comment, r.review_date as date, r.status, r.helpful
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      JOIN seller_profiles s ON p.seller_id = s.user_id
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getAdminNotifications: async () => {
    const query = `
      SELECT id, type, title, message, time_display as time, is_read as \`read\`, priority
      FROM marketplace_notifications
      ORDER BY id ASC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getAdminAnalytics: async () => {
    const [[{totalRevenue}]] = await db.query("SELECT SUM(total_amount) as totalRevenue FROM orders");
    const [[{activeSellers}]] = await db.query("SELECT COUNT(*) as activeSellers FROM seller_profiles WHERE status = 'Active'");
    const [[{totalOrders}]] = await db.query("SELECT COUNT(*) as totalOrders FROM orders");
    const [[{pendingComplaints}]] = await db.query("SELECT COUNT(*) as pendingComplaints FROM marketplace_complaints WHERE status = 'Open'");
    
    return {
        totalRevenue: totalRevenue ? `৳${(totalRevenue/1000).toFixed(1)}k` : "৳0",
        activeSellers: activeSellers || 0,
        totalOrders: totalOrders || 0,
        pendingComplaints: pendingComplaints || 0,
        revenueData: [
            { month: "Jan", amount: 150000 },
            { month: "Feb", amount: 180000 },
            { month: "Mar", amount: 210000 },
            { month: "Apr", amount: 190000 },
            { month: "May", amount: 250000 },
            { month: "Jun", amount: 320000 }
        ]
    };
  }
};

module.exports = MarketplaceModel;
