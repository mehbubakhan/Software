const { recordResponse } = require('../models/Safety')

const respond = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { check_id, response, note } = req.body
    const r = await recordResponse({ nanny_id, check_id, response, note })
    return res.json({ ok:true, data: r })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

module.exports = { respond }
