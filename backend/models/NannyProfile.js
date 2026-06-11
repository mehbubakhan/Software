const pool = require('../config/db')

const upsertProfile = async (profileData) => {
  const { nanny_id, name, bio, experience, skills, photo_url, verified, phone, dob, nationalId, nationality, address, city, state, zipCode, gender, workPreference, languagesSpoken } = profileData;
  const [rows] = await pool.query('SELECT id FROM nanny_profiles WHERE nanny_id = ?', [nanny_id])
  
  if(rows.length){
    await pool.query(
      'UPDATE nanny_profiles SET name = ?, bio = ?, experience = ?, skills = ?, photo_url = ?, verified = ?, phone = ?, dob = ?, nationalId = ?, nationality = ?, address = ?, city = ?, state = ?, zipCode = ?, gender = ?, workPreference = ?, languagesSpoken = ? WHERE nanny_id = ?', 
      [name, bio, experience, JSON.stringify(skills||[]), photo_url, verified?1:0, phone, dob, nationalId, nationality, address, city, state, zipCode, gender, workPreference, JSON.stringify(languagesSpoken||[]), nanny_id]
    )
    return { nanny_id }
  }
  
  const [res] = await pool.query(
    'INSERT INTO nanny_profiles (nanny_id, name, bio, experience, skills, photo_url, verified, phone, dob, nationalId, nationality, address, city, state, zipCode, gender, workPreference, languagesSpoken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [nanny_id, name, bio, experience, JSON.stringify(skills||[]), photo_url, verified?1:0, phone, dob, nationalId, nationality, address, city, state, zipCode, gender, workPreference, JSON.stringify(languagesSpoken||[])]
  )
  return { id: res.insertId, nanny_id }
}

const findByNanny = async (nanny_id) => {
  const [rows] = await pool.query('SELECT * FROM nanny_profiles WHERE nanny_id = ?', [nanny_id])
  if(!rows[0]) return null
  const r = rows[0]
  try{ r.skills = JSON.parse(r.skills) }catch(e){ r.skills = [] }
  try{ r.languagesSpoken = JSON.parse(r.languagesSpoken) }catch(e){ r.languagesSpoken = [] }
  r.verified = r.verified === 1
  return r
}

module.exports = { upsertProfile, findByNanny }
