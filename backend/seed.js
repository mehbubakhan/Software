require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log("Connected to DB. Starting seeding...");

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Users
    const users = [
      ['admin', 'admin@test.com', passwordHash, 'admin'],
      ['parent1', 'parent@test.com', passwordHash, 'parent'],
      ['nanny1', 'nanny@test.com', passwordHash, 'nanny'],
      ['daycare1', 'daycare@test.com', passwordHash, 'daycare'],
      ['seller1', 'seller@test.com', passwordHash, 'seller'],
      ['orphanage_mgr', 'orphanage@test.com', passwordHash, 'orphanageManager']
    ];
    
    await connection.query('DELETE FROM users');
    await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');
    const [userRes] = await connection.query('INSERT INTO users (name, email, password, role) VALUES ?', [users]);
    console.log("Seeded Users");

    // 2. Categories & Products
    await connection.query('DELETE FROM categories');
    await connection.query('ALTER TABLE categories AUTO_INCREMENT = 1');
    await connection.query("INSERT INTO categories (name, description) VALUES ('Toys', 'Kids Toys'), ('Clothes', 'Kids Clothes')");
    
    await connection.query('DELETE FROM products');
    await connection.query('ALTER TABLE products AUTO_INCREMENT = 1');
    await connection.query(`
      INSERT INTO products (seller_id, category_id, name, description, price, stock, image_url) 
      VALUES 
      (5, 1, 'Lego Set', 'Building blocks', 49.99, 10, 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500&q=80'),
      (5, 2, 'Winter Jacket', 'Warm jacket for kids', 29.99, 5, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&q=80')
    `);
    console.log("Seeded Marketplace");

    // 3. Daycares
    await connection.query('DELETE FROM daycares');
    await connection.query('ALTER TABLE daycares AUTO_INCREMENT = 1');
    await connection.query(`
      INSERT INTO daycares (owner_id, name, license, address, phone, email, working_hours, capacity, description)
      VALUES (4, 'Sunshine Daycare', 'LIC-123', '123 Sunshine Rd', '555-1234', 'info@sunshinedaycare.com', '8 AM - 6 PM', 50, 'A beautiful daycare for kids.')
    `);
    await connection.query('DELETE FROM daycare_packages');
    await connection.query('ALTER TABLE daycare_packages AUTO_INCREMENT = 1');
    await connection.query(`
      INSERT INTO daycare_packages (daycare_id, type, price, age_group, duration)
      VALUES (1, 'monthly', 500.00, '3-5 years', 'Full Month')
    `);
    console.log("Seeded Daycares");

    // 4. Orphanages & Children
    await connection.query('DELETE FROM adoption_orphanages');
    await connection.query('ALTER TABLE adoption_orphanages AUTO_INCREMENT = 1');
    await connection.query(`
      INSERT INTO adoption_orphanages (orphanage_name, created_by, verification_status, description)
      VALUES ('Hope Orphanage', 6, 'verified', 'Providing hope and home.')
    `);
    
    await connection.query('DELETE FROM adoption_children');
    await connection.query('ALTER TABLE adoption_children AUTO_INCREMENT = 1');
    await connection.query(`
      INSERT INTO adoption_children (orphanage_id, child_name, age, gender, short_description)
      VALUES (1, 'Alex', '5 years', 'Male', 'A sweet boy who loves to draw.')
    `);
    console.log("Seeded Adoption");

    // 5. Nanny Profiles & Jobs
    await connection.query('DELETE FROM nanny_profiles');
    await connection.query('ALTER TABLE nanny_profiles AUTO_INCREMENT = 1');
    await connection.query(`
      INSERT INTO nanny_profiles (user_id, experience_years, expected_salary, preferred_work_type)
      VALUES (3, 5, 20.00, 'part-time')
    `);
    
    await connection.query('DELETE FROM parent_job_posts');
    await connection.query('ALTER TABLE parent_job_posts AUTO_INCREMENT = 1');
    await connection.query(`
      INSERT INTO parent_job_posts (parent_id, title, child_age, salary_offered)
      VALUES (2, 'Looking for an evening nanny', '4 years', 25.00)
    `);
    console.log("Seeded Nanny & Jobs");

    await connection.end();
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DB:", err);
    process.exit(1);
  }
}

seed();
