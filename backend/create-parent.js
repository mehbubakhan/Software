require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createParent() {
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
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('1234', salt);
    
    await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Test Parent', 'parent@gmail.com', hash, 'parent']);
    
    console.log('Parent user created: email=parent@gmail.com, password=1234');
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createParent();
