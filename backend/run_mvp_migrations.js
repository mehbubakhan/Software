require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
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
    
    console.log("Connected successfully.");

    const migrations = [
      '01_core_auth.sql',
      '02_family_system.sql',
      '03_child_profiles.sql',
      '04_messaging_scheduling.sql'
    ];

    for (const file of migrations) {
      console.log(`Running migration: ${file}...`);
      const sqlPath = path.join(__dirname, 'migrations', file);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await connection.query(sql);
      console.log(`Successfully ran ${file}`);
    }
    
    await connection.end();
    console.log("All migrations executed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error executing migrations:", err);
    process.exit(1);
  }
}

runMigrations();
