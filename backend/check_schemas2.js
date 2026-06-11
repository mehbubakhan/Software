require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function check() {
  try {
    for (const table of ['nanny_jobs', 'applications', 'admin_notifications', 'activities', 'daycare_daily_reports']) {
      const [rows] = await pool.query(`SHOW CREATE TABLE ${table}`);
      console.log(rows[0]['Create Table']);
    }
  } catch (err) {
    console.error(err.message);
  }
  process.exit(0);
}
check();
