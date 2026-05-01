const { sendSos } = require('../models/Sos')

const sos = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { lat, lng, message } = req.body
    const r = await sendSos({ nanny_id, lat, lng, message })
    return res.json({ ok:true, data: r })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

module.exports = { sos }
