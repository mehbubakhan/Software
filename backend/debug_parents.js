require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function debug() {
  try {
    const user_id = 902;
    const [parents] = await pool.query('SELECT * FROM parents');
    console.log("All parents:", parents);
    const [children] = await pool.query('SELECT * FROM children WHERE parent_id = ?', [user_id]);
    console.log("All children for 902:", children);
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
debug();
