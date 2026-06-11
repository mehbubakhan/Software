require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function fixFK() {
  try {
    await pool.query('ALTER TABLE parents DROP FOREIGN KEY parents_ibfk_1');
    console.log("Dropped FK constraint successfully");
  } catch (err) {
    console.log("Error or already dropped:", err.message);
  }
  process.exit(0);
}
fixFK();
