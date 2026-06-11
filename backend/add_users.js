require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const pool = require('./config/db');

async function addUsers() {
  try {
    const bangladeshiNames = ['Rahim Uddin', 'Karim Hasan', 'Nasrin Akter'];
    for (let name of bangladeshiNames) {
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'nanny')",
        [name, name.replace(' ', '').toLowerCase() + '@example.com', '1234']
      );
    }
    console.log("Added Bangladeshi users!");
  } catch (err) {
    console.error("Error adding users:", err);
  }
  process.exit(0);
}

addUsers();
