const pool = require('../config/db')

const setAvailability = async ({ nanny_id, availability }) => {
  const [rows] = await pool.query('SELECT id FROM availability WHERE nanny_id = ?', [nanny_id])
  const data = JSON.stringify(availability||{})
  if(rows.length){
    await pool.query('UPDATE availability SET data = ? WHERE nanny_id = ?', [data, nanny_id])
    return { nanny_id }
  }
  const [res] = await pool.query('INSERT INTO availability (nanny_id, data) VALUES (?, ?)', [nanny_id, data])
  return { id: res.insertId, nanny_id }
}

const getAvailability = async (nanny_id) => {
  const [rows] = await pool.query('SELECT data FROM availability WHERE nanny_id = ?', [nanny_id])
  if(!rows[0]) return null
  try{ return JSON.parse(rows[0].data) }catch(e){ return null }
}

module.exports = { setAvailability, getAvailability }
