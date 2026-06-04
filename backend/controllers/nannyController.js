const pool = require('../config/db')

let mockNannyProfiles = {}
let mockNannyAvailability = {}

const saveProfile = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const { experience_years, expected_salary, preferred_work_type, availability_status } = req.body
    
    const [rows] = await pool.query('SELECT id FROM nanny_profiles WHERE user_id = ?', [nanny_id])
    if (rows.length > 0) {
      await pool.query('UPDATE nanny_profiles SET experience_years = ?, expected_salary = ?, preferred_work_type = ?, availability_status = ? WHERE user_id = ?', 
        [experience_years, expected_salary, preferred_work_type, availability_status, nanny_id])
    } else {
      await pool.query('INSERT INTO nanny_profiles (user_id, experience_years, expected_salary, preferred_work_type, availability_status) VALUES (?, ?, ?, ?, ?)', 
        [nanny_id, experience_years, expected_salary, preferred_work_type, availability_status])
    }
    return res.json({ ok:true, data: { user_id: nanny_id, experience_years, expected_salary, preferred_work_type, availability_status } })
  } catch (err) {
    const nanny_id = req.user.id
    return res.json({ ok:true, mock: true }) 
  }
}

const getProfile = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const [rows] = await pool.query(`
      SELECT np.*, u.name, u.email 
      FROM nanny_profiles np 
      JOIN users u ON np.user_id = u.id 
      WHERE user_id = ?
    `, [nanny_id])
    if (rows.length === 0) return res.json({ ok: true, data: null })
    return res.json({ ok:true, data: rows[0] })
  } catch (err) {
    return res.json({ ok:true, data: null, mock: true }) 
  }
}

const saveAvailability = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const { availability } = req.body
    await pool.query('UPDATE nanny_profiles SET availability_status = ? WHERE user_id = ?', [availability, nanny_id])
    return res.json({ ok:true, data: { nanny_id, availability } })
  } catch (err) {
    return res.json({ ok:true, mock: true }) 
  }
}

const getAvail = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const [rows] = await pool.query('SELECT availability_status FROM nanny_profiles WHERE user_id = ?', [nanny_id])
    const status = rows.length > 0 ? rows[0].availability_status : 'Offline'
    return res.json({ ok:true, data: { availability: status } })
  } catch (err) {
    return res.json({ ok:true, data: { availability: 'Offline' }, mock: true }) 
  }
}

const getAgencies = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.id, o.name, o.address as location, 
             COUNT(os.nanny_id) as numNannies
      FROM organizations o
      LEFT JOIN organization_staff os ON o.id = os.org_id AND os.status = 'active'
      WHERE o.verification_status = 'approved'
      GROUP BY o.id
    `);
    
    const agencies = rows.map(r => ({
      id: r.id,
      name: r.name,
      logo: '🏢', 
      rating: 4.5, // Default rating for now
      reviews: Math.floor(Math.random() * 50) + 10,
      location: r.location || 'Unknown',
      numNannies: r.numNannies,
      skills: ['Newborn Care', 'Teaching'],
      desc: 'Verified professional agency'
    }));
    
    return res.json({ ok: true, data: agencies });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

const getIndividualNannies = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT np.user_id as id, u.name, np.experience_years, np.expected_salary as rate, 
             np.preferred_work_type as type, np.compatibility_score, np.verification_status
      FROM nanny_profiles np
      JOIN users u ON np.user_id = u.id
      WHERE np.availability_status = 'Available'
    `)
    
    const data = rows.map(r => ({
      id: r.id,
      name: r.name,
      photo: '👩', // Mock photo
      experience: r.experience_years ? r.experience_years + '+ years' : 'N/A',
      rating: r.compatibility_score ? (r.compatibility_score / 20).toFixed(1) : '4.5',
      reviews: Math.floor(Math.random() * 100) + 10,
      location: 'Dhaka', // Default location
      type: r.type === 'full-time' ? 'Full-time' : (r.type === 'part-time' ? 'Part-time' : 'Hourly'),
      rate: r.rate ? '৳' + r.rate + '/mo' : 'N/A',
      skills: ['Newborn Care', 'Teaching']
    }))
    
    return res.json({ ok: true, data })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

