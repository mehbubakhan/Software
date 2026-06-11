require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function fix() {
  try {
    const [rows] = await pool.query("SHOW CREATE TABLE children");
    console.log(rows[0]['Create Table']);
    await pool.query("ALTER TABLE children DROP FOREIGN KEY children_ibfk_1");
    console.log("Dropped children FK successfully");
  } catch (err) {
    console.error("Error:", err.message);
  }
  process.exit(0);
}
fix();
