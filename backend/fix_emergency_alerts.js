const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixTable() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    const addCol = async (sql) => {
      try { await db.query(sql); } catch(e) {}
    };

    await addCol(`ALTER TABLE emergency_alerts ADD COLUMN user_id INT`);
    await addCol(`ALTER TABLE emergency_alerts ADD COLUMN type VARCHAR(100)`);
    await addCol(`ALTER TABLE emergency_alerts ADD COLUMN location VARCHAR(255)`);
    await addCol(`ALTER TABLE emergency_alerts ADD COLUMN message TEXT`);
    
    await db.query(`ALTER TABLE emergency_alerts MODIFY COLUMN status VARCHAR(50) DEFAULT 'Active'`);

    console.log('Fixed emergency_alerts table.');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
fixTable();
