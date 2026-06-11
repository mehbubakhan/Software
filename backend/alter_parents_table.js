require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function alterTable() {
  try {
    console.log("Altering parents table...");
    await pool.query(`ALTER TABLE parents ADD COLUMN profile_photo LONGTEXT`);
    console.log("Parents table altered successfully.");
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists.");
      process.exit(0);
    }
    console.error("Error altering parents table:", error);
    process.exit(1);
  }
}

alterTable();
