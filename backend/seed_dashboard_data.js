require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedDashboard() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log("Connected to DB. Starting dashboard data seeding...");

    // Get all parents
    const [parents] = await connection.query("SELECT id FROM users WHERE role = 'parent' OR id = 1");
    if (parents.length === 0) {
      console.log("No parents found.");
      process.exit(1);
    }

    for (const parent of parents) {
      const parentId = parent.id;
      console.log(`Seeding data for parent ID: ${parentId}`);

      // Insert children if not exists
      const [children] = await connection.query("SELECT id FROM children WHERE parent_id = ?", [parentId]);
      let childIds = children.map(c => c.id);
      
      if (childIds.length === 0) {
        const [res] = await connection.query(
          "INSERT IGNORE INTO children (parent_id, name, dob) VALUES (?, 'Demo Child', '2022-01-01')",
          [parentId]
        );
        childIds.push(res.insertId);
        await connection.query(
          "INSERT IGNORE INTO children (parent_id, name, dob) VALUES (?, 'Second Child', '2020-05-15')",
          [parentId]
        );
        childIds.push(res.insertId + 1);
      }

      // 1. Parent Job Posts (Active Bookings & Nannies Hired)
      await connection.query(
        "INSERT IGNORE INTO parent_job_posts (parent_id, title, child_age, status, salary_offered) VALUES (?, 'Need an evening sitter', '4 years', 'open', 20.00)",
        [parentId]
      );
      await connection.query(
        "INSERT IGNORE INTO parent_job_posts (parent_id, title, child_age, status, salary_offered) VALUES (?, 'Weekend Nanny Required', '4 years', 'filled', 25.00)",
        [parentId]
      );

      // 2. Orders
      await connection.query(
        "INSERT IGNORE INTO orders (user_id, status, total_amount, tracking_number, shipping_address) VALUES (?, 'Pending', 150.00, 'TRK-1001', '123 Main St, City')",
        [parentId]
      );
      await connection.query(
        "INSERT IGNORE INTO orders (user_id, status, total_amount, tracking_number, shipping_address) VALUES (?, 'Delivered', 45.00, 'TRK-1002', '123 Main St, City')",
        [parentId]
      );

      // 3. Adoption Meetups
      await connection.query(
        "INSERT IGNORE INTO adoption_meetups (created_by, meeting_type, meetup_date, meetup_time) VALUES (?, 'virtual', '2026-07-01', '10:00:00')",
        [parentId]
      );

      // 4. Daycare Daily Reports
      for (const childId of childIds) {
        await connection.query(
          "INSERT IGNORE INTO daycare_daily_reports (child_id, type, description) VALUES (?, 'meal', 'Ate full lunch')",
          [childId]
        );
        await connection.query(
          "INSERT IGNORE INTO daycare_daily_reports (child_id, type, description) VALUES (?, 'sleep', 'Napped for 2 hours')",
          [childId]
        );
        // 5. Activities
        await connection.query(
          "INSERT IGNORE INTO activities (child_id, nanny_id, type) VALUES (?, 3, 'Art class')",
          [childId]
        );
        await connection.query(
          "INSERT INTO activities (child_id, nanny_id, type) VALUES (?, 3, 'Outdoor play')",
          [childId]
        );
      }
    }

    console.log("Dashboard data seeded successfully.");
    await connection.end();
    process.exit(0);

  } catch (err) {
    console.error("Error seeding dashboard data:", err);
    process.exit(1);
  }
}

seedDashboard();
