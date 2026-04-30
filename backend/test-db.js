require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    const connectionConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      multipleStatements: true
    };
    
    if (process.env.DB_PASSWORD) {
      connectionConfig.password = process.env.DB_PASSWORD;
    }
    
    const connection = await mysql.createConnection(connectionConfig);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // Get tables
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log('Tables in database:');
    tables.forEach(table => console.log('  -', Object.values(table)[0]));
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabase();
