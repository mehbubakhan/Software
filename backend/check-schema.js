require('dotenv').config();
const pool = require('./config/db');

async function checkSchema() {
  try {
    const conn = await pool.getConnection();
    
    const tables = ['nanny_profiles', 'seller_profiles', 'daycare_packages', 'adoption_orphanages', 'work_sessions', 'emergency_alerts', 'verification_documents', 'daycares', 'daycare_staff', 'daycare_children', 'daycare_transport', 'daycare_daily_reports', 'daycare_applications'];
    
    for (const table of tables) {
      try {
        const [cols] = await conn.query(`DESCRIBE ${table}`);
        console.log(`\n=== ${table} ===`);
        cols.forEach(c => console.log(`  ${c.Field} (${c.Type}) ${c.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${c.Key || ''} ${c.Default ? 'def=' + c.Default : ''}`));
      } catch(e) {
        console.log(`\n=== ${table} === NOT FOUND`);
      }
    }
    
    conn.release();
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkSchema();
