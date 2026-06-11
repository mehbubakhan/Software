require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const pool = require('./config/db')

async function run() {
  try {
    const [rows] = await pool.query('SELECT id, name, role, email FROM users WHERE name LIKE "%Mehbuba%" OR name LIKE "%Mehuba%" OR name LIKE "%Admin%"')
    console.log("Users:", rows)
  } catch (err) {
    console.log("Error details:", err)
  }
  process.exit(0)
}

run()
