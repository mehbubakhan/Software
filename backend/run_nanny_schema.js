require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true
    })
    
    const sql = fs.readFileSync('nanny_schema_updates.sql', 'utf8')
    await connection.query(sql)
    console.log("Nanny tables created.")

    // Add columns to nanny_profiles safely
    const addColumn = async (table, col, def) => {
      try {
        await connection.query(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`)
        console.log(`Added ${col} to ${table}`)
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`${col} already exists in ${table}`)
        } else {
          console.error(`Error adding ${col}: ${err.message}`)
        }
      }
    }

    await addColumn('nanny_profiles', 'trust_score', 'DECIMAL(3,2) DEFAULT 0.00')
    await addColumn('nanny_profiles', 'compatibility_score', 'INT DEFAULT 0')
    await addColumn('nanny_profiles', 'wellness_status', 'VARCHAR(50) DEFAULT "good"')
    await addColumn('nanny_profiles', 'badges', 'JSON')

    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
run()
