require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    console.log("Connecting to database at", process.env.DB_HOST);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true
    });
    
    console.log("Connected successfully. Reading SQL file...");
    const sqlPath = path.join(__dirname, '../daycare_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log("Executing SQL...");
    await connection.query(sql);
    console.log("SQL executed successfully!");
    
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Error executing SQL:", err);
    process.exit(1);
  }
}

run();