const getFeaturedNannies = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT np.user_id as id, u.name, np.experience_years, np.expected_salary as rate, 
             np.compatibility_score, np.verification_status
      FROM nanny_profiles np
      JOIN users u ON np.user_id = u.id
      WHERE np.compatibility_score > 80 AND np.availability_status = 'Available'
      ORDER BY np.compatibility_score DESC LIMIT 4
    `)
    
    const data = rows.map(r => ({
      id: r.id,
      name: r.name,
      photo: '👩',
      experience: r.experience_years ? r.experience_years + ' years' : 'N/A',
      rating: r.compatibility_score ? (r.compatibility_score / 20).toFixed(1) : '4.8',
      reviews: Math.floor(Math.random() * 100) + 20,
      location: 'Dhaka',
      rate: r.rate ? '৳' + r.rate + '/mo' : 'N/A',
      available: true
    }))
    
    return res.json({ ok: true, data })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

const getNannyDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT np.*, u.name, u.email 
      FROM nanny_profiles np 
      JOIN users u ON np.user_id = u.id 
      WHERE user_id = ?
    `, [id])
    
    if (rows.length === 0) throw new Error("Nanny not found")
    
    const r = rows[0]
    
    const details = {
      id: r.user_id,
      name: r.name,
      title: 'Professional Childcare Specialist',
      photo: '👩',
      rating: r.compatibility_score ? (r.compatibility_score / 20).toFixed(1) : '4.8',
      reviews: Math.floor(Math.random() * 100) + 20,
      location: 'Dhaka',
      availability: r.preferred_work_type || 'Full-time',
      rate: r.expected_salary ? '৳' + r.expected_salary + '/mo' : 'N/A',
      experience: r.experience_years ? r.experience_years + '+ years' : 'N/A',
      languages: 3,
      about: 'Experienced and dedicated nanny. I have a passion for nurturing children.',
      specializations: ['Newborn Care', 'Teaching'],
      weeklyAvailability: [
        { day: 'Monday', time: '8:00 AM - 6:00 PM', available: true },
        { day: 'Tuesday', time: '8:00 AM - 6:00 PM', available: true },
        { day: 'Wednesday', time: '8:00 AM - 6:00 PM', available: true },
        { day: 'Thursday', time: '8:00 AM - 6:00 PM', available: true },
        { day: 'Friday', time: '8:00 AM - 6:00 PM', available: true },
        { day: 'Saturday', time: 'Not Available', available: false },
        { day: 'Sunday', time: 'Not Available', available: false },
      ],
      certifications: ['CPR & First Aid Certified', 'Early Childhood Education'],
      knownLanguages: [
        { name: 'Bengali', level: 'Native' },
        { name: 'English', level: 'Fluent' }
      ]
    }
    return res.json({ ok: true, data: details })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

const getPayments = async (req, res) => {
  try {
    const nanny_id = req.user.id
    
    // Get work sessions for payments
    const [sessions] = await pool.query(`
      SELECT ws.id, ws.start_time, ws.end_time, ws.status, u.name as parent_name,
             TIMESTAMPDIFF(HOUR, ws.start_time, COALESCE(ws.end_time, NOW())) as hours
      FROM work_sessions ws
      JOIN users u ON ws.parent_id = u.id
      WHERE ws.nanny_id = ?
      ORDER BY ws.start_time DESC
    `, [nanny_id])
    
    const history = sessions.map(s => ({
      session: 'Care session with ' + s.parent_name,
      date: new Date(s.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: '৳' + (s.hours * 200), // Assuming 200 per hour
      status: s.status === 'completed' ? 'Paid' : 'Pending'
    }))
    
    const [totals] = await pool.query(`
      SELECT SUM(TIMESTAMPDIFF(HOUR, start_time, COALESCE(end_time, NOW())) * 200) as total
      FROM work_sessions
      WHERE nanny_id = ? AND status = 'completed'
    `, [nanny_id]);

    const totalPaid = totals[0]?.total || 0;

    const paymentsData = {
      summaries: [
        { period: 'Total Earnings', amount: '৳' + totalPaid, status: 'Paid' }
      ],
      history: history
    };
    return res.json({ ok: true, data: paymentsData });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { saveProfile, getProfile, saveAvailability, getAvail, getAgencies, getIndividualNannies, getFeaturedNannies, getNannyDetails, getPayments }
