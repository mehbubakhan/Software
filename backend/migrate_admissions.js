require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function migrate() {
  try {
    // Check if table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'admissions'");
    
    if (tables.length === 0) {
      console.log("Creating admissions table...");
      await pool.query(`
        CREATE TABLE admissions (
          id INT AUTO_INCREMENT PRIMARY KEY, 
          child_id INT, 
          parent_id INT, 
          daycare_id INT,
          status VARCHAR(50), 
          created_at DATETIME, 
          FOREIGN KEY(child_id) REFERENCES children(id), 
          FOREIGN KEY(parent_id) REFERENCES users(id)
        )
      `);
      console.log("Created table successfully.");
    } else {
      console.log("Table exists, adding daycare_id column if not exists...");
      try {
        await pool.query("ALTER TABLE admissions ADD COLUMN daycare_id INT");
        console.log("Added daycare_id column.");
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log("daycare_id column already exists.");
        } else {
          throw err;
        }
      }
    }
  } catch (err) {
    console.error("Migration failed:", err);
  }
  process.exit(0);
}

migrate();
