const db = require('../config/db')

const toJson = (value) => {
  if (value == null) return null
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

const fromJson = (value) => {
  if (!value) return null
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const normalizeOrphanage = (data = {}) => ({
  orphanage_name: data.orphanage_name || data.organizationName || data.name || 'Unnamed Orphanage',
  license_number: data.license_number || data.registrationNumber || null,
  address: data.address || null,
  contact_number: data.contact_number || data.contactNumber || null,
  email: data.email || null,
  description: data.description || null,
  verification_status: data.verification_status || 'pending',
  profile_image: data.profile_image || null,
  created_by: data.created_by,
})

const normalizeChild = (data = {}) => {
  // Extract known columns
  const knownKeys = ['orphanage_id', 'child_name', 'name', 'age', 'gender', 'health_condition', 'interests', 'short_description', 'description', 'profile_image', 'adoption_status'];
  
  // Put everything else in extra_details
  const extra_details = {};
  for (const key in data) {
    if (!knownKeys.includes(key) && key !== 'id') {
      extra_details[key] = data[key];
    }
  }

  return {
    orphanage_id: data.orphanage_id,
    child_name: data.child_name || data.name || 'Unnamed Child',
    age: data.age || null,
    gender: data.gender || null,
    health_condition: data.health_condition || null,
    interests: data.interests || null,
    short_description: data.short_description || data.description || null,
    profile_image: data.profile_image || null,
    adoption_status: data.adoption_status || 'available',
    extra_details: toJson(extra_details)
  };
}

const normalizeApplication = (data = {}, parentId) => ({
  parent_id: data.parent_id || parentId,
  child_id: data.child_id,
  orphanage_id: data.orphanage_id,
  application_status: data.application_status || 'pending',
  submitted_documents: toJson(data.submitted_documents || data.documents || null),
  form_data: toJson(data.form_data || null),
  meetup_count: data.meetup_count || 0,
  compatibility_score: data.compatibility_score || 0,
  final_decision: data.final_decision || null,
})

const mapChildRow = (row) => ({
  ...row,
  interests: row.interests || '',
  profile_image: row.profile_image || null,
  extra_details: fromJson(row.extra_details) || {},
})

const mapApplicationRow = (row) => ({
  ...row,
  submitted_documents: fromJson(row.submitted_documents),
  form_data: fromJson(row.form_data),
})

const Orphanage = {
  create: async (data) => {
    const payload = normalizeOrphanage(data)
    const [result] = await db.query(
      'INSERT INTO adoption_orphanages (orphanage_name, license_number, address, contact_number, email, description, verification_status, profile_image, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [payload.orphanage_name, payload.license_number, payload.address, payload.contact_number, payload.email, payload.description, payload.verification_status, payload.profile_image, payload.created_by]
    )
    return result.insertId
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM adoption_orphanages ORDER BY created_at DESC')
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM adoption_orphanages WHERE id = ?', [id])
    return rows[0] || null
  },

  findByUser: async (userId) => {
    const [rows] = await db.query('SELECT * FROM adoption_orphanages WHERE created_by = ? ORDER BY created_at DESC LIMIT 1', [userId])
    return rows[0] || null
  },

  updateStatus: async (id, status) => {
    await db.query('UPDATE adoption_orphanages SET verification_status = ? WHERE id = ?', [status, id])
  },

  update: async (id, data) => {
    const payload = normalizeOrphanage(data)
    await db.query(
      'UPDATE adoption_orphanages SET orphanage_name = ?, license_number = ?, address = ?, contact_number = ?, email = ?, description = ?, profile_image = ? WHERE id = ?',
      [payload.orphanage_name, payload.license_number, payload.address, payload.contact_number, payload.email, payload.description, payload.profile_image, id]
    )
  },
}

const Child = {
  create: async (data) => {
    const payload = normalizeChild(data)
    const [result] = await db.query(
      'INSERT INTO adoption_children (orphanage_id, child_name, age, gender, health_condition, interests, short_description, profile_image, adoption_status, extra_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [payload.orphanage_id, payload.child_name, payload.age, payload.gender, payload.health_condition, payload.interests, payload.short_description, payload.profile_image, payload.adoption_status, payload.extra_details]
    )
    return result.insertId
  },

  findAll: async () => {
    const [rows] = await db.query(
      `SELECT c.*, o.orphanage_name
       FROM adoption_children c
       JOIN adoption_orphanages o ON c.orphanage_id = o.id
       ORDER BY c.created_at DESC`
    )
    return rows.map(mapChildRow)
  },

  findByOrphanage: async (orphanageId) => {
    const [rows] = await db.query('SELECT * FROM adoption_children WHERE orphanage_id = ? ORDER BY created_at DESC', [orphanageId])
    return rows.map(mapChildRow)
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM adoption_children WHERE id = ?', [id])
    return rows[0] ? mapChildRow(rows[0]) : null
  },

  updateStatus: async (id, status) => {
    await db.query('UPDATE adoption_children SET adoption_status = ? WHERE id = ?', [status, id])
  },

  update: async (id, data) => {
    const payload = normalizeChild(data)
    await db.query(
      'UPDATE adoption_children SET child_name = ?, age = ?, gender = ?, health_condition = ?, interests = ?, short_description = ?, profile_image = ?, adoption_status = ?, extra_details = ? WHERE id = ?',
      [payload.child_name, payload.age, payload.gender, payload.health_condition, payload.interests, payload.short_description, payload.profile_image, payload.adoption_status, payload.extra_details, id]
    )
  },

  delete: async (id) => {
    await db.query('DELETE FROM adoption_children WHERE id = ?', [id])
  },
}

const Application = {
  create: async (data) => {
    const payload = normalizeApplication(data, data.parent_id)
    const [result] = await db.query(
      'INSERT INTO adoption_applications (parent_id, child_id, orphanage_id, application_status, submitted_documents, form_data, meetup_count, compatibility_score, final_decision) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [payload.parent_id, payload.child_id, payload.orphanage_id, payload.application_status, payload.submitted_documents, payload.form_data, payload.meetup_count, payload.compatibility_score, payload.final_decision]
    )
    return result.insertId
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM adoption_applications WHERE id = ?', [id])
    return rows[0] ? mapApplicationRow(rows[0]) : null
  },

  findByParent: async (parentId) => {
    const [rows] = await db.query(
      `SELECT a.*, c.child_name, c.age, c.gender, o.orphanage_name, u.name AS parent_name
       FROM adoption_applications a
       JOIN adoption_children c ON a.child_id = c.id
       JOIN adoption_orphanages o ON a.orphanage_id = o.id
       JOIN users u ON a.parent_id = u.id
       WHERE a.parent_id = ?
       ORDER BY a.created_at DESC`,
      [parentId]
    )
    return rows.map(mapApplicationRow)
  },

  findByOrphanage: async (orphanageId) => {
    const [rows] = await db.query(
      `SELECT a.*, c.child_name, c.age, c.gender, u.name AS parent_name
       FROM adoption_applications a
       JOIN adoption_children c ON a.child_id = c.id
       JOIN users u ON a.parent_id = u.id
       WHERE a.orphanage_id = ?
       ORDER BY a.created_at DESC`,
      [orphanageId]
    )
    return rows.map(mapApplicationRow)
  },

  updateStatus: async (id, status) => {
    await db.query('UPDATE adoption_applications SET application_status = ? WHERE id = ?', [status, id])
  },
  
  update: async (id, data) => {
    const payload = normalizeApplication(data, data.parent_id)
    await db.query(
      'UPDATE adoption_applications SET parent_id = ?, child_id = ?, orphanage_id = ?, application_status = ?, submitted_documents = ?, form_data = ?, meetup_count = ?, compatibility_score = ?, final_decision = ? WHERE id = ?',
      [payload.parent_id, payload.child_id, payload.orphanage_id, payload.application_status, payload.submitted_documents, payload.form_data, payload.meetup_count, payload.compatibility_score, payload.final_decision, id]
    )
  },

  updateCompatibility: async (id, score) => {
    await db.query('UPDATE adoption_applications SET compatibility_score = ? WHERE id = ?', [score, id])
  },
}

const Meetup = {
  create: async (data) => {
    const [result] = await db.query(
      'INSERT INTO adoption_meetups (application_id, meetup_date, meetup_time, location, meeting_type, notes, attendance_status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.application_id, data.meetup_date || null, data.meetup_time || null, data.location || null, data.meeting_type || 'in_person', data.notes || null, data.attendance_status || 'scheduled', data.created_by]
    )
    return result.insertId
  },

  findByApplication: async (applicationId) => {
    const [rows] = await db.query('SELECT * FROM adoption_meetups WHERE application_id = ? ORDER BY created_at DESC', [applicationId])
    return rows
  },

  updateStatus: async (id, status) => {
    await db.query('UPDATE adoption_meetups SET attendance_status = ? WHERE id = ?', [status, id])
  },
}

const QaResponse = {
  create: async (data) => {
    const [result] = await db.query(
      'INSERT INTO adoption_qa_responses (application_id, parent_questions, parent_answers, orphanage_observations) VALUES (?, ?, ?, ?)',
      [data.application_id, toJson(data.parent_questions || null), toJson(data.parent_answers || null), data.orphanage_observations || null]
    )
    return result.insertId
  },

  findByApplication: async (applicationId) => {
    const [rows] = await db.query('SELECT * FROM adoption_qa_responses WHERE application_id = ? ORDER BY submitted_at DESC', [applicationId])
    return rows.map(row => ({ ...row, parent_questions: fromJson(row.parent_questions), parent_answers: fromJson(row.parent_answers) }))
  },
}

const Document = {
  create: async (data) => {
    const [result] = await db.query(
      'INSERT INTO adoption_documents (application_id, doc_type, file_url, verification_status, verified_by) VALUES (?, ?, ?, ?, ?)',
      [data.application_id, data.doc_type, data.file_url, data.verification_status || 'pending', data.verified_by || null]
    )
    return result.insertId
  },

  findByApplication: async (applicationId) => {
    const [rows] = await db.query('SELECT * FROM adoption_documents WHERE application_id = ? ORDER BY created_at DESC', [applicationId])
    return rows
  },

  updateStatus: async (id, status, verifiedBy) => {
    await db.query('UPDATE adoption_documents SET verification_status = ?, verified_by = ? WHERE id = ?', [status, verifiedBy, id])
  },
}

module.exports = {
  Orphanage,
  Child,
  Application,
  Meetup,
  QaResponse,
  Document,
}