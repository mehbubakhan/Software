// In-memory mock DB to bypass PROTOCOL_CONNECTION_LOST on Railway
let orphanages = [{ id: 1, orphanage_name: 'Hope Orphanage', verification_status: 'Pending', created_by: 1 }];
let children = [
  { id: 1, orphanage_id: 1, child_name: 'Lucas', age: '5 years', gender: 'Male', health_condition: 'Healthy', interests: 'Drawing, Cars', short_description: 'A very creative and energetic boy.', adoption_status: 'available' },
  { id: 2, orphanage_id: 1, child_name: 'Mia', age: '3 years', gender: 'Female', health_condition: 'Asthma (Mild)', interests: 'Dolls, Reading', short_description: 'Sweet and loves storytime.', adoption_status: 'under_review' }
];
let applications = [
  { id: 1, parent_id: 2, child_id: 1, orphanage_id: 1, application_status: 'Pending', compatibility_score: 0, submitted_documents: {} },
  { id: 2, parent_id: 3, child_id: 2, orphanage_id: 1, application_status: 'Evaluation Ongoing', compatibility_score: 65, submitted_documents: {} }
];
let meetups = [];
let qaResponses = [];

let idCounters = { orphanage: 2, child: 3, application: 3, meetup: 1, qa: 1 };

const Orphanage = {
  create: async (data) => {
    const id = idCounters.orphanage++;
    orphanages.push({ id, verification_status: 'Pending', ...data });
    return id;
  },
  findAll: async () => orphanages,
  findById: async (id) => orphanages.find(o => o.id == id),
  findByUser: async (userId) => orphanages.find(o => o.created_by == userId),
  updateStatus: async (id, status) => {
    const o = orphanages.find(o => o.id == id);
    if(o) o.verification_status = status;
  }
};

const Child = {
  create: async (data) => {
    const id = idCounters.child++;
    children.push({ id, adoption_status: 'available', ...data });
    return id;
  },
  findAll: async () => children.map(c => ({...c, orphanage_name: orphanages.find(o => o.id == c.orphanage_id)?.orphanage_name })),
  findByOrphanage: async (orphanage_id) => children.filter(c => c.orphanage_id == orphanage_id),
  findById: async (id) => children.find(c => c.id == id),
  updateStatus: async (id, status) => {
    const c = children.find(c => c.id == id);
    if(c) c.adoption_status = status;
  }
};

const Application = {
  create: async (data) => {
    const id = idCounters.application++;
    applications.push({ id, application_status: 'Pending', compatibility_score: 0, ...data });
    return id;
  },
  findByParent: async (parent_id) => {
    return applications.filter(a => a.parent_id == parent_id).map(a => {
      const c = children.find(ch => ch.id == a.child_id) || {};
      const o = orphanages.find(or => or.id == a.orphanage_id) || {};
      return { ...a, child_name: c.child_name, age: c.age, gender: c.gender, orphanage_name: o.orphanage_name };
    });
  },
  findByOrphanage: async (orphanage_id) => {
    return applications.filter(a => a.orphanage_id == orphanage_id).map(a => {
      const c = children.find(ch => ch.id == a.child_id) || {};
      return { ...a, child_name: c.child_name, age: c.age, gender: c.gender, parent_name: 'Parent ID: ' + a.parent_id };
    });
  },
  updateStatus: async (id, status) => {
    const a = applications.find(a => a.id == id);
    if(a) a.application_status = status;
  },
  updateCompatibility: async (id, score) => {
    const a = applications.find(a => a.id == id);
    if(a) a.compatibility_score = score;
  }
};

const Meetup = {
  create: async (data) => {
    const id = idCounters.meetup++;
    meetups.push({ id, attendance_status: 'Scheduled', ...data });
    return id;
  },
  findByApplication: async (application_id) => meetups.filter(m => m.application_id == application_id),
  updateStatus: async (id, status) => {
    const m = meetups.find(m => m.id == id);
    if(m) m.attendance_status = status;
  }
};

const QaResponse = {
  create: async (data) => {
    const id = idCounters.qa++;
    qaResponses.push({ id, ...data });
    return id;
  },
  findByApplication: async (application_id) => qaResponses.filter(q => q.application_id == application_id)
};

const Document = {
  create: async (data) => {
    const { application_id, doc_type, file_url } = data;
    const [res] = await pool.query(
      'INSERT INTO adoption_documents (application_id, doc_type, file_url) VALUES (?, ?, ?)',
      [application_id, doc_type, file_url]
    );
    return res.insertId;
  },
  findByApplication: async (application_id) => {
    const [rows] = await pool.query('SELECT * FROM adoption_documents WHERE application_id = ?', [application_id]);
    return rows;
  },
  updateStatus: async (id, status, verified_by) => {
    await pool.query('UPDATE adoption_documents SET verification_status = ?, verified_by = ? WHERE id = ?', [status, verified_by, id]);
  }
};

module.exports = {
  Orphanage,
  Child,
  Application,
  Meetup,
  QaResponse,
  Document
};
