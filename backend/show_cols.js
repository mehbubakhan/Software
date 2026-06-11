require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function showCols() {
  try {
    const [rows] = await pool.query('SHOW COLUMNS FROM users');
    console.log(rows);
  } catch(e) {
    console.log(e);
  }
  process.exit(0);
}
showCols();
