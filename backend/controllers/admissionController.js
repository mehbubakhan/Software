const { applyAdmission, updateStatus, findById, listPending } = require('../models/Admission')
const { createChild } = require('../models/Child')

const apply = async (req, res) => {
  try{
    const { childName, dob } = req.body
    const parent_id = req.user.id
    // create child record
    const child = await createChild({ name: childName, parent_id, dob })
    const adm = await applyAdmission({ child_id: child.id, parent_id })
    return res.json({ ok:true, admissionId: adm.id })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const approve = async (req, res) => {
  try{
    const { id } = req.params
    const { action } = req.body // 'approve' or 'reject'
    const status = action === 'approve' ? 'approved' : 'rejected'
    await updateStatus(id, status)
    return res.json({ ok:true })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const pending = async (req, res) => {
  try{ const rows = await listPending(); return res.json({ ok:true, data: rows }) }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

module.exports = { apply, approve, pending }
