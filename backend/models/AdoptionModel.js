const pool = require('../config/db');

const Orphanage = {
  create: async (data) => {
    const { orphanage_name, license_number, address, contact_number, email, description, created_by } = data;
    const [res] = await pool.query(
      'INSERT INTO adoption_orphanages (orphanage_name, license_number, address, contact_number, email, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orphanage_name, license_number, address, contact_number, email, description, created_by]
    );
    return res.insertId;
  },
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM adoption_orphanages');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM adoption_orphanages WHERE id = ?', [id]);
    return rows[0];
  },
  findByUser: async (userId) => {
    const [rows] = await pool.query('SELECT * FROM adoption_orphanages WHERE created_by = ?', [userId]);
    return rows[0];
  },
  updateStatus: async (id, status) => {
    await pool.query('UPDATE adoption_orphanages SET verification_status = ? WHERE id = ?', [status, id]);
  }
};

const Child = {
  create: async (data) => {
    const { orphanage_id, child_name, age, gender, health_condition, interests, short_description } = data;
    const [res] = await pool.query(
      'INSERT INTO adoption_children (orphanage_id, child_name, age, gender, health_condition, interests, short_description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orphanage_id, child_name, age, gender, health_condition, interests, short_description]
    );
    return res.insertId;
  },
  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT c.*, o.orphanage_name 
      FROM adoption_children c 
      JOIN adoption_orphanages o ON c.orphanage_id = o.id
    `);
    return rows;
  },
  findByOrphanage: async (orphanage_id) => {
    const [rows] = await pool.query('SELECT * FROM adoption_children WHERE orphanage_id = ?', [orphanage_id]);
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM adoption_children WHERE id = ?', [id]);
    return rows[0];
  },
  updateStatus: async (id, status) => {
    await pool.query('UPDATE adoption_children SET adoption_status = ? WHERE id = ?', [status, id]);
  }
};

const Application = {
  create: async (data) => {
    const { parent_id, child_id, orphanage_id, submitted_documents } = data;
    const [res] = await pool.query(
      'INSERT INTO adoption_applications (parent_id, child_id, orphanage_id, submitted_documents) VALUES (?, ?, ?, ?)',
      [parent_id, child_id, orphanage_id, JSON.stringify(submitted_documents)]
    );
    return res.insertId;
  },
  findByParent: async (parent_id) => {
    const [rows] = await pool.query(`
      SELECT a.*, c.child_name, c.age, c.gender, o.orphanage_name 
      FROM adoption_applications a
      JOIN adoption_children c ON a.child_id = c.id
      JOIN adoption_orphanages o ON a.orphanage_id = o.id
      WHERE a.parent_id = ?
    `, [parent_id]);
    return rows;
  },
  findByOrphanage: async (orphanage_id) => {
    const [rows] = await pool.query(`
      SELECT a.*, c.child_name, c.age, c.gender, u.name as parent_name, u.email as parent_email 
      FROM adoption_applications a
      JOIN adoption_children c ON a.child_id = c.id
      JOIN users u ON a.parent_id = u.id
      WHERE a.orphanage_id = ?
    `, [orphanage_id]);
    return rows;
  },
  updateStatus: async (id, status) => {
    await pool.query('UPDATE adoption_applications SET application_status = ? WHERE id = ?', [status, id]);
  },
  updateCompatibility: async (id, score) => {
    await pool.query('UPDATE adoption_applications SET compatibility_score = ? WHERE id = ?', [score, id]);
  }
};

const Meetup = {
  create: async (data) => {
    const { application_id, meetup_date, meetup_time, location, meeting_type, created_by } = data;
    const [res] = await pool.query(
      'INSERT INTO adoption_meetups (application_id, meetup_date, meetup_time, location, meeting_type, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [application_id, meetup_date, meetup_time, location, meeting_type, created_by]
    );
    return res.insertId;
  },
  findByApplication: async (application_id) => {
    const [rows] = await pool.query('SELECT * FROM adoption_meetups WHERE application_id = ?', [application_id]);
    return rows;
  },
  updateStatus: async (id, status) => {
    await pool.query('UPDATE adoption_meetups SET attendance_status = ? WHERE id = ?', [status, id]);
  }
};

const QaResponse = {
  create: async (data) => {
    const { application_id, parent_questions, parent_answers, orphanage_observations } = data;
    const [res] = await pool.query(
      'INSERT INTO adoption_qa_responses (application_id, parent_questions, parent_answers, orphanage_observations) VALUES (?, ?, ?, ?)',
      [application_id, JSON.stringify(parent_questions), JSON.stringify(parent_answers), orphanage_observations]
    );
    return res.insertId;
  },
  findByApplication: async (application_id) => {
    const [rows] = await pool.query('SELECT * FROM adoption_qa_responses WHERE application_id = ?', [application_id]);
    return rows;
  }
};

module.exports = {
  Orphanage,
  Child,
  Application,
  Meetup,
  QaResponse
};
