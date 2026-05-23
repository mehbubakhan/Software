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
  }
};

module.exports = MarketplaceModel;
