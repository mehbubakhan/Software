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
    
    const [rows] = await connection.query("SHOW TABLES LIKE 'daycare_children'");
    if (rows.length > 0) {
      const [cols] = await connection.query("SHOW COLUMNS FROM daycare_children");
      console.log(cols.map(c => c.Field).join(", "));
    } else {
      console.log("Table does not exist");
    }
    
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}
run();
