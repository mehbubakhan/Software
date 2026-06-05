const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'marketplace_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('✓ Connected to MySQL');

    await connection.query(schema);
    console.log('✓ Marketplace schema extended successfully');

    await connection.end();
    console.log('✓ Setup complete!');
  } catch (error) {
    console.error('Error setting up marketplace database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
