require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function test() {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    console.log("Connected! Tables:", rows);
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}
test();
