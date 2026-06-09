require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')

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
    
    const sql = fs.readFileSync('admin_schema_updates.sql', 'utf8')
    await connection.query(sql)
    console.log("Admin tables created successfully.")
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
run()
