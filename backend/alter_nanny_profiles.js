require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function alterTable() {
  const columns = [
    'name VARCHAR(255)',
    'phone VARCHAR(255)',
    'dob VARCHAR(255)',
    'nationalId VARCHAR(255)',
    'nationality VARCHAR(255)',
    'address VARCHAR(255)',
    'city VARCHAR(255)',
    'state VARCHAR(255)',
    'zipCode VARCHAR(255)',
    'gender VARCHAR(50)',
    'workPreference VARCHAR(100)',
    'languagesSpoken TEXT'
  ];

  try {
    for (const col of columns) {
      const [colName] = col.split(' ');
      try {
        await pool.query(`ALTER TABLE nanny_profiles ADD COLUMN ${col}`);
        console.log(`Added column ${colName}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column ${colName} already exists, skipping.`);
        } else {
          throw err;
        }
      }
    }
    console.log('Successfully altered nanny_profiles table');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    process.exit();
  }
}

alterTable();
