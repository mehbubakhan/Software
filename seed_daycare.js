require('dotenv').config({path: 'backend/.env'});
const db = require('./backend/config/db.js');

async function seed() {
  try {
    await db.query(`INSERT IGNORE INTO users (id, name, email, password, role) VALUES (1, 'Test Parent', 'parent@test.com', '123', 'parent')`);
    await db.query(`INSERT IGNORE INTO daycares (id, owner_id, name) VALUES (1, 1, 'TinySteps Daycare')`);
    await db.query(`INSERT IGNORE INTO daycare_packages (id, daycare_id, type, price, age_group, duration, features) VALUES (1, 1, '1 Month', 750, 'All Ages', 'Monthly' , '[]')`);
    console.log('Seeded!');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

seed();
