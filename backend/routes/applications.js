const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { listByNanny, updateApplication } = require('../models/Application')

router.get('/mine', auth, permit('nanny'), async (req, res) => {
  try{
    const nanny_id = req.user.id
    const rows = await listByNanny(nanny_id)
    return res.json({ ok:true, data: rows })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
})

module.exports = router
