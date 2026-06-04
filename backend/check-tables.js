require('dotenv').config();
const pool = require('./config/db');

async function checkTables() {
  try {
    const connection = await pool.getConnection();
    const [tables] = await connection.query('SHOW TABLES');
    console.log('=== ALL TABLES ===');
    tables.forEach(t => console.log(Object.values(t)[0]));
    console.log('\nTotal:', tables.length);
    
    // Check users table structure
    const [userCols] = await connection.query('DESCRIBE users');
    console.log('\n=== USERS COLUMNS ===');
    userCols.forEach(c => console.log(`  ${c.Field} (${c.Type}) ${c.Key}`));
    
    // Check user count
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log('\nUser count:', userCount[0].count);
    
    // List a few users
    const [users] = await connection.query('SELECT id, name, email, role FROM users LIMIT 10');
    console.log('\n=== SAMPLE USERS ===');
    users.forEach(u => console.log(`  ${u.id}: ${u.name} (${u.email}) - ${u.role}`));
    
    // Check key tables have data
    const keyTables = ['children', 'nanny_profiles', 'parent_job_posts', 'products', 'categories', 'daycares', 'adoption_orphanages', 'adoption_children', 'parents'];
    for (const table of keyTables) {
      try {
        const [count] = await connection.query(`SELECT COUNT(*) as c FROM ${table}`);
        console.log(`  ${table}: ${count[0].c} rows`);
      } catch(e) {
        console.log(`  ${table}: NOT FOUND`);
      }
    }
    
    connection.release();
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkTables();
