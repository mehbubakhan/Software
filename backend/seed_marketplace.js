const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedMarketplace() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    console.log('✓ Connected to MySQL. Seeding marketplace data...');

    // We'll create some mock sellers as users first, if they don't exist
    const sellers = [
      { id: "S-001", name: "BabyWorld BD", email: "contact@babyworldbd.com", phone: "01711-234567" },
      { id: "S-002", name: "Tiny Tots Store", email: "admin@tinytots.bd", phone: "01822-345678" },
      { id: "S-003", name: "KidsCraft Ltd.", email: "info@kidscraft.bd", phone: "01933-456789" },
      { id: "S-004", name: "SafeBaby Shop", email: "safe@babysafety.bd", phone: "01644-567890" },
      { id: "S-005", name: "KidGear Emporium", email: "store@kidgear.bd", phone: "01755-678901" },
      { id: "S-006", name: "NurtureTech BD", email: "nurture@techbd.com", phone: "01866-789012" },
    ];

    const passwordHash = await bcrypt.hash('password123', 10);
    const sellerIdsMap = {};

    for (const seller of sellers) {
      const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [seller.email]);
      let userId;
      if (existing.length === 0) {
        const [res] = await connection.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [seller.name, seller.email, passwordHash, 'marketplace_seller']
        );
        userId = res.insertId;
      } else {
        userId = existing[0].id;
      }
      sellerIdsMap[seller.name] = userId;

      // Ensure seller profile exists
      const [prof] = await connection.query('SELECT id FROM seller_profiles WHERE user_id = ?', [userId]);
      if (prof.length === 0) {
        await connection.query(
          `INSERT INTO seller_profiles (user_id, logo, business_name, business_type, revenue, status, trade_license, nid_verified, bank_verified, phone, joined_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId, seller.name.substring(0, 2).toUpperCase(), seller.name, 'Retail', '৳0', 'Active', 
            true, true, true, seller.phone, new Date()
          ]
        );
      }
    }

    console.log('✓ Seller Profiles Seeded');

    // Create Category
    const [cats] = await connection.query('SELECT id FROM categories LIMIT 1');
    let category_id = 1;
    if (cats.length === 0) {
      const [res] = await connection.query('INSERT INTO categories (name, description) VALUES (?, ?)', ['General', 'General category']);
      category_id = res.insertId;
    } else {
      category_id = cats[0].id;
    }

    // Seed Products
    const productsData = [
      { name: "Wooden Learning Blocks Set", seller: "KidsCraft Ltd.", price: 850, stock: 200, sold: 156, remaining: 44, status: "Approved", ageGroup: "3-6 yrs", safetyStatus: "Safe", featured: true },
      { name: "Premium Toy Car Collection", seller: "BabyWorld BD", price: 1200, stock: 500, sold: 350, remaining: 150, status: "Approved", ageGroup: "4+ yrs", safetyStatus: "Safe", featured: false },
      { name: "Baby Bottle Set (4pc)", seller: "BabyWorld BD", price: 650, stock: 800, sold: 640, remaining: 160, status: "Approved", ageGroup: "0-2 yrs", safetyStatus: "Safe", featured: false },
      { name: "Children's Backpack — Galaxy", seller: "KidGear Emporium", price: 1450, stock: 300, sold: 210, remaining: 90, status: "Approved", ageGroup: "5-10 yrs", safetyStatus: "Safe", featured: true },
      { name: "Magnetic Drawing Board", seller: "NurtureTech BD", price: 980, stock: 150, sold: 87, remaining: 63, status: "Pending Review", ageGroup: "3+ yrs", safetyStatus: "Under Review", featured: false },
      { name: "Soft Plush Teddy Bear XL", seller: "Tiny Tots Store", price: 750, stock: 400, sold: 390, remaining: 10, status: "Out of Stock", ageGroup: "All Ages", safetyStatus: "Safe", featured: false },
      { name: "Baby Safety Gate", seller: "SafeBaby Shop", price: 3200, stock: 80, sold: 34, remaining: 46, status: "Suspended", ageGroup: "0-3 yrs", safetyStatus: "Unsafe", featured: false },
      { name: "Interactive Learning Tablet", seller: "NurtureTech BD", price: 4500, stock: 60, sold: 29, remaining: 31, status: "Pending Review", ageGroup: "4-10 yrs", safetyStatus: "Under Review", featured: false },
    ];

    const productIdsMap = {};

    for (const p of productsData) {
      const sId = sellerIdsMap[p.seller] || 1;
      const [existingP] = await connection.query('SELECT id FROM products WHERE name = ? AND seller_id = ?', [p.name, sId]);
      let pId;
      if (existingP.length === 0) {
        const [pres] = await connection.query(
          `INSERT INTO products (seller_id, category_id, name, description, price, stock, is_verified, status, age_group, safety_status, featured, sold, remaining)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [sId, category_id, p.name, p.name, p.price, p.stock, true, p.status, p.ageGroup, p.safetyStatus, p.featured, p.sold, p.remaining]
        );
        pId = pres.insertId;
      } else {
        pId = existingP[0].id;
      }
      productIdsMap[p.name] = pId;
    }
    
    console.log('✓ Products Seeded');

    // Create a buyer
    const [buyerSearch] = await connection.query('SELECT id FROM users WHERE email = ?', ['buyer@test.com']);
    let buyerId;
    if (buyerSearch.length === 0) {
      const [bres] = await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Fatima Rahman', 'buyer@test.com', passwordHash, 'parent']);
      buyerId = bres.insertId;
    } else {
      buyerId = buyerSearch[0].id;
    }

    // Seed Orders
    const ordersData = [
      { id: "ORD-2891", tracking: "PT2891004567", customer: "Fatima Rahman", amount: 2700, date: "2026-06-04", status: "Shipped", phone: "01711-111222", address: "Dhaka, Gulshan-2" }
    ];

    for (const o of ordersData) {
      const [oSearch] = await connection.query('SELECT id FROM orders WHERE tracking_number = ?', [o.tracking]);
      let orderId;
      if (oSearch.length === 0) {
        const [ores] = await connection.query(
          `INSERT INTO orders (user_id, tracking_number, status, shipping_address, total_amount, payment_status, delivery_status, phone, customer_name, order_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [buyerId, o.tracking, 'Placed', o.address, o.amount, 'Paid', o.status, o.phone, o.customer, new Date(o.date)]
        );
        orderId = ores.insertId;
      } else {
        orderId = oSearch[0].id;
      }
      
      // Deliveries
      await connection.query('DELETE FROM marketplace_deliveries WHERE tracking_id = ?', [o.tracking]);
      await connection.query(
        `INSERT INTO marketplace_deliveries (id, order_id, courier, tracking_id, status, estimated_date, weight)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [`DEL-${orderId}`, orderId, 'Pathao', o.tracking, o.status, new Date(), '1.2 kg']
      );
    }
    
    console.log('✓ Orders and Deliveries Seeded');
    
    // Seed Payments
    const payments = [
      { id: "WR-001", seller: "BabyWorld BD", amount: "৳45,000", method: "bKash", status: "Pending", accountInfo: "bKash: 01711-234567" }
    ];
    for (const pm of payments) {
      await connection.query('DELETE FROM marketplace_payments WHERE id = ?', [pm.id]);
      await connection.query(
        'INSERT INTO marketplace_payments (id, seller_id, amount, method, status, request_date, account_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [pm.id, sellerIdsMap[pm.seller] || 1, pm.amount, pm.method, pm.status, new Date(), pm.accountInfo]
      );
    }
    
    console.log('✓ Payments Seeded');

    // Seed Complaints
    const complaints = [
      { id: "CMP-001", type: "Unsafe Product", reporter: "Fatima Rahman", seller: "SafeBaby Shop", priority: "Critical", status: "Open", desc: "Gate collapsed causing minor injury to child." }
    ];
    for (const cmp of complaints) {
      await connection.query('DELETE FROM marketplace_complaints WHERE id = ?', [cmp.id]);
      await connection.query(
        'INSERT INTO marketplace_complaints (id, type, reporter, seller_id, priority, status, complaint_date, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [cmp.id, cmp.type, cmp.reporter, sellerIdsMap[cmp.seller] || 1, cmp.priority, cmp.status, new Date(), cmp.desc]
      );
    }
    
    console.log('✓ Complaints Seeded');
    
    // Seed Notifications
    const notifications = [
      { id: "N-001", type: "complaint", title: "Critical: Unsafe Product Report", message: "Product #P-449 has been reported.", time: "2 min ago", read: false, priority: "high" }
    ];
    for (const n of notifications) {
      await connection.query('DELETE FROM marketplace_notifications WHERE id = ?', [n.id]);
      await connection.query(
        'INSERT INTO marketplace_notifications (id, type, title, message, time_display, is_read, priority) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [n.id, n.type, n.title, n.message, n.time, n.read, n.priority]
      );
    }

    console.log('✓ Notifications Seeded');
    console.log('✓ Seeding complete!');

    await connection.end();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedMarketplace();
