const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedData() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true
    });

    console.log('Connected to DB. Starting seed...');

    // 1. Seed Users (We'll just insert a few basic ones and get their IDs, using IGNORE to avoid duplicates if email exists)
    await db.query(`
      INSERT IGNORE INTO users (name, email, password, role) VALUES 
      ('Admin Admin', 'superadmin@test.com', 'hashedpassword', 'admin'),
      ('Parent John', 'parent1@test.com', 'hashedpassword', 'parent'),
      ('Nanny Mary', 'nanny1@test.com', 'hashedpassword', 'nanny'),
      ('Daycare Center A', 'daycare1@test.com', 'hashedpassword', 'daycare'),
      ('Seller Bob', 'seller1@test.com', 'hashedpassword', 'marketplace_seller');
    `);

    // Get some user IDs to use for foreign keys
    const [[parent]] = await db.query("SELECT id FROM users WHERE role='parent' LIMIT 1");
    const [[nanny]] = await db.query("SELECT id FROM users WHERE role='nanny' LIMIT 1");
    const [[daycare]] = await db.query("SELECT id FROM users WHERE role='daycare' LIMIT 1");
    const [[seller]] = await db.query("SELECT id FROM users WHERE role='marketplace_seller' LIMIT 1");
    const [[admin]] = await db.query("SELECT id FROM users WHERE role='admin' LIMIT 1");

    const parentId = parent?.id || 1;
    const nannyId = nanny?.id || 2;
    const daycareId = daycare?.id || 3;
    const sellerId = seller?.id || 4;
    const adminId = admin?.id || 5;

    // 2. Seed Complaints
    await db.query(`
      INSERT INTO complaints (reporter_id, target_user_id, complaint_type, description, priority, status) VALUES 
      (?, ?, 'Safety Concern', 'Nanny arrived 30 mins late and was unresponsive.', 'High', 'Open'),
      (?, ?, 'Payment Issue', 'Daycare charged me twice for this month.', 'Normal', 'Resolved');
    `, [parentId, nannyId, parentId, daycareId]);

    // 3. Seed Emergency Alerts
    await db.query(`
      INSERT INTO emergency_alerts (user_id, nanny_id, type, location, message, status) VALUES 
      (?, ?, 'Medical', 'Dhaka, Gulshan-2', 'Child having severe allergic reaction.', 'Active'),
      (?, ?, 'Security', 'Dhaka, Banani', 'Suspicious person hanging around the daycare.', 'Active');
    `, [nannyId, nannyId, daycareId, nannyId]);

    // 4. Seed Seller Profile & Products (Marketplace)
    await db.query(`
      INSERT IGNORE INTO seller_profiles (user_id, business_name, business_type, revenue, status) VALUES 
      (?, 'Bob Toys Emporium', 'Toys & Games', '৳45,000', 'Active');
    `, [sellerId]);

    await db.query(`
      INSERT INTO products (seller_id, category_id, name, price, status, remaining, sold) VALUES 
      (?, 1, 'Educational Building Blocks', 1200.00, 'Active', 50, 12),
      (?, 1, 'Organic Baby Food', 450.00, 'Active', 200, 45);
    `, [sellerId, sellerId]);

    // 5. Seed Orphanage, Child, and Adoption Application (Adoption)
    await db.query(`
      INSERT INTO adoption_orphanages (orphanage_name, license_number, address, email, created_by) VALUES 
      ('Hope Orphanage', 'LIC-12345', 'Mirpur, Dhaka', 'hope@orphanage.org', ?);
    `, [adminId]);

    const [[orphanage]] = await db.query("SELECT id FROM adoption_orphanages ORDER BY id DESC LIMIT 1");
    const orphanageId = orphanage.id;

    await db.query(`
      INSERT INTO adoption_children (orphanage_id, child_name, age, gender, adoption_status) VALUES 
      (?, 'Little Sarah', '4', 'Female', 'meetup_phase'),
      (?, 'Baby Tom', '1', 'Male', 'available');
    `, [orphanageId, orphanageId]);

    const [[child]] = await db.query("SELECT id FROM adoption_children ORDER BY id DESC LIMIT 1");
    const childId = child.id;

    await db.query(`
      INSERT INTO adoption_applications (parent_id, child_id, orphanage_id, application_status, compatibility_score) VALUES 
      (?, ?, ?, 'meetup_phase', 85);
    `, [parentId, childId, orphanageId]);

    console.log('Seed data successfully inserted!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
