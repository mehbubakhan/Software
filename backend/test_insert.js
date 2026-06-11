require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function testInsert() {
  try {
    const user_id = 902;
    await pool.query('INSERT INTO parents (user_id, phone, address, emergency_contact, child_mode_pin, profile_photo) VALUES (?, ?, ?, ?, ?, ?)', 
        [user_id, '123-456-7890', '123 Main St', 'Jane Doe', '1234', null]);
    console.log("Insert succeeded!");
  } catch (err) {
    console.error("DB Insert Error:", err);
  }
  process.exit(0);
}
testInsert();
