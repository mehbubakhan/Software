require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function checkSchemas() {
  try {
    for (const table of ['jobs', 'parent_job_posts', 'orders', 'order_items', 'adoption_meetups']) {
      const [rows] = await pool.query(`SHOW CREATE TABLE ${table}`);
      console.log(rows[0]['Create Table']);
    }
  } catch (err) {
    console.error(err.message);
  }
  process.exit(0);
}
checkSchemas();
