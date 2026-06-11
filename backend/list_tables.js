require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function list() {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
list();
