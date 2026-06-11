require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function testUsers() {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users ORDER BY id DESC LIMIT 5');
    console.log(rows);
  } catch (err) {
    console.error("DB Query Error:", err);
  }
  process.exit(0);
}
testUsers();
