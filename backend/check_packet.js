require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function test() {
  try {
    const [rows] = await pool.query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log(rows);
  } catch (err) {
    console.error("DB Query Error:", err);
  }
  process.exit(0);
}
test();
