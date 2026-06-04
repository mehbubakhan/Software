const pool = require('../config/db')

let mockFamilies = {}
let mockProfiles = {}

const getMyFamily = async (req, res) => {
  try {
    const user_id = req.user.id
    const [members] = await pool.query('SELECT f.*, fm.relationship FROM families f JOIN family_members fm ON f.id = fm.family_id WHERE fm.user_id = ?', [user_id])
    if (members.length === 0) {
      return res.json({ ok: true, data: null })
    }
    const family_id = members[0].id
    const [children] = await pool.query('SELECT * FROM children WHERE family_id = ?', [family_id])
    return res.json({ ok: true, data: { family: members[0], children } })
  } catch(err) { 
    const user_id = req.user.id
    return res.json({ ok: true, data: mockFamilies[user_id] || { family: { id: 1, name: 'Demo Family' }, children: [] }, mock: true }) 
  }
}

const getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [users] = await pool.query('SELECT name, email FROM users WHERE id = ?', [user_id]);
    const [parents] = await pool.query('SELECT phone, address, emergency_contact, child_mode_pin FROM parents WHERE user_id = ?', [user_id]);
    const [children] = await pool.query('SELECT name, dob FROM children WHERE parent_id = ? LIMIT 1', [user_id]);

    const user = users[0] || {};
    const parent = parents[0] || {};
    const child = children[0] || {};

    return res.json({
      ok: true,
      profile: {
        name: user.name || '',
        email: user.email || '',
        phone: parent.phone || '',
        address: parent.address || '',
        emergencyContact: parent.emergency_contact || '',
        childModePin: parent.child_mode_pin || '',
        childName: child.name || '',
        childAge: child.dob ? Math.floor((new Date() - new Date(child.dob)) / 31557600000) : '',
        childNotes: ''
      }
    });
  } catch (err) {
    const user_id = req.user.id;
    return res.json({
      ok: true,
      profile: mockProfiles[user_id] || {
        name: 'Demo Parent',
        email: 'parent@smartnanny.com',
        phone: '123-456-7890',
        address: '123 Main St',
        emergencyContact: 'Jane Doe',
        childModePin: '1234',
        childName: 'Emma',
        childAge: '4',
        childNotes: 'No allergies.'
      },
      mock: true
    });
  }
}

const updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, phone, address, emergencyContact, childModePin, childName, childAge } = req.body;

    if (name) {
      await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, user_id]);
    }

    const [existingParent] = await pool.query('SELECT id FROM parents WHERE user_id = ?', [user_id]);
    if (existingParent.length > 0) {
      await pool.query('UPDATE parents SET phone = ?, address = ?, emergency_contact = ?, child_mode_pin = ? WHERE user_id = ?', 
        [phone, address, emergencyContact, childModePin, user_id]);
    } else {
      await pool.query('INSERT INTO parents (user_id, phone, address, emergency_contact, child_mode_pin) VALUES (?, ?, ?, ?, ?)', 
        [user_id, phone, address, emergencyContact, childModePin]);
    }

    if (childName) {
      const dob = childAge ? new Date(new Date().setFullYear(new Date().getFullYear() - childAge)).toISOString().split('T')[0] : null;
      const [existingChild] = await pool.query('SELECT id FROM children WHERE parent_id = ? LIMIT 1', [user_id]);
      if (existingChild.length > 0) {
        await pool.query('UPDATE children SET name = ?, dob = ? WHERE id = ?', [childName, dob, existingChild[0].id]);
      } else {
        await pool.query('INSERT INTO children (name, dob, parent_id) VALUES (?, ?, ?)', [childName, dob, user_id]);
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    const user_id = req.user.id;
    const { name, phone, address, emergencyContact, childModePin, childName, childAge, childNotes } = req.body;
    mockProfiles[user_id] = { name, phone, address, emergencyContact, childModePin, childName, childAge, childNotes, email: 'parent@smartnanny.com' };
    return res.json({ ok: true, mock: true });
  }
}

module.exports = { getMyFamily, getProfile, updateProfile }
