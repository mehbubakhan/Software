require('dotenv').config()
const pool = require('./config/db')

async function testConnection() {
  try {
    console.log('Testing DB Connection...')
    console.log('Config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    })

    const connection = await pool.getConnection()
    console.log('Connected to database')

    const [rows] = await connection.query('SHOW TABLES')
    console.log('Tables in database:', rows.length)

    connection.release()
  } catch (error) {
    console.error('Connection error:', error.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

testConnection()
