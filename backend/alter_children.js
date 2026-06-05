require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    await connection.query("ALTER TABLE daycare_children ADD COLUMN data JSON");
    console.log("Added JSON data column to daycare_children!");
    
    await connection.end();
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists.");
    } else {
      console.error(err);
    }
  }
}
run();
