require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function testUpdate() {
  try {
    const user_id = 902; // Assuming the user is 902 or similar
    // Let's just try to insert a dummy parent
    const [existingParent] = await pool.query('SELECT id FROM parents LIMIT 1');
    console.log("Existing parent:", existingParent);
    
    // Test the update query with a large photo
    const photo = "data:image/png;base64," + "A".repeat(500000); // 500kb
    await pool.query('UPDATE parents SET profile_photo = ? WHERE id = ?', [photo, existingParent[0]?.id || 1]);
    console.log("Update succeeded!");
    process.exit(0);
  } catch (err) {
    console.error("DB Update Error:", err);
    process.exit(1);
  }
}
testUpdate();
