const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function setupDatabase() {
  try {
    // Read the schema file
    const schema = fs.readFileSync('../daycare_schema.sql', 'utf8');
    
    // Create connection
    const connectionConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      multipleStatements: true
    };
    
    if (process.env.DB_PASSWORD) {
      connectionConfig.password = process.env.DB_PASSWORD;
    }
    
    const connection = await mysql.createConnection(connectionConfig);

    console.log('✓ Connected to MySQL');

    // Execute schema
    await connection.query(schema);
    console.log('✓ Database schema imported successfully');

    await connection.end();
    console.log('✓ Setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
