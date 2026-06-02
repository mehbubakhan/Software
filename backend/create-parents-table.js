require('dotenv').config()
const mysql = require('mysql2/promise')

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true
    })
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS parents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        phone VARCHAR(50),
        address TEXT,
        emergency_contact VARCHAR(255),
        child_mode_pin VARCHAR(10),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log("parents table created")
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
run()
