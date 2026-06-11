require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function createTable() {
  try {
    console.log("Creating parents table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        phone VARCHAR(20),
        address VARCHAR(255),
        emergency_contact VARCHAR(255),
        child_mode_pin VARCHAR(10),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Parents table created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating parents table:", error);
    process.exit(1);
  }
}

createTable();
