const pool = require('../config/db')

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
    return res.status(500).json({ ok: false, error: err.message }) 
  }
}

module.exports = { getMyFamily }
