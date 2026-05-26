const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true
    });
    
    const sqlPath = path.join(__dirname, 'adoption_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await connection.query(sql);
    console.log('Adoption schema executed successfully!');
    
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
