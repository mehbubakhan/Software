require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false }
    });

    console.log("Connected to DB. Starting seeding...");
    const passwordHash = await bcrypt.hash('password123', 10);

    // ═══════════════════════════════════════════════════
    // 1. USERS
    // ═══════════════════════════════════════════════════
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('DELETE FROM users');
    await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');
    const users = [
      ['System Admin',    'admin@smartnanny.com',   passwordHash, 'admin'],
      ['Sarah Rahman',    'parent@smartnanny.com',  passwordHash, 'parent'],
      ['Kamrun Nahar',    'nanny@smartnanny.com',   passwordHash, 'nanny'],
      ['Sunshine Daycare', 'daycare@smartnanny.com', passwordHash, 'daycare'],
      ['BabyWorld BD',    'seller@smartnanny.com',  passwordHash, 'marketplace_seller'],
      ['Greenfields Orphanage', 'orphanage@smartnanny.com', passwordHash, 'orphanage_manager'],
      ['Rahim Uddin',     'parent2@smartnanny.com', passwordHash, 'parent'],
      ['Deedhity Dhara',  'nanny2@smartnanny.com',  passwordHash, 'nanny'],
      ['Nusrat Parvin',   'nanny3@smartnanny.com',  passwordHash, 'nanny'],
      ['Little Stars Center', 'daycare2@smartnanny.com', passwordHash, 'daycare'],
      ['KidsCraft Ltd.',  'seller2@smartnanny.com', passwordHash, 'marketplace_seller'],
      ['KidGear Emporium','seller3@smartnanny.com', passwordHash, 'marketplace_seller'],
      ['Hope Orphanage',  'orphanage2@smartnanny.com', passwordHash, 'orphanage_manager'],
      ['Sadia Afrin',     'nanny4@smartnanny.com',  passwordHash, 'nanny'],
      ['Maria Mim',       'nanny5@smartnanny.com',  passwordHash, 'nanny'],
    ];
    await connection.query('INSERT INTO users (name, email, password, role) VALUES ?', [users]);
    console.log("✓ Seeded Users (15)");

    // ═══════════════════════════════════════════════════
    // 2. PARENTS
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM parents');
      await connection.query('ALTER TABLE parents AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO parents (user_id, phone, address, emergency_contact, child_mode_pin) VALUES
        (2, '01711-234567', 'House 12, Road 5, Gulshan-2, Dhaka', 'Fatima Rahman - 01822-345678', '1234'),
        (7, '01933-456789', 'Apt 4B, Banani DOHS, Dhaka',        'Nargis Begum - 01644-567890', '5678')
      `);
      console.log("✓ Seeded Parents (2)");
    } catch(e) { console.log("⚠ Parents:", e.message); }

    // ═══════════════════════════════════════════════════
    // 3. CHILDREN
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM children');
      await connection.query('ALTER TABLE children AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO children (name, dob, parent_id) VALUES
        ('Md Reza',       '2024-03-15', 2),
        ('Evan Jakaria',  '2022-06-20', 2),
        ('Anika Rahman',  '2023-01-10', 7),
        ('Farhan Uddin',  '2021-11-05', 7)
      `);
      console.log("✓ Seeded Children (4)");
    } catch(e) { console.log("⚠ Children:", e.message); }

    // ═══════════════════════════════════════════════════
    // 4. NANNY PROFILES (correct columns: experience_years, expected_salary, preferred_work_type, availability_status, verification_status)
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM nanny_profiles');
      await connection.query('ALTER TABLE nanny_profiles AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO nanny_profiles (user_id, experience_years, expected_salary, preferred_work_type, availability_status, verification_status, compatibility_score) VALUES
        (3,  4, 25000.00, 'full-time',  'Available', 'approved', 85),
        (8,  7, 40000.00, 'part-time',  'Available', 'approved', 90),
        (9,  3, 22000.00, 'full-time',  'Available', 'pending',  70),
        (14, 5, 28000.00, 'full-time',  'Working',   'approved', 80),
        (15, 6, 32000.00, 'part-time',  'Available', 'approved', 95)
      `);
      console.log("✓ Seeded Nanny Profiles (5)");
    } catch(e) { console.log("⚠ Nanny profiles:", e.message); }

    // ═══════════════════════════════════════════════════
    // 5. PARENT JOB POSTS
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM parent_job_posts');
      await connection.query('ALTER TABLE parent_job_posts AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO parent_job_posts (parent_id, title, child_age, salary_offered, schedule, location, special_requirements, status, created_at) VALUES
        (2, 'Need Loving Nanny for 2yo Boy',         '2 years',  18000, 'Mon-Fri 8 AM - 6 PM',    'Gulshan 2, Dhaka',   'CPR certified, infant care experience', 'open', NOW() - INTERVAL 2 HOUR),
        (2, 'Part-time Evening Care for Toddler',     '4 years',  12000, 'Mon-Wed-Fri 3 PM - 8 PM','Gulshan 2, Dhaka',   'Cooking skills, patience', 'open', NOW() - INTERVAL 5 HOUR),
        (7, 'Full-time Nanny for Infant',             '8 months', 15000, 'Mon-Fri 9 AM - 2 PM',    'Banani, Dhaka',      'Newborn experience, first aid', 'open', NOW() - INTERVAL 1 DAY),
        (7, 'Weekend Babysitter Needed',              '3 years',  8000,  'Sat-Sun 10 AM - 6 PM',   'Banani DOHS, Dhaka', 'Fun, energetic, good with toddlers', 'open', NOW() - INTERVAL 2 DAY),
        (2, 'After-school Care for Pre-schooler',     '4 years',  10000, 'Mon-Fri 2 PM - 7 PM',    'Gulshan, Dhaka',     'Teaching experience', 'closed', NOW() - INTERVAL 7 DAY)
      `);
      console.log("✓ Seeded Parent Job Posts (5)");
    } catch(e) { console.log("⚠ Parent job posts:", e.message); }

    // ═══════════════════════════════════════════════════
    // 6. MARKETPLACE — Categories & Products
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM order_items');
      await connection.query('DELETE FROM cart_items');
      await connection.query('DELETE FROM wishlists');
      await connection.query('DELETE FROM product_reviews');
      await connection.query('DELETE FROM products');
      await connection.query('DELETE FROM categories');
      await connection.query('ALTER TABLE categories AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO categories (name, description) VALUES
        ('Educational', 'Educational toys and learning materials'),
        ('Toys', 'Kids toys and games'),
        ('Baby Care', 'Essential baby care products'),
        ('Clothing', 'Kids clothing and accessories'),
        ('Baby Safety', 'Safety equipment for babies'),
        ('Educational Tech', 'Tech-based educational products')
      `);
      
      await connection.query('ALTER TABLE products AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO products (seller_id, category_id, name, description, price, stock, image_url, status) VALUES
        (5,  1, 'Wooden Learning Blocks Set',     'Colorful wooden blocks for early learning.',         850,  200, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80', 'active'),
        (5,  2, 'Premium Toy Car Collection',      'Set of 12 die-cast toy cars.',                       1200, 500, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&q=80', 'active'),
        (5,  3, 'Baby Bottle Set (4pc)',           'BPA-free baby bottles with anti-colic design.',       650,  800, 'https://images.unsplash.com/photo-1584839404785-3d5c5f468970?w=500&q=80', 'active'),
        (12, 4, 'Children Backpack Galaxy',         'Durable kids backpack with galaxy print.',            1450, 300, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', 'active'),
        (11, 1, 'Magnetic Drawing Board',          'Large magnetic drawing board for toddlers.',           980,  150, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80', 'active'),
        (5,  2, 'Soft Plush Teddy Bear XL',        'Extra-large plush teddy bear.',                       750,  400, 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=500&q=80', 'active'),
        (12, 5, 'Baby Safety Gate',                'Adjustable pressure-mount safety gate.',               3200, 80,  'https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=500&q=80', 'active'),
        (11, 6, 'Interactive Learning Tablet',     'Kid-safe tablet with educational games.',               4500, 60,  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80', 'active'),
        (5,  3, 'Organic Baby Food Set',           'Organic puree set with 6 flavors. No preservatives.',  1800, 120, 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&q=80', 'active'),
        (12, 4, 'Kids Winter Jacket Blue',         'Warm waterproof winter jacket.',                       2500, 95,  'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&q=80', 'active')
      `);
      console.log("✓ Seeded Categories (6) & Products (10)");
    } catch(e) { console.log("⚠ Products:", e.message); }

    // ═══════════════════════════════════════════════════
    // 7. ORDERS
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM orders');
      await connection.query('ALTER TABLE orders AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO orders (user_id, total_amount, status, tracking_number, shipping_address, created_at) VALUES
        (2, 2700, 'shipped',    'TRK8A4B2C1D', 'House 12, Road 5, Gulshan-2, Dhaka', NOW() - INTERVAL 1 DAY),
        (2, 850,  'delivered',  'TRK9E5F3G2H', 'House 12, Road 5, Gulshan-2, Dhaka', NOW() - INTERVAL 3 DAY),
        (7, 1450, 'confirmed',  'TRKAF6G4H3I', 'Apt 4B, Banani DOHS, Dhaka',         NOW() - INTERVAL 2 DAY),
        (7, 2250, 'pending',    'TRKBG7H5I4J', 'Apt 4B, Banani DOHS, Dhaka',         NOW() - INTERVAL 1 DAY),
        (2, 4500, 'refunded',   'TRKCH8I6J5K', 'House 12, Road 5, Gulshan-2, Dhaka', NOW() - INTERVAL 5 DAY),
        (7, 1600, 'packed',     'TRKDI9J7K6L', 'Apt 4B, Banani DOHS, Dhaka',         NOW() - INTERVAL 1 DAY)
      `);
      await connection.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
        (1, 3, 2, 650), (1, 2, 1, 1200), (2, 1, 1, 850), (3, 4, 1, 1450), (4, 6, 3, 750), (5, 8, 1, 4500), (6, 9, 1, 1800)
      `);
      console.log("✓ Seeded Orders (6) & Order Items (7)");
    } catch(e) { console.log("⚠ Orders:", e.message); }

    // ═══════════════════════════════════════════════════
    // 8. SELLER PROFILES (correct columns: business_name, logo, revenue, status, joined_date)
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM seller_profiles');
      await connection.query('ALTER TABLE seller_profiles AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO seller_profiles (user_id, business_name, business_type, phone, trade_license, nid_verified, bank_verified, status, logo, revenue, joined_date) VALUES
        (5,  'BabyWorld BD',     'Baby Products', '01711-234567', 1, 1, 1, 'Active',  'BW', '284000', '2024-01-15'),
        (11, 'KidsCraft Ltd.',   'Educational',   '01933-456789', 1, 1, 1, 'Active',  'KC', '67200',  '2024-06-10'),
        (12, 'KidGear Emporium', 'Kids Clothing', '01755-678901', 1, 1, 1, 'Active',  'KG', '521000', '2023-08-20')
      `);
      console.log("✓ Seeded Seller Profiles (3)");
    } catch(e) { console.log("⚠ Seller profiles:", e.message); }

    // ═══════════════════════════════════════════════════
    // 9. DAYCARES (correct daycare_packages type enum: 'hourly','daily','weekly','monthly')
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM daycare_daily_reports');
      await connection.query('DELETE FROM daycare_applications');
      await connection.query('DELETE FROM daycare_children');
      await connection.query('DELETE FROM daycare_staff');
      await connection.query('DELETE FROM daycare_transport');
      await connection.query('DELETE FROM daycare_packages');
      await connection.query('DELETE FROM daycares');
      await connection.query('ALTER TABLE daycares AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO daycares (owner_id, name, license, address, phone, email, working_hours, capacity, description) VALUES
        (4,  'Sunshine Daycare',    'LIC-2024-001', '456 Park Avenue, Gulshan, Dhaka',    '01711-111222', 'info@sunshinedaycare.com',  '7:00 AM - 6:00 PM', 50, 'A beautiful daycare providing safe, nurturing environment.'),
        (10, 'Little Stars Center', 'LIC-2024-002', '78 Banani Main Road, Banani, Dhaka', '01822-222333', 'info@littlestars.com',      '7:30 AM - 5:30 PM', 35, 'Premium childcare center with play-based learning.')
      `);
      
      await connection.query(`
        INSERT INTO daycare_packages (daycare_id, type, price, age_group, duration) VALUES
        (1, 'monthly', 1200.00, '2-5 years', 'Full Month'),
        (1, 'weekly',  400.00,  '2-5 years', 'Per Week'),
        (1, 'hourly',  15.00,   '2-5 years', 'Per Hour'),
        (2, 'monthly', 1100.00, '1-4 years', 'Full Month'),
        (2, 'weekly',  350.00,  '1-4 years', 'Per Week')
      `);

      // daycare_staff needs user_id, so create some dummy staff user entries first
      // We'll use user_id references (they don't need to be real users for mock staff)
      await connection.query(`
        INSERT INTO daycare_staff (daycare_id, user_id, role, phone, email) VALUES
        (1, 4,  'Director',         '01711-0201', 'patricia@sunshinedaycare.com'),
        (1, 4,  'Lead Teacher',     '01711-0202', 'jennifer@sunshinedaycare.com'),
        (1, 4,  'Assistant Teacher', '01711-0203', 'sarah@sunshinedaycare.com'),
        (2, 10, 'Director',         '01822-0301', 'lisa@littlestars.com'),
        (2, 10, 'Lead Teacher',     '01822-0302', 'emily@littlestars.com')
      `);

      // daycare_children needs parent_id (user_id) and package_id
      await connection.query(`
        INSERT INTO daycare_children (daycare_id, parent_id, child_name, child_age, package_id, status) VALUES
        (1, 2, 'Md Reza',       2, 1, 'active'),
        (1, 2, 'Evan Jakaria',  4, 1, 'active'),
        (1, 7, 'Anika Rahman',  3, 1, 'active'),
        (2, 7, 'Farhan Uddin',  5, 4, 'active'),
        (2, 2, 'Sophia Davis',  2, 4, 'active')
      `);

      // daycare_transport uses van_number instead of plate_number
      await connection.query(`
        INSERT INTO daycare_transport (daycare_id, van_number, driver_name, driver_phone, route, status) VALUES
        (1, 'DYC-001', 'Kevin Harris', '01711-0205', 'North Route: Gulshan to Banani',    'idle'),
        (1, 'DYC-002', 'Mark Evans',   '01711-0401', 'South Route: Dhanmondi to Mirpur',  'in_transit')
      `);

      console.log("✓ Seeded Daycares (2), Packages (5), Staff (5), Children (5), Transport (2)");
    } catch(e) { console.log("⚠ Daycares:", e.message); }

    // ═══════════════════════════════════════════════════
    // 10. ADOPTION
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM adoption_qa_responses');
      await connection.query('DELETE FROM adoption_meetings');
      try { await connection.query('DELETE FROM adoption_meetups'); } catch(e) {}
      await connection.query('DELETE FROM adoption_applications');
      await connection.query('DELETE FROM adoption_children');
      await connection.query('DELETE FROM adoption_orphanages');
      await connection.query('ALTER TABLE adoption_orphanages AUTO_INCREMENT = 1');
      // correct columns: orphanage_name, license_number, address, contact_number, email, description, verification_status, created_by
      await connection.query(`
        INSERT INTO adoption_orphanages (orphanage_name, created_by, verification_status, description, address, contact_number, email) VALUES
        ('Greenfields Orphanage Home', 6,  'verified', 'Providing hope and loving care for children since 2010.', 'Plot 5, Block D, Mohakhali, Dhaka', '01711-888999', 'info@greenfields.org'),
        ('Hope Orphanage',            13, 'verified', 'Dedicated to giving every child a chance at a bright future.', '23 Mirpur Road, Dhaka', '01822-777888', 'info@hopeorphanage.org')
      `);

      await connection.query('ALTER TABLE adoption_children AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO adoption_children (orphanage_id, child_name, age, gender, health_condition, interests, short_description, adoption_status) VALUES
        (1, 'Emma Stone',    '4 years', 'Female', 'Healthy',                'Painting, Building Blocks, Dancing',  'Cheerful and creative child who loves colors.', 'available'),
        (1, 'Liam Miller',   '3 years', 'Male',   'Healthy',                'Music, Puzzles, Cars',                'Curious and active boy who enjoys exploring.',  'available'),
        (1, 'Sophia Chen',   '5 years', 'Female', 'Mild asthma (managed)',  'Reading, Drawing, Nature',            'Gentle and thoughtful girl.',                   'under_review'),
        (2, 'Alex Rahman',   '6 years', 'Male',   'Healthy',                'Football, Drawing, Science',          'Energetic boy who dreams of being a scientist.','available'),
        (2, 'Maya Akter',    '2 years', 'Female', 'Healthy',                'Toys, Music, Dancing',                'Sweet little girl who lights up every room.',   'available'),
        (2, 'Arifin Hasan',  '7 years', 'Male',   'Healthy',                'Cricket, Computers, Legos',           'Smart and independent boy.',                    'available')
      `);

      await connection.query('ALTER TABLE adoption_applications AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO adoption_applications (parent_id, child_id, orphanage_id, application_status, compatibility_score, final_decision) VALUES
        (2, 1, 1, 'under_review', 85, 'Loving family of three seeking to welcome a daughter.'),
        (7, 4, 2, 'approved',     92, 'Experienced parents with excellent references.'),
        (2, 5, 2, 'under_review', 78, 'Family interested in adopting a younger child.')
      `);

      await connection.query('ALTER TABLE adoption_meetings AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO adoption_meetings (application_id, orphanage_id, meeting_type, meeting_link, scheduled_at, status) VALUES
        (1, 1, 'bonding',     'Greenfields Orphanage — Garden Area',  '2026-06-10 10:00:00', 'scheduled'),
        (2, 2, 'interview',   'Hope Orphanage — Play Room',           '2026-06-08 14:00:00', 'scheduled')
      `);
      console.log("✓ Seeded Adoption — Orphanages (2), Children (6), Applications (3), Meetings (2)");
    } catch(e) { console.log("⚠ Adoption:", e.message); }

    // ═══════════════════════════════════════════════════
    // 11. WORK SESSIONS (correct columns: nanny_id, job_id, parent_id, start_time, end_time, status)
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM work_sessions');
      await connection.query('ALTER TABLE work_sessions AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO work_sessions (nanny_id, parent_id, start_time, end_time, status) VALUES
        (3, 2, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY + INTERVAL 8 HOUR, 'completed'),
        (3, 2, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY + INTERVAL 6 HOUR, 'completed'),
        (3, 7, NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY + INTERVAL 5 HOUR, 'completed'),
        (3, 2, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY + INTERVAL 8 HOUR, 'completed'),
        (3, 7, NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY + INTERVAL 4 HOUR, 'completed'),
        (3, 2, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY + INTERVAL 8 HOUR,  'completed'),
        (8, 7, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY + INTERVAL 6 HOUR,  'completed'),
        (8, 2, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY + INTERVAL 5 HOUR,  'completed'),
        (3, 2, NOW(), NULL, 'active')
      `);
      console.log("✓ Seeded Work Sessions (9)");
    } catch(e) { console.log("⚠ Work sessions:", e.message); }

    // ═══════════════════════════════════════════════════
    // 12. EMERGENCY ALERTS (correct columns: nanny_id, session_id, category, location_lat, location_lng, status, resolution_notes)
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM emergency_alerts');
      await connection.query('ALTER TABLE emergency_alerts AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO emergency_alerts (nanny_id, category, location_lat, location_lng, status, resolution_notes, created_at) VALUES
        (3,  'medical', 23.79370000, 90.40660000, 'resolved', 'Child fell and has a minor bruise. First aid applied.', NOW() - INTERVAL 5 DAY),
        (8,  'medical', 23.78060000, 90.41930000, 'active',   'Child has a high fever. Requesting emergency pickup.',   NOW() - INTERVAL 30 MINUTE),
        (9,  'medical', 23.75110000, 90.39070000, 'active',   'Severe allergic reaction. Called ambulance.',             NOW() - INTERVAL 10 MINUTE)
      `);
      console.log("✓ Seeded Emergency Alerts / SOS (3)");
    } catch(e) { console.log("⚠ Emergency alerts:", e.message); }

    // ═══════════════════════════════════════════════════
    // 13. VERIFICATION DOCUMENTS (correct columns: user_id, doc_type, doc_url, status, uploaded_at)
    // doc_type enum: 'NID','selfie','police_clearance','medical','certificate','trade_license'
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('DELETE FROM verification_documents');
      await connection.query('ALTER TABLE verification_documents AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO verification_documents (user_id, doc_type, doc_url, status, uploaded_at) VALUES
        (3,  'NID',              'uploads/nid_kamrun.jpg',         'approved',  NOW() - INTERVAL 30 DAY),
        (3,  'police_clearance', 'uploads/police_kamrun.pdf',      'approved',  NOW() - INTERVAL 30 DAY),
        (8,  'NID',              'uploads/nid_deedhity.jpg',       'pending',   NOW() - INTERVAL 2 DAY),
        (8,  'medical',          'uploads/medical_deedhity.pdf',   'pending',   NOW() - INTERVAL 2 DAY),
        (9,  'NID',              'uploads/nid_nusrat.jpg',         'pending',   NOW() - INTERVAL 1 DAY),
        (9,  'police_clearance', 'uploads/police_nusrat.pdf',      'pending',   NOW() - INTERVAL 1 DAY),
        (9,  'selfie',           'uploads/selfie_nusrat.jpg',      'pending',   NOW() - INTERVAL 1 DAY),
        (14, 'NID',              'uploads/nid_sadia.jpg',          'approved',  NOW() - INTERVAL 15 DAY),
        (15, 'NID',              'uploads/nid_maria.jpg',          'approved',  NOW() - INTERVAL 20 DAY),
        (15, 'medical',          'uploads/medical_maria.pdf',      'approved',  NOW() - INTERVAL 20 DAY)
      `);
      console.log("✓ Seeded Verification Documents (10)");
    } catch(e) { console.log("⚠ Verification docs:", e.message); }

    // ═══════════════════════════════════════════════════
    // 14. PRODUCT REVIEWS
    // ═══════════════════════════════════════════════════
    try {
      await connection.query('ALTER TABLE product_reviews AUTO_INCREMENT = 1');
      await connection.query(`
        INSERT INTO product_reviews (product_id, user_id, rating, comment, created_at) VALUES
        (1, 2, 5, 'Excellent quality blocks! My son loves them.',                    NOW() - INTERVAL 3 DAY),
        (2, 7, 4, 'Good quality cars. Only minor issue was packaging.',               NOW() - INTERVAL 5 DAY),
        (3, 2, 5, 'Perfect baby bottles! Anti-colic design works great.',             NOW() - INTERVAL 2 DAY),
        (4, 7, 5, 'Beautiful design and very durable.',                               NOW() - INTERVAL 4 DAY),
        (6, 2, 3, 'Decent teddy bear but stuffing quality could be better.',          NOW() - INTERVAL 6 DAY)
      `);
      console.log("✓ Seeded Product Reviews (5)");
    } catch(e) { console.log("⚠ Product reviews:", e.message); }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    await connection.end();
    console.log("\n🎉 Seeding complete! All tables populated.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
    if (connection) await connection.end();
    process.exit(1);
  }
}

seed();
