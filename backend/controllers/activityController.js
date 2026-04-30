const { addActivity, listByChild } = require('../models/Activity')

const add = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { child_id, type, details } = req.body
    const r = await addActivity({ child_id, nanny_id, type, details })
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

module.exports = { add, byChild }
