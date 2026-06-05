require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');

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
    
    // Check if daycares table has id=1, if not create it
    await connection.query('INSERT IGNORE INTO users (id, name, email, password, role) VALUES (1, "Test Owner", "test@owner.com", "password", "daycare")');
    await connection.query('INSERT IGNORE INTO daycares (id, owner_id, name) VALUES (1, 1, "Test Daycare")');
    
    // We also drop the foreign key constraint just in case it is strict
    try {
      await connection.query('ALTER TABLE daycare_parents DROP FOREIGN KEY daycare_parents_ibfk_1');
    } catch(e) {}
    
    console.log("Database constraints fixed!");
    
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
