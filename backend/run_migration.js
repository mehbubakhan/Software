require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

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
    
    const sqlPath = path.join(__dirname, 'migrations/20260605_daycare_parents.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await connection.query(sql);
    console.log("Migration executed successfully!");
    
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Error executing migration:", err);
    process.exit(1);
  }
}

run();
