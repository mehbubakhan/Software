const { addActivity, listByChild } = require('../models/Activity')
const { notifyParentsOfNanny } = require('../utils/notifier')

const add = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { child_id, type, details } = req.body
    const r = await addActivity({ child_id, nanny_id, type, details })
    // notify parents if request asks for it
    try{
      if(details && details.notify){
        setImmediate(()=> notifyParentsOfNanny(nanny_id, { subject: 'Activity update from your nanny', text: `${type} for child ${child_id}` }))
      }
    }catch(e){ console.error('notify error', e) }
    return res.json({ ok:true, id: r.id })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const byChild = async (req, res) => {
  try{
    const { child_id } = req.params
    const rows = await listByChild(child_id)
    return res.json({ ok:true, data: rows })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const byNanny = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { status } = req.query // optional filter inside details.status
    const [rows] = await require('../config/db').query('SELECT * FROM activities WHERE nanny_id = ? ORDER BY created_at DESC', [nanny_id])
    const data = rows.map(r => ({ ...r, details: JSON.parse(r.details) }))
    const filtered = status ? data.filter(d => d.details && d.details.status === status) : data
    return res.json({ ok:true, data: filtered })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

module.exports = { add, byChild }
