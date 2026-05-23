require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUsers() {
  try {
    const connectionConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      multipleStatements: true
    };
    
    if (process.env.DB_PASSWORD) {
      connectionConfig.password = process.env.DB_PASSWORD;
    }
    
    const connection = await mysql.createConnection(connectionConfig);
    const [users] = await connection.query('SELECT id, name, email, role FROM users');
    
    console.log('Users in database:');
    console.table(users);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUsers();
