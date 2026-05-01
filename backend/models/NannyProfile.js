const pool = require('../config/db')

const upsertProfile = async ({ nanny_id, bio, experience, skills, photo_url, verified }) => {
  const [rows] = await pool.query('SELECT id FROM nanny_profiles WHERE nanny_id = ?', [nanny_id])
  if(rows.length){
    await pool.query('UPDATE nanny_profiles SET bio = ?, experience = ?, skills = ?, photo_url = ?, verified = ? WHERE nanny_id = ?', [bio, experience, JSON.stringify(skills||[]), photo_url, verified?1:0, nanny_id])
    return { nanny_id }
  }
  const [res] = await pool.query('INSERT INTO nanny_profiles (nanny_id, bio, experience, skills, photo_url, verified) VALUES (?, ?, ?, ?, ?, ?)', [nanny_id, bio, experience, JSON.stringify(skills||[]), photo_url, verified?1:0])
  return { id: res.insertId, nanny_id }
}

const findByNanny = async (nanny_id) => {
  const [rows] = await pool.query('SELECT * FROM nanny_profiles WHERE nanny_id = ?', [nanny_id])
  if(!rows[0]) return null
  const r = rows[0]
  try{ r.skills = JSON.parse(r.skills) }catch(e){ r.skills = [] }
  r.verified = r.verified === 1
  return r
}

module.exports = { upsertProfile, findByNanny }
