const mysql = require('mysql2/promise');
require('dotenv').config();

async function addCol() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.query('ALTER TABLE adoption_applications ADD COLUMN form_data JSON;');
    console.log('Successfully added form_data column to adoption_applications.');
    await connection.end();
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column already exists.');
    } else {
      console.error('Error:', err);
    }
  }
}
addCol();
