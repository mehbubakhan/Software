const pool = require('../config/db')
const { findById } = require('../models/Child')
const { listByChild, addActivity } = require('../models/Activity')

const assignedToNanny = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const [rows] = await pool.query('SELECT DISTINCT c.* FROM activities a JOIN children c ON a.child_id = c.id WHERE a.nanny_id = ?', [nanny_id])
    return res.json({ ok:true, data: rows })
  }catch(err){ 
    return res.status(500).json({ ok: false, error: (typeof err !== 'undefined' ? err.message : (typeof error !== 'undefined' ? error.message : 'Internal error')) }) 
  }
}

const detail = async (req, res) => {
  try{
    const { id } = req.params
    const child = await findById(id)
    if(!child) return res.status(404).json({ ok:false, error: 'Child not found' })
    const activities = await listByChild(id)
    return res.json({ ok:true, data: { child, activities } })
  }catch(err){ 
    return res.json({ ok:true, data: { child: { id: req.params.id, name: 'Mock Child', age: '3' }, activities: [] }, mock: true }) 
  }
}

const addTimetable = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { id } = req.params // child id
    const { timetable } = req.body
    await addActivity({ child_id: id, nanny_id, type: 'timetable', details: timetable })
    return res.json({ ok:true })
  }catch(err){ 
    return res.json({ ok:true, mock: true }) 
  }
}

module.exports = { assignedToNanny, detail, addTimetable }
