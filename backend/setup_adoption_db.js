require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  
  try {
    console.log('Running database updates for Adoption Module...');

    // 1. Update adoption_children table
    const addColumn = async (colDef) => {
      try {
        await connection.execute(`ALTER TABLE adoption_children ADD COLUMN ${colDef}`);
      } catch (e) {
        if (e.code !== 'ER_DUP_FIELDNAME') console.error('Column err:', e.message);
      }
    };
    await addColumn('education_level VARCHAR(255)');
    await addColumn('personality TEXT');
    await addColumn('interests JSON');
    await addColumn('visibility BOOLEAN DEFAULT TRUE');
    await addColumn('archived BOOLEAN DEFAULT FALSE');
    console.log('Updated adoption_children table.');

    // 2. Create adoption_meetings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS adoption_meetings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        orphanage_id INT NOT NULL,
        meeting_type ENUM('interview', 'bonding', 'counselling', 'legal') NOT NULL,
        meeting_link TEXT,
        scheduled_at DATETIME NOT NULL,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created adoption_meetings table.');

    // 3. Create adoption_counselling_reports table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS adoption_counselling_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        counsellor_id INT,
        readiness_score INT,
        bonding_score INT,
        notes TEXT,
        recommendation ENUM('approved', 'needs_more_sessions', 'rejected'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created adoption_counselling_reports table.');

    // 4. Create adoption_staff table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS adoption_staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orphanage_id INT NOT NULL,
        user_id INT NOT NULL,
        role ENUM('staff', 'counsellor', 'legal_officer', 'verification_officer') NOT NULL,
        permissions JSON,
        status ENUM('active', 'suspended') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created adoption_staff table.');

    // 5. Create adoption_reports table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS adoption_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orphanage_id INT NOT NULL,
        reporter_id INT NOT NULL,
        report_type ENUM('fraud', 'abuse', 'emergency', 'technical') NOT NULL,
        description TEXT NOT NULL,
        evidence_url TEXT,
        status ENUM('pending', 'investigating', 'resolved') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created adoption_reports table.');

    console.log('Database updates completed successfully!');
  } catch (err) {
    console.error('Error during database update:', err);
  } finally {
    await connection.end();
  }
}

run();
