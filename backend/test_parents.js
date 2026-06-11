require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function testParents() {
  try {
    const [rows] = await pool.query('SELECT id, user_id, phone, address FROM parents');
    console.log(rows);
  } catch (err) {
    console.error("DB Query Error:", err);
  }
  process.exit(0);
}
testParents();
