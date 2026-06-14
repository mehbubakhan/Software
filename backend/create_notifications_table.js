require('dotenv').config();
const mysql = require('mysql2/promise');

async function createParentNotificationsTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log("Connected to DB. Creating parent_notifications table...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS parent_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        parent_id INT DEFAULT NULL,
        sender_role VARCHAR(50) DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_parent_id (parent_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    console.log("Table created successfully.");
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Error creating table:", err);
    process.exit(1);
  }
}

createParentNotificationsTable();
